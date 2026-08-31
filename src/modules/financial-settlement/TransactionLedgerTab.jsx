import { useMemo, useState } from 'react'
import DataTable from '../../components/common/DataTable'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import StatusBadge from '../../components/common/StatusBadge'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { transactionLedger } from '../../mock-data/financial'
// TODO: replace mock data with real API call to /api/v1/financial/ledger

export default function TransactionLedgerTab() {
  const symbol = useCurrencySymbol()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ type: '', direction: '' })

  const filteredData = useMemo(() => {
    return transactionLedger.filter((t) => {
      const matchesSearch =
        !search ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.reference.toLowerCase().includes(search.toLowerCase())
      const matchesType = !filters.type || t.type === filters.type
      const matchesDirection = !filters.direction || t.direction === filters.direction
      return matchesSearch && matchesType && matchesDirection
    })
  }, [search, filters])

  const columns = useMemo(
    () => [
      { header: 'Transaction ID', accessorKey: 'id' },
      { header: 'Date', accessorKey: 'date' },
      { header: 'Type', accessorKey: 'type' },
      { header: 'Reference', accessorKey: 'reference' },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (info) => `${symbol}${info.getValue().toLocaleString()}`,
      },
      {
        header: 'Direction',
        accessorKey: 'direction',
        cell: (info) => (
          <span
            className={
              info.getValue() === 'Credit'
                ? 'text-[var(--color-success)] font-medium'
                : 'text-[var(--color-danger)] font-medium'
            }
          >
            {info.getValue() === 'Credit' ? '+' : '-'} {info.getValue()}
          </span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
    ],
    [symbol]
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by transaction ID, reference..." />
        <FilterBar
          filters={[
            {
              key: 'type',
              label: 'Type',
              options: ['Order Payment', 'Commission Deduction', 'Seller Payout', 'Refund'].map((v) => ({
                label: v,
                value: v,
              })),
            },
            {
              key: 'direction',
              label: 'Direction',
              options: ['Credit', 'Debit'].map((v) => ({ label: v, value: v })),
            },
          ]}
          values={filters}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        />
        <ExportCsvButton
          data={filteredData}
          filename="transaction-ledger"
          columns={[
            { label: 'Transaction ID', accessor: 'id' },
            { label: 'Date', accessor: 'date' },
            { label: 'Type', accessor: 'type' },
            { label: 'Reference', accessor: 'reference' },
            { label: 'Amount', accessor: (row) => `${symbol}${row.amount.toLocaleString()}` },
            { label: 'Direction', accessor: 'direction' },
            { label: 'Status', accessor: 'status' },
          ]}
        />
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />
    </div>
  )
}
