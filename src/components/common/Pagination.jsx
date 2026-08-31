import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ pageIndex, pageCount, totalRows, pageSize, onPageChange }) {
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between px-1 pt-3 text-sm">
      <span className="text-[var(--color-text-muted)]">
        Showing <span className="font-medium text-[var(--color-text)]">{from}</span>-
        <span className="font-medium text-[var(--color-text)]">{to}</span> of{' '}
        <span className="font-medium text-[var(--color-text)]">{totalRows}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-40 hover:bg-[var(--color-bg)]"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-2 text-[var(--color-text)]">
          Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
        </span>
        <button
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1}
          className="p-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-40 hover:bg-[var(--color-bg)]"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
