// Minimal client-side CSV export — no dependency needed for this data size.
// columns: [{ label, accessor }] where accessor is a key string or (row) => value
// meta (optional): { title, generatedBy, filters: string[] } — rendered as a
// branded header block above the column row (platform name, export date, and a
// plain-text summary of whatever search/filters were active when exporting —
// CSV has no styling, so "themed" here means "carries the platform's identity").
export function exportToCsv(filename, columns, data, meta) {
  const escape = (val) => {
    if (val === null || val === undefined) return ''
    const str = String(val)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }

  const getValue = (row, accessor) => (typeof accessor === 'function' ? accessor(row) : row[accessor])

  const lines = []

  if (meta) {
    if (meta.title) lines.push(escape(meta.title))
    lines.push(escape(`Exported by ${meta.generatedBy || 'Admin'} on ${new Date().toLocaleString()}`))
    lines.push(escape(`Records: ${data.length}`))
    if (meta.filters && meta.filters.length > 0) {
      lines.push(escape(`Filters applied: ${meta.filters.join(' | ')}`))
    } else {
      lines.push(escape('Filters applied: None'))
    }
    lines.push('')
  }

  lines.push(columns.map((c) => escape(c.label)).join(','))
  data.forEach((row) => lines.push(columns.map((c) => escape(getValue(row, c.accessor))).join(',')))

  downloadCsv(filename, lines.join('\n'))
}

function downloadCsv(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Dashboard export has several small, differently-shaped tables (KPIs, revenue trend,
// order status, top categories) rather than one flat row set, so it builds its own
// multi-section CSV instead of using exportToCsv's single-table shape.
export function exportDashboardCsv({ filename, kpiRows, revenueTrend, orderStatusBreakdown, topSellingCategories }) {
  const escape = (val) => {
    if (val === null || val === undefined) return ''
    const str = String(val)
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
  }
  const row = (cells) => cells.map(escape).join(',')
  const section = (title, header, rows) => [title, row(header), ...rows.map(row), '']

  const lines = [
    ...section('KPI Summary', ['Metric', 'Value', 'vs Last Month'], kpiRows),
    ...section(
      'Revenue Trend',
      ['Month', 'Revenue', 'Orders'],
      revenueTrend.map((r) => [r.year ? `${r.month} ${r.year}` : r.month, r.revenue, r.orders])
    ),
    ...section(
      'Order Status Breakdown',
      ['Status', 'Orders'],
      orderStatusBreakdown.map((r) => [r.name, r.value])
    ),
    ...section(
      'Top Selling Categories',
      ['Category', 'Sales'],
      topSellingCategories.map((r) => [r.category, r.sales])
    ),
  ]

  downloadCsv(filename, lines.join('\n'))
}
