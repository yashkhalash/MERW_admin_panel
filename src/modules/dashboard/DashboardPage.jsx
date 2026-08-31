import {
  ShoppingCart,
  DollarSign,
  Store,
  ClipboardCheck,
  Truck,
  MessageCircle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import KpiCard from './KpiCard'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import {
  kpiData,
  revenueTrend,
  orderStatusBreakdown,
  topSellingCategories,
  recentActivity,
} from '../../mock-data/dashboard'
// TODO: replace mock data with real API call to /api/v1/dashboard

const PIE_COLORS = ['#34A853', '#3D85C6', '#FBBC04', '#EA4335']

export default function DashboardPage() {
  const symbol = useCurrencySymbol()
  const currency = (v) => `${symbol}${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of marketplace performance and operational status"
      />

      {/* KPI widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard label="Total Orders" icon={ShoppingCart} {...kpiData.totalOrders} />
        <KpiCard
          label="Gross Revenue"
          icon={DollarSign}
          {...kpiData.grossRevenue}
          format={(v) => `${symbol}${v.toLocaleString()}`}
        />
        <KpiCard label="Active Sellers" icon={Store} {...kpiData.activeSellers} />
        <KpiCard label="Pending Approvals" icon={ClipboardCheck} {...kpiData.pendingApprovals} />
        <KpiCard label="Active Couriers" icon={Truck} {...kpiData.activeCouriers} />
        <KpiCard label="Open Enquiries" icon={MessageCircle} {...kpiData.openEnquiries} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
            Revenue Trend
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Last 7 months</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <YAxis tickFormatter={currency} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <Tooltip formatter={(v) => `${symbol}${v.toLocaleString()}`} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#revGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
            Order Status Breakdown
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Current month</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={orderStatusBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {orderStatusBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
            Top Selling Categories
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">By gross sales</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topSellingCategories} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tickFormatter={currency} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 12 }}
                stroke="var(--color-text-muted)"
                width={100}
              />
              <Tooltip formatter={(v) => `${symbol}${v.toLocaleString()}`} />
              <Bar dataKey="sales" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">
            Recent Activity
          </h3>
          <ul className="space-y-3">
            {recentActivity.map((item) => (
              <li key={item.id} className="text-sm">
                <p className="text-[var(--color-text)] leading-snug">{item.message}</p>
                <span className="text-xs text-[var(--color-text-muted)]">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
