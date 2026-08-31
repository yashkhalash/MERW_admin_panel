import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Ban, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
import { customers as mockCustomers } from '../../mock-data/customers'
// TODO: replace mock data with real API call to /api/v1/customers/:id

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const symbol = useCurrencySymbol()
  const { showToast } = useToast()
  const [customers, setCustomers] = useState(mockCustomers)
  const [confirmAction, setConfirmAction] = useState(null) // 'suspend' | 'reactivate'

  const customer = customers.find((c) => c.id === id)

  if (!customer) {
    return (
      <div>
        <PageHeader title="Customer Not Found" />
        <Link to="/customers" className="text-sm text-[var(--color-secondary)] hover:underline">
          &larr; Back to Customer Management
        </Link>
      </div>
    )
  }

  const handleConfirm = (reason) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customer.id
          ? {
              ...c,
              status: confirmAction === 'suspend' ? 'Suspended' : 'Active',
              suspendReason: confirmAction === 'suspend' ? reason : null,
            }
          : c
      )
    )
    showToast(
      confirmAction === 'suspend' ? `${customer.name}'s account has been suspended.` : `${customer.name}'s account has been reactivated.`,
      confirmAction === 'suspend' ? 'error' : 'success'
    )
    setConfirmAction(null)
  }

  return (
    <div>
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-3"
      >
        <ArrowLeft size={15} /> Back to Customer Management
      </button>

      <PageHeader
        title={customer.name}
        subtitle={customer.id}
        actions={
          customer.status === 'Active' ? (
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
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Profile</h3>
            <StatusBadge status={customer.status} />
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text)]">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text)]">{customer.mobile}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={15} className="text-[var(--color-text-muted)] mt-0.5" />
              <span className="text-[var(--color-text)]">
                {customer.addresses[0].line}, {customer.addresses[0].city} - {customer.addresses[0].pincode}
              </span>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] flex justify-between">
              <span className="text-[var(--color-text-muted)]">Registered Date</span>
              <span className="text-[var(--color-text)] font-medium">{customer.registeredDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Total Orders</span>
              <span className="text-[var(--color-text)] font-medium">{customer.totalOrders}</span>
            </div>
          </dl>
          {customer.status === 'Suspended' && customer.suspendReason && (
            <div className="mt-4 p-3 rounded-md bg-[var(--color-danger)]/10 text-xs text-[var(--color-danger)]">
              <span className="font-semibold">Suspension reason: </span>
              {customer.suspendReason}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Recent Orders</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left text-[var(--color-text-muted)]">
                <th className="px-5 py-2 font-medium">Order ID</th>
                <th className="px-5 py-2 font-medium">Date</th>
                <th className="px-5 py-2 font-medium">Amount</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {customer.recentOrders.map((o) => (
                <tr key={o.orderId} className="border-t border-[var(--color-border)]">
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{o.orderId}</td>
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{o.date}</td>
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{symbol}{o.amount.toLocaleString()}</td>
                  <td className="px-5 py-2.5">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction === 'suspend' ? 'Suspend Customer' : 'Reactivate Customer'}
        message={
          confirmAction === 'suspend'
            ? `This will suspend ${customer.name}'s account and block further orders. Please provide a reason.`
            : `This will reactivate ${customer.name}'s account, allowing them to place orders again.`
        }
        confirmLabel={confirmAction === 'suspend' ? 'Suspend' : 'Reactivate'}
        danger={confirmAction === 'suspend'}
        requireReason={confirmAction === 'suspend'}
      />
    </div>
  )
}
