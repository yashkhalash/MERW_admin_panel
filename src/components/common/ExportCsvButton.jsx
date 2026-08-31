import { Download } from 'lucide-react'
import { exportToCsv } from '../../utils/csv'
import { useToast } from './ToastContext'

// Themed CSV export button — uses the active palette's CSS vars, so it matches
// whatever theme is currently applied. Drop into any list page's PageHeader
// actions (or toolbar row) alongside its DataTable.
//
// Default usage exports a flat `data` array through `columns` ({ label, accessor }).
// For a page whose export doesn't fit that single-table shape (e.g. several small
// tables), pass `onGenerate` instead — a function that builds and downloads the CSV
// itself (see src/utils/csv.js's exportDashboardCsv for an example).
export default function ExportCsvButton({ data, columns, filename, label = 'Export CSV', onGenerate }) {
  const { showToast } = useToast()

  const handleExport = () => {
    if (onGenerate) {
      onGenerate()
      showToast('Exported to CSV.')
      return
    }
    if (!data || data.length === 0) {
      showToast('No data to export.', 'error')
      return
    }
    exportToCsv(filename, columns, data)
    showToast(`Exported ${data.length} row${data.length === 1 ? '' : 's'} to CSV.`)
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] active:scale-95 transition-all duration-150"
    >
      <Download size={15} /> {label}
    </button>
  )
}
