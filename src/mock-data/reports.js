// TODO: replace mock data with real API call to /api/v1/reports/*

export const salesByCategory = [
  { category: 'Electronics', sales: 1284000, orders: 4210 },
  { category: 'Fashion', sales: 982000, orders: 5320 },
  { category: 'Grocery', sales: 765000, orders: 8140 },
  { category: 'Home & Living', sales: 612000, orders: 2410 },
  { category: 'Beauty', sales: 453000, orders: 3105 },
  { category: 'Toys & Kids', sales: 298000, orders: 1620 },
  { category: 'Books', sales: 187000, orders: 2890 },
  { category: 'Sports & Fitness', sales: 341000, orders: 1780 },
]

export const salesTrend = [
  { month: 'Feb', sales: 2980000 },
  { month: 'Mar', sales: 3410000 },
  { month: 'Apr', sales: 3120000 },
  { month: 'May', sales: 3650000 },
  { month: 'Jun', sales: 4020000 },
  { month: 'Jul', sales: 3880000 },
  { month: 'Aug', sales: 4520000 },
]

export const marketplaceGrowth = [
  { month: 'Feb', sellers: 480, customers: 12400, orders: 15200 },
  { month: 'Mar', sellers: 512, customers: 13850, orders: 16900 },
  { month: 'Apr', sellers: 528, customers: 14920, orders: 15600 },
  { month: 'May', sellers: 549, customers: 16340, orders: 17800 },
  { month: 'Jun', sellers: 578, customers: 17920, orders: 19400 },
  { month: 'Jul', sellers: 595, customers: 19010, orders: 18700 },
  { month: 'Aug', sellers: 612, customers: 20480, orders: 21100 },
]

export const avgOrderValue = [
  { month: 'Feb', aov: 196 },
  { month: 'Mar', aov: 202 },
  { month: 'Apr', aov: 200 },
  { month: 'May', aov: 205 },
  { month: 'Jun', aov: 207 },
  { month: 'Jul', aov: 208 },
  { month: 'Aug', aov: 214 },
]

export const userActivityTrend = [
  { day: 'Mon', dau: 3820, sessions: 5210 },
  { day: 'Tue', dau: 4010, sessions: 5480 },
  { day: 'Wed', dau: 3950, sessions: 5390 },
  { day: 'Thu', dau: 4210, sessions: 5720 },
  { day: 'Fri', dau: 4680, sessions: 6340 },
  { day: 'Sat', dau: 5320, sessions: 7210 },
  { day: 'Sun', dau: 4980, sessions: 6780 },
]

export const userActivityLog = Array.from({ length: 30 }, (_, i) => {
  const actions = ['Login', 'Order Placed', 'Product Viewed', 'Cart Updated', 'Profile Updated', 'Wishlist Added']
  const roles = ['Customer', 'Seller', 'Courier']
  return {
    id: `ACT-${9000 + i}`,
    user: ['Aarav Sharma', 'Diya Gupta', 'Rahul Mehta', 'Sanya Kapoor', 'Vikram Rao', 'Isha Gupta'][i % 6],
    role: roles[i % roles.length],
    action: actions[i % actions.length],
    timestamp: new Date(2026, 7, ((i * 2) % 27) + 1, (i * 3) % 24, (i * 7) % 60).toISOString().slice(0, 16).replace('T', ' '),
  }
})

export const productPerformance = Array.from({ length: 24 }, (_, i) => {
  const names = [
    'Wireless Earbuds Pro', 'Organic Cold-Pressed Oil', 'Leather Messenger Bag', 'Smart LED Desk Lamp',
    'Handwoven Cotton Rug', 'Bluetooth Fitness Tracker', 'Ceramic Dinner Set', 'Kids Building Blocks Set',
    'Anti-Aging Face Serum', 'Stainless Steel Water Bottle', 'Bestseller Fiction Novel', 'Yoga Mat Premium',
  ]
  const name = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : '')
  return {
    id: `PRD-${4000 + i}`,
    name,
    category: ['Electronics', 'Grocery', 'Fashion', 'Home & Living', 'Beauty', 'Toys & Kids', 'Books', 'Sports & Fitness'][i % 8],
    unitsSold: 1200 - i * 38,
    revenue: (1200 - i * 38) * (150 + (i * 47) % 900),
    returnRate: Math.max(1, (i % 12)),
  }
})
