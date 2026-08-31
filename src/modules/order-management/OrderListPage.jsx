import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Truck } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ReassignCourierModal from './ReassignCourierModal'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
import { orders as mockOrders } from '../../mock-data/orders'
// TODO: replace mock data with real API call to /api/v1/orders

export default function OrderListPage() {
  const navigate = useNavigate()
  const symbol = useCurrencySymbol()
  const { showToast } = useToast()
  const [orders, setOrders] = useState(mockOrders)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ paymentStatus: '', fulfilmentStatus: '' })
  const [reassignTarget, setReassignTarget] = useState(null)

  const filteredData = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.sellerName.toLowerCase().includes(search.toLowerCase())
      const matchesPayment = !filters.paymentStatus || o.paymentStatus === filters.paymentStatus
      const matchesFulfilment = !filters.fulfilmentStatus || o.fulfilmentStatus === filters.fulfilmentStatus
      return matchesSearch && matchesPayment && matchesFulfilment
    })
  }, [orders, search, filters])

  const handleReassign = (courier, reason) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === reassignTarget.id
          ? {
              ...o,
              courierId: courier.id,
              courierName: courier.name,
              reassignmentHistory: [
                ...o.reassignmentHistory,
                { from: o.courierName, to: courier.name, date: new Date().toISOString().slice(0, 10), reason },
              ],
            }
          : o
      )
    )
    showToast(`${reassignTarget.id} has been reassigned to ${courier.name}.`)
    setReassignTarget(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Order ID', accessorKey: 'id' },
      { header: 'Customer', accessorKey: 'customerName' },
      { header: 'Seller', accessorKey: 'sellerName' },
      { header: 'Courier', accessorKey: 'courierName' },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (info) => `${symbol}${info.getValue().toLocaleString()}`,
      },
      {
        header: 'Payment Status',
        accessorKey: 'paymentStatus',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        header: 'Fulfilment Status',
        accessorKey: 'fulfilmentStatus',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
          const o = row.original
          const canReassign = !['Delivered', 'Cancelled'].includes(o.fulfilmentStatus)
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/orders/${o.id}`)}
                className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-secondary)]"
                title="View"
              >
                <Eye size={16} />
              </button>
              {canReassign && (
                <button
                  onClick={() => setReassignTarget(o)}
                  className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary-dark)]"
                  title="Reassign Courier"
                >
                  <Truck size={16} />
                </button>
              )}
            </div>
          )
        },
      },
    ],
    [navigate, symbol]
  )

  return (
    <div>
      <PageHeader title="Order Management" subtitle="Track and manage all marketplace orders" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by order ID, customer, seller..." />
        <FilterBar
          filters={[
            {
              key: 'paymentStatus',
              label: 'Payment',
              options: ['Paid', 'Pending', 'Refunded'].map((v) => ({ label: v, value: v })),
            },
            {
              key: 'fulfilmentStatus',
              label: 'Fulfilment',
              options: ['Delivered', 'In Transit', 'Processing', 'Cancelled'].map((v) => ({ label: v, value: v })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />

      <ReassignCourierModal
        open={!!reassignTarget}
        onClose={() => setReassignTarget(null)}
        onSave={handleReassign}
        order={reassignTarget}
      />
    </div>
  )
}
