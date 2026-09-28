import { useState } from 'react'
import { Search, ShoppingBag, Eye } from 'lucide-react'
import { orders } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Common'
import { Link } from 'react-router-dom'

const allOrders = [
  ...orders,
  { id: 'NC-ORD-2024-004', userId: 'u5', items: [{ productId: 'p4', title: 'Vertex Heritage Jacket', image: `https://picsum.photos/seed/prod-p4-1/600/600`, price: 179, quantity: 1, storeId: 's2', storeName: 'Vertex Lifestyle' }], subtotal: 179, shipping: 9.99, tax: 15.12, discount: 0, total: 204.11, status: 'pending' as const, address: { id: 'a3', label: 'Home', name: 'Emma Wilson', street: '456 Oak Ave', city: 'Portland', state: 'OR', zip: '97201', country: 'USA', phone: '+1 (555) 987-6543' }, paymentMethod: 'Visa •••• 1234', createdAt: '2024-09-28', trackingNumber: 'NC1Z777888999', estimatedDelivery: '2024-10-03', timeline: [] },
  { id: 'NC-ORD-2024-005', userId: 'u6', items: [{ productId: 'p8', title: 'NovaPlay Console Z', image: `https://picsum.photos/seed/prod-p8-1/600/600`, price: 499, quantity: 1, storeId: 's1', storeName: 'AuraTech Official' }], subtotal: 499, shipping: 0, tax: 39.92, discount: 50, total: 488.92, status: 'confirmed' as const, address: { id: 'a4', label: 'Home', name: 'James Park', street: '789 Pine St', city: 'Seattle', state: 'WA', zip: '98101', country: 'USA', phone: '+1 (555) 456-7890' }, paymentMethod: 'PayPal', createdAt: '2024-09-28', trackingNumber: '', estimatedDelivery: '2024-10-04', timeline: [] },
]

export default function AdminOrders() {
  const { showToast } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = allOrders.filter(o => {
    if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && o.status !== filter) return false
    return true
  })

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-2">Order Management</h1>
      <p className="text-muted text-sm mb-6">{allOrders.length} total orders</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="input pl-10 h-10" />
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition whitespace-nowrap ${filter === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elev">
              <tr className="text-left text-xs text-muted">
                <th className="p-3 font-medium">Order ID</th>
                <th className="p-3 font-medium hidden md:table-cell">Customer</th>
                <th className="p-3 font-medium hidden sm:table-cell">Date</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t border-base hover:bg-elev transition">
                  <td className="p-3 text-sm font-medium">{o.id}</td>
                  <td className="p-3 text-sm hidden md:table-cell">{o.address.name}</td>
                  <td className="p-3 text-sm hidden sm:table-cell">{formatDate(o.createdAt)}</td>
                  <td className="p-3 text-sm font-medium">{formatPrice(o.total)}</td>
                  <td className="p-3"><Badge variant={o.status === 'delivered' ? 'green' : o.status === 'pending' ? 'gold' : 'blue'} className="capitalize">{o.status.replace(/_/g, ' ')}</Badge></td>
                  <td className="p-3"><Link to={`/orders/${o.id}`} className="p-1.5 rounded-lg hover:bg-ink-800 text-muted hover:text-gold-400"><Eye className="w-4 h-4" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
