import { useState } from 'react';
import useAppStore, { BANK_COLORS } from '../../store/appStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Plus, Trash2, CreditCard, Play, Zap, GraduationCap, ShoppingBag, PiggyBank } from 'lucide-react';
import Navbar from '../common/Navbar';
import AddAccountModal from './AddAccountModal';
import { DEMO_PROFILES } from '../../utils/transactionSimulator';

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
    { key: 'student', label: 'Student', icon: GraduationCap, desc: 'Low income, high food spending' },
    { key: 'highSpender', label: 'High Spender', icon: ShoppingBag, desc: 'Luxury purchases, high expense' },
    { key: 'saver', label: 'Saver', icon: PiggyBank, desc: 'Minimal spending, high savings' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Bank Accounts</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{accounts.length} accounts linked</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Account
          </button>
        </div>

        {/* Simulation Controls */}
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>🚀 Simulation Controls</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {accounts.length > 0 ? (
              <>
                <button onClick={() => accounts.forEach(a => simulateDays(a.id, 7))}
                  className="btn-secondary flex items-center gap-2 text-sm">
                  <Play size={14} /> Simulate 7 Days
                </button>
                <button onClick={() => accounts.forEach(a => simulateDays(a.id, 30))}
                  className="btn-secondary flex items-center gap-2 text-sm">
                  <Zap size={14} /> Simulate 30 Days
                </button>
              </>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add an account first to simulate transactions</p>
            )}
          </div>

          {accounts.length > 0 && (
            <>
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Demo Modes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {demoModes.map(mode => (
                  <button key={mode.key} onClick={() => loadDemoProfile(mode.key)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all border-none cursor-pointer"
                    style={{
                      background: activeDemo === mode.key ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card-hover)',
                      border: activeDemo === mode.key ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                    }}>
                    <mode.icon size={18} style={{ color: activeDemo === mode.key ? '#3b82f6' : 'var(--text-secondary)' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{mode.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{mode.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Account Cards */}
        {accounts.length === 0 ? (
          <div className="card p-12 text-center">
            <CreditCard size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No accounts yet</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Add your first bank account to get started</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary mx-auto flex items-center gap-2">
              <Plus size={18} /> Add Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account, i) => (
              <div key={account.id} className="relative rounded-2xl p-5 text-white overflow-hidden animate-fade-in"
                style={{
                  background: `linear-gradient(135deg, ${account.color[0]}, ${account.color[1]})`,
                  animationDelay: `${i * 0.1}s`,
                }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={20} className="text-white/80" />
                      <span className="text-sm font-medium text-white/80">{account.name}</span>
                    </div>
                    <button onClick={() => removeAccount(account.id)}
                      className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border-none cursor-pointer hover:bg-white/20 transition-colors">
                      <Trash2 size={14} className="text-white/70" />
                    </button>
                  </div>
                  <p className="text-2xl font-bold mb-1">{formatCurrency(account.balance)}</p>
                  <p className="text-xs font-mono text-white/50 mb-3">{account.accountNumber}</p>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Last: {getLastActivity(account.id)}</span>
                    <span>{transactions.filter(t => t.accountId === account.id).length} txns</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AddAccountModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
