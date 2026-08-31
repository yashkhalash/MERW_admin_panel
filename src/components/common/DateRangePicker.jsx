import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function toISO(date) {
  return date.toISOString().slice(0, 10)
}

function formatDisplay(iso) {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const startOffset = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}

// Fully custom (no native <input type="date">) start/end range picker,
// themed entirely from the active palette's CSS vars.
export default function DateRangePicker({ startDate, endDate, onChange, placeholder = 'Select date range' }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => (startDate ? new Date(`${startDate}T00:00:00`) : new Date()))
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const cells = buildMonthGrid(year, month)

  const handleDayClick = (date) => {
    const iso = toISO(date)
    if (!startDate || (startDate && endDate)) {
      onChange({ start: iso, end: '' })
    } else if (iso < startDate) {
      onChange({ start: iso, end: startDate })
    } else {
      onChange({ start: startDate, end: iso })
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange({ start: '', end: '' })
  }

  const isInRange = (date) => {
    if (!startDate || !endDate) return false
    const iso = toISO(date)
    return iso > startDate && iso < endDate
  }
  const isEndpoint = (date) => toISO(date) === startDate || toISO(date) === endDate

  const hasValue = startDate || endDate

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 min-w-[15rem] px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-left hover:border-[var(--color-text-muted)] transition-colors"
      >
        <Calendar size={15} className="text-[var(--color-text-muted)] shrink-0" />
        {hasValue ? (
          <span className="flex-1 text-[var(--color-text)] truncate">
            {formatDisplay(startDate) || '...'} <span className="text-[var(--color-text-muted)]">&rarr;</span>{' '}
            {formatDisplay(endDate) || '...'}
          </span>
        ) : (
          <span className="flex-1 text-[var(--color-text-muted)] truncate">{placeholder}</span>
        )}
        {hasValue && (
          <span
            onClick={handleClear}
            className="shrink-0 p-0.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-bg)]"
            aria-label="Clear date range"
          >
            <X size={13} />
          </span>
        )}
      </button>

      {open && (
        <div
          style={{ animation: 'fadeInUp 0.15s ease-out both' }}
          className="absolute z-30 mt-2 w-72 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-1 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-[var(--color-text)]">
              {viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-1 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAY_LABELS.map((d, i) => (
              <span key={i} className="text-[10px] text-center text-[var(--color-text-muted)] font-medium py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((date, i) => {
              if (!date) return <span key={i} />
              const inRange = isInRange(date)
              const endpoint = isEndpoint(date)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDayClick(date)}
                  className={`text-xs rounded-md h-7 w-full flex items-center justify-center transition-colors ${
                    endpoint
                      ? 'bg-[var(--color-primary)] text-white font-medium'
                      : inRange
                      ? 'bg-[var(--color-primary)]/15 text-[var(--color-text)]'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => onChange({ start: '', end: '' })}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
