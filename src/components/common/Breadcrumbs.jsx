import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// items: [{ label, to? }] — the last item (or any item without `to`) renders as
// plain text; every earlier item with `to` is a clickable link.
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-3 flex-wrap">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={13} className="text-[var(--color-text-muted)] shrink-0" />}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-text-muted)]'}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
