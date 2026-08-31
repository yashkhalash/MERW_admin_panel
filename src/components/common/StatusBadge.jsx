const STYLES = {
  active: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  suspended: { bg: 'bg-[var(--color-danger)]/10', text: 'text-[var(--color-danger)]' },
  pending: { bg: 'bg-[var(--color-warning)]/15', text: 'text-[#8a6d00]' },
  verified: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  uploaded: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  rejected: { bg: 'bg-[var(--color-danger)]/10', text: 'text-[var(--color-danger)]' },
  inactive: { bg: 'bg-[var(--color-text-muted)]/10', text: 'text-[var(--color-text-muted)]' },
  delivered: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  paid: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  'in transit': { bg: 'bg-[var(--color-secondary)]/10', text: 'text-[var(--color-secondary)]' },
  processing: { bg: 'bg-[var(--color-warning)]/15', text: 'text-[#8a6d00]' },
  cancelled: { bg: 'bg-[var(--color-danger)]/10', text: 'text-[var(--color-danger)]' },
  refunded: { bg: 'bg-[var(--color-text-muted)]/10', text: 'text-[var(--color-text-muted)]' },
  approved: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  completed: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  failed: { bg: 'bg-[var(--color-danger)]/10', text: 'text-[var(--color-danger)]' },
  published: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  draft: { bg: 'bg-[var(--color-text-muted)]/10', text: 'text-[var(--color-text-muted)]' },
  new: { bg: 'bg-[var(--color-secondary)]/10', text: 'text-[var(--color-secondary)]' },
  'in progress': { bg: 'bg-[var(--color-warning)]/15', text: 'text-[#8a6d00]' },
  resolved: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]' },
  default: { bg: 'bg-[var(--color-text-muted)]/10', text: 'text-[var(--color-text-muted)]' },
}

export default function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const style = STYLES[key] || STYLES.default

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${style.bg} ${style.text}`}
    >
      {status}
    </span>
  )
}
