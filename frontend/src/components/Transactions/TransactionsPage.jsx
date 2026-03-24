import { useMemo, useState } from 'react';
import useAppStore from '../../store/appStore';
import { formatCurrency, formatDate, formatTime, exportToCSV } from '../../utils/helpers';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/categoryDetector';
import { Download, Filter, ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Transactions</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{filtered.length} transactions found</p>
          </div>
          <button onClick={() => exportToCSV(filtered)}
            className="btn-secondary flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input className="input-field" style={{ paddingLeft: '36px' }} placeholder="Search transactions..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input-field cursor-pointer" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input-field cursor-pointer" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
            <select className="input-field cursor-pointer" value={filterAccount} onChange={e => setFilterAccount(e.target.value)}>
              <option value="all">All Accounts</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--text-muted)' }}>
              <Filter size={48} className="mb-3 opacity-20" />
              <p>No transactions match your filters</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {filtered.slice(0, 100).map((t, i) => {
                const account = accounts.find(a => a.id === t.accountId);
                return (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--bg-card-hover)]" style={{ animationDelay: `${i * 0.02}s` }}>
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
                    <div className="flex items-center gap-2 flex-shrink-0">
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
