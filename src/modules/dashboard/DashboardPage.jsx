import { useMemo, useState } from 'react'
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
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import KpiCard from './KpiCard'
import Select from '../../components/common/Select'
import ExportCsvButton from '../../components/common/ExportCsvButton'
import ExportPdfButton from '../../components/common/ExportPdfButton'
import { useCurrencySymbol, usePlatformSettings } from '../../theme/PlatformSettingsContext'
import { exportDashboardCsv } from '../../utils/csv'
import { generateDashboardReportPdf } from '../../utils/pdfReport'
import {
  kpiData,
  revenueTrend,
  monthlyBreakdown,
  orderStatusBreakdown,
  topSellingCategories,
  recentActivity,
} from '../../mock-data/dashboard'
// TODO: replace mock data with real API call to /api/v1/dashboard

const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const PIE_COLORS = ['#34A853', '#3D85C6', '#FBBC04', '#EA4335']

// The overall order-status and top-category snapshots don't have a per-month
// breakdown in the mock data, so a single month's split is derived by applying the
// overall mix's proportions to that month's totals — keeps every filtered view
// internally consistent with the unfiltered "All Months" numbers.
const totalOrdersAllTime = orderStatusBreakdown.reduce((sum, s) => sum + s.value, 0)
const ORDER_STATUS_RATIOS = orderStatusBreakdown.map((s) => s.value / totalOrdersAllTime)
const totalCategorySales = topSellingCategories.reduce((sum, c) => sum + c.sales, 0)
const CATEGORY_RATIOS = topSellingCategories.map((c) => c.sales / totalCategorySales)
const CATEGORY_SHARE_OF_REVENUE = totalCategorySales / kpiData.grossRevenue.value

