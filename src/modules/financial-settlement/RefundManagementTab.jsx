import { useMemo, useState } from 'react'
import { Check, X, Eye } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
import { refunds as mockRefunds } from '../../mock-data/financial'
// TODO: replace mock data with real API call to /api/v1/financial/refunds

export default function RefundManagementTab() {
  const symbol = useCurrencySymbol()
  const { showToast } = useToast()
  const [refunds, setRefunds] = useState(mockRefunds)
  const [filters, setFilters] = useState({ status: 'Pending' })
  const [confirmTarget, setConfirmTarget] = useState(null) // { refund, action }
  const [viewing, setViewing] = useState(null)

  const filteredData = useMemo(
    () => refunds.filter((r) => !filters.status || r.status === filters.status),
    [refunds, filters]
  )

  const handleConfirmAction = (reason) => {
    const { refund, action } = confirmTarget
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === refund.id
          ? {
              ...r,
              status: action === 'approve' ? 'Approved' : 'Rejected',
              resolutionNote: reason || r.resolutionNote,
            }
          : r
      )
    )
    showToast(
      action === 'approve' ? `Refund for ${refund.orderId} has been approved.` : `Refund for ${refund.orderId} has been rejected.`,
      action === 'approve' ? 'success' : 'error'
    )
    setConfirmTarget(null)
  }

  const columns = useMemo(
    () => [
      { header: 'Refund ID', accessorKey: 'id' },
      { header: 'Order ID', accessorKey: 'orderId' },
      { header: 'Customer', accessorKey: 'customerName' },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (info) => `${symbol}${info.getValue().toLocaleString()}`,
      },
      { header: 'Requested Date', accessorKey: 'requestedDate' },
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
          const r = row.original
          return (
            <div className="flex items-center gap-1">
              <IconActionButton icon={Eye} label="View" variant="view" onClick={() => setViewing(r)} />
              {r.status === 'Pending' && (
                <>
                  <IconActionButton
                    icon={Check}
                    label="Approve"
                    variant="approve"
                    onClick={() => setConfirmTarget({ refund: r, action: 'approve' })}
                  />
                  <IconActionButton
                    icon={X}
                    label="Reject"
                    variant="reject"
                    onClick={() => setConfirmTarget({ refund: r, action: 'reject' })}
                  />
                </>
              )}
            </div>
          )
        },
      },
    ],
    [symbol]
  )

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <FilterBar
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: ['Pending', 'Approved', 'Rejected'].map((v) => ({ label: v, value: v })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
        <ExportCsvButton
          data={filteredData}
          filename="refunds"
          columns={[
            { label: 'Refund ID', accessor: 'id' },
            { label: 'Order ID', accessor: 'orderId' },
            { label: 'Customer', accessor: 'customerName' },
            { label: 'Amount', accessor: (row) => `${symbol}${row.amount.toLocaleString()}` },
            { label: 'Requested Date', accessor: 'requestedDate' },
            { label: 'Status', accessor: 'status' },
          ]}
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Refund ${viewing?.id ?? ''}`} size="sm">
        {viewing && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Order ID</span>
              <span className="text-[var(--color-text)] font-medium">{viewing.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Customer</span>
              <span className="text-[var(--color-text)] font-medium">{viewing.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Amount</span>
              <span className="text-[var(--color-text)] font-medium">{symbol}{viewing.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Requested Date</span>
              <span className="text-[var(--color-text)] font-medium">{viewing.requestedDate}</span>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)] block mb-1">Customer Reason</span>
              <span className="text-[var(--color-text)]">{viewing.reason}</span>
            </div>
            {viewing.resolutionNote && (
              <div className="p-3 rounded-md bg-[var(--color-bg)] text-xs text-[var(--color-text)]">
                <span className="font-semibold">Resolution note: </span>
                {viewing.resolutionNote}
              </div>
            )}
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirmAction}
        title={confirmTarget?.action === 'approve' ? 'Approve Refund' : 'Reject Refund'}
        message={
          confirmTarget?.action === 'approve'
            ? `This will approve the refund of ${symbol}${confirmTarget?.refund.amount.toLocaleString()} for ${confirmTarget?.refund.orderId}.`
            : `This will reject the refund request for ${confirmTarget?.refund.orderId}. Please provide a reason.`
        }
        confirmLabel={confirmTarget?.action === 'approve' ? 'Approve' : 'Reject'}
        danger={confirmTarget?.action === 'reject'}
        requireReason={confirmTarget?.action === 'reject'}
      />
    </div>
  )
}
