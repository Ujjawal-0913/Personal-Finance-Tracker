import { useState } from 'react';
import api from '../api.js';

const CATEGORIES = [
  'Food', 'Transport', 'Rent', 'Utilities', 'Entertainment',
  'Shopping', 'Health', 'Education', 'Salary', 'Other',
];

export default function TransactionForm({ onAdded }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/transactions', {
        type,
        amount: parseFloat(amount),
        category,
        description,
        date,
      });
      setAmount('');
      setDescription('');
      onAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add transaction');
    }
  };

  return (
    <div className="card">
      <h3>Add Transaction</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-row">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
}
