import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Truck, MapPin, History } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import StatusBadge from '../../components/common/StatusBadge'
import ReassignCourierModal from './ReassignCourierModal'
import { useCurrencySymbol } from '../../theme/PlatformSettingsContext'
import { useToast } from '../../components/common/ToastContext'
import { orders as mockOrders } from '../../mock-data/orders'
// TODO: replace mock data with real API call to /api/v1/orders/:id

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const symbol = useCurrencySymbol()
  const { showToast } = useToast()
  const [orders, setOrders] = useState(mockOrders)
  const [reassigning, setReassigning] = useState(false)

  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div>
        <PageHeader title="Order Not Found" />
        <Link to="/orders" className="text-sm text-[var(--color-secondary)] hover:underline">
          &larr; Back to Order Management
        </Link>
      </div>
    )
  }

  const canReassign = !['Delivered', 'Cancelled'].includes(order.fulfilmentStatus)

  const handleReassign = (courier, reason) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              courierId: courier.id,
              courierName: courier.name,
              reassignmentHistory: [
                ...o.reassignmentHistory,
                { from: o.courierName, to: courier.name, date: new Date().toISOString().slice(0, 10), reason },
              ],
            }
          : o
      )
    )
    showToast(`${order.id} has been reassigned to ${courier.name}.`)
    setReassigning(false)
  }

  const itemsTotal = order.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Order Management', to: '/orders' },
          { label: order.id },
        ]}
      />

      <PageHeader
        title={order.id}
        subtitle={`Placed on ${order.orderDate}`}
        actions={
          canReassign && (
            <button
              onClick={() => setReassigning(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              <Truck size={15} /> Reassign Courier
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Order Summary</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Customer</span>
              <span className="text-[var(--color-text)] font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Seller</span>
              <span className="text-[var(--color-text)] font-medium">{order.sellerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Courier</span>
              <span className="text-[var(--color-text)] font-medium">{order.courierName}</span>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] flex justify-between">
              <span className="text-[var(--color-text-muted)]">Amount</span>
              <span className="text-[var(--color-text)] font-medium">{symbol}{order.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-muted)]">Payment Status</span>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-text-muted)]">Fulfilment Status</span>
              <StatusBadge status={order.fulfilmentStatus} />
            </div>
          </dl>
          <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-start gap-2 text-sm">
            <MapPin size={15} className="text-[var(--color-text-muted)] mt-0.5" />
            <span className="text-[var(--color-text)]">{order.shippingAddress}</span>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Order Items</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg)] text-left text-[var(--color-text-muted)]">
                <th className="px-5 py-2 font-medium">Item</th>
                <th className="px-5 py-2 font-medium">Qty</th>
                <th className="px-5 py-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-t border-[var(--color-border)]">
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{item.name}</td>
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{item.qty}</td>
                  <td className="px-5 py-2.5 text-[var(--color-text)]">{symbol}{item.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
                <td colSpan={2} className="px-5 py-2.5 font-medium text-[var(--color-text)]">
                  Total
                </td>
                <td className="px-5 py-2.5 font-medium text-[var(--color-text)]">
                  {symbol}{itemsTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <History size={16} /> Courier Reassignment History
          </h3>
          {order.reassignmentHistory.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No manual reassignments for this order.</p>
          ) : (
            <ul className="space-y-3">
              {order.reassignmentHistory.map((h, idx) => (
                <li key={idx} className="text-sm border-l-2 border-[var(--color-primary)] pl-3">
                  <p className="text-[var(--color-text)]">
                    <span className="font-medium">{h.from}</span> &rarr;{' '}
                    <span className="font-medium">{h.to}</span>
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">{h.date}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{h.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ReassignCourierModal
        open={reassigning}
        onClose={() => setReassigning(false)}
        onSave={handleReassign}
        order={order}
      />
    </div>
  )
}
