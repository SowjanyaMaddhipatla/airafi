import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerUser(form);
      login(data.token, data.user, null);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
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
          <h1 className="font-display font-bold text-xl text-[var(--color-text)]">Create your AiraFi account</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Step 1 of 2 — your identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <div>
            <label className="text-sm font-medium text-[var(--color-text-muted)]">Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              placeholder="yourname"
            />
          </div>
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
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-[var(--color-expense-text)]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[var(--color-primary-600)] text-white text-sm font-medium hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Continue'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-primary-600)] font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
