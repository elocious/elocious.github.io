import { useState } from 'react'
import { Search, Boxes, AlertTriangle, TrendingDown, Plus, Minus } from 'lucide-react'
import { products, stores } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Badge, EmptyState } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'

export default function SellerInventory() {
  const { user, showToast } = useStore()
  const store = stores.find(s => s.sellerId === user?.id) || stores[0]
  const myProducts = products.filter(p => p.storeId === store.id)
  const [search, setSearch] = useState('')

  const filtered = myProducts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  const lowStock = myProducts.filter(p => p.stock < 10 && p.stock > 0)
  const outOfStock = myProducts.filter(p => p.stock === 0)

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-2">Inventory</h1>
      <p className="text-muted text-sm mb-6">Track and manage your stock levels</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Products', value: myProducts.length, icon: Boxes, color: 'text-gold-400' },
          { label: 'Low Stock', value: lowStock.length, icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Out of Stock', value: outOfStock.length, icon: TrendingDown, color: 'text-red-400' },
          { label: 'Total Value', value: formatPrice(myProducts.reduce((s, p) => s + p.price * p.stock, 0)), icon: Boxes, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className={`w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center ${s.color} mb-2`}><s.icon className="w-5 h-5" /></div>
            <p className="font-display font-bold text-xl">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="card p-4 mb-4 bg-amber-500/5 border-amber-500/30">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="font-medium">{lowStock.length} products are running low on stock!</span>
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="input pl-10 h-10" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elev">
              <tr className="text-left text-xs text-muted">
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium hidden sm:table-cell">SKU</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium hidden md:table-cell">Value</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-base hover:bg-elev transition">
                  <td className="p-3"><div className="flex items-center gap-2"><img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" /><span className="text-sm font-medium line-clamp-1 max-w-[180px]">{p.title}</span></div></td>
                  <td className="p-3 text-sm hidden sm:table-cell font-mono text-muted">{p.sku}</td>
                  <td className="p-3 text-sm font-medium">{p.stock}</td>
                  <td className="p-3 text-sm hidden md:table-cell">{formatPrice(p.price * p.stock)}</td>
                  <td className="p-3">{p.stock === 0 ? <Badge variant="red">Out of stock</Badge> : p.stock < 10 ? <Badge variant="gold">Low stock</Badge> : <Badge variant="green">In stock</Badge>}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => showToast('info', 'Stock decreased')} className="w-7 h-7 rounded-lg bg-elev hover:bg-ink-800 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                      <button onClick={() => showToast('success', 'Stock increased')} className="w-7 h-7 rounded-lg bg-elev hover:bg-ink-800 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
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
