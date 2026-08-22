import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data.token, data.user, data.profile);
      navigate(data.user.hasProfile ? '/dashboard' : '/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center mb-3">
            <Wallet size={22} className="text-[var(--color-primary-600)]" />
          </div>
          <h1 className="font-display font-bold text-xl text-[var(--color-text)]">Welcome back</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Log in to your AiraFi account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <div>
            <label className="text-sm font-medium text-[var(--color-text-muted)]">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--color-text-muted)]">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-[var(--color-expense-text)]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[var(--color-primary-600)] text-white text-sm font-medium hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-5">
          New to AiraFi?{' '}
          <Link to="/register" className="text-[var(--color-primary-600)] font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
