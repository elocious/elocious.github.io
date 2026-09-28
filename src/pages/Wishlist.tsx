import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, Bell, ShoppingBag, Trash2, Plus, TrendingDown, ArrowRight } from 'lucide-react'
import { products } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { EmptyState, Badge } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ProductCard from '@/components/product/ProductCard'
import { useState } from 'react'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, showToast } = useStore()
  const [collection, setCollection] = useState('All')

  const wishProducts = wishlist.map(w => products.find(p => p.id === w.productId)).filter(Boolean) as typeof products
  const collections = ['All', 'Default', 'Gift Ideas', 'Watch Later']

  const filtered = collection === 'All' ? wishProducts : wishlist.filter(w => w.collection === collection).map(w => products.find(p => p.id === w.productId)).filter(Boolean) as typeof products

  if (wishProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        <EmptyState
          icon={<Heart className="w-8 h-8 text-muted" />}
          title="Your wishlist is empty"
          message="Save items you love and come back to them later. Get notified when prices drop!"
          action={<Link to="/products" className="btn btn-primary"><ShoppingBag className="w-4 h-4" /> Discover Products</Link>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">My Wishlist</h1>
          <p className="text-muted text-sm mt-1">{wishProducts.length} items saved</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => showToast('success', 'Wishlist link copied! Share it with friends!')}><Share2 className="w-4 h-4" /> Share</Button>
          <Button variant="secondary" size="sm" onClick={() => showToast('info', 'Price drop alerts enabled for all items')}><Bell className="w-4 h-4" /> Alerts On</Button>
        </div>
      </div>

      {/* Collections */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {collections.map(c => (
          <button key={c} onClick={() => setCollection(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${collection === c ? 'btn-primary' : 'btn-secondary'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Price drop alerts */}
      <div className="card p-4 mb-6 bg-gradient-to-r from-gold-500/10 to-transparent flex items-center gap-3">
        <TrendingDown className="w-5 h-5 text-gold-400" />
        <p className="text-sm flex-1"><span className="font-medium">2 items</span> have dropped in price since you added them!</p>
        <Button size="sm" variant="secondary">View Price Drops</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map((p, i) => (
          <div key={p.id} className="relative">
            <ProductCard product={p} index={i} />
            <div className="absolute bottom-16 left-2 right-2 flex gap-1 z-10">
              <Button size="sm" className="flex-1 text-xs" onClick={() => { addToCart(p.id); showToast('success', `${p.title} added to cart`) }}>
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </Button>
              <Button size="sm" variant="secondary" className="text-xs px-2" onClick={() => { toggleWishlist(p.id); showToast('info', 'Removed from wishlist') }}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <section className="mt-12">
        <h2 className="font-display font-bold text-xl mb-4">Recommended for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.filter(p => !wishlist.some(w => w.productId === p.id)).slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </div>
  )
}
