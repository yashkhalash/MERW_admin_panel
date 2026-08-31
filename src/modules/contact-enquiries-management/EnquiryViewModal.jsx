import { useEffect, useState } from 'react'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import { fieldInputClass } from '../../components/common/FormField'

const STATUS_OPTIONS = ['New', 'In Progress', 'Resolved']

export default function EnquiryViewModal({ open, onClose, onStatusChange, enquiry }) {
  const [status, setStatus] = useState('New')

  useEffect(() => {
    if (enquiry) setStatus(enquiry.status)
  }, [enquiry])

  if (!enquiry) return null

  const handleSave = () => {
    onStatusChange(enquiry.id, status)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={enquiry.subject}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={status === enquiry.status}
            className="px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Update Status
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
          <span className="text-[var(--color-text-muted)]">From</span>
          <span className="text-[var(--color-text)] font-medium text-right">{enquiry.name}</span>
          <span className="text-[var(--color-text-muted)]">Email</span>
          <span className="text-[var(--color-text)] font-medium text-right">{enquiry.email}</span>
          <span className="text-[var(--color-text-muted)]">Mobile</span>
          <span className="text-[var(--color-text)] font-medium text-right">{enquiry.mobile}</span>
          <span className="text-[var(--color-text-muted)]">Submitted</span>
          <span className="text-[var(--color-text)] font-medium text-right">{enquiry.submittedDate}</span>
        </dl>

        <div className="pt-2 border-t border-[var(--color-border)]">
          <span className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Message</span>
          <p className="text-sm text-[var(--color-text)] leading-relaxed">{enquiry.message}</p>
        </div>

        <div className="pt-2 border-t border-[var(--color-border)]">
          <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} className={fieldInputClass} />
        </div>
      </div>
    </Modal>
  )
}
