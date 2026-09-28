import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CreditCard, Truck, MapPin, User, ShoppingBag, ArrowLeft, ArrowRight, PartyPopper, Shield, Package } from 'lucide-react'
import { products } from '@/data/mockData'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { cn } from '@/lib/utils'

const steps = [
  { n: 1, label: 'Information', icon: User },
  { n: 2, label: 'Shipping', icon: MapPin },
  { n: 3, label: 'Delivery', icon: Truck },
  { n: 4, label: 'Payment', icon: CreditCard },
  { n: 5, label: 'Review', icon: ShoppingBag },
  { n: 6, label: 'Done', icon: Check },
]

export default function Checkout() {
  const { cart, addresses, clearCart, showToast, user } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedAddr, setSelectedAddr] = useState(addresses[0]?.id || '')
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('card')
  const [notes, setNotes] = useState('')
  const [guestInfo, setGuestInfo] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const [cardInfo, setCardInfo] = useState({ number: '', name: '', exp: '', cvc: '' })

  const activeCart = cart.filter(c => !c.savedForLater)
  const cartProducts = activeCart.map(item => ({ ...item, product: products.find(p => p.id === item.productId)! })).filter(c => c.product)
  const subtotal = cartProducts.reduce((s, c) => s + (c.product.dealPrice || c.product.price) * c.quantity, 0)
  const shippingCost = delivery === 'express' ? 19.99 : delivery === 'same-day' ? 29.99 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  if (cartProducts.length === 0 && step < 6) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl mb-2">Your cart is empty</h2>
        <p className="text-muted mb-6">Add items to your cart before checking out.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    )
  }

  const next = () => setStep(s => Math.min(6, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))

  const placeOrder = () => {
    clearCart()
    setStep(6)
    showToast('success', 'Order placed successfully!')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      {/* Step indicator */}
      {step < 6 && (
        <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar">
          {steps.slice(0, 5).map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center border-2 transition', step > s.n ? 'border-gold-400 bg-gold-400 text-ink-950' : step === s.n ? 'border-gold-400 text-gold-400' : 'border-base text-muted')}>
                  {step > s.n ? <Check className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={cn('text-[10px] font-medium whitespace-nowrap', step >= s.n ? 'text-foreground' : 'text-muted')}>{s.label}</span>
              </div>
              {i < 4 && <div className={cn('flex-1 h-0.5 mx-2 transition', step > s.n ? 'bg-gold-400' : 'bg-base')} />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 6 ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="font-display font-bold text-3xl mb-2">Order Confirmed! 🎉</h1>
            <p className="text-muted mb-1">Thank you for your purchase. Your order has been placed successfully.</p>
            <p className="text-sm text-gold-400 mb-8">Order #NC-ORD-2024-{Math.floor(Math.random() * 9000 + 1000)}</p>
            <div className="card p-6 max-w-md mx-auto text-left mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8 text-gold-400" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted">{new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <p className="text-sm text-muted">A confirmation email has been sent to {guestInfo.email}. You can track your order anytime.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link to="/orders" className="btn btn-primary"><Package className="w-4 h-4" /> Track Order</Link>
              <Link to="/products" className="btn btn-secondary">Continue Shopping</Link>
            </div>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Step 1: Information */}
              {step === 1 && (
                <div className="card p-6">
                  <h2 className="font-display font-bold text-xl mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div><label className="text-sm font-medium block mb-1">Full Name</label><input className="input" value={guestInfo.name} onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })} placeholder="John Doe" /></div>
                    <div><label className="text-sm font-medium block mb-1">Email</label><input type="email" className="input" value={guestInfo.email} onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })} placeholder="john@example.com" /></div>
                    <div><label className="text-sm font-medium block mb-1">Phone</label><input className="input" value={guestInfo.phone} onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })} placeholder="+1 (555) 123-4567" /></div>
                  </div>
                  <div className="mt-4 p-3 bg-elev rounded-lg text-xs text-muted flex items-center gap-2"><Shield className="w-4 h-4 text-gold-400" /> Your information is encrypted and never shared.</div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div className="card p-6">
                  <h2 className="font-display font-bold text-xl mb-4">Shipping Address</h2>
                  <div className="space-y-3">
                    {addresses.map(a => (
                      <label key={a.id} className={cn('card p-4 flex items-start gap-3 cursor-pointer transition', selectedAddr === a.id ? 'border-gold-400 bg-gold-500/5' : '')}>
                        <input type="radio" name="addr" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} className="accent-gold-400 mt-1" />
                        <div>
                          <div className="flex items-center gap-2"><span className="font-medium text-sm">{a.label}</span>{a.isDefault && <span className="badge bg-gold-500/20 text-gold-300">Default</span>}</div>
                          <p className="text-sm text-muted mt-1">{a.name}</p>
                          <p className="text-sm text-muted">{a.street}, {a.city}, {a.state} {a.zip}</p>
                          <p className="text-sm text-muted">{a.country} · {a.phone}</p>
                        </div>
                      </label>
                    ))}
                    <button className="btn btn-secondary w-full text-sm" onClick={() => showToast('info', 'Address form would open here')}>+ Add New Address</button>
                  </div>
                </div>
              )}

              {/* Step 3: Delivery */}
              {step === 3 && (
                <div className="card p-6">
                  <h2 className="font-display font-bold text-xl mb-4">Delivery Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'standard', label: 'Standard Shipping', desc: '3-5 business days', price: 0, icon: Truck },
                      { id: 'express', label: 'Express Shipping', desc: '1-2 business days', price: 19.99, icon: Truck },
                      { id: 'same-day', label: 'Same-Day Delivery', desc: 'Order before 2PM', price: 29.99, icon: Truck },
                    ].map(opt => (
                      <label key={opt.id} className={cn('card p-4 flex items-center gap-3 cursor-pointer transition', delivery === opt.id ? 'border-gold-400 bg-gold-500/5' : '')}>
                        <input type="radio" name="delivery" checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} className="accent-gold-400" />
                        <opt.icon className="w-5 h-5 text-gold-400" />
                        <div className="flex-1"><p className="font-medium text-sm">{opt.label}</p><p className="text-xs text-muted">{opt.desc}</p></div>
                        <span className="font-medium text-sm">{opt.price === 0 ? 'FREE' : formatPrice(opt.price)}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4"><label className="text-sm font-medium block mb-1">Order Notes (optional)</label><textarea className="input resize-none h-20" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Delivery instructions, gift message, etc." /></div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="card p-6">
                  <h2 className="font-display font-bold text-xl mb-4">Payment Method</h2>
                  <div className="space-y-3 mb-4">
                    {[
                      { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                      { id: 'paypal', label: 'PayPal', icon: CreditCard },
                      { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                    ].map(opt => (
                      <label key={opt.id} className={cn('card p-4 flex items-center gap-3 cursor-pointer transition', payment === opt.id ? 'border-gold-400 bg-gold-500/5' : '')}>
                        <input type="radio" name="payment" checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-gold-400" />
                        <opt.icon className="w-5 h-5 text-gold-400" />
                        <span className="font-medium text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {payment === 'card' && (
                    <div className="space-y-3">
                      <div><label className="text-sm font-medium block mb-1">Card Number</label><input className="input" value={cardInfo.number} onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })} placeholder="1234 5678 9012 3456" maxLength={19} /></div>
                      <div><label className="text-sm font-medium block mb-1">Name on Card</label><input className="input" value={cardInfo.name} onChange={e => setCardInfo({ ...cardInfo, name: e.target.value })} placeholder="John Doe" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-sm font-medium block mb-1">Expiry</label><input className="input" value={cardInfo.exp} onChange={e => setCardInfo({ ...cardInfo, exp: e.target.value })} placeholder="MM/YY" maxLength={5} /></div>
                        <div><label className="text-sm font-medium block mb-1">CVC</label><input className="input" value={cardInfo.cvc} onChange={e => setCardInfo({ ...cardInfo, cvc: e.target.value })} placeholder="123" maxLength={4} /></div>
                      </div>
                      <p className="text-xs text-muted flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gold-400" /> Card details are encrypted and never stored on our servers.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="card p-6">
                  <h2 className="font-display font-bold text-xl mb-4">Review Your Order</h2>
                  <div className="space-y-3 mb-4">
                    {cartProducts.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />
                        <div className="flex-1"><p className="text-sm font-medium">{product.title}</p><p className="text-xs text-muted">Qty: {quantity}</p></div>
                        <span className="font-medium text-sm">{formatPrice((product.dealPrice || product.price) * quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-base pt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted">Delivery</span><span>{delivery === 'standard' ? 'Standard (3-5 days)' : delivery === 'express' ? 'Express (1-2 days)' : 'Same-Day'}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Payment</span><span>{payment === 'card' ? 'Credit Card' : payment === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</span></div>
                    {notes && <div className="flex justify-between"><span className="text-muted">Notes</span><span className="text-right max-w-[200px]">{notes}</span></div>}
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-4">
                {step > 1 ? <Button variant="secondary" onClick={back}><ArrowLeft className="w-4 h-4" /> Back</Button> : <span />}
                {step < 5 ? <Button onClick={next}>Continue <ArrowRight className="w-4 h-4" /></Button> : <Button onClick={placeOrder}><Check className="w-4 h-4" /> Place Order</Button>}
              </div>
            </div>

            {/* Order summary sidebar */}
            <div>
              <div className="card p-5 sticky top-20">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {cartProducts.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-2 text-sm">
                      <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0"><p className="truncate text-xs">{product.title}</p><p className="text-xs text-muted">x{quantity}</p></div>
                      <span className="text-xs font-medium">{formatPrice((product.dealPrice || product.price) * quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm border-t border-base pt-3">
                  <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatPrice(tax)}</span></div>
                  <div className="flex justify-between font-display font-bold text-lg border-t border-base pt-2"><span>Total</span><span className="gradient-text">{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
