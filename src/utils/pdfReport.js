import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// Reads the *currently applied* palette straight from the CSS custom properties on
// <html>, so the PDF always matches whatever theme (built-in or custom) is active —
// no need to duplicate palette values here.
export function getThemeColors() {
  const style = getComputedStyle(document.documentElement)
  const read = (name, fallback) => style.getPropertyValue(name).trim() || fallback
  return {
    primary: read('--color-primary', '#FF9900'),
    primaryDark: read('--color-primary-dark', '#CC7A00'),
    secondary: read('--color-secondary', '#3D85C6'),
    surface: read('--color-surface', '#FFFFFF'),
    border: read('--color-border', '#E0E0E0'),
    text: read('--color-text', '#1A1A1A'),
    textMuted: read('--color-text-muted', '#6B7280'),
    success: read('--color-success', '#34A853'),
    danger: read('--color-danger', '#EA4335'),
  }
}

export function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = parseInt(full, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

// jsPDF's built-in core fonts use WinAnsi encoding, which has no ₹ glyph (renders as a
// broken character). Every other supported currency symbol is fine — only ₹ needs a
// text fallback for PDF output specifically (the on-screen UI keeps using ₹ as-is).
export function pdfSafeCurrency(symbol) {
  return symbol === '₹' ? 'Rs. ' : symbol
}

/**
 * Generates a themed "Financial & Settlement Report" PDF summarizing GMV, commission,
 * seller payouts, the monthly trend, and current commission rates by category —
 * everything shown on the Financial Reports tab, laid out for printing/sharing.
 */
export function generateFinancialReportPdf({ platformName, currencySymbol, summary, commissionConfig }) {
  const symbol = pdfSafeCurrency(currencySymbol)
  const c = getThemeColors()
  const [primaryR, primaryG, primaryB] = hexToRgb(c.primary)
  const [textR, textG, textB] = hexToRgb(c.text)
  const [mutedR, mutedG, mutedB] = hexToRgb(c.textMuted)
  const [borderR, borderG, borderB] = hexToRgb(c.border)
  const [successR, successG, successB] = hexToRgb(c.success)

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  let y = 0

  // ---- Header band ----
  doc.setFillColor(primaryR, primaryG, primaryB)
  doc.rect(0, 0, pageWidth, 90, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(platformName || 'MERW Multi-Vendor Marketplace', margin, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('Financial & Settlement Report', margin, 60)
  doc.setFontSize(9)
  const generatedOn = new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  doc.text(`Generated on ${generatedOn}`, margin, 76)

  y = 120

  // ---- KPI summary cards ----
  const latest = summary[summary.length - 1]
  const previous = summary[summary.length - 2] || latest
  const cards = [
    { label: 'Gross Merchandise Value', value: latest.gmv, prev: previous.gmv },
    { label: 'Platform Commission', value: latest.commission, prev: previous.commission },
    { label: 'Seller Payouts', value: latest.payouts, prev: previous.payouts },
  ]
  const cardGap = 12
  const cardWidth = (pageWidth - margin * 2 - cardGap * (cards.length - 1)) / cards.length
  const cardHeight = 64

  cards.forEach((card, i) => {
    const x = margin + i * (cardWidth + cardGap)
    doc.setDrawColor(borderR, borderG, borderB)
    doc.setLineWidth(1)
    doc.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'S')
    // accent bar
    doc.setFillColor(primaryR, primaryG, primaryB)
    doc.roundedRect(x, y, 4, cardHeight, 2, 2, 'F')

    doc.setTextColor(mutedR, mutedG, mutedB)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.text(card.label, x + 14, y + 18, { maxWidth: cardWidth - 20 })

    doc.setTextColor(textR, textG, textB)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.text(`${symbol}${card.value.toLocaleString()}`, x + 14, y + 38)

    const delta = card.prev ? (((card.value - card.prev) / card.prev) * 100).toFixed(1) : '0.0'
    const isUp = Number(delta) >= 0
    const [dR, dG, dB] = isUp ? [successR, successG, successB] : hexToRgb(c.danger)
    doc.setTextColor(dR, dG, dB)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.text(`${isUp ? '+' : ''}${delta}% vs last month`, x + 14, y + 52)
  })

  y += cardHeight + 30

  // ---- Monthly trend table ----
  doc.setTextColor(textR, textG, textB)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Monthly Trend — GMV, Commission & Payouts', margin, y)
  y += 10

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Month', 'GMV', 'Commission', 'Seller Payouts']],
    body: summary.map((row) => [
      row.month,
      `${symbol}${row.gmv.toLocaleString()}`,
      `${symbol}${row.commission.toLocaleString()}`,
      `${symbol}${row.payouts.toLocaleString()}`,
    ]),
    styles: { fontSize: 9, textColor: [textR, textG, textB], lineColor: [borderR, borderG, borderB] },
    headStyles: { fillColor: [primaryR, primaryG, primaryB], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  })

  y = doc.lastAutoTable.finalY + 30

  // ---- Commission config table ----
  if (commissionConfig?.length) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(textR, textG, textB)
    doc.text('Commission Rates by Category', margin, y)
    y += 10

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Category', 'Commission Rate', 'Last Updated']],
      body: commissionConfig.map((row) => [row.category, `${row.rate}%`, row.updatedDate]),
      styles: { fontSize: 9, textColor: [textR, textG, textB], lineColor: [borderR, borderG, borderB] },
      headStyles: { fillColor: [primaryR, primaryG, primaryB], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    })
  }

  // ---- Footer with page numbers ----
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.setDrawColor(borderR, borderG, borderB)
    doc.line(margin, pageHeight - 36, pageWidth - margin, pageHeight - 36)
    doc.setFontSize(8)
    doc.setTextColor(mutedR, mutedG, mutedB)
    doc.setFont('helvetica', 'normal')
    doc.text('Confidential — for internal use only', margin, pageHeight - 22)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 22, { align: 'right' })
  }

  doc.save(`financial-report-${new Date().toISOString().slice(0, 10)}.pdf`)
}

