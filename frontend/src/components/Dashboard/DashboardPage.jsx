import { useMemo, useState, useEffect } from 'react';
import useAppStore from '../../store/appStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/categoryDetector';
import Navbar from '../common/Navbar';
import MonthlyBarChart from '../Charts/MonthlyBarChart';
import CategoryPieChart from '../Charts/CategoryPieChart';
import BudgetTracker from '../Budget/BudgetTracker';
import HealthScore from '../Insights/HealthScore';
import InsightsPanel from '../Insights/InsightsPanel';
import AnomalyAlerts from '../Insights/AnomalyAlerts';
import { Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight, CreditCard, Sparkles, ArrowRight, IndianRupee, PiggyBank } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Skeleton Placeholder ─── */
function SkeletonCard() {
  return (
    <div className="card-static" style={{ padding: 28 }}>
      <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 16 }}></div>
      <div className="skeleton" style={{ width: 180, height: 32 }}></div>
    </div>
  );
}

export default function DashboardPage() {
  const { accounts, transactions } = useAppStore();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* ─── Financial Calculations (Verified) ─── */
  const totalBalance = useMemo(() =>
    accounts.reduce((sum, a) => sum + a.balance, 0), [accounts]);

  const thisMonthStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const income = thisMonth
      .filter(t => t.type === 'credit')
      .reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonth
      .filter(t => t.type === 'debit')
      .reduce((s, t) => s + t.amount, 0);
    return { income, expenses, savings: income - expenses };
  }, [transactions]);

  const recentTransactions = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8),
    [transactions]);

  /* ─── Stat card data ─── */
  const statCards = [
    {
      label: 'Total Balance',
      value: formatCurrency(totalBalance),
      icon: Wallet,
      iconBg: 'rgba(59, 130, 246, 0.1)',
      iconColor: '#3b82f6',
      valueColor: 'var(--text-primary)',
      subtitle: `${accounts.length} account${accounts.length !== 1 ? 's' : ''} linked`,
    },
    {
      label: 'Monthly Income',
      value: formatCurrency(thisMonthStats.income),
      icon: ArrowDownLeft,
      iconBg: 'rgba(34, 197, 94, 0.1)',
      iconColor: '#22c55e',
      valueColor: '#22c55e',
      subtitle: 'This month credits',
    },
    {
      label: 'Monthly Expenses',
      value: formatCurrency(thisMonthStats.expenses),
      icon: ArrowUpRight,
      iconBg: 'rgba(239, 68, 68, 0.08)',
      iconColor: '#ef4444',
      valueColor: '#ef4444',
      subtitle: 'This month debits',
    },
    {
      label: 'Net Savings',
      value: formatCurrency(thisMonthStats.savings),
      icon: PiggyBank,
      iconBg: thisMonthStats.savings >= 0 ? 'rgba(139, 92, 246, 0.1)' : 'rgba(239, 68, 68, 0.08)',
      iconColor: thisMonthStats.savings >= 0 ? '#8b5cf6' : '#ef4444',
      valueColor: thisMonthStats.savings >= 0 ? '#8b5cf6' : '#ef4444',
      subtitle: thisMonthStats.savings >= 0 ? 'Income − Expenses' : 'Spending exceeds income',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 28px 48px' }}>
        {/* ═══ HEADER ═══ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.02em' }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>
              Your financial overview at a glance
            </p>
          </div>
          {accounts.length === 0 && (
            <button onClick={() => navigate('/accounts')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} /> Get Started
            </button>
          )}
        </div>

        {/* ═══ TOP: 4 STAT CARDS ═══ */}
        <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 'var(--section-gap)' }}>
          {!loaded ? (
            <>
              <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </>
          ) : (
            statCards.map((card, i) => (
              <div key={i} className="card animate-fade-in"
                style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: card.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <card.icon size={20} style={{ color: card.iconColor }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {card.label}
                  </span>
                </div>
                <p style={{ fontSize: 28, fontWeight: 800, color: card.valueColor, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>
                  {card.value}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
                  {card.subtitle}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ═══ ACCOUNT CARDS HORIZONTAL SCROLL ═══ */}
        {accounts.length > 0 && (
          <div style={{ marginBottom: 'var(--section-gap)' }}>
            <p className="section-title">Your Accounts</p>
            <div className="no-scrollbar" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }}>
              {accounts.map((account, i) => (
                <div key={account.id}
                  className="animate-fade-in"
                  style={{
                    flexShrink: 0, width: 240, borderRadius: 20, padding: '24px 22px',
                    color: 'white', position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${account.color[0]}, ${account.color[1]})`,
                    cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    animationDelay: `${i * 0.08}s`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  onClick={() => navigate('/accounts')}>
                  {/* Decorative circles */}
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
                  <div style={{ position: 'absolute', bottom: -30, left: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <CreditCard size={16} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>{account.name}</span>
                    </div>
                    <p style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.01em' }}>
                      {formatCurrency(account.balance)}
                    </p>
                    <p style={{ fontSize: 11, fontFamily: 'monospace', opacity: 0.4 }}>
                      •••• {account.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ANOMALY ALERTS ═══ */}
        <div style={{ marginBottom: 20 }}>
          <AnomalyAlerts />
        </div>

        {/* ═══ CHARTS: Bar 60% + Pie 40% ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 'var(--section-gap)' }}>
          <MonthlyBarChart transactions={transactions} />
          <CategoryPieChart transactions={transactions} />
        </div>

        {/* ═══ INSIGHTS + BUDGET (Equal 2-col) ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 'var(--section-gap)' }}>
          <InsightsPanel />
          <BudgetTracker />
        </div>

        {/* ═══ HEALTH SCORE + PER-ACCOUNT PIE ═══ */}
        {accounts.length > 1 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 'var(--section-gap)' }}>
            <HealthScore />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(accounts.length, 3)}, 1fr)`, gap: 20 }}>
              {accounts.slice(0, 3).map(account => (
                <CategoryPieChart
                  key={account.id}
                  transactions={transactions.filter(t => t.accountId === account.id)}
                  title={`${account.name} Spending`}
                  compact
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 'var(--section-gap)' }}>
            <HealthScore />
          </div>
        )}

        {/* ═══ RECENT TRANSACTIONS ═══ */}
        <div>
          <p className="section-title">Recent Activity</p>
          <div className="card-static" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Transactions</h3>
              <button onClick={() => navigate('/transactions')}
                style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                View All <ArrowRight size={14} />
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div style={{ padding: '48px 28px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <IndianRupee size={40} style={{ opacity: 0.15, margin: '0 auto 12px' }} />
                <p style={{ fontSize: 14 }}>No transactions yet. Go to Accounts to simulate data!</p>
              </div>
            ) : (
              recentTransactions.map((t, i) => {
                const account = accounts.find(a => a.id === t.accountId);
                return (
                  <div key={t.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 28px',
                      borderBottom: i < recentTransactions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                      background: `${CATEGORY_COLORS[t.category]}12`,
                    }}>
                      {CATEGORY_ICONS[t.category] || '📋'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span>{formatDate(t.date)}</span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span>{t.category}</span>
                        {account && (
                          <>
                            <span style={{ opacity: 0.4 }}>•</span>
                            <span>{account.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {t.type === 'credit' ? (
                        <ArrowDownLeft size={15} style={{ color: '#22c55e' }} />
                      ) : (
                        <ArrowUpRight size={15} style={{ color: '#ef4444' }} />
                      )}
                      <span style={{
                        fontSize: 15, fontWeight: 700,
                        color: t.type === 'credit' ? '#22c55e' : '#ef4444',
                      }}>
                        {t.type === 'credit' ? '+' : '−'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
