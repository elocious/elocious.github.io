import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Package, Truck, MapPin, CreditCard, Download, RotateCcw, X, Clock } from 'lucide-react'
import { orders } from '@/data/mockData'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge, EmptyState } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { useStore } from '@/lib/store'

export default function OrderDetail() {
  const { id } = useParams()
  const { showToast } = useStore()
  const order = orders.find(o => o.id === id)

  if (!order) {
    return <div className="max-w-7xl mx-auto px-4 py-6"><EmptyState icon={<Package className="w-8 h-8 text-muted" />} title="Order not found" message="This order may have been removed." action={<Link to="/orders" className="btn btn-primary">Back to Orders</Link>} /></div>
  }

  const statusColors: Record<string, 'gold' | 'blue' | 'green' | 'red'> = {
    pending: 'gold', confirmed: 'blue', processing: 'blue', shipped: 'blue', out_for_delivery: 'gold', delivered: 'green', cancelled: 'red', returned: 'red', refunded: 'red',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders', to: '/orders' }, { label: order.id }]} />

      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl">{order.id}</h1>
          <p className="text-muted text-sm">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={statusColors[order.status]} className="capitalize text-sm px-3 py-1">{order.status.replace(/_/g, ' ')}</Badge>
      </div>

      {/* Timeline */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-6">Order Timeline</h2>
        <div className="relative">
          {order.timeline.map((step, i) => (
            <div key={i} className="flex gap-4 pb-8 last:pb-0 relative">
              {i < order.timeline.length - 1 && (
                <div className={`absolute left-5 top-10 bottom-0 w-0.5 ${step.done ? 'bg-gold-400' : 'bg-base'}`} />
              )}
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-gold-400 text-ink-950' : 'bg-ink-800 text-muted'}`}>
                {step.done ? <Check className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
              </motion.div>
              <div className="pt-1.5">
                <p className={`font-medium text-sm ${step.done ? '' : 'text-muted'}`}>{step.label}</p>
                <p className="text-xs text-muted">{step.date === '—' ? 'Pending' : formatDate(step.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Items in Order</h2>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.productId} className="flex items-center gap-3">
              <Link to={`/product/${item.productId}`}><img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" /></Link>
              <div className="flex-1">
                <Link to={`/product/${item.productId}`}><p className="font-medium text-sm hover:text-gold-400 transition">{item.title}</p></Link>
                <p className="text-xs text-muted">{item.storeName} · Qty: {item.quantity}</p>
              </div>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400" /> Shipping Address</h3>
          <p className="text-sm">{order.address.name}</p>
          <p className="text-sm text-muted">{order.address.street}</p>
          <p className="text-sm text-muted">{order.address.city}, {order.address.state} {order.address.zip}</p>
          <p className="text-sm text-muted">{order.address.country}</p>
          <p className="text-sm text-muted mt-1">{order.address.phone}</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gold-400" /> Payment</h3>
          <p className="text-sm">{order.paymentMethod}</p>
          {order.trackingNumber && <><p className="text-xs text-muted mt-2">Tracking Number</p><p className="text-sm font-mono">{order.trackingNumber}</p></>}
          {order.estimatedDelivery && <><p className="text-xs text-muted mt-2">Est. Delivery</p><p className="text-sm">{formatDate(order.estimatedDelivery)}</p></>}
        </div>
      </div>

      {/* Summary */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-sm mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatPrice(order.tax)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between font-display font-bold text-lg border-t border-base pt-2"><span>Total</span><span className="gradient-text">{formatPrice(order.total)}</span></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => showToast('success', 'Invoice downloaded')}><Download className="w-4 h-4" /> Download Invoice</Button>
        {order.status === 'processing' && <Button variant="secondary" onClick={() => showToast('info', 'Order cancellation requested')}><X className="w-4 h-4" /> Cancel Order</Button>}
        {order.status === 'delivered' && <Button variant="secondary" onClick={() => showToast('info', 'Return request initiated')}><RotateCcw className="w-4 h-4" /> Request Return</Button>}
        <Link to="/products" className="btn btn-secondary"><Package className="w-4 h-4" /> Buy Again</Link>
      </div>
    </div>
  )
}
