// routes/transactions.js
const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All routes here require a valid JWT
router.use(requireAuth);

// GET /api/transactions  (optional query params: startDate, endDate, category)
router.get('/', (req, res) => {
  const { startDate, endDate, category } = req.query;

  let query = 'SELECT * FROM transactions WHERE user_id = ?';
  const params = [req.userId];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY date DESC, id DESC';

  const rows = db.prepare(query).all(...params);
  res.json(rows);
});

// POST /api/transactions
router.post('/', (req, res) => {
  const { type, amount, category, description, date } = req.body;

  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: 'type, amount, category, and date are required' });
  }
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: "type must be 'income' or 'expense'" });
  }

  const insert = db.prepare(`
    INSERT INTO transactions (user_id, type, amount, category, description, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = insert.run(req.userId, type, amount, category, description || '', date);

  const created = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/transactions/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { type, amount, category, description, date } = req.body;

  const existing = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(id, req.userId);
  if (!existing) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  db.prepare(`
    UPDATE transactions
    SET type = ?, amount = ?, category = ?, description = ?, date = ?
    WHERE id = ? AND user_id = ?
  `).run(
    type || existing.type,
    amount ?? existing.amount,
    category || existing.category,
    description ?? existing.description,
    date || existing.date,
    id,
    req.userId
  );

  const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
  res.json(updated);
});

// DELETE /api/transactions/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(id, req.userId);
  if (!existing) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(id, req.userId);
  res.status(204).send();
});

// GET /api/transactions/summary/stats
// Returns totals + category breakdown, used to feed the charts on the frontend
router.get('/summary/stats', (req, res) => {
  const userId = req.userId;

  const totals = db.prepare(`
    SELECT type, SUM(amount) as total
    FROM transactions
    WHERE user_id = ?
    GROUP BY type
  `).all(userId);

  const byCategory = db.prepare(`
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE user_id = ? AND type = 'expense'
    GROUP BY category
    ORDER BY total DESC
  `).all(userId);

  const byMonth = db.prepare(`
    SELECT strftime('%Y-%m', date) as month, type, SUM(amount) as total
    FROM transactions
    WHERE user_id = ?
    GROUP BY month, type
    ORDER BY month ASC
  `).all(userId);

  const income = totals.find(t => t.type === 'income')?.total || 0;
  const expense = totals.find(t => t.type === 'expense')?.total || 0;

  res.json({
    balance: income - expense,
    income,
    expense,
    byCategory,
    byMonth,
  });
});

module.exports = router;
