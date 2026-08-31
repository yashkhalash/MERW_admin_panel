import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Ban, CheckCircle2, Check, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
import { sellers as mockSellers } from '../../mock-data/sellers'
// TODO: replace mock data with real API call to /api/v1/sellers

export default function SellerListPage() {
  const navigate = useNavigate()
  const symbol = useCurrencySymbol()
  const { showToast } = useToast()
  const [sellers, setSellers] = useState(mockSellers)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ verificationStatus: '', category: '' })
  const [confirmTarget, setConfirmTarget] = useState(null) // { seller, action: 'approve'|'reject'|'suspend'|'reactivate' }

  const categories = useMemo(() => [...new Set(mockSellers.map((s) => s.category))], [])

  const filteredData = useMemo(() => {
    return sellers.filter((s) => {
      const matchesSearch =
        !search ||
        s.storeName.toLowerCase().includes(search.toLowerCase()) ||
        s.owner.toLowerCase().includes(search.toLowerCase())
      const matchesVerification = !filters.verificationStatus || s.verificationStatus === filters.verificationStatus
      const matchesCategory = !filters.category || s.category === filters.category
      return matchesSearch && matchesVerification && matchesCategory
    })
  }, [sellers, search, filters])

  const handleConfirmAction = (reason) => {
    const { seller, action } = confirmTarget
    setSellers((prev) =>
      prev.map((s) => {
        if (s.id !== seller.id) return s
        if (action === 'approve') {
          return { ...s, verificationStatus: 'Verified', status: 'Active', rejectReason: null }
        }
        if (action === 'reject') {
          return { ...s, verificationStatus: 'Rejected', status: 'Inactive', rejectReason: reason }
        }
        if (action === 'suspend') {
          return { ...s, status: 'Suspended', suspendReason: reason }
        }
        if (action === 'reactivate') {
          return { ...s, status: 'Active', suspendReason: null }
        }
        return s
      })
    )
    const messages = {
      approve: [`${seller.storeName} has been approved and verified.`, 'success'],
      reject: [`${seller.storeName}'s application has been rejected.`, 'error'],
      suspend: [`${seller.storeName} has been suspended.`, 'error'],
      reactivate: [`${seller.storeName} has been reactivated.`, 'success'],
    }
    const [msg, type] = messages[action] || []
    if (msg) showToast(msg, type)
    setConfirmTarget(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Store Name', accessorKey: 'storeName' },
      { header: 'Owner', accessorKey: 'owner' },
      { header: 'Category', accessorKey: 'category' },
      {
        header: 'Verification Status',
        accessorKey: 'verificationStatus',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      { header: 'Registered Date', accessorKey: 'registeredDate' },
      { header: 'Products', accessorKey: 'products' },
      {
        header: 'Sales',
        accessorKey: 'sales',
        cell: (info) => `${symbol}${info.getValue().toLocaleString()}`,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
          const s = row.original
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/sellers/${s.id}`)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-secondary)]"
                title="View"
              >
                <Eye size={16} />
              </button>
              {s.verificationStatus === 'Pending' && (
                <>
                  <button
                    onClick={() => setConfirmTarget({ seller: s, action: 'approve' })}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-success)]"
                    title="Approve"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmTarget({ seller: s, action: 'reject' })}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-danger)]"
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                </>
              )}
              {s.verificationStatus === 'Verified' &&
                (s.status === 'Active' ? (
                  <button
                    onClick={() => setConfirmTarget({ seller: s, action: 'suspend' })}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-danger)]"
                    title="Suspend"
                  >
                    <Ban size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmTarget({ seller: s, action: 'reactivate' })}
                    className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-success)]"
                    title="Reactivate"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                ))}
            </div>
          )
        },
      },
    ],
    [navigate, symbol]
  )

  const dialogCopy = {
    approve: {
      title: 'Approve Seller',
      message: `This will verify ${confirmTarget?.seller.storeName} and activate their storefront.`,
      confirmLabel: 'Approve',
      danger: false,
      requireReason: false,
    },
    reject: {
      title: 'Reject Seller',
      message: `This will reject ${confirmTarget?.seller.storeName}'s application. Please provide a reason.`,
      confirmLabel: 'Reject',
      danger: true,
      requireReason: true,
    },
    suspend: {
      title: 'Suspend Seller',
      message: `This will suspend ${confirmTarget?.seller.storeName}'s storefront. Please provide a reason.`,
      confirmLabel: 'Suspend',
      danger: true,
      requireReason: true,
    },
    reactivate: {
      title: 'Reactivate Seller',
      message: `This will reactivate ${confirmTarget?.seller.storeName}'s storefront.`,
      confirmLabel: 'Reactivate',
      danger: false,
      requireReason: false,
    },
  }[confirmTarget?.action]

  return (
    <div>
      <PageHeader
        title="Seller Management"
        subtitle="Review, verify, and manage marketplace sellers"
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by store name, owner..." />
        <FilterBar
          filters={[
            {
              key: 'verificationStatus',
              label: 'Verification',
              options: ['Verified', 'Pending', 'Rejected'].map((v) => ({ label: v, value: v })),
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
        {...(dialogCopy || {})}
      />
    </div>
  )
}
