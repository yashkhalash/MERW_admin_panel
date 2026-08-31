import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DataTable from '../../components/common/DataTable'
import SearchBar from '../../components/common/SearchBar'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { productPerformance } from '../../mock-data/reports'
// TODO: replace mock data with real API call to /api/v1/reports/product-performance

export default function ProductPerformanceTab() {
  const symbol = useCurrencySymbol()
  const currency = (v) => `${symbol}${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`
  const [search, setSearch] = useState('')

  const topProducts = useMemo(() => [...productPerformance].sort((a, b) => b.revenue - a.revenue).slice(0, 8), [])

  const filteredData = useMemo(
    () =>
      productPerformance.filter(
        (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

  const columns = useMemo(
    () => [
      { header: 'Product Name', accessorKey: 'name' },
      { header: 'Category', accessorKey: 'category' },
      { header: 'Units Sold', accessorKey: 'unitsSold' },
      { header: 'Revenue', accessorKey: 'revenue', cell: (info) => `${symbol}${info.getValue().toLocaleString()}` },
      { header: 'Return Rate', accessorKey: 'returnRate', cell: (info) => `${info.getValue()}%` },
    ],
    [symbol]
  )

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Top Performing Products</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">By revenue, current period</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis type="number" tickFormatter={currency} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" width={160} />
            <Tooltip formatter={(v) => `${symbol}${v.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by product name..." />
        </div>
        <DataTable columns={columns} data={filteredData} pageSize={10} />
      </div>
    </div>
  )
}
