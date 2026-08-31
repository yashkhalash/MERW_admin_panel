import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Ban, CheckCircle2, Check, X, Mail, Phone, FileCheck2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
import { sellers as mockSellers } from '../../mock-data/sellers'
// TODO: replace mock data with real API call to /api/v1/sellers/:id

export default function SellerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const symbol = useCurrencySymbol()
  const { showToast } = useToast()
  const [sellers, setSellers] = useState(mockSellers)
  const [confirmAction, setConfirmAction] = useState(null)

  const seller = sellers.find((s) => s.id === id)

  if (!seller) {
    return (
      <div>
        <PageHeader title="Seller Not Found" />
        <Link to="/sellers" className="text-sm text-[var(--color-secondary)] hover:underline">
          &larr; Back to Seller Management
        </Link>
      </div>
    )
  }

  const handleConfirm = (reason) => {
    setSellers((prev) =>
      prev.map((s) => {
        if (s.id !== seller.id) return s
        if (confirmAction === 'approve') return { ...s, verificationStatus: 'Verified', status: 'Active', rejectReason: null }
        if (confirmAction === 'reject') return { ...s, verificationStatus: 'Rejected', status: 'Inactive', rejectReason: reason }
        if (confirmAction === 'suspend') return { ...s, status: 'Suspended', suspendReason: reason }
        if (confirmAction === 'reactivate') return { ...s, status: 'Active', suspendReason: null }
        return s
      })
    )
    const messages = {
      approve: [`${seller.storeName} has been approved and verified.`, 'success'],
      reject: [`${seller.storeName}'s application has been rejected.`, 'error'],
      suspend: [`${seller.storeName} has been suspended.`, 'error'],
      reactivate: [`${seller.storeName} has been reactivated.`, 'success'],
    }
    const [msg, type] = messages[confirmAction] || []
    if (msg) showToast(msg, type)
    setConfirmAction(null)
  }

  const dialogCopy = {
    approve: {
      title: 'Approve Seller',
      message: `This will verify ${seller.storeName} and activate their storefront.`,
      confirmLabel: 'Approve',
      danger: false,
      requireReason: false,
    },
    reject: {
      title: 'Reject Seller',
      message: `This will reject ${seller.storeName}'s application. Please provide a reason.`,
      confirmLabel: 'Reject',
      danger: true,
      requireReason: true,
    },
    suspend: {
      title: 'Suspend Seller',
      message: `This will suspend ${seller.storeName}'s storefront. Please provide a reason.`,
      confirmLabel: 'Suspend',
      danger: true,
      requireReason: true,
    },
    reactivate: {
      title: 'Reactivate Seller',
      message: `This will reactivate ${seller.storeName}'s storefront.`,
      confirmLabel: 'Reactivate',
      danger: false,
      requireReason: false,
    },
  }[confirmAction]

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Seller Management', to: '/sellers' },
          { label: seller.storeName },
        ]}
      />

      <PageHeader
        title={seller.storeName}
        subtitle={`${seller.id} · ${seller.category}`}
        actions={
          <div className="flex items-center gap-2">
            {seller.verificationStatus === 'Pending' && (
              <>
                <button
                  onClick={() => setConfirmAction('approve')}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-success)] text-white hover:opacity-90"
                >
                  <Check size={15} /> Approve
                </button>
                <button
                  onClick={() => setConfirmAction('reject')}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-danger)] text-white hover:opacity-90"
                >
                  <X size={15} /> Reject
                </button>
              </>
            )}
            {seller.verificationStatus === 'Verified' &&
              (seller.status === 'Active' ? (
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
              ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Seller Profile</h3>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={seller.verificationStatus} />
              <StatusBadge status={seller.status} />
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Owner</span>
              <span className="text-[var(--color-text)] font-medium">{seller.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text)]">{seller.ownerEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text)]">{seller.ownerMobile}</span>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] flex justify-between">
              <span className="text-[var(--color-text-muted)]">Registered Date</span>
              <span className="text-[var(--color-text)] font-medium">{seller.registeredDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Products</span>
              <span className="text-[var(--color-text)] font-medium">{seller.products}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Sales</span>
              <span className="text-[var(--color-text)] font-medium">{symbol}{seller.sales.toLocaleString()}</span>
            </div>
          </dl>
          {seller.status === 'Suspended' && seller.suspendReason && (
            <div className="mt-4 p-3 rounded-md bg-[var(--color-danger)]/10 text-xs text-[var(--color-danger)]">
              <span className="font-semibold">Suspension reason: </span>
              {seller.suspendReason}
            </div>
          )}
          {seller.verificationStatus === 'Rejected' && seller.rejectReason && (
            <div className="mt-4 p-3 rounded-md bg-[var(--color-danger)]/10 text-xs text-[var(--color-danger)]">
              <span className="font-semibold">Rejection reason: </span>
              {seller.rejectReason}
            </div>
          )}
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <FileCheck2 size={16} /> Verification Documents
          </h3>
          <ul className="space-y-2">
            {seller.documents.map((doc) => (
              <li
                key={doc.name}
                className="flex items-center justify-between text-sm border border-[var(--color-border)] rounded-md px-3 py-2"
              >
                <span className="text-[var(--color-text)]">{doc.name}</span>
                <StatusBadge status={doc.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Recent Products</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left text-[var(--color-text-muted)]">
                <th className="px-5 py-2 font-medium">Name</th>
                <th className="px-5 py-2 font-medium">Price</th>
                <th className="px-5 py-2 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {seller.recentProducts.map((p) => (
                <tr key={p.name} className="border-t border-[var(--color-border)]">
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{p.name}</td>
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{symbol}{p.price.toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{p.stock}</td>
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
        {...(dialogCopy || {})}
      />
    </div>
  )
}
