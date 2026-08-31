import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useCurrencySymbol, usePlatformSettings } from '../../theme/PlatformSettingsContext'
import ExportPdfButton from '../../components/common/ExportPdfButton'
import { generateFinancialReportPdf } from '../../utils/pdfReport'
import { financialSummary, commissionConfig } from '../../mock-data/financial'
// TODO: replace mock data with real API call to /api/v1/financial/reports

export default function FinancialReportsTab() {
  const symbol = useCurrencySymbol()
  const { generalSettings } = usePlatformSettings()
  const currency = (v) => `${symbol}${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`
  const latest = financialSummary[financialSummary.length - 1]
  const previous = financialSummary[financialSummary.length - 2]
  const cards = [
    { label: 'Gross Merchandise Value', value: latest.gmv, prev: previous.gmv },
    { label: 'Platform Commission', value: latest.commission, prev: previous.commission },
    { label: 'Seller Payouts', value: latest.payouts, prev: previous.payouts },
  ]

  return (
    <div>
      <div className="flex justify-end mb-4">
        <ExportPdfButton
          onGenerate={() =>
            generateFinancialReportPdf({
              platformName: generalSettings.platformName,
              currencySymbol: symbol,
              summary: financialSummary,
              commissionConfig,
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {cards.map((c) => {
          const delta = (((c.value - c.prev) / c.prev) * 100).toFixed(1)
          const isUp = delta >= 0
          return (
            <div
              key={c.label}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4"
            >
              <span className="text-xs font-medium text-[var(--color-text-muted)]">{c.label}</span>
              <div className="text-2xl font-semibold text-[var(--color-text)] mt-1">
                {symbol}{c.value.toLocaleString()}
              </div>
              <span
                className={`text-xs font-medium ${
                  isUp ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                }`}
              >
                {isUp ? '+' : ''}
                {delta}% vs last month
              </span>
            </div>
          )
        })}
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">GMV, Commission & Payouts</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">Last 7 months</p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={financialSummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
            <YAxis tickFormatter={currency} tick={{ fontSize: 12 }} stroke="var(--color-text-muted)" />
            <Tooltip formatter={(v) => `${symbol}${v.toLocaleString()}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="gmv" name="GMV" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey="payouts" name="Seller Payouts" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} barSize={28} />
            <Line
              type="monotone"
              dataKey="commission"
              name="Commission"
              stroke="var(--color-success)"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
