import { useState } from 'react'
import { Plus, Edit2, Trash2, Boxes } from 'lucide-react'
import { categories } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Common'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminCategories() {
  const { showToast } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', parentId: '' })

  const parentCats = categories.filter(c => c.parentId === null)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="font-display font-bold text-2xl">Categories</h1><p className="text-muted text-sm">{categories.length} categories</p></div>
        <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Add Category</Button>
      </div>

      <div className="space-y-4">
        {parentCats.map(cat => {
          const subs = categories.filter(c => c.parentId === cat.id)
          return (
            <div key={cat.id} className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={cat.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-xs text-muted">{cat.productCount} products · {subs.length} subcategories</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => showToast('info', 'Edit form would open')} className="p-2 rounded-lg hover:bg-ink-800 text-muted hover:text-gold-400"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => showToast('info', 'Category deleted')} className="p-2 rounded-lg hover:bg-ink-800 text-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {subs.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-15">
                  {subs.map(s => (
                    <div key={s.id} className="flex items-center gap-2 bg-elev rounded-lg px-3 py-1.5">
                      <img src={s.image} alt="" className="w-6 h-6 rounded object-cover" />
                      <span className="text-sm">{s.name}</span>
                      <span className="text-xs text-muted">{s.productCount}</span>
                      <button onClick={() => showToast('info', 'Subcategory deleted')} className="text-muted hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="font-display font-bold text-xl mb-4">Add Category</h2>
              <div className="space-y-3">
                <div><label className="text-sm font-medium block mb-1">Name</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Category name" /></div>
                <div><label className="text-sm font-medium block mb-1">Parent Category (optional)</label><select className="input" value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })}><option value="">None (top-level)</option>{parentCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" onClick={() => { if (form.name) { showToast('success', 'Category created!'); setShowForm(false); setForm({ name: '', parentId: '' }) } else showToast('error', 'Name is required') }}>Create</Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
