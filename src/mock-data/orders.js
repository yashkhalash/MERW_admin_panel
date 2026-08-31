// TODO: replace mock data with real API call to /api/v1/orders
import { customers } from './customers'
import { sellers } from './sellers'
import { couriers } from './couriers'

const paymentStatuses = ['Paid', 'Paid', 'Pending', 'Refunded']
const fulfilmentStatuses = ['Delivered', 'In Transit', 'Processing', 'Cancelled']

export const orders = Array.from({ length: 60 }, (_, i) => {
  const customer = customers[i % customers.length]
  const seller = sellers[i % sellers.length]
  const courier = couriers[i % couriers.length]
  const orderDate = new Date(2026, 7, ((i * 3) % 27) + 1)
  const fulfilmentStatus = fulfilmentStatuses[i % fulfilmentStatuses.length]

  return {
    id: `ORD-${20000 + i}`,
    customerId: customer.id,
    customerName: customer.name,
    sellerId: seller.id,
    sellerName: seller.storeName,
    courierId: courier.id,
    courierName: courier.name,
    amount: 350 + ((i * 271) % 6500),
    paymentStatus: paymentStatuses[i % paymentStatuses.length],
    fulfilmentStatus,
    orderDate: orderDate.toISOString().slice(0, 10),
    items: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
      name: `${seller.category} Product ${j + 1}`,
      qty: (j % 3) + 1,
      price: 150 + ((i + j) * 63) % 2500,
    })),
    shippingAddress: `${100 + i} MG Road, Sector ${((i % 12) + 1)}, ${['Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Hyderabad'][i % 5]}`,
    reassignmentHistory:
      i % 7 === 0
        ? [
            {
              from: couriers[(i + 1) % couriers.length].name,
              to: courier.name,
              date: new Date(2026, 7, ((i * 3) % 27)).toISOString().slice(0, 10),
              reason: 'Original courier unavailable due to zone congestion.',
            },
          ]
        : [],
  }
})
