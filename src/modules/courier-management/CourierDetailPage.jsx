import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Ban, CheckCircle2, Pencil, Phone, Bike, MapPin } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CourierFormModal from './CourierFormModal'
import { useToast } from '../../components/common/ToastContext'
import { couriers as mockCouriers } from '../../mock-data/couriers'
// TODO: replace mock data with real API call to /api/v1/couriers/:id

export default function CourierDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [couriers, setCouriers] = useState(mockCouriers)
  const [confirmAction, setConfirmAction] = useState(null)
  const [editing, setEditing] = useState(false)

  const courier = couriers.find((c) => c.id === id)

  if (!courier) {
    return (
      <div>
        <PageHeader title="Courier Not Found" />
        <Link to="/couriers" className="text-sm text-[var(--color-secondary)] hover:underline">
          &larr; Back to Courier Management
        </Link>
      </div>
    )
  }

  const handleConfirm = (reason) => {
    setCouriers((prev) =>
      prev.map((c) =>
        c.id === courier.id
          ? {
              ...c,
              status: confirmAction === 'suspend' ? 'Suspended' : 'Active',
              suspendReason: confirmAction === 'suspend' ? reason : null,
            }
          : c
      )
    )
    showToast(
      confirmAction === 'suspend' ? `${courier.name} has been suspended.` : `${courier.name} has been reactivated.`,
      confirmAction === 'suspend' ? 'error' : 'success'
    )
    setConfirmAction(null)
  }

  const handleSave = (data) => {
    setCouriers((prev) => prev.map((c) => (c.id === courier.id ? { ...c, ...data } : c)))
    showToast(`${data.name}'s details have been updated.`)
    setEditing(false)
  }

  return (
    <div>
      <button
        onClick={() => navigate('/couriers')}
        className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-3"
      >
        <ArrowLeft size={15} /> Back to Courier Management
      </button>

      <PageHeader
        title={courier.name}
        subtitle={`${courier.id} · ${courier.employeeId}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
            >
              <Pencil size={15} /> Edit
            </button>
            {courier.status === 'Active' ? (
              <button
                onClick={() => setConfirmAction('suspend')}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-danger)] text-white hover:opacity-90"
              >
                <Ban size={15} /> Suspend
              </button>
            ) : (
              <button
                onClick={() => setConfirmAction('reactivate')}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-success)] text-white hover:opacity-90"
              >
                <CheckCircle2 size={15} /> Reactivate
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Courier Details</h3>
            <StatusBadge status={courier.status} />
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text)]">{courier.mobile}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bike size={15} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text)]">{courier.vehicleType}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text)]">{courier.zone}</span>
            </div>
            <div className="flex justify-between sm:contents">
              <span className="text-[var(--color-text-muted)]">Joined Date</span>
              <span className="text-[var(--color-text)] font-medium sm:text-right">{courier.joinedDate}</span>
            </div>
          </dl>
          {courier.status === 'Suspended' && courier.suspendReason && (
            <div className="mt-4 p-3 rounded-md bg-[var(--color-danger)]/10 text-xs text-[var(--color-danger)]">
              <span className="font-semibold">Suspension reason: </span>
              {courier.suspendReason}
            </div>
          )}
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-[var(--color-text-muted)] mb-1">
            Deliveries Completed
          </span>
          <span className="text-3xl font-semibold text-[var(--color-text)]">
            {courier.deliveriesCompleted.toLocaleString()}
          </span>
        </div>
      </div>

      <CourierFormModal
        open={editing}
        onClose={() => setEditing(false)}
        onSave={handleSave}
        courier={courier}
      />

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction === 'suspend' ? 'Suspend Courier' : 'Reactivate Courier'}
        message={
          confirmAction === 'suspend'
            ? `This will suspend ${courier.name} and unassign them from active deliveries. Please provide a reason.`
            : `This will reactivate ${courier.name}, allowing new delivery assignments.`
        }
        confirmLabel={confirmAction === 'suspend' ? 'Suspend' : 'Reactivate'}
        danger={confirmAction === 'suspend'}
        requireReason={confirmAction === 'suspend'}
      />
    </div>
  )
}
