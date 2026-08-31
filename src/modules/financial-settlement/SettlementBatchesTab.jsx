import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import FilterBar from '../../components/common/FilterBar'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import IconActionButton from '../../components/common/IconActionButton'
import ExportCsvButton from '../../components/common/ExportCsvButton'
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
          <IconActionButton icon={Eye} label="View" variant="view" onClick={() => setViewing(row.original)} />
        ),
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
              options: ['Completed', 'Processing', 'Failed'].map((v) => ({ label: v, value: v })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
        <ExportCsvButton
          data={filteredData}
          filename="settlement-batches"
          columns={[
            { label: 'Batch ID', accessor: 'id' },
            { label: 'Batch Date', accessor: 'batchDate' },
            { label: 'Sellers', accessor: 'sellersCount' },
            { label: 'Total Amount', accessor: (row) => `${symbol}${row.totalAmount.toLocaleString()}` },
            { label: 'Status', accessor: 'status' },
          ]}
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
