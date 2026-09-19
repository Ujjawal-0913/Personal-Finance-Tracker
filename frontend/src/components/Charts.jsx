import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#8b5cf6', '#ec4899', '#0891b2', '#65a30d'];

export default function Charts({ summary }) {
  if (!summary) return null;

  const categoryData = summary.byCategory.map((c) => ({
    name: c.category,
    value: c.total,
  }));

  // Reshape byMonth (rows of {month, type, total}) into one row per month
  // with separate income/expense fields, which is what BarChart expects.
  const monthMap = {};
  summary.byMonth.forEach((row) => {
    if (!monthMap[row.month]) monthMap[row.month] = { month: row.month, income: 0, expense: 0 };
    monthMap[row.month][row.type] = row.total;
  });
  const monthlyData = Object.values(monthMap);

  return (
    <div className="charts-grid">
      <div className="card">
        <h3>Spending by Category</h3>
        {categoryData.length === 0 ? (
          <p>No expense data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <h3>Income vs Expense by Month</h3>
        {monthlyData.length === 0 ? (
          <p>No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#16a34a" />
              <Bar dataKey="expense" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
