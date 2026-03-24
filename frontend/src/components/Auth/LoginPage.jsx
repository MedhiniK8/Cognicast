import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';
import { TrendingUp, Eye, EyeOff, Sparkles, ArrowRight, Shield, BarChart3, Brain } from 'lucide-react';

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
      if (result.success) navigate('/dashboard');
      else setError(result.error);
      setLoading(false);
    }, 500);
  };

  const handleDemo = () => {
    setLoading(true);
    demoLogin();
    setupDemoData();
    setTimeout(() => navigate('/dashboard'), 600);
  };

  const features = [
    { icon: BarChart3, text: 'Multi-bank account aggregation' },
    { icon: Brain, text: 'AI-powered spending insights' },
    { icon: Shield, text: 'Smart budget tracking & health score' },
    { icon: Sparkles, text: 'Real-time anomaly detection' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex" style={{
        width: '50%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #ec4899 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Decorative */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'white', filter: 'blur(80px)' }}></div>
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'white', filter: 'blur(100px)' }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, padding: '0 60px', maxWidth: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={28} color="white" />
            </div>
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 12 }}>
            FinSight AI
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.6 }}>
            Intelligent Financial Dashboard
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {features.map((f, i) => (
              <div key={i} className="animate-fade-in" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                animationDelay: `${i * 0.12}s`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <f.icon size={16} color="rgba(255,255,255,0.8)" />
                </div>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div className="animate-slide-up" style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={22} color="white" />
            </div>
            <span className="gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>FinSight AI</span>
          </div>

          <h2 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32 }}>Sign in to access your financial dashboard</p>

          {error && (
            <div style={{
              marginBottom: 20, padding: '14px 18px', borderRadius: 14, fontSize: 13, fontWeight: 600,
              background: 'rgba(239, 68, 68, 0.06)', color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.15)',
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Email</label>
              <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Enter password"
                  value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px 28px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }} disabled={loading}>
              {loading ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }}></div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }}></div>
          </div>

          <button onClick={handleDemo}
            style={{
              width: '100%', padding: '14px 28px', borderRadius: 14,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.3s ease', fontFamily: 'var(--font-sans)',
            }}>
            <Sparkles size={16} /> Try Demo — Instant Access
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>Sign up free</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
