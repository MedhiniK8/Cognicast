import { useState } from 'react';
import useAppStore, { BANK_NAMES, BANK_COLORS } from '../../store/appStore';
import { Plus, X, CreditCard, Building2 } from 'lucide-react';

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
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}>
      <div className="card-static animate-slide-up"
        style={{ padding: 32, width: '100%', maxWidth: 440 }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Building2 size={20} color="white" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Add Bank Account</h3>
          </div>
          <button onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'var(--bg-card-hover)', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-sans)',
            }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Bank Name</label>
            <select className="input-field" style={{ cursor: 'pointer' }} value={bankName} onChange={e => setBankName(e.target.value)} required>
              <option value="">Select a bank</option>
              {BANK_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>

          {bankName && (
            <div className="animate-fade-in" style={{
              padding: '20px 22px', borderRadius: 18,
              background: `linear-gradient(135deg, ${BANK_COLORS[bankName]?.[0] || '#3b82f6'}, ${BANK_COLORS[bankName]?.[1] || '#8b5cf6'})`,
              color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CreditCard size={14} style={{ opacity: 0.7 }} />
                <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>Preview</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 800 }}>{bankName}</p>
              <p style={{ fontSize: 11, fontFamily: 'monospace', opacity: 0.4, marginTop: 6 }}>XXXX XXXX XXXX XXXX</p>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Initial Balance (₹)</label>
            <input type="number" className="input-field" placeholder="50000" value={balance} onChange={e => setBalance(e.target.value)} min="0" required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Plus size={16} /> Add Account
          </button>
        </form>
      </div>
    </div>
  );
}
