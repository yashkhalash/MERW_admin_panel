import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, Ban, CheckCircle2, Check, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import DateRangePicker from '../../components/common/DateRangePicker'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
import { sellers as mockSellers } from '../../mock-data/sellers'
// TODO: replace mock data with real API call to /api/v1/sellers

export default function SellerListPage() {
  const navigate = useNavigate()
  const symbol = useCurrencySymbol()
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const [sellers, setSellers] = useState(mockSellers)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    verificationStatus: searchParams.get('verificationStatus') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
  })
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
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
      const matchesStatus = !filters.status || s.status === filters.status
      const matchesStart = !dateRange.start || s.registeredDate >= dateRange.start
      const matchesEnd = !dateRange.end || s.registeredDate <= dateRange.end
      return matchesSearch && matchesVerification && matchesCategory && matchesStatus && matchesStart && matchesEnd
    })
  }, [sellers, search, filters, dateRange])

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
              <IconActionButton icon={Eye} label="View" variant="view" onClick={() => navigate(`/sellers/${s.id}`)} />
              {s.verificationStatus === 'Pending' && (
                <>
                  <IconActionButton
                    icon={Check}
                    label="Approve"
                    variant="approve"
                    onClick={() => setConfirmTarget({ seller: s, action: 'approve' })}
                  />
                  <IconActionButton
                    icon={X}
                    label="Reject"
                    variant="reject"
                    onClick={() => setConfirmTarget({ seller: s, action: 'reject' })}
                  />
                </>
              )}
              {s.verificationStatus === 'Verified' &&
                (s.status === 'Active' ? (
                  <IconActionButton
                    icon={Ban}
                    label="Suspend"
                    variant="suspend"
                    onClick={() => setConfirmTarget({ seller: s, action: 'suspend' })}
                  />
                ) : (
                  <IconActionButton
                    icon={CheckCircle2}
                    label="Reactivate"
                    variant="reactivate"
                    onClick={() => setConfirmTarget({ seller: s, action: 'reactivate' })}
                  />
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

  const activeFilters = [
    search && `Search: "${search}"`,
    filters.verificationStatus && `Verification: ${filters.verificationStatus}`,
    filters.category && `Category: ${filters.category}`,
    dateRange.start && `From: ${dateRange.start}`,
    dateRange.end && `To: ${dateRange.end}`,
  ].filter(Boolean)

  return (
    <div>
      <PageHeader
        title="Seller Management"
        subtitle="Review, verify, and manage marketplace sellers"
        actions={
          <ExportCsvButton
            data={filteredData}
            filename="sellers"
            title="Seller Management"
            filters={activeFilters}
            columns={[
              { label: 'Store Name', accessor: 'storeName' },
              { label: 'Owner', accessor: 'owner' },
              { label: 'Category', accessor: 'category' },
              { label: 'Verification Status', accessor: 'verificationStatus' },
              { label: 'Registered Date', accessor: 'registeredDate' },
              { label: 'Products', accessor: 'products' },
              { label: 'Sales', accessor: (row) => `${symbol}${row.sales.toLocaleString()}` },
            ]}
          />
        }
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
            {
              key: 'status',
              label: 'Status',
              options: ['Active', 'Suspended', 'Inactive'].map((v) => ({ label: v, value: v })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={setDateRange}
          placeholder="Registered date range"
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
