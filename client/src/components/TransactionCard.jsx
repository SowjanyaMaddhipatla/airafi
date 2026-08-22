import { Pencil, Trash2 } from 'lucide-react';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-300)] transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
            isIncome
              ? 'bg-[var(--color-income)]/40 text-[var(--color-income-text)]'
              : 'bg-[var(--color-expense)]/40 text-[var(--color-expense-text)]'
          }`}
        >
          {transaction.category}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--color-text)] truncate">{transaction.title}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{formatDate(transaction.date)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span
          className={`figure text-sm font-semibold ${
            isIncome ? 'text-[var(--color-income-text)]' : 'text-[var(--color-expense-text)]'
          }`}
        >
          {isIncome ? '+' : '−'} {formatCurrency(transaction.amount)}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(transaction)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary-600)]"
            aria-label="Edit transaction"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(transaction._id)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-expense-text)]"
            aria-label="Delete transaction"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
