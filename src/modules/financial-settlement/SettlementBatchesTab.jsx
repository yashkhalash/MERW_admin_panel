import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { settlementBatches } from '../../mock-data/financial'
// TODO: replace mock data with real API call to /api/v1/financial/settlement-batches

export default function SettlementBatchesTab() {
  const symbol = useCurrencySymbol()
  const [filters, setFilters] = useState({ status: '' })
  const [viewing, setViewing] = useState(null)

  const filteredData = useMemo(
    () => settlementBatches.filter((b) => !filters.status || b.status === filters.status),
    [filters]
  )

  const columns = useMemo(
    () => [
      { header: 'Batch ID', accessorKey: 'id' },
      { header: 'Batch Date', accessorKey: 'batchDate' },
      { header: 'Sellers', accessorKey: 'sellersCount' },
      {
        header: 'Total Amount',
        accessorKey: 'totalAmount',
        cell: (info) => `${symbol}${info.getValue().toLocaleString()}`,
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
        cell: ({ row }) => (
          <button
            onClick={() => setViewing(row.original)}
            className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-secondary)]"
            title="View"
          >
            <Eye size={16} />
          </button>
        ),
      },
    ],
    [symbol]
  )

  return (
    <div>
      <div className="mb-4">
        <FilterBar
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: ['Completed', 'Processing', 'Failed'].map((v) => ({ label: v, value: v })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Settlement Batch ${viewing?.id ?? ''}`} size="sm">
        {viewing && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Batch Date</span>
              <span className="text-[var(--color-text)] font-medium">{viewing.batchDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Sellers Included</span>
              <span className="text-[var(--color-text)] font-medium">{viewing.sellersCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Total Amount</span>
              <span className="text-[var(--color-text)] font-medium">{symbol}{viewing.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-muted)]">Status</span>
              <StatusBadge status={viewing.status} />
            </div>
            {viewing.failureReason && (
              <div className="pt-2 p-3 rounded-md bg-[var(--color-danger)]/10 text-xs text-[var(--color-danger)]">
                <span className="font-semibold">Failure reason: </span>
                {viewing.failureReason}
              </div>
            )}
          </dl>
        )}
      </Modal>
    </div>
  )
}
