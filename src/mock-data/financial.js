// TODO: replace mock data with real API call to /api/v1/financial/*

export const commissionConfig = [
  { id: 'COM-1', category: 'Electronics', rate: 8.5, updatedDate: '2026-07-12' },
  { id: 'COM-2', category: 'Fashion', rate: 12.0, updatedDate: '2026-06-28' },
  { id: 'COM-3', category: 'Grocery', rate: 5.0, updatedDate: '2026-07-01' },
  { id: 'COM-4', category: 'Home & Living', rate: 10.0, updatedDate: '2026-05-19' },
  { id: 'COM-5', category: 'Beauty', rate: 11.5, updatedDate: '2026-07-20' },
  { id: 'COM-6', category: 'Toys & Kids', rate: 9.0, updatedDate: '2026-04-30' },
  { id: 'COM-7', category: 'Books', rate: 6.0, updatedDate: '2026-06-15' },
  { id: 'COM-8', category: 'Sports & Fitness', rate: 9.5, updatedDate: '2026-07-05' },
]

export const financialSummary = [
  { month: 'Feb', gmv: 2980000, commission: 253300, payouts: 2650000 },
  { month: 'Mar', gmv: 3410000, commission: 289850, payouts: 3030000 },
  { month: 'Apr', gmv: 3120000, commission: 265200, payouts: 2780000 },
  { month: 'May', gmv: 3650000, commission: 310250, payouts: 3250000 },
  { month: 'Jun', gmv: 4020000, commission: 341700, payouts: 3580000 },
  { month: 'Jul', gmv: 3880000, commission: 329800, payouts: 3450000 },
  { month: 'Aug', gmv: 4520000, commission: 384200, payouts: 4010000 },
]

const settlementStatuses = ['Completed', 'Completed', 'Processing', 'Failed']
export const settlementBatches = Array.from({ length: 22 }, (_, i) => {
  const status = settlementStatuses[i % settlementStatuses.length]
  return {
    id: `STL-${900 + i}`,
    batchDate: new Date(2026, 7 - Math.floor(i / 4), 27 - (i % 4) * 7).toISOString().slice(0, 10),
    sellersCount: 8 + (i % 20),
    totalAmount: 45000 + ((i * 5231) % 380000),
    status,
    failureReason: status === 'Failed' ? 'Bank account verification failed for 2 sellers in batch.' : null,
  }
})

const transactionTypes = ['Order Payment', 'Commission Deduction', 'Seller Payout', 'Refund']
export const transactionLedger = Array.from({ length: 50 }, (_, i) => {
  const type = transactionTypes[i % transactionTypes.length]
  const isCredit = type === 'Order Payment'
  return {
    id: `TXN-${70000 + i}`,
    date: new Date(2026, 7, ((i * 3) % 27) + 1).toISOString().slice(0, 10),
    type,
    reference: type === 'Refund' ? `ORD-${20000 + (i % 60)}` : type === 'Seller Payout' ? `STL-${900 + (i % 22)}` : `ORD-${20000 + (i % 60)}`,
    amount: 200 + ((i * 341) % 8500),
    direction: isCredit ? 'Credit' : 'Debit',
    status: i % 11 === 0 ? 'Pending' : 'Completed',
  }
})

const refundStatuses = ['Pending', 'Pending', 'Approved', 'Rejected']
export const refunds = Array.from({ length: 18 }, (_, i) => {
  const status = refundStatuses[i % refundStatuses.length]
  return {
    id: `REF-${5000 + i}`,
    orderId: `ORD-${20000 + (i * 7) % 60}`,
    customerName: ['Aarav Sharma', 'Diya Gupta', 'Kabir Verma', 'Ananya Iyer', 'Rohan Reddy'][i % 5],
    amount: 300 + ((i * 271) % 3500),
    reason: [
      'Product damaged during delivery',
      'Wrong item delivered',
      'Item not as described',
      'Customer changed mind within return window',
    ][i % 4],
    requestedDate: new Date(2026, 7, ((i * 4) % 27) + 1).toISOString().slice(0, 10),
    status,
    resolutionNote:
      status === 'Approved'
        ? 'Refund verified against return pickup confirmation.'
        : status === 'Rejected'
        ? 'Return window expired; refund not eligible per policy.'
        : null,
  }
})
