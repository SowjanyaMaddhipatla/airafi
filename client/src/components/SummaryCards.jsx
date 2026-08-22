import { TrendingUp, TrendingDown, Wallet2 } from 'lucide-react';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function Card({ label, value, icon: Icon, tone }) {
  const toneStyles = {
    neutral: { bg: 'bg-[var(--color-primary-50)]', icon: 'text-[var(--color-primary-600)]' },
    income: { bg: 'bg-[var(--color-income)]/30', icon: 'text-[var(--color-income-text)]' },
    expense: { bg: 'bg-[var(--color-expense)]/30', icon: 'text-[var(--color-expense-text)]' },
  }[tone];

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneStyles.bg}`}>
          <Icon size={16} className={toneStyles.icon} />
        </div>
      </div>
      <p className="figure text-2xl font-semibold text-[var(--color-text)]">
        {formatCurrency(value)}
      </p>
    </div>
  );
}

export default function SummaryCards({ dashboard }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card label="Net Balance" value={dashboard?.balance} icon={Wallet2} tone="neutral" />
      <Card label="Total Income" value={dashboard?.totalIncome} icon={TrendingUp} tone="income" />
      <Card label="Total Expense" value={dashboard?.totalExpense} icon={TrendingDown} tone="expense" />
    </div>
  );
}
