import { useMemo, useState } from 'react';
import useAppStore from '../../store/appStore';
import { formatCurrency, formatDate, exportToCSV } from '../../utils/helpers';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/categoryDetector';
import { Download, Search, ArrowDownLeft, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import Navbar from '../common/Navbar';

export default function TransactionsPage() {
  const { transactions, accounts } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('all');
  const [filterAccount, setFilterAccount] = useState('all');

  const filtered = useMemo(() => {
    return [...transactions]
      .filter(t => {
        if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterCategory !== 'All' && t.category !== filterCategory) return false;
        if (filterType !== 'all' && t.type !== filterType) return false;
        if (filterAccount !== 'all' && t.accountId !== filterAccount) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, search, filterCategory, filterType, filterAccount]);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ['All', ...cats];
  }, [transactions]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 28px 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
              Transactions
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{filtered.length} transactions found</p>
          </div>
          <button onClick={() => exportToCSV(filtered)}
            className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card-static" style={{ padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filters</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input-field" style={{ paddingLeft: 40 }} placeholder="Search..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input-field" style={{ cursor: 'pointer' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            <select className="input-field" style={{ cursor: 'pointer' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
            <select className="input-field" style={{ cursor: 'pointer' }} value={filterAccount} onChange={e => setFilterAccount(e.target.value)}>
              <option value="all">All Accounts</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="card-static" style={{ overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 28px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <SlidersHorizontal size={40} style={{ opacity: 0.15, margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14 }}>No transactions match your filters</p>
            </div>
          ) : (
            filtered.slice(0, 100).map((t, i) => {
              const account = accounts.find(a => a.id === t.accountId);
              return (
                <div key={t.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 28px',
                    borderBottom: i < Math.min(filtered.length, 100) - 1 ? '1px solid var(--border-subtle)' : 'none',
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
                    <span style={{ fontSize: 15, fontWeight: 700, color: t.type === 'credit' ? '#22c55e' : '#ef4444' }}>
                      {t.type === 'credit' ? '+' : '−'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
