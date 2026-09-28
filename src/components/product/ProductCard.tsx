import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Zap, Star } from 'lucide-react'
import type { Product } from '@/types'
import { useStore } from '@/lib/store'
import { formatPrice, useCountdown } from '@/lib/utils'
import { Badge } from '@/components/ui/Common'

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isWishlisted, showToast } = useStore()
  const wished = isWishlisted(product.id)
  const { days, hours, mins } = useCountdown(product.dealEndsAt || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
      className="card card-hover group relative overflow-hidden flex flex-col"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden rounded-t-2xl bg-ink-900">
        <img src={product.images[0]} alt={product.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount > 0 && <Badge variant="red">-{product.discount}%</Badge>}
          {product.flashSale && <Badge variant="gold"><Zap className="w-3 h-3" /> Flash</Badge>}
          {product.bestSeller && <Badge variant="blue">Best Seller</Badge>}
          {product.newArrival && <Badge variant="green">New</Badge>}
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); showToast(wished ? 'info' : 'success', wished ? 'Removed from wishlist' : 'Added to wishlist') }}
          className="absolute top-2 right-2 w-9 h-9 rounded-full glass flex items-center justify-center transition hover:scale-110"
        >
          <Heart className={`w-4 h-4 transition ${wished ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
        </button>
        {/* Quick add */}
        <button
          onClick={(e) => { e.preventDefault(); addToCart(product.id); showToast('success', `${product.title} added to cart`) }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <span className="btn btn-primary w-full text-sm py-2"><ShoppingCart className="w-4 h-4" /> Quick Add</span>
        </button>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-muted mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-gold-400 transition leading-snug min-h-[2.5rem]">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-display font-bold text-lg">{formatPrice(product.dealPrice || product.price)}</span>
          {product.originalPrice && <span className="text-sm text-muted line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
        {product.flashSale && product.dealEndsAt && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gold-400">
            <Zap className="w-3 h-3" />
            <span>Ends in {days}d {hours}h {mins}m</span>
          </div>
        )}
        <p className="text-xs text-muted mt-1">{product.stock < 10 ? `Only ${product.stock} left!` : 'In stock'}</p>
      </div>
    </motion.div>
  )
}
