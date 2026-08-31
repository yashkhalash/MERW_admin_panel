import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Truck } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import DataTable from '../../components/common/DataTable'
import StatusBadge from '../../components/common/StatusBadge'
import ReassignCourierModal from './ReassignCourierModal'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import DateRangePicker from '../../components/common/DateRangePicker'
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
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
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
      const matchesStart = !dateRange.start || o.orderDate >= dateRange.start
      const matchesEnd = !dateRange.end || o.orderDate <= dateRange.end
      return matchesSearch && matchesPayment && matchesFulfilment && matchesStart && matchesEnd
    })
  }, [orders, search, filters, dateRange])

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
      { header: 'Date', accessorKey: 'orderDate' },
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
              <IconActionButton icon={Eye} label="View" variant="view" onClick={() => navigate(`/orders/${o.id}`)} />
              {canReassign && (
                <IconActionButton
                  icon={Truck}
                  label="Reassign Courier"
                  variant="reassign"
                  onClick={() => setReassignTarget(o)}
                />
              )}
            </div>
          )
        },
      },
    ],
    [navigate, symbol]
  )

  const activeFilters = [
    search && `Search: "${search}"`,
    filters.paymentStatus && `Payment: ${filters.paymentStatus}`,
    filters.fulfilmentStatus && `Fulfilment: ${filters.fulfilmentStatus}`,
    dateRange.start && `From: ${dateRange.start}`,
    dateRange.end && `To: ${dateRange.end}`,
  ].filter(Boolean)

  return (
    <div>
      <PageHeader
        title="Order Management"
        subtitle="Track and manage all marketplace orders"
        actions={
          <ExportCsvButton
            data={filteredData}
            filename="orders"
            title="Order Management"
            filters={activeFilters}
            columns={[
              { label: 'Order ID', accessor: 'id' },
              { label: 'Date', accessor: 'orderDate' },
              { label: 'Customer', accessor: 'customerName' },
              { label: 'Seller', accessor: 'sellerName' },
              { label: 'Courier', accessor: 'courierName' },
              { label: 'Amount', accessor: (row) => `${symbol}${row.amount.toLocaleString()}` },
              { label: 'Payment Status', accessor: 'paymentStatus' },
              { label: 'Fulfilment Status', accessor: 'fulfilmentStatus' },
            ]}
          />
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 flex-wrap">
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
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={setDateRange}
          placeholder="Order date range"
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
