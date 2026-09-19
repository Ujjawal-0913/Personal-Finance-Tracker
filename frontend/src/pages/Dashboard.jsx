import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import Charts from '../components/Charts.jsx';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    const [txRes, summaryRes] = await Promise.all([
      api.get('/transactions'),
      api.get('/transactions/summary/stats'),
    ]);
    setTransactions(txRes.data);
    setSummary(summaryRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="topbar">
        <h1>Finance Tracker</h1>
        <button className="secondary" onClick={handleLogout}>Log out</button>
      </div>

      {summary && (
        <div className="summary-grid">
          <div className="card">
            <div className="label">Balance</div>
            <div className="value">₹{summary.balance.toFixed(2)}</div>
          </div>
          <div className="card">
            <div className="label">Total Income</div>
            <div className="value" style={{ color: '#16a34a' }}>₹{summary.income.toFixed(2)}</div>
          </div>
          <div className="card">
            <div className="label">Total Expense</div>
            <div className="value" style={{ color: '#dc2626' }}>₹{summary.expense.toFixed(2)}</div>
          </div>
        </div>
      )}

      <TransactionForm onAdded={loadData} />
      <Charts summary={summary} />
      <TransactionList transactions={transactions} onChanged={loadData} />
    </div>
  );
}
