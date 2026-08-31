import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, X, ImageIcon, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
import { products as mockProducts } from '../../mock-data/products'
// TODO: replace mock data with real API call to /api/v1/products/:id

export default function ModerationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const symbol = useCurrencySymbol()
  const { showToast } = useToast()
  const [products, setProducts] = useState(mockProducts)
  const [confirmAction, setConfirmAction] = useState(null)

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div>
        <PageHeader title="Product Not Found" />
        <Link to="/moderation" className="text-sm text-[var(--color-secondary)] hover:underline">
          &larr; Back to Content & Product Moderation
        </Link>
      </div>
    )
  }

  const handleConfirm = (reason) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              status: confirmAction === 'approve' ? 'Approved' : 'Rejected',
              rejectReason: confirmAction === 'reject' ? reason : null,
            }
          : p
      )
    )
    showToast(
      confirmAction === 'approve' ? `"${product.name}" has been approved.` : `"${product.name}" has been rejected.`,
      confirmAction === 'approve' ? 'success' : 'error'
    )
    setConfirmAction(null)
  }

  const scoreColor =
    product.aiQualityScore >= 80
      ? 'var(--color-success)'
      : product.aiQualityScore >= 65
      ? 'var(--color-warning)'
      : 'var(--color-danger)'

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Content Moderation', to: '/moderation' },
          { label: product.name },
        ]}
      />

      <PageHeader
        title={product.name}
        subtitle={`${product.id} · ${product.category} · Submitted by ${product.sellerName}`}
        actions={
          product.status === 'Pending' && (
            <div className="flex items-center gap-2">
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
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Product Details</h3>
            <StatusBadge status={product.status} />
          </div>

          <div className="flex items-center gap-2 mb-4 text-[var(--color-text-muted)] text-sm">
            <ImageIcon size={15} />
            <span>{product.images} product images uploaded</span>
          </div>

          <p className="text-sm text-[var(--color-text)] leading-relaxed mb-4">{product.description}</p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm border-t border-[var(--color-border)] pt-4">
            <span className="text-[var(--color-text-muted)]">Price</span>
            <span className="text-[var(--color-text)] font-medium text-right">{symbol}{product.price.toLocaleString()}</span>
            <span className="text-[var(--color-text-muted)]">Submitted Date</span>
            <span className="text-[var(--color-text)] font-medium text-right">{product.submittedDate}</span>
            <span className="text-[var(--color-text-muted)]">Seller</span>
            <span className="text-[var(--color-text)] font-medium text-right">{product.sellerName}</span>
          </dl>

          {product.status === 'Rejected' && product.rejectReason && (
            <div className="mt-4 p-3 rounded-md bg-[var(--color-danger)]/10 text-xs text-[var(--color-danger)]">
              <span className="font-semibold">Rejection reason: </span>
              {product.rejectReason}
            </div>
          )}
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">AI Quality Assessment</h3>
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-semibold border-4"
              style={{ borderColor: scoreColor, color: scoreColor }}
            >
              {product.aiQualityScore}
            </div>
          </div>
          {product.aiFlags.length > 0 ? (
            <ul className="space-y-2">
              {product.aiFlags.map((flag, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-[var(--color-warning-dark,#8a6d00)] bg-[var(--color-warning)]/10 rounded-md px-3 py-2"
                >
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] text-center">No quality flags detected.</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction === 'approve' ? 'Approve Product' : 'Reject Product'}
        message={
          confirmAction === 'approve'
            ? `This will approve "${product.name}" and publish it to the marketplace.`
            : `This will reject "${product.name}"'s listing. Please provide a reason.`
        }
        confirmLabel={confirmAction === 'approve' ? 'Approve' : 'Reject'}
        danger={confirmAction === 'reject'}
        requireReason={confirmAction === 'reject'}
      />
    </div>
  )
}
