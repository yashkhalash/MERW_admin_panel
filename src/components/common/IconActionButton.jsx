import Tooltip from './Tooltip'

// Palette-colored icon action button (View/Edit/Delete/Approve/...) with a
// built-in tooltip, used for every row/detail action across the app so
// action intent reads from color, not just an icon shape.
const VARIANT_STYLES = {
  view: 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20',
  edit: 'bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)]/20',
  delete: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20',
  approve: 'bg-[var(--color-success)]/10 text-[var(--color-success)] hover:bg-[var(--color-success)]/20',
  reject: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20',
  suspend: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20',
  reactivate: 'bg-[var(--color-success)]/10 text-[var(--color-success)] hover:bg-[var(--color-success)]/20',
  assign: 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/20',
  reassign: 'bg-[var(--color-warning)]/15 text-[#8a6d00] hover:bg-[var(--color-warning)]/25',
  neutral: 'bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)] hover:bg-[var(--color-text-muted)]/20',
}

export default function IconActionButton({
  icon: Icon,
  label,
  variant = 'neutral',
  onClick,
  size = 16,
  disabled = false,
  tooltipPosition = 'top',
}) {
  return (
    <Tooltip label={label} position={tooltipPosition}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`p-1.5 rounded-md transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
          VARIANT_STYLES[variant] || VARIANT_STYLES.neutral
        }`}
      >
        <Icon size={size} />
      </button>
    </Tooltip>
  )
}
