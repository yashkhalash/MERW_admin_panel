import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import { marketplaceGrowth, avgOrderValue } from '../../mock-data/reports'
// TODO: replace mock data with real API call to /api/v1/reports/marketplace-analytics

export default function MarketplaceAnalyticsTab() {
  const symbol = useCurrencySymbol()
  const latest = marketplaceGrowth[marketplaceGrowth.length - 1]

  // marketplaceGrowth and avgOrderValue share the same `month` axis, so combine them
  // into one row per month for a single, readable export.
  const combined = marketplaceGrowth.map((row) => ({
    ...row,
    aov: avgOrderValue.find((a) => a.month === row.month)?.aov ?? '',
  }))

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportCsvButton
          data={combined}
          filename="marketplace-analytics"
          columns={[
            { label: 'Month', accessor: 'month' },
            { label: 'Active Sellers', accessor: 'sellers' },
            { label: 'Registered Customers', accessor: 'customers' },
            { label: 'Monthly Orders', accessor: 'orders' },
            { label: 'Average Order Value', accessor: (row) => `${symbol}${row.aov}` },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <span className="text-xs font-medium text-[var(--color-text-muted)]">Active Sellers</span>
          <div className="text-2xl font-semibold text-[var(--color-text)] mt-1">{latest.sellers.toLocaleString()}</div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <span className="text-xs font-medium text-[var(--color-text-muted)]">Registered Customers</span>
          <div className="text-2xl font-semibold text-[var(--color-text)] mt-1">{latest.customers.toLocaleString()}</div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <span className="text-xs font-medium text-[var(--color-text-muted)]">Monthly Orders</span>
          <div className="text-2xl font-semibold text-[var(--color-text)] mt-1">{latest.orders.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Marketplace Growth</h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Sellers, customers &amp; orders over time</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={marketplaceGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="sellers" name="Sellers" stroke="var(--color-primary)" strokeWidth={2} />
              <Line type="monotone" dataKey="customers" name="Customers" stroke="var(--color-secondary)" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" name="Orders" stroke="var(--color-success)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Average Order Value</h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Last 7 months</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={avgOrderValue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <YAxis tickFormatter={(v) => `${symbol}${v}`} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <Tooltip formatter={(v) => `${symbol}${v}`} />
              <Line type="monotone" dataKey="aov" name="AOV" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
