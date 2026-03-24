import { useMemo } from 'react';
import useAppStore from '../../store/appStore';
import { formatCurrency, formatDate, formatTime } from '../../utils/helpers';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/categoryDetector';
import Navbar from '../common/Navbar';
import MonthlyBarChart from '../Charts/MonthlyBarChart';
import CategoryPieChart from '../Charts/CategoryPieChart';
import BudgetTracker from '../Budget/BudgetTracker';
import HealthScore from '../Insights/HealthScore';
import InsightsPanel from '../Insights/InsightsPanel';
import AnomalyAlerts from '../Insights/AnomalyAlerts';
import { Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight, CreditCard, Sparkles, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { accounts, transactions } = useAppStore();
  const navigate = useNavigate();

  const totalBalance = useMemo(() =>
    accounts.reduce((sum, a) => sum + a.balance, 0), [accounts]);

  const thisMonthStats = useMemo(() => {
    const now = new Date();
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    return {
      income: thisMonth.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0),
      expenses: thisMonth.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0),
    };
  }, [transactions]);

  const recentTransactions = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
    [transactions]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your financial overview at a glance</p>
          </div>
          {accounts.length === 0 && (
            <button onClick={() => navigate('/accounts')} className="btn-primary flex items-center gap-2">
              <Sparkles size={16} /> Get Started
            </button>
          )}
        </div>

        {/* ─── TOP SECTION: Balance + Account Cards ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Balance */}
          <div className="lg:col-span-1 rounded-2xl p-6 text-white relative overflow-hidden"
            style={{ background: 'var(--gradient-primary)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <Wallet size={24} className="mb-3 text-white/80" />
            <p className="text-sm text-white/70 mb-1">Total Balance</p>
            <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
            <p className="text-xs text-white/60 mt-2">{accounts.length} accounts linked</p>
          </div>

          {/* This Month Income */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <ArrowDownLeft size={18} style={{ color: '#22c55e' }} />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>This Month Income</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{formatCurrency(thisMonthStats.income)}</p>
          </div>

          {/* This Month Expenses */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <ArrowUpRight size={18} style={{ color: '#ef4444' }} />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>This Month Expenses</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{formatCurrency(thisMonthStats.expenses)}</p>
          </div>

          {/* Savings */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <TrendingUp size={18} style={{ color: '#8b5cf6' }} />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Net Savings</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: thisMonthStats.income - thisMonthStats.expenses >= 0 ? '#8b5cf6' : '#ef4444' }}>
              {formatCurrency(thisMonthStats.income - thisMonthStats.expenses)}
            </p>
          </div>
        </div>

        {/* Account Cards Row */}
        {accounts.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
            {accounts.map(account => (
              <div key={account.id}
                className="flex-shrink-0 w-56 rounded-xl p-4 text-white relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${account.color[0]}, ${account.color[1]})` }}
                onClick={() => navigate('/accounts')}>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={14} className="text-white/70" />
                  <span className="text-xs font-medium text-white/70">{account.name}</span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(account.balance)}</p>
                <p className="text-xs font-mono text-white/40 mt-1">{account.accountNumber}</p>
              </div>
            ))}
          </div>
        )}

        {/* Anomaly Alerts */}
        <div className="mb-4">
          <AnomalyAlerts />
        </div>

        {/* ─── MIDDLE SECTION: Charts ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <MonthlyBarChart transactions={transactions} />
          </div>
          <div>
            <CategoryPieChart transactions={transactions} />
          </div>
        </div>

        {/* ─── INSIGHTS + BUDGET + HEALTH ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <InsightsPanel />
          <BudgetTracker />
          <HealthScore />
        </div>

        {/* Per-Account Pie Charts */}
        {accounts.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {accounts.map(account => (
              <CategoryPieChart
                key={account.id}
                transactions={transactions.filter(t => t.accountId === account.id)}
                title={`${account.name} Spending`}
              />
            ))}
          </div>
        )}

        {/* ─── BOTTOM SECTION: Recent Transactions ─── */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} style={{ color: '#3b82f6' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h3>
            </div>
            <button onClick={() => navigate('/transactions')} className="text-sm font-medium" style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
              View All →
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--text-muted)' }}>
              <p>No transactions yet. Go to Accounts to simulate data!</p>
            </div>
          ) : (
            <div>
              {recentTransactions.map(t => {
                const account = accounts.find(a => a.id === t.accountId);
                return (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0 transition-colors"
                    style={{ borderColor: 'var(--border-color)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: `${CATEGORY_COLORS[t.category]}15` }}>
                      {CATEGORY_ICONS[t.category] || '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{t.description}</p>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>{formatDate(t.date)}</span>
                        <span>•</span>
                        <span>{t.category}</span>
                        {account && <><span>•</span><span>{account.name}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {t.type === 'credit' ? (
                        <ArrowDownLeft size={14} style={{ color: '#22c55e' }} />
                      ) : (
                        <ArrowUpRight size={14} style={{ color: '#ef4444' }} />
                      )}
                      <span className="text-sm font-semibold" style={{ color: t.type === 'credit' ? '#22c55e' : '#ef4444' }}>
                        {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
