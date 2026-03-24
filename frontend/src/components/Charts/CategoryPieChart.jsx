import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CATEGORY_COLORS } from '../../utils/categoryDetector';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="card p-3" style={{ border: '1px solid var(--border-color)' }}>
      <p className="text-sm font-semibold" style={{ color: d.payload.fill }}>{d.name}</p>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(d.value)} ({d.payload.percent}%)</p>
    </div>
  );
};

const renderLabel = ({ name, percent }) => {
  if (percent < 5) return '';
  return `${name} ${percent}%`;
};

export default function CategoryPieChart({ transactions, title = 'Spending by Category' }) {
  const data = useMemo(() => {
    const cats = {};
    transactions.filter(t => t.type === 'debit').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    const total = Object.values(cats).reduce((s, v) => s + v, 0);
    return Object.entries(cats)
      .map(([name, value]) => ({
        name,
        value,
        fill: CATEGORY_COLORS[name] || '#94a3b8',
        percent: total > 0 ? Math.round(value / total * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <div className="flex items-center justify-center h-52" style={{ color: 'var(--text-muted)' }}>
          <p>No spending data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2">
        {data.slice(0, 6).map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }}></div>
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
