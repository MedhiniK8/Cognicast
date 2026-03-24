import { useState } from 'react';
import useAppStore, { BANK_NAMES, BANK_COLORS } from '../../store/appStore';
import { Plus, X, CreditCard, Building2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export default function AddAccountModal({ isOpen, onClose }) {
  const [bankName, setBankName] = useState('');
  const [balance, setBalance] = useState('');
  const { addAccount } = useAppStore();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bankName || !balance) return;
    addAccount(bankName, Number(balance));
    setBankName('');
    setBalance('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="card p-6 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Building2 size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Add Bank Account</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer"
            style={{ background: 'var(--bg-card-hover)', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Bank Name</label>
            <select className="input-field cursor-pointer" value={bankName} onChange={e => setBankName(e.target.value)} required>
              <option value="">Select a bank</option>
              {BANK_NAMES.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {bankName && (
            <div className="p-4 rounded-xl animate-fade-in" style={{ background: `linear-gradient(135deg, ${BANK_COLORS[bankName]?.[0] || '#3b82f6'}, ${BANK_COLORS[bankName]?.[1] || '#8b5cf6'})` }}>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-white/80" />
                <span className="text-white/80 text-xs font-medium">Preview</span>
              </div>
              <p className="text-white font-bold text-lg">{bankName}</p>
              <p className="text-white/60 text-xs font-mono mt-1">XXXX XXXX XXXX XXXX</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Initial Balance (₹)</label>
            <input type="number" className="input-field" placeholder="50000" value={balance} onChange={e => setBalance(e.target.value)} min="0" required />
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            <Plus size={18} /> Add Account
          </button>
        </form>
      </div>
    </div>
  );
}
