import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';
import { TrendingUp, LayoutDashboard, Wallet, ArrowLeftRight, Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const { resetAll } = useAppStore();
  const [dark, setDark] = useState(() => localStorage.getItem('finsight_theme') === 'dark');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('finsight_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => {
    logout();
    resetAll();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/accounts', label: 'Accounts', icon: Wallet },
    { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={18} color="white" />
            </div>
            <span className="gradient-text" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
              FinSight AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 10,
                    fontSize: 13, fontWeight: active ? 600 : 500,
                    textDecoration: 'none',
                    background: active ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    color: active ? '#3b82f6' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                  }}>
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setDark(!dark)}
              style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '1px solid var(--border-color)',
                background: 'var(--bg-card)', color: 'var(--text-secondary)',
                transition: 'all 0.2s ease', fontFamily: 'var(--font-sans)',
              }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <div className="hidden sm:flex" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px 6px 6px', borderRadius: 10,
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'white',
                background: 'var(--gradient-primary)',
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.name || 'User'}
              </span>
            </div>

            <button onClick={handleLogout}
              style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: 'none',
                background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444',
                transition: 'all 0.2s ease', fontFamily: 'var(--font-sans)',
              }}>
              <LogOut size={15} />
            </button>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
                background: 'var(--bg-card)', color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden animate-fade-in" style={{ paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 12,
                    fontSize: 14, fontWeight: active ? 600 : 500,
                    textDecoration: 'none',
                    background: active ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    color: active ? '#3b82f6' : 'var(--text-secondary)',
                  }}>
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
