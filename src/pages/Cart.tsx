import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Minus, Plus, ShoppingBag, Tag, X, Heart, ArrowRight, Truck } from 'lucide-react'
import { products, coupons } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { EmptyState, Badge } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ProductCard from '@/components/product/ProductCard'

export default function Cart() {
  const { cart, removeFromCart, updateQty, saveForLater, moveToCart, clearCart, showToast, addresses } = useStore()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null)
  const [couponError, setCouponError] = useState('')

  const activeCart = cart.filter(c => !c.savedForLater)
  const savedItems = cart.filter(c => c.savedForLater)

  const cartProducts = activeCart.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId),
  })).filter(c => c.product)

  const savedProducts = savedItems.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId),
  })).filter(c => c.product)

  const subtotal = cartProducts.reduce((s, c) => s + (c.product!.dealPrice || c.product!.price) * c.quantity, 0)
  const discount = appliedCoupon?.type === 'percentage' ? (subtotal * appliedCoupon.value) / 100
    : appliedCoupon?.type === 'fixed' ? Math.min(appliedCoupon.value, subtotal) : 0
  const shipping = subtotal > 50 ? 0 : (subtotal > 0 ? 9.99 : 0)
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  const applyCoupon = () => {
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase())
    if (!coupon) { setCouponError('Invalid coupon code'); return }
    if (subtotal < coupon.minPurchase) { setCouponError(`Minimum purchase of ${formatPrice(coupon.minPurchase)} required`); return }
    setAppliedCoupon(coupon); setCouponError(''); showToast('success', `Coupon ${coupon.code} applied!`)
  }

  const recommended = products.filter(p => !cart.some(c => c.productId === p.id)).slice(0, 4)

  if (cartProducts.length === 0 && savedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8 text-muted" />}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Let's fix that!"
          action={<Link to="/products" className="btn btn-primary"><ShoppingBag className="w-4 h-4" /> Start Shopping</Link>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cartProducts.map(({ product, quantity, variant }) => (
              <motion.div key={product!.id} layout
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 200 }}
                className="card p-4 flex gap-4">
                <Link to={`/product/${product!.id}`} className="shrink-0">
                  <img src={product!.images[0]} alt="" className="w-24 h-24 rounded-xl object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product!.id}`}>
                    <h3 className="font-medium text-sm hover:text-gold-400 transition line-clamp-1">{product!.title}</h3>
                  </Link>
                  <p className="text-xs text-muted mt-0.5">{product!.brand} · {product!.storeName}</p>
                  {variant && Object.entries(variant).map(([k, v]) => <p key={k} className="text-xs text-muted">{k}: {v}</p>)}
                  <div className="flex items-center gap-2 mt-2">
                    {product!.originalPrice && <Badge variant="red">-{product!.discount}%</Badge>}
                    <span className="text-xs text-emerald-400">In Stock</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 card p-1">
                      <button onClick={() => updateQty(product!.id, quantity - 1)} className="w-7 h-7 rounded-lg hover:bg-ink-800 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button onClick={() => updateQty(product!.id, quantity + 1)} className="w-7 h-7 rounded-lg hover:bg-ink-800 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold">{formatPrice((product!.dealPrice || product!.price) * quantity)}</span>
                      <button onClick={() => saveForLater(product!.id)} className="text-muted hover:text-gold-400 transition" title="Save for later"><Heart className="w-4 h-4" /></button>
                      <button onClick={() => { removeFromCart(product!.id); showToast('info', 'Item removed') }} className="text-muted hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {activeCart.length > 0 && (
            <button onClick={() => { clearCart(); showToast('info', 'Cart cleared') }} className="text-sm text-muted hover:text-red-400 transition">Clear cart</button>
          )}

          {/* Saved for later */}
          {savedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display font-bold text-lg mb-3">Saved for Later ({savedProducts.length})</h2>
              <div className="space-y-3">
                {savedProducts.map(({ product }) => (
                  <div key={product!.id} className="card p-4 flex gap-4">
                    <img src={product!.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{product!.title}</h3>
                      <p className="font-bold mt-1">{formatPrice(product!.dealPrice || product!.price)}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="secondary" onClick={() => moveToCart(product!.id)}>Move to Cart</Button>
                        <Button size="sm" variant="ghost" onClick={() => removeFromCart(product!.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="card p-5 sticky top-20">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                  <span className="text-sm flex items-center gap-2"><Tag className="w-4 h-4 text-emerald-400" /> {appliedCoupon.code}</span>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode('') }}><X className="w-4 h-4 text-muted" /></button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Coupon code" className="input h-10 text-sm" />
                    <Button variant="secondary" size="sm" onClick={applyCoupon}>Apply</Button>
                  </div>
                  {couponError && <p className="text-xs text-red-400 mt-1">{couponError}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {coupons.slice(0, 3).map(c => (
                      <button key={c.id} onClick={() => { setCouponCode(c.code); }} className="text-xs text-gold-400 hover:underline">{c.code}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? <Badge variant="green">FREE</Badge> : formatPrice(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Tax (8%)</span><span>{formatPrice(tax)}</span></div>
              <div className="border-t border-base pt-3 flex justify-between font-display font-bold text-lg"><span>Total</span><span className="gradient-text">{formatPrice(total)}</span></div>
            </div>

            {shipping > 0 && (
              <div className="mt-3 text-xs text-muted flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Add {formatPrice(50 - subtotal)} more for free shipping!
              </div>
            )}

            <Button className="w-full mt-4" onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to="/products" className="btn btn-ghost w-full mt-2 text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display font-bold text-xl mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recommended.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  )
}
