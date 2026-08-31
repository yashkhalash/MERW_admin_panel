import { useState, useEffect } from 'react'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import FormField, { fieldInputClass } from '../../components/common/FormField'
import { couriers } from '../../mock-data/couriers'
// TODO: replace mock data with real API call to /api/v1/couriers?status=active

const activeCouriers = couriers.filter((c) => c.status === 'Active')

export default function ReassignCourierModal({ open, onClose, onSave, order }) {
  const [courierId, setCourierId] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setCourierId('')
      setReason('')
    }
  }, [open])

  const canSave = courierId && reason.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reassign Courier"
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const courier = activeCouriers.find((c) => c.id === courierId)
              onSave(courier, reason.trim())
            }}
            disabled={!canSave}
            className="px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reassign
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Currently assigned to <span className="font-medium text-[var(--color-text)]">{order?.courierName}</span>.
          Choose a new courier for {order?.id}.
        </p>

        <FormField label="New Courier" required>
          <Select
            value={courierId}
            onChange={(e) => setCourierId(e.target.value)}
            placeholder="Select a courier..."
            options={activeCouriers
              .filter((c) => c.name !== order?.courierName)
              .map((c) => ({ value: c.id, label: `${c.name} · ${c.zone} · ${c.vehicleType}` }))}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Reason" required>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Enter a reason for manual reassignment..."
            className={fieldInputClass}
          />
        </FormField>
      </div>
    </Modal>
  )
}
