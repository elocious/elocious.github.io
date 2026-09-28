import { useState } from 'react'
import { Search, Eye, Ban, Package, Trash2 } from 'lucide-react'
import { products } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Badge, EmptyState } from '@/components/ui/Common'
import { Link } from 'react-router-dom'

export default function AdminProducts() {
  const { showToast } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = products.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'out-of-stock' && p.stock > 0) return false
    if (filter === 'low-stock' && p.stock >= 10) return false
    return true
  })

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-2">Product Management</h1>
      <p className="text-muted text-sm mb-6">{products.length} total products on platform</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input pl-10 h-10" />
        </div>
        <div className="flex gap-1">
          {['all', 'low-stock', 'out-of-stock'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${filter === t ? 'btn-primary' : 'btn-secondary'}`}>{t.replace(/-/g, ' ')}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elev">
              <tr className="text-left text-xs text-muted">
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium hidden md:table-cell">Store</th>
                <th className="p-3 font-medium hidden sm:table-cell">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium hidden lg:table-cell">Sold</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-base hover:bg-elev transition">
                  <td className="p-3"><div className="flex items-center gap-2"><img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" /><span className="text-sm font-medium line-clamp-1 max-w-[200px]">{p.title}</span></div></td>
                  <td className="p-3 text-sm hidden md:table-cell">{p.storeName}</td>
                  <td className="p-3 text-sm hidden sm:table-cell">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.stock === 0 ? <Badge variant="red">Out</Badge> : p.stock < 10 ? <Badge variant="gold">Low</Badge> : <Badge variant="green">{p.stock}</Badge>}</td>
                  <td className="p-3 text-sm hidden lg:table-cell">{p.sold}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Link to={`/product/${p.id}`} className="p-1.5 rounded-lg hover:bg-ink-800 text-muted hover:text-gold-400"><Eye className="w-4 h-4" /></Link>
                      <button onClick={() => showToast('info', 'Product removed')} className="p-1.5 rounded-lg hover:bg-ink-800 text-muted hover:text-red-400"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filtered.length === 0 && <EmptyState icon={<Package className="w-8 h-8 text-muted" />} title="No products found" message="Try a different search." />}
    </div>
  )
}
