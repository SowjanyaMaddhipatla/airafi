import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';
import { createOnboardingProfile } from '../api/profile';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const [form, setForm] = useState({ fullName: '', startingBalance: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setActiveProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setLoading(true);
    try {
      const data = await createOnboardingProfile(form);
      setActiveProfile(data.profile);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-100)] flex items-center justify-center mb-3">
            <UserCircle2 size={22} className="text-[var(--color-primary-600)]" />
          </div>
          <h1 className="font-display font-bold text-xl text-[var(--color-text)]">Set up your profile</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Step 2 of 2 — your financial profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <div>
            <label className="text-sm font-medium text-[var(--color-text-muted)]">Full name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--color-text-muted)]">Starting balance (optional)</label>
            <input
              type="number"
              step="0.01"
              value={form.startingBalance}
              onChange={(e) => setForm({ ...form, startingBalance: e.target.value })}
              className="figure mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              placeholder="0.00"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Any amount you already have on hand. Leave blank to start from zero.
            </p>
          </div>

          {error && <p className="text-sm text-[var(--color-expense-text)]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[var(--color-primary-600)] text-white text-sm font-medium hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-60"
          >
            {loading ? 'Setting up…' : 'Go to dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
