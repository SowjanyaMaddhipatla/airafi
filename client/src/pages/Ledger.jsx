import { useEffect, useState, useCallback } from 'react';
import { Plus, Inbox } from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchFilterBar from '../components/SearchFilterBar';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import {
  fetchTransactions,
  createTransaction as createTxn,
  updateTransaction as updateTxn,
  deleteTransaction as deleteTxn,
} from '../api/transactions';

export default function Ledger() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (month) params.month = month;
      const data = await fetchTransactions(params);
      setTransactions(data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load transactions.');
    } finally {
      setLoading(false);
    }
  }, [search, month]);

  useEffect(() => {
    const debounce = setTimeout(load, 300);
    return () => clearTimeout(debounce);
  }, [load]);

  const handleAdd = async (form) => {
    await createTxn({ ...form, amount: Number(form.amount) });
    setShowForm(false);
    load();
  };

  const handleEditSubmit = async (form) => {
    await updateTxn(editing._id, { ...form, amount: Number(form.amount) });
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction? This cannot be undone.')) return;
    await deleteTxn(id);
    load();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-[var(--color-text)]">Ledger</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Search and filter your full transaction history.
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

        <div className="mb-5">
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            month={month}
            onMonthChange={setMonth}
          />
        </div>

        {error && <p className="text-sm text-[var(--color-expense-text)] mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading transactions…</p>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[var(--color-border)] rounded-xl">
            <Inbox size={28} className="text-[var(--color-text-muted)] mb-3" />
            <p className="text-sm font-medium text-[var(--color-text)]">No transactions found</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Try a different search term or clear the month filter.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <TransactionCard
                key={t._id}
                transaction={t}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && <TransactionForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
      {editing && (
        <TransactionForm initial={editing} onSubmit={handleEditSubmit} onCancel={() => setEditing(null)} />
      )}
    </div>
  );
}
