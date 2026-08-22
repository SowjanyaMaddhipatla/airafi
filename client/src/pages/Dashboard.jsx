import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import { fetchDashboard } from '../api/transactions';
import { createTransaction as createTxn } from '../api/transactions';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      const data = await fetchDashboard();
      setDashboard(data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAdd = async (form) => {
    await createTxn({ ...form, amount: Number(form.amount) });
    setShowForm(false);
    loadDashboard();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-[var(--color-text)]">
              {dashboard?.fullName ? `Hi, ${dashboard.fullName.split(' ')[0]}` : 'Your dashboard'}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Here's your real-time financial snapshot.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary-600)] text-white text-sm font-medium hover:bg-[var(--color-primary-700)] transition-colors"
          >
            <Plus size={16} />
            Add transaction
          </button>
        </div>

        {error && (
          <p className="text-sm text-[var(--color-expense-text)] mb-4">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading dashboard…</p>
        ) : (
          <SummaryCards dashboard={dashboard} />
        )}
      </main>

      {showForm && (
        <TransactionForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
}
