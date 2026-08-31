import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Check, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../components/common/ToastContext'
import { products as mockProducts } from '../../mock-data/products'
// TODO: replace mock data with real API call to /api/v1/products/moderation-queue

function QualityScore({ score }) {
  const color =
    score >= 80 ? 'var(--color-success)' : score >= 65 ? 'var(--color-warning)' : 'var(--color-danger)'
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {score}
    </span>
  )
}

export default function ModerationQueuePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [products, setProducts] = useState(mockProducts)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'Pending', category: '' })
  const [confirmTarget, setConfirmTarget] = useState(null) // { product, action: 'approve'|'reject' }

  const categories = useMemo(() => [...new Set(mockProducts.map((p) => p.category))], [])

  const filteredData = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !filters.status || p.status === filters.status
      const matchesCategory = !filters.category || p.category === filters.category
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [products, search, filters])

  const handleConfirmAction = (reason) => {
    const { product, action } = confirmTarget
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              status: action === 'approve' ? 'Approved' : 'Rejected',
              rejectReason: action === 'reject' ? reason : null,
            }
          : p
      )
    )
    showToast(
      action === 'approve' ? `"${product.name}" has been approved.` : `"${product.name}" has been rejected.`,
      action === 'approve' ? 'success' : 'error'
    )
    setConfirmTarget(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Product Name', accessorKey: 'name' },
      { header: 'Seller', accessorKey: 'sellerName' },
      { header: 'Category', accessorKey: 'category' },
      { header: 'Submitted Date', accessorKey: 'submittedDate' },
      {
        header: 'AI Quality Score',
        accessorKey: 'aiQualityScore',
        cell: (info) => <QualityScore score={info.getValue()} />,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
          const p = row.original
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/moderation/${p.id}`)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-secondary)]"
                title="View"
              >
                <Eye size={16} />
              </button>
              {p.status === 'Pending' && (
                <>
                  <button
                    onClick={() => setConfirmTarget({ product: p, action: 'approve' })}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-success)]"
                    title="Approve"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmTarget({ product: p, action: 'reject' })}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-danger)]"
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          )
        },
      },
    ],
    [navigate]
  )

  return (
    <div>
      <PageHeader
        title="Content & Product Moderation"
        subtitle="Review pending product listings before they go live"
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by product name, seller..." />
        <FilterBar
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: ['Pending', 'Approved', 'Rejected'].map((v) => ({ label: v, value: v })),
            },
            {
              key: 'category',
              label: 'Category',
              options: categories.map((c) => ({ label: c, value: c })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirmAction}
        title={confirmTarget?.action === 'approve' ? 'Approve Product' : 'Reject Product'}
        message={
          confirmTarget?.action === 'approve'
            ? `This will approve "${confirmTarget?.product.name}" and publish it to the marketplace.`
            : `This will reject "${confirmTarget?.product.name}"'s listing. Please provide a reason.`
        }
        confirmLabel={confirmTarget?.action === 'approve' ? 'Approve' : 'Reject'}
        danger={confirmTarget?.action === 'reject'}
        requireReason={confirmTarget?.action === 'reject'}
      />
    </div>
  )
}
