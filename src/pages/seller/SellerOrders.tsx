import { useState } from 'react'
import { Search, Package, Eye } from 'lucide-react'
import { orders } from '@/data/mockData'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Common'
import { useStore } from '@/lib/store'

export default function SellerOrders() {
  const { showToast } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = orders.filter(o => {
    if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && o.status !== filter) return false
    return true
  })

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-2">Orders</h1>
      <p className="text-muted text-sm mb-6">Manage and track customer orders</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="input pl-10 h-10" />
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {['all', 'processing', 'shipped', 'delivered'].map(t => (
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
                <th className="p-3 font-medium hidden md:table-cell">Date</th>
                <th className="p-3 font-medium hidden sm:table-cell">Items</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t border-base hover:bg-elev transition">
                  <td className="p-3 text-sm font-medium">{o.id}</td>
                  <td className="p-3 text-sm hidden md:table-cell">{formatDate(o.createdAt)}</td>
                  <td className="p-3 text-sm hidden sm:table-cell">{o.items.length}</td>
                  <td className="p-3 text-sm font-medium">{formatPrice(o.total)}</td>
                  <td className="p-3"><Badge variant={o.status === 'delivered' ? 'green' : o.status === 'shipped' ? 'blue' : 'gold'} className="capitalize">{o.status.replace(/_/g, ' ')}</Badge></td>
                  <td className="p-3">
                    <select className="input h-8 text-xs" defaultValue={o.status} onChange={() => showToast('success', 'Order status updated')}>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
