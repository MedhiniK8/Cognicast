import useAppStore from '../../store/appStore';
import { formatCurrency } from '../../utils/helpers';
import { useMemo, useState } from 'react';
import { Target, TrendingUp, TrendingDown, Wallet, Edit3 } from 'lucide-react';

export default function BudgetTracker() {
  const { transactions, monthlyBudget, setMonthlyBudget } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const income = thisMonth.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonth.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const savings = income - expenses;
    const budgetUsage = monthlyBudget > 0 ? Math.min((expenses / monthlyBudget) * 100, 150) : 0;
    const isOverBudget = expenses > monthlyBudget;
    return { income, expenses, savings, budgetUsage, isOverBudget };
  }, [transactions, monthlyBudget]);

  const handleSave = () => {
    setMonthlyBudget(Number(tempBudget));
    setEditing(false);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Budget Tracker</h3>
        <button onClick={() => { setEditing(!editing); setTempBudget(monthlyBudget); }}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border-none cursor-pointer"
          style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
          <Edit3 size={12} /> Set Budget
        </button>
      </div>

      {editing && (
        <div className="flex gap-2 mb-4 animate-fade-in">
          <input type="number" className="input-field flex-1" value={tempBudget} onChange={e => setTempBudget(e.target.value)} placeholder="Monthly budget" />
          <button onClick={handleSave} className="btn-primary px-4">Save</button>
        </div>
      )}

      {/* Budget Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: 'var(--text-secondary)' }}>Budget Usage</span>
          <span className="font-semibold" style={{ color: stats.isOverBudget ? '#ef4444' : '#22c55e' }}>
            {stats.budgetUsage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(stats.budgetUsage, 100)}%`,
              background: stats.budgetUsage > 90
                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                : stats.budgetUsage > 70
                  ? 'linear-gradient(90deg, #eab308, #f97316)'
                  : 'linear-gradient(90deg, #22c55e, #06b6d4)',
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
          <span>{formatCurrency(stats.expenses)} spent</span>
          <span>of {formatCurrency(monthlyBudget)}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
          <TrendingUp size={16} className="mx-auto mb-1" style={{ color: '#22c55e' }} />
          <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Income</p>
          <p className="text-sm font-bold" style={{ color: '#22c55e' }}>{formatCurrency(stats.income)}</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(59, 130, 246, 0.08)' }}>
          <TrendingDown size={16} className="mx-auto mb-1" style={{ color: '#3b82f6' }} />
          <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Expenses</p>
          <p className="text-sm font-bold" style={{ color: '#3b82f6' }}>{formatCurrency(stats.expenses)}</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: stats.savings >= 0 ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)' }}>
          <Wallet size={16} className="mx-auto mb-1" style={{ color: stats.savings >= 0 ? '#22c55e' : '#ef4444' }} />
          <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Savings</p>
          <p className="text-sm font-bold" style={{ color: stats.savings >= 0 ? '#22c55e' : '#ef4444' }}>{formatCurrency(stats.savings)}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-4 flex justify-center">
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: stats.isOverBudget ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            color: stats.isOverBudget ? '#ef4444' : '#22c55e',
          }}>
          {stats.isOverBudget ? '⚠️ Over Budget' : '✅ On Track'}
        </span>
      </div>
    </div>
  );
}
