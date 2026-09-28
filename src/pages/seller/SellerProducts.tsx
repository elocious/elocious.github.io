import { useState } from 'react'
import { Plus, Search, Edit2, Copy, Trash2, Eye, Package, Filter, X } from 'lucide-react'
import { products, stores, categories } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Badge, EmptyState } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

export default function SellerProducts() {
  const { user, showToast } = useStore()
  const store = stores.find(s => s.sellerId === user?.id) || stores[0]
  const myProducts = products.filter(p => p.storeId === store.id)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', price: '', stock: '', category: '', description: '' })

  const filtered = myProducts.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'low-stock' && p.stock > 10) return false
    if (filter === 'out-of-stock' && p.stock > 0) return false
    return true
  })

  const handleAdd = () => {
    if (!form.title || !form.price) { showToast('error', 'Please fill required fields'); return }
    showToast('success', `${form.title} added to your store!`)
    setShowForm(false)
    setForm({ title: '', price: '', stock: '', category: '', description: '' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="font-display font-bold text-2xl">Products</h1><p className="text-muted text-sm">{myProducts.length} products in your store</p></div>
        <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Add Product</Button>
      </div>

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

      {filtered.length === 0 ? (
        <EmptyState icon={<Package className="w-8 h-8 text-muted" />} title="No products found" message="Add your first product to start selling!" action={<Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Add Product</Button>} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-elev">
                <tr className="text-left text-xs text-muted">
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium hidden md:table-cell">Price</th>
                  <th className="p-3 font-medium hidden sm:table-cell">Stock</th>
                  <th className="p-3 font-medium hidden lg:table-cell">Sold</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-t border-base hover:bg-elev transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-sm font-medium line-clamp-1 max-w-[200px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm hidden md:table-cell">{formatPrice(p.price)}</td>
                    <td className="p-3 text-sm hidden sm:table-cell"><span className={p.stock < 10 ? 'text-red-400' : ''}>{p.stock}</span></td>
                    <td className="p-3 text-sm hidden lg:table-cell">{p.sold}</td>
                    <td className="p-3">{p.stock > 0 ? <Badge variant="green">Active</Badge> : <Badge variant="red">Out of stock</Badge>}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => showToast('info', 'Edit form would open')} className="p-1.5 rounded-lg hover:bg-ink-800 text-muted hover:text-gold-400"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => showToast('success', 'Product duplicated')} className="p-1.5 rounded-lg hover:bg-ink-800 text-muted hover:text-gold-400"><Copy className="w-4 h-4" /></button>
                        <button onClick={() => showToast('info', 'Product deleted')} className="p-1.5 rounded-lg hover:bg-ink-800 text-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add product modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-xl">Add New Product</h2>
                  <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3">
                  <div><label className="text-sm font-medium block mb-1">Product Title *</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Product name" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium block mb-1">Price ($) *</label><input type="number" className="input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="99.99" /></div>
                    <div><label className="text-sm font-medium block mb-1">Stock</label><input type="number" className="input" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="100" /></div>
                  </div>
                  <div><label className="text-sm font-medium block mb-1">Category</label><select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="">Select category</option>{categories.filter(c => c.parentId === null).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div><label className="text-sm font-medium block mb-1">Description</label><textarea className="input resize-none h-24" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description" /></div>
                  <div><label className="text-sm font-medium block mb-1">Product Images</label><div className="border-2 border-dashed border-base rounded-xl p-8 text-center cursor-pointer hover:border-gold-400 transition" onClick={() => showToast('info', 'File picker would open')}><Package className="w-8 h-8 text-muted mx-auto mb-2" /><p className="text-sm text-muted">Click to upload images</p></div></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" onClick={handleAdd}>Add Product</Button>
                  <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
