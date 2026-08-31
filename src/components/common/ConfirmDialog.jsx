import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

// Destructive-action confirmation dialog. When `requireReason` is true, a reason
// must be typed before the confirm button is enabled (per SOW: Suspend/Delete actions).
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  danger = true,
  requireReason = false,
}) {
  const [reason, setReason] = useState('')

  const canConfirm = !requireReason || reason.trim().length > 0

  const handleConfirm = () => {
    onConfirm(requireReason ? reason.trim() : undefined)
    setReason('')
  }

  const handleClose = () => {
    setReason('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={handleClose}
            className="px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-3 py-2 text-sm font-medium rounded-md text-white disabled:opacity-40 disabled:cursor-not-allowed ${
              danger ? 'bg-[var(--color-danger)] hover:opacity-90' : 'bg-[var(--color-primary)] hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        {danger && (
          <div className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)] flex items-center justify-center">
            <AlertTriangle size={18} />
          </div>
        )}
        <div className="flex-1">
          {message && <p className="text-sm text-[var(--color-text-muted)]">{message}</p>}
          {requireReason && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                Reason <span className="text-[var(--color-danger)]">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Enter a reason for this action..."
                className="w-full text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