function pctDelta(current, previous) {
  if (!previous) return 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

// Maps a recent-activity item to the page (pre-filtered where possible) that explains it.
function getActivityLink(activity) {
  switch (activity.type) {
    case 'seller_approval':
      return '/sellers?verificationStatus=Pending'
    case 'order': {
      const orderId = activity.message.match(/ORD-\d+/)?.[0]
      return orderId ? `/orders/${orderId}` : '/orders'
    }
    case 'enquiry':
      return '/enquiries?status=New'
    case 'moderation':
      return '/moderation'
    case 'settlement':
      return '/financial?tab=settlements'
    default:
      return null
  }
}

export default function DashboardPage() {
  const symbol = useCurrencySymbol()
  const navigate = useNavigate()
  const { generalSettings } = usePlatformSettings()
  const currency = (v) => `${symbol}${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`

  const years = useMemo(() => [...new Set(revenueTrend.map((r) => r.year))].sort(), [])
  const [yearFilter, setYearFilter] = useState(String(years[years.length - 1]))
  const [monthFilter, setMonthFilter] = useState('')

  const monthsInYear = useMemo(
    () =>
      revenueTrend
        .filter((r) => String(r.year) === yearFilter)
        .map((r) => r.month)
        .sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)),
    [yearFilter]
  )

  const filteredTrend = useMemo(
    () =>
      revenueTrend.filter(
        (r) => String(r.year) === yearFilter && (!monthFilter || r.month === monthFilter)
      ),
    [yearFilter, monthFilter]
  )

  const periodLabel = monthFilter ? `${monthFilter} ${yearFilter}` : `Full year ${yearFilter}`

  // When a specific month is picked, swap the KPI cards / pie / bar chart for that
  // month's figures (derived from monthlyBreakdown); "All Months" keeps the original
  // overall snapshot exactly as before.
  const monthlyIndex = monthFilter
    ? monthlyBreakdown.findIndex((m) => String(m.year) === yearFilter && m.month === monthFilter)
    : -1
  const selectedMonth = monthlyIndex >= 0 ? monthlyBreakdown[monthlyIndex] : null
  const previousMonth = monthlyIndex > 0 ? monthlyBreakdown[monthlyIndex - 1] : null

  const monthlyKpiField = (field) => {
    const delta = pctDelta(selectedMonth[field], previousMonth?.[field])
    return { value: selectedMonth[field], delta, trend: delta >= 0 ? 'up' : 'down' }
  }
  const displayKpiData = selectedMonth
    ? {
        totalOrders: monthlyKpiField('totalOrders'),
        grossRevenue: monthlyKpiField('grossRevenue'),
        activeSellers: monthlyKpiField('activeSellers'),
        pendingApprovals: monthlyKpiField('pendingApprovals'),
        activeCouriers: monthlyKpiField('activeCouriers'),
        openEnquiries: monthlyKpiField('openEnquiries'),
      }
    : kpiData

  const displayOrderStatus = selectedMonth
    ? orderStatusBreakdown.map((s, i) => ({ ...s, value: Math.round(selectedMonth.totalOrders * ORDER_STATUS_RATIOS[i]) }))
    : orderStatusBreakdown

  const displayTopCategories = selectedMonth
    ? topSellingCategories.map((c, i) => ({
        ...c,
        sales: Math.round(selectedMonth.grossRevenue * CATEGORY_SHARE_OF_REVENUE * CATEGORY_RATIOS[i]),
      }))
    : topSellingCategories

  const kpiRows = [
    ['Total Orders', displayKpiData.totalOrders.value, `${displayKpiData.totalOrders.delta}%`],
    ['Gross Revenue', `${symbol}${displayKpiData.grossRevenue.value.toLocaleString()}`, `${displayKpiData.grossRevenue.delta}%`],
    ['Active Sellers', displayKpiData.activeSellers.value, `${displayKpiData.activeSellers.delta}%`],
    ['Pending Approvals', displayKpiData.pendingApprovals.value, `${displayKpiData.pendingApprovals.delta}%`],
    ['Active Couriers', displayKpiData.activeCouriers.value, `${displayKpiData.activeCouriers.delta}%`],
    ['Open Enquiries', displayKpiData.openEnquiries.value, `${displayKpiData.openEnquiries.delta}%`],
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of marketplace performance and operational status"
        actions={
          <>
            <Select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value)
                setMonthFilter('')
              }}
              options={years.map((y) => ({ value: String(y), label: String(y) }))}
              className="text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 min-w-[6.5rem]"
            />
            <Select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              placeholder="All Months"
              options={[{ value: '', label: 'All Months' }, ...monthsInYear.map((m) => ({ value: m, label: m }))]}
              className="text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 min-w-[8rem]"
            />
            <ExportCsvButton
              onGenerate={() =>
                exportDashboardCsv({
                  filename: 'dashboard-overview',
                  kpiRows,
                  revenueTrend: filteredTrend,
                  orderStatusBreakdown: displayOrderStatus,
                  topSellingCategories: displayTopCategories,
                })
              }
            />
            <ExportPdfButton
              onGenerate={() =>
                generateDashboardReportPdf({
                  platformName: generalSettings.platformName,
                  currencySymbol: symbol,
                  kpiData: displayKpiData,
                  revenueTrend: filteredTrend,
                  orderStatusBreakdown: displayOrderStatus,
                  topSellingCategories: displayTopCategories,
                  periodLabel,
                })
              }
            />
          </>
        }
      />

      {/* KPI widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard label="Total Orders" icon={ShoppingCart} to="/orders" {...displayKpiData.totalOrders} />
        <KpiCard
          label="Gross Revenue"
          icon={DollarSign}
          to="/financial?tab=reports"
          {...displayKpiData.grossRevenue}
          format={(v) => `${symbol}${v.toLocaleString()}`}
        />
        <KpiCard label="Active Sellers" icon={Store} to="/sellers?status=Active" {...displayKpiData.activeSellers} />
        <KpiCard
          label="Pending Approvals"
          icon={ClipboardCheck}
          to="/sellers?verificationStatus=Pending"
          {...displayKpiData.pendingApprovals}
        />
        <KpiCard label="Active Couriers" icon={Truck} to="/couriers?status=Active" {...displayKpiData.activeCouriers} />
        <KpiCard label="Open Enquiries" icon={MessageCircle} to="/enquiries?status=New" {...displayKpiData.openEnquiries} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
            Revenue Trend
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">{periodLabel}</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={filteredTrend}>
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
          <p className="text-xs text-[var(--color-text-muted)] mb-4">{periodLabel}</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={displayOrderStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {displayOrderStatus.map((_, i) => (
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
          <p className="text-xs text-[var(--color-text-muted)] mb-4">By gross sales — {periodLabel}</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={displayTopCategories} layout="vertical" margin={{ left: 20 }}>
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
              <Bar
                dataKey="sales"
                fill="var(--color-secondary)"
                radius={[0, 4, 4, 0]}
                cursor="pointer"
                onClick={(data) => navigate(`/sellers?category=${encodeURIComponent(data.category)}`)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">
            Recent Activity
          </h3>
          <ul className="space-y-1">
            {recentActivity.map((item) => {
              const to = getActivityLink(item)
              const content = (
                <>
                  <p className="text-[var(--color-text)] leading-snug">{item.message}</p>
                  <span className="text-xs text-[var(--color-text-muted)]">{item.time}</span>
                </>
              )
              return (
                <li key={item.id} className="text-sm">
                  {to ? (
                    <Link to={to} className="block -mx-2 px-2 py-1.5 rounded-md hover:bg-[var(--color-bg)]">
                      {content}
                    </Link>
                  ) : (
                    <div className="-mx-2 px-2 py-1.5">{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
