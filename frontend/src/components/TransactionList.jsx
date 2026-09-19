import api from '../api.js';

export default function TransactionList({ transactions, onChanged }) {
  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    onChanged();
  };

  return (
    <div className="card">
      <h3>Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet. Add one above to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td style={{ color: t.type === 'income' ? '#16a34a' : '#dc2626' }}>
                  {t.type}
                </td>
                <td>{t.category}</td>
                <td>{t.description}</td>
                <td>{t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}</td>
                <td>
                  <button className="danger" onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
