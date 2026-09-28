import { useParams, Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Star, Shield, MapPin, Users, Calendar, ChevronDown, Bell } from 'lucide-react'
import { stores, products } from '@/data/mockData'
import ProductCard from '@/components/product/ProductCard'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { EmptyState, Badge } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'

export default function StoreDetail() {
  const { id } = useParams()
  const store = stores.find(s => s.id === id)
  const { showToast } = useStore()
  const [sort, setSort] = useState('relevance')

  const storeProducts = useMemo(() => {
    let result = products.filter(p => p.storeId === id)
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [id, sort])

  if (!store) {
    return <div className="max-w-7xl mx-auto px-4 py-6"><EmptyState icon={<Star className="w-8 h-8 text-muted" />} title="Store not found" message="This store may have been removed." action={<Link to="/stores" className="btn btn-primary">Browse Stores</Link>} /></div>
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={store.banner} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Store header */}
        <div className="card p-6 -mt-16 relative mb-6">
          <div className="flex items-start gap-4 flex-wrap">
            <img src={store.logo} alt="" className="w-20 h-20 rounded-2xl border-2 border-card object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl">{store.name}</h1>
                {store.verified && <Badge variant="blue"><Shield className="w-3 h-3" /> Verified</Badge>}
              </div>
              <p className="text-muted text-sm mt-1 max-w-xl">{store.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted flex-wrap">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-gold-400 fill-gold-400" /> {store.rating} ({store.reviewCount})</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {store.location}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {store.followers.toLocaleString()} followers</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Since {new Date(store.joinedAt).getFullYear()}</span>
              </div>
            </div>
            <Button onClick={() => showToast('success', `Following ${store.name}!`)}><Bell className="w-4 h-4" /> Follow Store</Button>
          </div>
        </div>

        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Stores', to: '/stores' }, { label: store.name }]} />

        {/* Products */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <h2 className="font-display font-bold text-xl">Products ({storeProducts.length})</h2>
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)} className="input h-10 pr-8 appearance-none cursor-pointer text-sm">
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>

        {storeProducts.length === 0 ? (
          <EmptyState icon={<Star className="w-8 h-8 text-muted" />} title="No products yet" message="This store hasn't listed any products yet." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {storeProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
