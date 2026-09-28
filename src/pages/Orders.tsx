import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Package, ChevronRight, Search, Filter } from 'lucide-react'
import { orders } from '@/data/mockData'
import { formatPrice, formatDate } from '@/lib/utils'
import { EmptyState, Badge } from '@/components/ui/Common'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { cn } from '@/lib/utils'

const statusColors: Record<string, 'gold' | 'blue' | 'green' | 'red' | 'default'> = {
  pending: 'gold', confirmed: 'blue', processing: 'blue', shipped: 'blue',
  out_for_delivery: 'gold', delivered: 'green', cancelled: 'red', returned: 'red', refunded: 'red',
}

export default function Orders() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const tabs = ['all', 'processing', 'shipped', 'delivered', 'cancelled']

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders' }]} />
        <EmptyState icon={<Package className="w-8 h-8 text-muted" />} title="No orders yet" message="When you place an order, it will appear here." action={<Link to="/products" className="btn btn-primary">Start Shopping</Link>} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My Orders' }]} />
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-6">My Orders</h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID..." className="input pl-10 h-10" />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={cn('px-3 py-2 rounded-lg text-sm font-medium capitalize transition whitespace-nowrap', filter === t ? 'btn-primary' : 'btn-secondary')}>{t}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(order => (
          <Link key={order.id} to={`/orders/${order.id}`} className="card card-hover p-4 block">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-ink-800 flex items-center justify-center"><Package className="w-5 h-5 text-gold-400" /></div>
                <div>
                  <p className="font-semibold text-sm">{order.id}</p>
                  <p className="text-xs text-muted">Placed on {formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  <p className="font-display font-bold">{formatPrice(order.total)}</p>
                </div>
                <Badge variant={statusColors[order.status]} className="capitalize">{order.status.replace(/_/g, ' ')}</Badge>
                <ChevronRight className="w-5 h-5 text-muted" />
              </div>
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {order.items.map(item => (
                <img key={item.productId} src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
