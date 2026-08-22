import { Link, useNavigate } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center">
            <Wallet size={18} className="text-[var(--color-primary-600)]" />
          </div>
          <span className="font-display font-bold text-lg text-[var(--color-text)]">AiraFi</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-600)] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/ledger"
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-600)] transition-colors"
          >
            Ledger
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {profile?.fullName && (
            <span className="text-sm text-[var(--color-text-muted)] hidden sm:inline">
              {profile.fullName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-expense-text)] transition-colors"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
