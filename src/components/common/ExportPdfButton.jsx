import { FileDown } from 'lucide-react'
import { useToast } from './ToastContext'

// Themed PDF export button. `onGenerate` should be a function (already bound with the
// data it needs) that builds and downloads the PDF, e.g. one of the src/utils/pdfReport.js
// generators. Kept generic so any report page can drop it in without duplicating markup.
export default function ExportPdfButton({ onGenerate, label = 'Export PDF' }) {
  const { showToast } = useToast()

  const handleExport = () => {
    try {
      onGenerate()
      showToast('Report exported as PDF.')
    } catch {
      showToast('Could not generate the PDF report.', 'error')
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)] active:scale-95 transition-all duration-150"
    >
      <FileDown size={15} /> {label}
    </button>
  )
}
