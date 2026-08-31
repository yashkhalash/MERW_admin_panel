// Simple controlled tab strip, reused by modules with multiple sub-views
// (Financial & Settlement, Reports & Analytics, Platform Configuration).
export default function Tabs({ tabs, activeKey, onChange }) {
  return (
    <div className="border-b border-[var(--color-border)] mb-5 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all duration-200 ${
              activeKey === tab.key
                ? 'border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
