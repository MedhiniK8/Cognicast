import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';
import { TrendingUp, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, demoLogin } = useAuthStore();
  const { setupDemoData } = useAppStore();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 500);
  };

  const handleDemo = () => {
    setLoading(true);
    demoLogin();
    setupDemoData();
    setTimeout(() => navigate('/dashboard'), 600);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'var(--gradient-primary)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <TrendingUp size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">FinSight AI</h1>
          <p className="text-xl text-blue-100 mb-8">Intelligent Financial Dashboard</p>
          <div className="space-y-4 text-left max-w-md mx-auto">
            {['Multi-bank account aggregation', 'AI-powered spending insights', 'Smart budget tracking', 'Real-time anomaly detection'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90 animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <TrendingUp size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">FinSight AI</h1>
          </div>

          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Welcome back</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Sign in to access your financial dashboard</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }}></div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }}></div>
          </div>

          <button onClick={handleDemo}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', color: 'white', border: 'none' }}
          >
            <Sparkles size={18} />
            Try Demo — Instant Access
          </button>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold" style={{ color: '#3b82f6' }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
