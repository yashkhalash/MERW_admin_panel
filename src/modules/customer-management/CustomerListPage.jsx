import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Ban, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../components/common/ToastContext'
import { customers as mockCustomers } from '../../mock-data/customers'
// TODO: replace mock data with real API call to /api/v1/customers

export default function CustomerListPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [customers, setCustomers] = useState(mockCustomers)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: '' })
  const [confirmTarget, setConfirmTarget] = useState(null) // { customer, action: 'suspend' | 'reactivate' }

  const filteredData = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search)
      const matchesStatus = !filters.status || c.status === filters.status
      return matchesSearch && matchesStatus
    })
  }, [customers, search, filters])

  const handleConfirmAction = (reason) => {
    const { customer, action } = confirmTarget
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customer.id
          ? {
              ...c,
              status: action === 'suspend' ? 'Suspended' : 'Active',
              suspendReason: action === 'suspend' ? reason : null,
            }
          : c
      )
    )
    showToast(
      action === 'suspend' ? `${customer.name}'s account has been suspended.` : `${customer.name}'s account has been reactivated.`,
      action === 'suspend' ? 'error' : 'success'
    )
    setConfirmTarget(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Mobile', accessorKey: 'mobile', enableSorting: false },
      { header: 'Email', accessorKey: 'email', enableSorting: false },
      { header: 'Registered Date', accessorKey: 'registeredDate' },
      { header: 'Total Orders', accessorKey: 'totalOrders' },
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
          const c = row.original
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/customers/${c.id}`)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-secondary)]"
                title="View"
              >
                <Eye size={16} />
              </button>
              {c.status === 'Active' ? (
                <button
                  onClick={() => setConfirmTarget({ customer: c, action: 'suspend' })}
                  className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-danger)]"
                  title="Suspend"
                >
                  <Ban size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setConfirmTarget({ customer: c, action: 'reactivate' })}
                  className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-success)]"
                  title="Reactivate"
                >
                  <CheckCircle2 size={16} />
                </button>
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
        title="Customer Management"
        subtitle="View and manage registered marketplace customers"
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, mobile..." />
        <FilterBar
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Active', value: 'Active' },
                { label: 'Suspended', value: 'Suspended' },
              ],
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
        title={confirmTarget?.action === 'suspend' ? 'Suspend Customer' : 'Reactivate Customer'}
        message={
          confirmTarget?.action === 'suspend'
            ? `This will suspend ${confirmTarget?.customer.name}'s account and block further orders. Please provide a reason.`
            : `This will reactivate ${confirmTarget?.customer.name}'s account, allowing them to place orders again.`
        }
        confirmLabel={confirmTarget?.action === 'suspend' ? 'Suspend' : 'Reactivate'}
        danger={confirmTarget?.action === 'suspend'}
        requireReason={confirmTarget?.action === 'suspend'}
      />
    </div>
  )
}
