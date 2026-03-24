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
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">FinSight AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline"
                  style={{
                    background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: active ? '#3b82f6' : 'var(--text-secondary)',
                  }}>
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border-none"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</span>
            </div>

            <button onClick={handleLogout}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border-none"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <LogOut size={16} />
            </button>

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center border-none cursor-pointer"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium no-underline"
                  style={{
                    background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
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
