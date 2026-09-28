import { useState } from 'react'
import { Search, Check, Ban, Store, Shield, Star } from 'lucide-react'
import { stores } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { Badge, EmptyState } from '@/components/ui/Common'
import { formatDate } from '@/lib/utils'

export default function AdminSellers() {
  const { showToast } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = stores.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'verified' && !s.verified) return false
    if (filter === 'pending' && s.verified) return false
    return true
  })

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-2">Seller Management</h1>
      <p className="text-muted text-sm mb-6">{stores.length} sellers · {stores.filter(s => !s.verified).length} pending</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sellers..." className="input pl-10 h-10" />
        </div>
        <div className="flex gap-1">
          {['all', 'verified', 'pending'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="card p-4">
            <div className="flex items-start gap-3">
              <img src={s.logo} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                  {s.verified && <Shield className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <p className="text-xs text-muted mt-0.5">{s.sellerName} · {s.location}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold-400 fill-gold-400" /> {s.rating}</span>
                  <span>{s.productCount} products</span>
                  <span>{s.followers.toLocaleString()} followers</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {s.verified ? <Badge variant="green">Verified</Badge> : <Badge variant="gold">Pending</Badge>}
                  <span className="text-xs text-muted">Since {formatDate(s.joinedAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {!s.verified && <button onClick={() => showToast('success', `${s.name} approved!`)} className="btn btn-primary text-sm flex-1"><Check className="w-4 h-4" /> Approve</button>}
              <button onClick={() => showToast('info', 'Seller suspended')} className="btn btn-secondary text-sm px-3"><Ban className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <EmptyState icon={<Store className="w-8 h-8 text-muted" />} title="No sellers found" message="Try a different search." />}
    </div>
  )
}
