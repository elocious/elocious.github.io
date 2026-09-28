import { Link } from 'react-router-dom'
import { useState } from 'react'
import { stores, products } from '@/data/mockData'
import { Star, Shield, MapPin, Search } from 'lucide-react'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { EmptyState } from '@/components/ui/Common'

export default function Stores() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = stores.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'verified' && !s.verified) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Stores' }]} />
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">Explore Stores</h1>
      <p className="text-muted text-sm mb-6">Discover unique products from trusted sellers worldwide</p>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stores..." className="input pl-10 h-10" />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        </div>
        <div className="flex gap-1">
          {['all', 'verified'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Search className="w-8 h-8 text-muted" />} title="No stores found" message="Try a different search term." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => {
            const storeProducts = products.filter(p => p.storeId === s.id)
            return (
              <ScrollReveal key={s.id} delay={i * 0.05}>
                <Link to={`/store/${s.id}`} className="card card-hover overflow-hidden block">
                  <div className="h-28 relative">
                    <img src={s.banner} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                  </div>
                  <div className="p-4 -mt-12 relative">
                    <img src={s.logo} alt="" className="w-16 h-16 rounded-2xl border-2 border-card object-cover mb-2" />
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-lg">{s.name}</h3>
                      {s.verified && <Shield className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-sm text-muted line-clamp-2 mt-1">{s.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" /> {s.rating} ({s.reviewCount})</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {s.location}</span>
                      <span>{s.productCount} products</span>
                    </div>
                    <div className="flex gap-1 mt-3">
                      {storeProducts.slice(0, 4).map(p => <img key={p.id} src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />)}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
