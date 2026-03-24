import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, getMonthYear } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', padding: '14px 18px', borderRadius: 14,
      border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-elevated)',
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 3, background: p.color }}></div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{formatCurrency(p.value)}</span>
        </div>
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
      const dateA = new Date(a.month.replace(/(\w+)\s(\d+)/, '$1 1, $2'));
      const dateB = new Date(b.month.replace(/(\w+)\s(\d+)/, '$1 1, $2'));
      return dateA - dateB;
    }).slice(-6);
  }, [transactions]);

  return (
    <div className="card-static" style={{ padding: '28px 28px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Monthly Overview</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Income vs Expenses comparison</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: '#22c55e' }}></div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Income</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: '#3b82f6' }}></div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Expense</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320, color: 'var(--text-muted)', fontSize: 14 }}>
          No transaction data yet. Simulate some transactions!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} barGap={6} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 500 }}
              axisLine={{ stroke: 'var(--border-color)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.04)' }} />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[8, 8, 0, 0]} maxBarSize={48} />
            <Bar dataKey="expense" name="Expense" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
