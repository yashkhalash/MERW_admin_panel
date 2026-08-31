// TODO: replace mock data with real API call to /api/v1/dashboard

export const kpiData = {
  totalOrders: { value: 18420, delta: 8.2, trend: 'up' },
  grossRevenue: { value: 4285600, delta: 12.5, trend: 'up' },
  activeSellers: { value: 612, delta: 3.1, trend: 'up' },
  pendingApprovals: { value: 27, delta: -4.4, trend: 'down' },
  activeCouriers: { value: 184, delta: 1.8, trend: 'up' },
  openEnquiries: { value: 39, delta: 6.7, trend: 'up' },
}

export const revenueTrend = [
  { month: 'Feb', year: 2026, revenue: 298000, orders: 1120 },
  { month: 'Mar', year: 2026, revenue: 341000, orders: 1290 },
  { month: 'Apr', year: 2026, revenue: 312000, orders: 1205 },
  { month: 'May', year: 2026, revenue: 365000, orders: 1380 },
  { month: 'Jun', year: 2026, revenue: 402000, orders: 1510 },
  { month: 'Jul', year: 2026, revenue: 388000, orders: 1470 },
  { month: 'Aug', year: 2026, revenue: 452000, orders: 1640 },
]

// Per-month breakdown backing the Month/Year filter — lets the KPI cards, order status
// pie, and top-categories bar chart actually change when a specific month is picked,
// instead of the filter only affecting the revenue trend line. Aug (the latest month)
// intentionally matches `kpiData` above, since that's the current overall snapshot.
export const monthlyBreakdown = [
  { month: 'Feb', year: 2026, totalOrders: 1120, grossRevenue: 298000, activeSellers: 520, pendingApprovals: 18, activeCouriers: 150, openEnquiries: 22 },
  { month: 'Mar', year: 2026, totalOrders: 1290, grossRevenue: 341000, activeSellers: 540, pendingApprovals: 21, activeCouriers: 158, openEnquiries: 26 },
  { month: 'Apr', year: 2026, totalOrders: 1205, grossRevenue: 312000, activeSellers: 555, pendingApprovals: 19, activeCouriers: 163, openEnquiries: 24 },
  { month: 'May', year: 2026, totalOrders: 1380, grossRevenue: 365000, activeSellers: 570, pendingApprovals: 23, activeCouriers: 169, openEnquiries: 29 },
  { month: 'Jun', year: 2026, totalOrders: 1510, grossRevenue: 402000, activeSellers: 588, pendingApprovals: 25, activeCouriers: 174, openEnquiries: 33 },
  { month: 'Jul', year: 2026, totalOrders: 1470, grossRevenue: 388000, activeSellers: 598, pendingApprovals: 24, activeCouriers: 179, openEnquiries: 35 },
  { month: 'Aug', year: 2026, totalOrders: 1640, grossRevenue: 452000, activeSellers: 612, pendingApprovals: 27, activeCouriers: 184, openEnquiries: 39 },
]

export const orderStatusBreakdown = [
  { name: 'Delivered', value: 12480 },
  { name: 'In Transit', value: 3210 },
  { name: 'Processing', value: 1890 },
  { name: 'Cancelled', value: 840 },
]

export const topSellingCategories = [
  { category: 'Electronics', sales: 128400 },
  { category: 'Fashion', sales: 98200 },
  { category: 'Home & Living', sales: 76500 },
  { category: 'Grocery', sales: 61200 },
  { category: 'Beauty', sales: 45300 },
]

export const recentActivity = [
  { id: 1, type: 'seller_approval', message: 'New seller "Urban Threads" pending approval', time: '12 min ago' },
  { id: 2, type: 'order', message: 'Order #ORD-18420 flagged for manual courier reassignment', time: '34 min ago' },
  { id: 3, type: 'enquiry', message: 'New contact enquiry from a customer regarding refund', time: '1 hr ago' },
  { id: 4, type: 'moderation', message: 'Product "Wireless Earbuds Pro" submitted for moderation', time: '2 hr ago' },
  { id: 5, type: 'settlement', message: 'Settlement batch #STL-0932 processed successfully', time: '3 hr ago' },
]