function drawFooter(doc, { margin, borderColor, mutedColor }) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.setDrawColor(...borderColor)
    doc.line(margin, pageHeight - 36, pageWidth - margin, pageHeight - 36)
    doc.setFontSize(8)
    doc.setTextColor(...mutedColor)
    doc.setFont('helvetica', 'normal')
    doc.text('Confidential — for internal use only', margin, pageHeight - 22)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 22, { align: 'right' })
  }
}

/**
 * Generates a themed "Dashboard Overview" PDF: the KPI summary row, the (optionally
 * month/year-filtered) revenue trend, order status breakdown, and top selling categories
 * — the same data shown on the Dashboard page, laid out for printing/sharing.
 */
export function generateDashboardReportPdf({
  platformName,
  currencySymbol,
  kpiData,
  revenueTrend,
  orderStatusBreakdown,
  topSellingCategories,
  periodLabel,
}) {
  const symbol = pdfSafeCurrency(currencySymbol)
  const c = getThemeColors()
  const primary = hexToRgb(c.primary)
  const text = hexToRgb(c.text)
  const muted = hexToRgb(c.textMuted)
  const border = hexToRgb(c.border)
  const success = hexToRgb(c.success)
  const danger = hexToRgb(c.danger)

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  let y = 0

  // ---- Header band ----
  doc.setFillColor(...primary)
  doc.rect(0, 0, pageWidth, 90, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(platformName || 'MERW Multi-Vendor Marketplace', margin, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('Dashboard Overview Report', margin, 60)
  doc.setFontSize(9)
  const generatedOn = new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  doc.text(`Generated on ${generatedOn}${periodLabel ? ` — ${periodLabel}` : ''}`, margin, 76)

  y = 120

  // ---- KPI cards (2 rows x 3) ----
  const kpiCards = [
    { label: 'Total Orders', value: kpiData.totalOrders.value.toLocaleString(), delta: kpiData.totalOrders.delta },
    { label: 'Gross Revenue', value: `${symbol}${kpiData.grossRevenue.value.toLocaleString()}`, delta: kpiData.grossRevenue.delta },
    { label: 'Active Sellers', value: kpiData.activeSellers.value.toLocaleString(), delta: kpiData.activeSellers.delta },
    { label: 'Pending Approvals', value: kpiData.pendingApprovals.value.toLocaleString(), delta: kpiData.pendingApprovals.delta },
    { label: 'Active Couriers', value: kpiData.activeCouriers.value.toLocaleString(), delta: kpiData.activeCouriers.delta },
    { label: 'Open Enquiries', value: kpiData.openEnquiries.value.toLocaleString(), delta: kpiData.openEnquiries.delta },
  ]
  const cols = 3
  const gap = 12
  const cardWidth = (pageWidth - margin * 2 - gap * (cols - 1)) / cols
  const cardHeight = 58

  kpiCards.forEach((card, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = margin + col * (cardWidth + gap)
    const cardY = y + row * (cardHeight + gap)

    doc.setDrawColor(...border)
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 4, 4, 'S')
    doc.setFillColor(...primary)
    doc.roundedRect(x, cardY, 4, cardHeight, 2, 2, 'F')

    doc.setTextColor(...muted)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(card.label, x + 12, cardY + 16, { maxWidth: cardWidth - 18 })

    doc.setTextColor(...text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(String(card.value), x + 12, cardY + 34)

    const isUp = card.delta >= 0
    doc.setTextColor(...(isUp ? success : danger))
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`${isUp ? '+' : ''}${card.delta}% vs last month`, x + 12, cardY + 48)
  })

  y += 2 * (cardHeight + gap) + 20

  // ---- Revenue trend table ----
  doc.setTextColor(...text)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Revenue Trend', margin, y)
  y += 10

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Month', 'Revenue', 'Orders']],
    body: revenueTrend.map((row) => [
      row.year ? `${row.month} ${row.year}` : row.month,
      `${symbol}${row.revenue.toLocaleString()}`,
      row.orders.toLocaleString(),
    ]),
    styles: { fontSize: 9, textColor: text, lineColor: border },
    headStyles: { fillColor: primary, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  })

  y = doc.lastAutoTable.finalY + 26

  // ---- Order status breakdown + Top selling categories, side by side ----
  const halfWidth = (pageWidth - margin * 2 - 20) / 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Order Status Breakdown', margin, y)
  autoTable(doc, {
    startY: y + 10,
    margin: { left: margin, right: margin + halfWidth + 20 },
    tableWidth: halfWidth,
    head: [['Status', 'Orders']],
    body: orderStatusBreakdown.map((row) => [row.name, row.value.toLocaleString()]),
    styles: { fontSize: 9, textColor: text, lineColor: border },
    headStyles: { fillColor: primary, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  })
  const leftFinalY = doc.lastAutoTable.finalY

  doc.text('Top Selling Categories', margin + halfWidth + 20, y)
  autoTable(doc, {
    startY: y + 10,
    margin: { left: margin + halfWidth + 20, right: margin },
    tableWidth: halfWidth,
    head: [['Category', 'Sales']],
    body: topSellingCategories.map((row) => [row.category, `${symbol}${row.sales.toLocaleString()}`]),
    styles: { fontSize: 9, textColor: text, lineColor: border },
    headStyles: { fillColor: primary, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 248, 248] },
  })
  const rightFinalY = doc.lastAutoTable.finalY

  y = Math.max(leftFinalY, rightFinalY)

  drawFooter(doc, { margin, borderColor: border, mutedColor: muted })

  doc.save(`dashboard-report-${new Date().toISOString().slice(0, 10)}.pdf`)
}
