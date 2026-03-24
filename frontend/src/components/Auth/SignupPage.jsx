import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { TrendingUp, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = signup(name, email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <TrendingUp size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">FinSight AI</h1>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-2">
            <UserPlus size={24} style={{ color: '#3b82f6' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Account</h2>
          </div>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Start tracking your finances today</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" className="input-field" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#3b82f6' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
