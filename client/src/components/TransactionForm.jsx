import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Food', 'Groceries', 'Transport', 'Rent', 'Utilities', 'Shopping', 'Salary', 'Freelance', 'Other'];

export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    type: initial?.type || 'expense',
    amount: initial?.amount || '',
    category: initial?.category || CATEGORIES[0],
    date: initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        type: initial.type,
        amount: initial.amount,
        category: initial.category,
        date: initial.date.slice(0, 10),
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.amount || Number(form.amount) <= 0) {
      setError('Enter a title and an amount greater than 0.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-text)]/20 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-[var(--color-text)]">
            {initial ? 'Edit transaction' : 'Add transaction'}
          </h2>
          <button onClick={onCancel} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: 'expense' }))}
              className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.type === 'expense'
                  ? 'bg-[var(--color-expense)]/40 border-[var(--color-expense)] text-[var(--color-expense-text)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: 'income' }))}
              className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.type === 'income'
                  ? 'bg-[var(--color-income)]/40 border-[var(--color-income)] text-[var(--color-income-text)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-muted)]">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Milk & bread"
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-[var(--color-text-muted)]">Amount</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="figure mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-text-muted)]">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-muted)]">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-[var(--color-expense-text)]">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 rounded-lg bg-[var(--color-primary-600)] text-white text-sm font-medium hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : initial ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
