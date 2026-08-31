// Lightweight CSS-only tooltip: wraps any element and shows a small label
// bubble above it on hover/focus. No JS positioning needed.
export default function Tooltip({ label, children, position = 'top' }) {
  if (!label) return children

  const positionClasses =
    position === 'bottom'
      ? 'top-full mt-1.5'
      : 'bottom-full mb-1.5'

  return (
    <span className="relative inline-flex group/tooltip">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${positionClasses} whitespace-nowrap px-2 py-1 rounded-md text-[11px] font-medium bg-[var(--color-text)] text-[var(--color-surface)] opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:scale-100 transition-all duration-150 z-30`}
      >
        {label}
      </span>
    </span>
  )
}
