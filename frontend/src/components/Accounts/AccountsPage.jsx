import { useState } from 'react';
import useAppStore, { BANK_COLORS } from '../../store/appStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Plus, Trash2, CreditCard, Play, Zap, GraduationCap, ShoppingBag, PiggyBank } from 'lucide-react';
import Navbar from '../common/Navbar';
import AddAccountModal from './AddAccountModal';

export default function AccountsPage() {
  const { accounts, removeAccount, simulateDays, loadDemoProfile, activeDemo, transactions } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const getLastActivity = (accountId) => {
    const accountTxns = transactions.filter(t => t.accountId === accountId);
    if (accountTxns.length === 0) return 'No activity';
    const latest = accountTxns.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return formatDate(latest.date);
  };

  const demoModes = [
    { key: 'student', label: 'Student', icon: GraduationCap, desc: 'Low income, high food spending', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    { key: 'highSpender', label: 'High Spender', icon: ShoppingBag, desc: 'Luxury purchases, high expense', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
    { key: 'saver', label: 'Saver', icon: PiggyBank, desc: 'Minimal spending, high savings', gradient: 'linear-gradient(135deg, #22c55e, #06b6d4)' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 28px 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
              Bank Accounts
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{accounts.length} account{accounts.length !== 1 ? 's' : ''} linked</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Add Account
          </button>
        </div>

        {/* Simulation Controls */}
        <div className="card-static" style={{ padding: 28, marginBottom: 28 }}>
          <p className="section-title" style={{ marginBottom: 16 }}>🚀 Simulation Controls</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            {accounts.length > 0 ? (
              <>
                <button onClick={() => accounts.forEach(a => simulateDays(a.id, 7))}
                  className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <Play size={14} /> Simulate 7 Days
                </button>
                <button onClick={() => accounts.forEach(a => simulateDays(a.id, 30))}
                  className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <Zap size={14} /> Simulate 30 Days
                </button>
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add an account first to simulate transactions</p>
            )}
          </div>

          {accounts.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                Demo Modes
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {demoModes.map(mode => {
                  const isActive = activeDemo === mode.key;
                  return (
                    <button key={mode.key} onClick={() => loadDemoProfile(mode.key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '16px 18px', borderRadius: 16, textAlign: 'left',
                        border: isActive ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                        background: isActive ? 'rgba(59, 130, 246, 0.04)' : 'var(--bg-card)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        fontFamily: 'var(--font-sans)',
                      }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: mode.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <mode.icon size={18} color="white" />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{mode.label}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mode.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Account Cards */}
        {accounts.length === 0 ? (
          <div className="card-static" style={{ padding: '64px 28px', textAlign: 'center' }}>
            <CreditCard size={48} style={{ color: 'var(--text-muted)', opacity: 0.15, margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No accounts yet</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Add your first bank account to get started</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Add Account
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {accounts.map((account, i) => (
              <div key={account.id} className="animate-fade-in"
                style={{
                  borderRadius: 24, padding: '28px 24px', color: 'white',
                  position: 'relative', overflow: 'hidden',
                  background: `linear-gradient(135deg, ${account.color[0]}, ${account.color[1]})`,
                  animationDelay: `${i * 0.08}s`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px -10px rgba(0,0,0,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: -25, right: -25, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}></div>
                <div style={{ position: 'absolute', bottom: -35, left: -25, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}></div>
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CreditCard size={18} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.8 }}>{account.name}</span>
                    </div>
                    <button onClick={() => removeAccount(account.id)}
                      style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: 'rgba(255,255,255,0.1)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
                    {formatCurrency(account.balance)}
                  </p>
                  <p style={{ fontSize: 12, fontFamily: 'monospace', opacity: 0.4, marginBottom: 16 }}>
                    {account.accountNumber}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.5 }}>
                    <span>Last: {getLastActivity(account.id)}</span>
                    <span>{transactions.filter(t => t.accountId === account.id).length} txns</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <AddAccountModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
