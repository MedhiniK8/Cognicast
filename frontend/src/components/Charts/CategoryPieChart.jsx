import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '../../utils/categoryDetector';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 14,
      border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-elevated)',
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: d.payload.fill, marginBottom: 2 }}>{d.name}</p>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        {formatCurrency(d.value)} · {d.payload.percent}%
      </p>
    </div>
  );
};

export default function CategoryPieChart({ transactions, title = 'Spending by Category', compact = false }) {
  const { data, total } = useMemo(() => {
    const cats = {};
    transactions.filter(t => t.type === 'debit').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    const total = Object.values(cats).reduce((s, v) => s + v, 0);
    const data = Object.entries(cats)
      .map(([name, value]) => ({
        name,
        value,
        fill: CATEGORY_COLORS[name] || '#94a3b8',
        percent: total > 0 ? Math.round(value / total * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
    return { data, total };
  }, [transactions]);

  const chartH = compact ? 200 : 280;

  return (
    <div className="card-static" style={{ padding: compact ? '20px 20px 16px' : '28px 28px 20px' }}>
      <div style={{ marginBottom: compact ? 12 : 20 }}>
        <h3 style={{ fontSize: compact ? 14 : 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</h3>
        {!compact && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Category-wise breakdown</p>}
      </div>

      {data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: chartH, color: 'var(--text-muted)', fontSize: 14 }}>
          No spending data yet
        </div>
      ) : (
        <>
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={chartH}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={compact ? 40 : 65}
                  outerRadius={compact ? 70 : 105}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', textAlign: 'center',
            }}>
              <p style={{ fontSize: compact ? 10 : 11, color: 'var(--text-muted)', fontWeight: 500 }}>Total</p>
              <p style={{ fontSize: compact ? 14 : 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {formatCurrency(total)}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: compact ? '6px 12px' : '8px 20px',
            marginTop: compact ? 8 : 16, justifyContent: 'center',
          }}>
            {data.slice(0, compact ? 4 : 8).map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 3, background: d.fill, flexShrink: 0 }}></div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {d.name} <span style={{ color: 'var(--text-muted)' }}>{d.percent}%</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
