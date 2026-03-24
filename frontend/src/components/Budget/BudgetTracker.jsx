import useAppStore from '../../store/appStore';
import { formatCurrency } from '../../utils/helpers';
import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Edit3, Check } from 'lucide-react';

export default function BudgetTracker() {
  const { transactions, monthlyBudget, setMonthlyBudget } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const income = thisMonth.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonth.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const savings = income - expenses;
    const budgetUsage = monthlyBudget > 0 ? Math.min((expenses / monthlyBudget) * 100, 200) : 0;
    const remaining = monthlyBudget - expenses;
    const isOverBudget = expenses > monthlyBudget;
    return { income, expenses, savings, budgetUsage, remaining, isOverBudget };
  }, [transactions, monthlyBudget]);

  const handleSave = () => {
    setMonthlyBudget(Number(tempBudget));
    setEditing(false);
  };

  const progressWidth = Math.min(stats.budgetUsage, 100);
  const progressColor = stats.budgetUsage > 90
    ? 'linear-gradient(90deg, #ef4444, #f97316)'
    : stats.budgetUsage > 70
      ? 'linear-gradient(90deg, #eab308, #f97316)'
      : 'linear-gradient(90deg, #22c55e, #06b6d4)';

  return (
    <div className="card-static" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Budget Tracker</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly spending limit</p>
        </div>
        <button onClick={() => { setEditing(!editing); setTempBudget(monthlyBudget); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: 'var(--bg-card-hover)', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
          }}>
          <Edit3 size={12} /> Set Budget
        </button>
      </div>

      {editing && (
        <div className="animate-fade-in" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input type="number" className="input-field" value={tempBudget}
            onChange={e => setTempBudget(e.target.value)} placeholder="Monthly budget" style={{ flex: 1 }} />
          <button onClick={handleSave} className="btn-primary" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} /> Save
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ marginBottom: 24, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Budget Usage</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: stats.isOverBudget ? '#ef4444' : '#22c55e', letterSpacing: '-0.02em' }}>
            {stats.budgetUsage.toFixed(0)}%
          </span>
        </div>
        <div style={{ width: '100%', height: 10, borderRadius: 6, background: 'var(--border-color)', overflow: 'hidden' }}>
          <div style={{
            width: `${progressWidth}%`, height: '100%', borderRadius: 6,
            background: progressColor,
            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{formatCurrency(stats.expenses)} spent</span>
          <span>of {formatCurrency(monthlyBudget)}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          { icon: TrendingUp, label: 'Income', value: stats.income, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.06)' },
          { icon: TrendingDown, label: 'Expenses', value: stats.expenses, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.06)' },
          { icon: Wallet, label: stats.remaining >= 0 ? 'Remaining' : 'Over by', value: Math.abs(stats.remaining), color: stats.remaining >= 0 ? '#22c55e' : '#ef4444', bg: stats.remaining >= 0 ? 'rgba(34, 197, 94, 0.06)' : 'rgba(239, 68, 68, 0.06)' },
        ].map((item, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 14, background: item.bg, textAlign: 'center' }}>
            <item.icon size={16} style={{ color: item.color, margin: '0 auto 6px' }} />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>{item.label}</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: item.color, letterSpacing: '-0.01em' }}>
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Status Badge */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', padding: '8px 20px', borderRadius: 24, fontSize: 12, fontWeight: 700,
          background: stats.isOverBudget ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
          color: stats.isOverBudget ? '#ef4444' : '#22c55e',
          border: `1px solid ${stats.isOverBudget ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'}`,
        }}>
          {stats.isOverBudget ? '⚠️ Over Budget' : '✅ On Track'}
        </span>
      </div>
    </div>
  );
}
