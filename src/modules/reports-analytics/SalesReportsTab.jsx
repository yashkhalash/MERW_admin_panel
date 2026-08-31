import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import DataTable from '../../components/common/DataTable'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { salesTrend, salesByCategory } from '../../mock-data/reports'
// TODO: replace mock data with real API call to /api/v1/reports/sales

export default function SalesReportsTab() {
  const symbol = useCurrencySymbol()
  const currency = (v) => `${symbol}${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`
  const columns = [
    { header: 'Category', accessorKey: 'category' },
    { header: 'Orders', accessorKey: 'orders' },
    { header: 'Sales', accessorKey: 'sales', cell: (info) => `${symbol}${info.getValue().toLocaleString()}` },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Sales Trend</h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Last 7 months</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <YAxis tickFormatter={currency} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <Tooltip formatter={(v) => `${symbol}${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="sales" stroke="var(--color-primary)" strokeWidth={2} fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Sales by Category</h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Current period</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tickFormatter={currency} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <Tooltip formatter={(v) => `${symbol}${v.toLocaleString()}`} />
              <Bar dataKey="sales" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable columns={columns} data={salesByCategory} pageSize={10} />
    </div>
  )
}
