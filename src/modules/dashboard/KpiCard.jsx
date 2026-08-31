import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function KpiCard({ label, value, delta, trend, icon: Icon, format }) {
  const isUp = trend === 'up'
  const displayValue = format ? format(value) : value.toLocaleString()

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-md bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary-dark)]">
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold text-[var(--color-text)]">{displayValue}</div>
      <div
        className={`flex items-center gap-1 text-xs font-medium ${
          isUp ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
        }`}
      >
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{Math.abs(delta)}%</span>
        <span className="text-[var(--color-text-muted)] font-normal">vs last month</span>
      </div>
    </div>
  )
}
