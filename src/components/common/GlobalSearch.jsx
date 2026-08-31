import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, Users, Store, Truck, ShoppingCart, Mail, HelpCircle, FileText, Compass } from 'lucide-react'
import { navItems } from './navItems'
import { customers } from '../../mock-data/customers'
import { sellers } from '../../mock-data/sellers'
import { orders } from '../../mock-data/orders'
import { couriers } from '../../mock-data/couriers'
import { enquiries } from '../../mock-data/enquiries'
import { faqs } from '../../mock-data/faqs'
import { cmsPages } from '../../mock-data/cms'

const MAX_PER_GROUP = 4

// Search groups: label/icon for the dropdown, a match test, a display line, and where clicking navigates to.
const GROUPS = [
  {
    key: 'pages',
    label: 'Pages',
    icon: Compass,
    items: navItems,
    match: (n, q) => n.label.toLowerCase().includes(q),
    title: (n) => n.label,
    subtitle: () => 'Go to page',
    to: (n) => n.to,
    iconFor: (n) => n.icon,
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: Users,
    items: customers,
    match: (c, q) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    title: (c) => c.name,
    subtitle: (c) => `${c.id} · ${c.email}`,
    to: (c) => `/customers/${c.id}`,
  },
  {
    key: 'sellers',
    label: 'Sellers',
    icon: Store,
    items: sellers,
    match: (s, q) => s.storeName.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || s.id.toLowerCase().includes(q),
    title: (s) => s.storeName,
    subtitle: (s) => `${s.id} · ${s.owner}`,
    to: (s) => `/sellers/${s.id}`,
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    items: orders,
    match: (o, q) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q),
    title: (o) => o.id,
    subtitle: (o) => `${o.customerName} · ${o.fulfilmentStatus}`,
    to: (o) => `/orders/${o.id}`,
  },
  {
    key: 'couriers',
    label: 'Couriers',
    icon: Truck,
    items: couriers,
    match: (c, q) => c.name.toLowerCase().includes(q) || c.employeeId.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    title: (c) => c.name,
    subtitle: (c) => `${c.id} · ${c.zone}`,
    to: (c) => `/couriers/${c.id}`,
  },
  {
    key: 'enquiries',
    label: 'Contact Enquiries',
    icon: Mail,
    items: enquiries,
    match: (e, q) => e.subject.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q),
    title: (e) => e.subject,
    subtitle: (e) => `${e.id} · ${e.name}`,
    to: () => '/enquiries',
  },
  {
    key: 'faqs',
    label: 'FAQs',
    icon: HelpCircle,
    items: faqs,
    match: (f, q) => f.question.toLowerCase().includes(q) || f.category.toLowerCase().includes(q),
    title: (f) => f.question,
    subtitle: (f) => f.category,
    to: (f) => `/faqs/${f.id}`,
  },
  {
    key: 'cms',
    label: 'CMS Pages',
    icon: FileText,
    items: cmsPages,
    match: (p, q) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    title: (p) => p.title,
    subtitle: (p) => `/${p.slug}`,
    to: (p) => `/cms/${p.id}`,
  },
]

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const wrapperRef = useRef(null)
  const panelRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return GROUPS.map((group) => ({
      ...group,
      matches: group.items.filter((item) => group.match(item, q)).slice(0, MAX_PER_GROUP),
    })).filter((group) => group.matches.length > 0)
  }, [query])

  const totalResults = results.reduce((sum, g) => sum + g.matches.length, 0)

  const updateCoords = () => {
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return
    setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width })
  }

  useEffect(() => {
    if (!open) return
    updateCoords()
    const handlePointerDown = (e) => {
      if (wrapperRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const handleReposition = () => updateCoords()
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open])

  const handleSelect = (group, item) => {
    setOpen(false)
    setQuery('')
    navigate(group.to(item))
  }

  return (
    <div ref={wrapperRef} className="flex-1 max-w-md relative min-w-0">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search pages, customers, orders, sellers..."
        className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
      />

      {open &&
        query.trim() &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', top: coords.top, left: coords.left, width: coords.width }}
            className="z-50 max-h-96 overflow-y-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg py-1"
          >
            {totalResults === 0 ? (
              <p className="px-3 py-4 text-sm text-center text-[var(--color-text-muted)]">
                No results for "{query}"
              </p>
            ) : (
              results.map((group) => (
                <div key={group.key} className="py-1">
                  <div className="px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)] tracking-wide">
                    {group.label}
                  </div>
                  {group.matches.map((item, i) => {
                    const Icon = group.iconFor?.(item) ?? group.icon
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelect(group, item)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[var(--color-bg)]"
                      >
                        <Icon size={14} className="shrink-0 text-[var(--color-text-muted)]" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-[var(--color-text)] truncate">{group.title(item)}</span>
                          <span className="block text-xs text-[var(--color-text-muted)] truncate">
                            {group.subtitle(item)}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
