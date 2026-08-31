import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Check, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import DateRangePicker from '../../components/common/DateRangePicker'
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
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
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
      const matchesStart = !dateRange.start || p.submittedDate >= dateRange.start
      const matchesEnd = !dateRange.end || p.submittedDate <= dateRange.end
      return matchesSearch && matchesStatus && matchesCategory && matchesStart && matchesEnd
    })
  }, [products, search, filters, dateRange])

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
              <IconActionButton icon={Eye} label="View" variant="view" onClick={() => navigate(`/moderation/${p.id}`)} />
              {p.status === 'Pending' && (
                <>
                  <IconActionButton
                    icon={Check}
                    label="Approve"
                    variant="approve"
                    onClick={() => setConfirmTarget({ product: p, action: 'approve' })}
                  />
                  <IconActionButton
                    icon={X}
                    label="Reject"
                    variant="reject"
                    onClick={() => setConfirmTarget({ product: p, action: 'reject' })}
                  />
                </>
              )}
            </div>
          )
        },
      },
    ],
    [navigate]
  )

  const activeFilters = [
    search && `Search: "${search}"`,
    filters.status && `Status: ${filters.status}`,
    filters.category && `Category: ${filters.category}`,
    dateRange.start && `From: ${dateRange.start}`,
    dateRange.end && `To: ${dateRange.end}`,
  ].filter(Boolean)

  return (
    <div>
      <PageHeader
        title="Content & Product Moderation"
        subtitle="Review pending product listings before they go live"
        actions={
          <ExportCsvButton
            data={filteredData}
            filename="moderation-queue"
            title="Content & Product Moderation"
            filters={activeFilters}
            columns={[
              { label: 'Product Name', accessor: 'name' },
              { label: 'Seller', accessor: 'sellerName' },
              { label: 'Category', accessor: 'category' },
              { label: 'Submitted Date', accessor: 'submittedDate' },
              { label: 'AI Quality Score', accessor: 'aiQualityScore' },
              { label: 'Status', accessor: 'status' },
            ]}
          />
        }
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
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={setDateRange}
          placeholder="Submitted date range"
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
