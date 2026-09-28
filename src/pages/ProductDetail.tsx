import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, ShoppingCart, Share2, Zap, Truck, RefreshCw, Shield, Check,
  Star, ChevronRight, Minus, Plus, Store as StoreIcon, MessageCircle, ThumbsUp, Flag, ZoomIn,
} from 'lucide-react'
import { products, reviews as allReviews, stores } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { formatPrice, formatDate, useCountdown } from '@/lib/utils'
import { Badge, Rating, EmptyState } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ProductCard from '@/components/product/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const { addToCart, toggleWishlist, isWishlisted, showToast } = useStore()
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'questions' | 'shipping'>('description')
  const [zoom, setZoom] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const productReviews = useMemo(() => allReviews.filter(r => r.productId === id), [id])
  const relatedProducts = useMemo(() => products.filter(p => p.categoryId === product?.categoryId && p.id !== id).slice(0, 4), [id, product])
  const frequentlyBought = useMemo(() => products.filter(p => p.id !== id).slice(4, 7), [id])
  const store = stores.find(s => s.id === product?.storeId)

  if (!product) {
    return <EmptyState icon={<Star className="w-8 h-8 text-muted" />} title="Product not found" message="This product may have been removed or is no longer available." action={<Link to="/products"><Button>Browse Products</Button></Link>} />
  }

  const wished = isWishlisted(product.id)
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({ star, count: productReviews.filter(r => r.rating === star).length }))
  const { days, hours, mins } = useCountdown(product.dealEndsAt || '')

  const handleAddToCart = () => {
    if (product.variants.length > 0) {
      const missing = product.variants.find(v => !selectedVariants[v.name])
      if (missing) { showToast('warning', `Please select ${missing.name}`); return }
    }
    addToCart(product.id, quantity, selectedVariants)
    showToast('success', `${product.title} added to cart`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/cart'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: product.title }]} />

      <div className="grid lg:grid-cols-2 gap-8 mt-4">
        {/* Gallery */}
        <div>
          <div className="card overflow-hidden relative aspect-square bg-ink-900 group" onClick={() => setZoom(true)}>
            <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.discount > 0 && <Badge variant="red">-{product.discount}% OFF</Badge>}
              {product.flashSale && <Badge variant="gold"><Zap className="w-3 h-3" /> Flash Sale</Badge>}
            </div>
            <div className="absolute bottom-3 right-3 glass rounded-lg p-2 opacity-0 group-hover:opacity-100 transition">
              <ZoomIn className="w-5 h-5" />
            </div>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${activeImage === i ? 'border-gold-400' : 'border-base'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-muted mb-1">{product.brand}</p>
          <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">{product.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Rating value={product.rating} />
              <span className="text-sm font-medium ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-muted">·</span>
            <button onClick={() => setActiveTab('reviews')} className="text-sm text-muted hover:text-gold-400 transition">{product.reviewCount} reviews</button>
            <span className="text-sm text-muted">·</span>
            <span className="text-sm text-emerald-400">{product.sold}+ sold</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-2">
            <span className="font-display font-bold text-3xl gradient-text">{formatPrice(product.dealPrice || product.price)}</span>
            {product.originalPrice && <span className="text-lg text-muted line-through">{formatPrice(product.originalPrice)}</span>}
            {product.discount > 0 && <Badge variant="red">Save {formatPrice((product.originalPrice || 0) - product.price)}</Badge>}
          </div>
          {product.flashSale && product.dealEndsAt && (
            <div className="flex items-center gap-2 text-sm text-gold-400 mb-4">
              <Zap className="w-4 h-4" /> Deal ends in {days}d {hours}h {mins}m
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-4">
            {product.stock > 0 ? (
              <span className="text-sm text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> In Stock — {product.stock} available</span>
            ) : (
              <span className="text-sm text-red-400">Out of Stock</span>
            )}
            <span className="text-sm text-muted">· SKU: {product.sku}</span>
          </div>

          {/* Variants */}
          {product.variants.map(v => (
            <div key={v.name} className="mb-4">
              <p className="text-sm font-medium mb-2">{v.name}: <span className="text-muted">{selectedVariants[v.name] || 'Select'}</span></p>
              <div className="flex flex-wrap gap-2">
                {v.options.map(opt => (
                  <button key={opt} onClick={() => setSelectedVariants(s => ({ ...s, [v.name]: opt }))}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition ${selectedVariants[v.name] === opt ? 'border-gold-400 bg-gold-500/10 text-gold-400' : 'border-base hover:border-gold-400'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-medium">Quantity:</p>
            <div className="flex items-center gap-2 card p-1">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg hover:bg-ink-800 flex items-center justify-center transition"><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-8 h-8 rounded-lg hover:bg-ink-800 flex items-center justify-center transition"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-4">
            <Button onClick={handleAddToCart} className="flex-1"><ShoppingCart className="w-4 h-4" /> Add to Cart</Button>
            <Button onClick={handleBuyNow} className="flex-1">Buy Now</Button>
            <button onClick={() => { toggleWishlist(product.id); showToast(wished ? 'info' : 'success', wished ? 'Removed from wishlist' : 'Added to wishlist') }}
              className="btn btn-secondary p-3"><Heart className={`w-5 h-5 ${wished ? 'fill-red-500 text-red-500' : ''}`} /></button>
            <button onClick={() => showToast('success', 'Link copied to clipboard')} className="btn btn-secondary p-3"><Share2 className="w-5 h-5" /></button>
          </div>

          {/* Delivery estimate */}
          <div className="card p-4 space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-gold-400" />
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted">Est. delivery: {new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-gold-400" />
              <div>
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-muted">Free returns on eligible items</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold-400" />
              <div>
                <p className="text-sm font-medium">NexaCart Protection</p>
                <p className="text-xs text-muted">Full refund if item doesn't arrive</p>
              </div>
            </div>
          </div>

          {/* Store info */}
          {store && (
            <Link to={`/store/${store.id}`} className="card card-hover p-4 flex items-center gap-3">
              <img src={store.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm">{store.name}</p>
                  {store.verified && <Shield className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Star className="w-3 h-3 text-gold-400 fill-gold-400" /> {store.rating} · {store.reviewCount} reviews · {store.location}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted" />
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-1 border-b border-base overflow-x-auto no-scrollbar">
          {[
            { k: 'description', l: 'Description' },
            { k: 'specs', l: 'Specifications' },
            { k: 'reviews', l: `Reviews (${productReviews.length})` },
            { k: 'questions', l: 'Questions' },
            { k: 'shipping', l: 'Shipping & Returns' },
          ].map(t => (
            <button key={t.k} onClick={() => setActiveTab(t.k as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${activeTab === t.k ? 'border-gold-400 text-gold-400' : 'border-transparent text-muted hover:text-foreground'}`}>
              {t.l}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-3xl">
              <p className="text-muted leading-relaxed mb-4">{product.description}</p>
              <h3 className="font-semibold mb-2">What's Included</h3>
              <ul className="space-y-1">
                {product.whatsIncluded.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-emerald-400" /> {item}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((s, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-elev' : ''}>
                      <td className="py-3 px-4 font-medium text-sm w-1/3">{s.label}</td>
                      <td className="py-3 px-4 text-sm text-muted">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div>
                <div className="card p-5 text-center">
                  <p className="font-display font-bold text-5xl">{product.rating}</p>
                  <Rating value={product.rating} size="lg" />
                  <p className="text-sm text-muted mt-2">{product.reviewCount} reviews</p>
                  <div className="mt-4 space-y-1">
                    {ratingDist.map(d => (
                      <div key={d.star} className="flex items-center gap-2 text-xs">
                        <span className="w-8">{d.star}★</span>
                        <div className="flex-1 h-2 rounded-full bg-ink-800 overflow-hidden">
                          <div className="h-full bg-gold-400 rounded-full" style={{ width: `${productReviews.length ? (d.count / productReviews.length) * 100 : 0}%` }} />
                        </div>
                        <span className="w-6 text-muted">{d.count}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" onClick={() => setShowReviewForm(!showReviewForm)}>Write a Review</Button>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card p-4">
                      <textarea placeholder="Share your experience..." className="input mb-2 h-24 resize-none" />
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 text-gold-400 fill-gold-400 cursor-pointer" />)}
                      </div>
                      <Button size="sm" onClick={() => { setShowReviewForm(false); showToast('success', 'Review submitted!') }}>Submit Review</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {productReviews.length === 0 ? (
                  <EmptyState icon={<MessageCircle className="w-8 h-8 text-muted" />} title="No reviews yet" message="Be the first to review this product!" />
                ) : (
                  productReviews.map(r => (
                    <div key={r.id} className="card p-4">
                      <div className="flex items-start gap-3">
                        <img src={r.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{r.userName}</p>
                            {r.verified && <Badge variant="green"><Check className="w-3 h-3" /> Verified</Badge>}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Rating value={r.rating} />
                            <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                          </div>
                          <h4 className="font-semibold text-sm mt-2">{r.title}</h4>
                          <p className="text-sm text-muted mt-1">{r.body}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <button onClick={() => showToast('success', 'Marked as helpful')} className="text-xs text-muted hover:text-gold-400 flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Helpful ({r.helpful})</button>
                            <button onClick={() => showToast('info', 'Review reported')} className="text-xs text-muted hover:text-red-400 flex items-center gap-1"><Flag className="w-3.5 h-3.5" /> Report</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === 'questions' && (
            <EmptyState icon={<MessageCircle className="w-8 h-8 text-muted" />} title="No questions yet" message="Ask a question about this product and our community will help!" action={<Button>Ask a Question</Button>} />
          )}
          {activeTab === 'shipping' && (
            <div className="max-w-2xl space-y-4">
              <div className="card p-4"><h3 className="font-semibold mb-1 flex items-center gap-2"><Truck className="w-4 h-4 text-gold-400" /> Shipping Information</h3><p className="text-sm text-muted">{product.shippingInfo}</p></div>
              <div className="card p-4"><h3 className="font-semibold mb-1 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-gold-400" /> Return Policy</h3><p className="text-sm text-muted">{product.returnPolicy}</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Frequently bought together */}
      <section className="mt-12">
        <h2 className="font-display font-bold text-xl mb-4">Frequently Bought Together</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[product, ...frequentlyBought].slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* Related products */}
      <section className="mt-12">
        <h2 className="font-display font-bold text-xl mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
            <motion.img src={product.images[activeImage]} alt={product.title} initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="max-w-full max-h-full object-contain rounded-xl" />
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setZoom(false)}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
