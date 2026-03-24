import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, getMonthYear } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3" style={{ border: '1px solid var(--border-color)' }}>
      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function MonthlyBarChart({ transactions }) {
  const data = useMemo(() => {
    const monthly = {};
    transactions.forEach(t => {
      const key = getMonthYear(t.date);
      if (!monthly[key]) monthly[key] = { month: key, income: 0, expense: 0 };
      if (t.type === 'credit') monthly[key].income += t.amount;
      else monthly[key].expense += t.amount;
    });
    return Object.values(monthly).sort((a, b) => {
      const [mA, yA] = a.month.split(' ');
      const [mB, yB] = b.month.split(' ');
      return new Date(`${mA} 1 ${yA}`) - new Date(`${mB} 1 ${yB}`);
    }).slice(-6);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Monthly Overview</h3>
        <div className="flex items-center justify-center h-52" style={{ color: 'var(--text-muted)' }}>
          <p>No transaction data yet. Simulate some transactions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
          <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="income" name="Income" fill="#22c55e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" name="Expense" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
