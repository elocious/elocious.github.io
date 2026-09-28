import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Zap, TrendingUp, Star, Store as StoreIcon, ShoppingBag,
  Sparkles, Shield, Truck, Award, ChevronRight,
} from 'lucide-react'
import { products, categories, stores, brands, promotions, reviews } from '@/data/mockData'
import ProductCard from '@/components/product/ProductCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { useCountdown, formatPrice } from '@/lib/utils'
import { Badge, Rating } from '@/components/ui/Common'
import { useStore } from '@/lib/store'
import { useState } from 'react'

export default function Home() {
  const trending = products.filter(p => p.trending).slice(0, 8)
  const bestSellers = products.filter(p => p.bestSeller).slice(0, 4)
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4)
  const flashDeals = products.filter(p => p.flashSale).slice(0, 6)
  const parentCats = categories.filter(c => c.parentId === null)
  const topStores = stores.slice(0, 4)
  const topBrands = brands.slice(0, 8)
  const featuredReviews = reviews.slice(0, 3)

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gold-500/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-xs font-semibold text-gold-300">#1 Premium Marketplace</span>
              </div>
              <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] mb-6 tracking-tight">
                Shop the <span className="gradient-text">Future</span><br /> of E-Commerce
              </h1>
              <p className="text-muted text-lg mb-10 max-w-lg leading-relaxed">Discover millions of products from trusted sellers worldwide. Premium quality, unbeatable prices, lightning-fast delivery.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn btn-primary btn-lg text-base px-8 py-3.5"><ShoppingBag className="w-5 h-5" /> Start Shopping</Link>
                <Link to="/stores" className="btn btn-secondary btn-lg text-base px-8 py-3.5"><StoreIcon className="w-5 h-5" /> Browse Stores</Link>
              </div>
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-base">
                {[['2M+', 'Products'], ['50K+', 'Sellers'], ['10M+', 'Customers'], ['4.8★', 'Rating']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display font-bold text-3xl gradient-text">{n}</p>
                    <p className="text-xs text-muted mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Hero showcase */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-5">
                {products.slice(0, 4).map((p, i) => (
                  <motion.div key={p.id}
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    className={`card overflow-hidden shadow-2xl ${i % 2 === 1 ? 'mt-10' : ''}`}>
                    <Link to={`/product/${p.id}`}>
                      <img src={p.images[0]} alt={p.title} className="w-full aspect-square object-cover" />
                      <div className="p-3">
                        <p className="text-xs font-medium truncate">{p.title}</p>
                        <p className="text-base font-bold gradient-text mt-0.5">{formatPrice(p.dealPrice || p.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="absolute -bottom-6 -left-6 card px-4 py-3 flex items-center gap-3 shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Buyer Protection</p>
                  <p className="text-xs text-muted">100% Secure</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-base bg-elev/50">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Shield className="w-5 h-5" />, title: 'Buyer Protection', desc: 'Full refund guarantee' },
              { icon: <Truck className="w-5 h-5" />, title: 'Fast & Free Shipping', desc: 'On orders over $50' },
              { icon: <Award className="w-5 h-5" />, title: 'Quality Guaranteed', desc: 'Verified sellers only' },
              { icon: <Sparkles className="w-5 h-5" />, title: 'Rewards Program', desc: 'Earn on every order' },
            ].map((t) => (
              <div key={t.title} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">{t.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm">{t.title}</h3>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <SectionHeader title="Shop by Category" subtitle="Browse our curated categories" to="/products" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-8">
          {parentCats.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 0.05}>
              <Link to={`/category/${c.slug}`} className="card card-hover flex flex-col items-center gap-3 p-5 text-center group">
                <div className="w-16 h-16 rounded-2xl bg-ink-800 overflow-hidden ring-1 ring-base group-hover:ring-gold-500/30 transition">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold">{c.name}</p>
                  <p className="text-[10px] text-muted mt-0.5">{c.productCount} items</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <FlashSaleBanner products={flashDeals} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {flashDeals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* PROMOTIONS BANNER */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-5">
          {promotions.map((promo, i) => {
            const { days, hours } = useCountdown(promo.endsAt)
            return (
              <ScrollReveal key={promo.id} delay={i * 0.1}>
                <Link to="/products?filter=deals" className="card card-hover relative overflow-hidden block group min-h-[220px]">
                  <div className="absolute inset-0">
                    <img src={promo.image} alt={promo.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />
                  </div>
                  <div className="relative p-7 min-h-[220px] flex flex-col justify-end">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/20 mb-3 self-start">
                      <Zap className="w-3 h-3 text-gold-400" />
                      <span className="text-[10px] font-bold text-gold-300 uppercase tracking-wide">{promo.type.replace('_', ' ')}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-2">{promo.title}</h3>
                    <p className="text-sm text-muted mb-4">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gold-400">Ends in {days}d {hours}h</span>
                      <ArrowRight className="w-5 h-5 text-gold-400 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* TRENDING */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <SectionHeader title="Trending Now" subtitle="What everyone's talking about" icon={<TrendingUp className="w-5 h-5 text-gold-400" />} to="/products?filter=trending" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <SectionHeader title="Best Sellers" subtitle="Top-rated customer favorites" icon={<Award className="w-5 h-5 text-gold-400" />} to="/products?filter=best" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* POPULAR STORES */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <SectionHeader title="Popular Stores" subtitle="Shop from trusted sellers" icon={<StoreIcon className="w-5 h-5 text-gold-400" />} to="/stores" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
          {topStores.map((s, i) => (
            <ScrollReveal key={s.id} delay={i * 0.05}>
              <Link to={`/store/${s.id}`} className="card card-hover overflow-hidden block group">
                <div className="h-24 bg-ink-800 relative overflow-hidden">
                  <img src={s.banner} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 -mt-10 relative">
                  <img src={s.logo} alt={s.name} className="w-16 h-16 rounded-2xl border-2 border-card object-cover mb-3 shadow-lg" />
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    {s.verified && <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                    <span className="text-xs font-medium">{s.rating}</span>
                    <span className="text-xs text-muted">· {s.productCount} products</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <SectionHeader title="New Arrivals" subtitle="Fresh products just landed" icon={<Sparkles className="w-5 h-5 text-gold-400" />} to="/products?filter=new" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* POPULAR BRANDS */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <SectionHeader title="Popular Brands" subtitle="Shop your favorite brands" />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mt-8">
          {topBrands.map((b, i) => (
            <ScrollReveal key={b.id} delay={i * 0.03}>
              <Link to={`/products?brand=${b.name}`} className="card card-hover flex flex-col items-center gap-3 p-5 group">
                <img src={b.logo} alt={b.name} className="w-14 h-14 rounded-2xl object-cover group-hover:scale-110 transition-transform duration-300" />
                <p className="text-xs font-medium text-center">{b.name}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SELLER SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="card relative overflow-hidden p-10 md:p-16 bg-gradient-to-br from-ink-900 to-ink-950">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-5">
                <StoreIcon className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-xs font-semibold text-gold-300">Seller Spotlight</span>
              </div>
              <h2 className="font-display font-bold text-4xl mb-4 leading-tight">Become a NexaCart Seller</h2>
              <p className="text-muted mb-8 text-lg leading-relaxed max-w-md">Join 50,000+ sellers growing their business on NexaCart. Reach millions of customers with powerful tools, analytics, and support.</p>
              <div className="flex gap-4">
                <Link to="/seller" className="btn btn-primary btn-lg"><StoreIcon className="w-4 h-4" /> Start Selling</Link>
                <Link to="/stores" className="btn btn-secondary btn-lg">Explore Stores</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[['$2.4B+', 'Seller Revenue'], ['50K+', 'Active Sellers'], ['4.8★', 'Avg Rating'], ['24/7', 'Support']].map(([n, l]) => (
                <div key={l} className="card p-6 text-center">
                  <p className="font-display font-bold text-3xl gradient-text">{n}</p>
                  <p className="text-sm text-muted mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <SectionHeader title="What Customers Say" subtitle="Real reviews from real shoppers" icon={<Star className="w-5 h-5 text-gold-400" />} />
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {featuredReviews.map((r, i) => (
            <ScrollReveal key={r.id} delay={i * 0.1}>
              <div className="card p-6 h-full flex flex-col">
                <Rating value={r.rating} size="md" />
                <p className="text-sm mt-4 mb-5 line-clamp-3 flex-1 leading-relaxed">"{r.body}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-base">
                  <img src={r.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{r.userName}</p>
                    <p className="text-xs text-muted">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ title, subtitle, icon, to }: { title: string; subtitle?: string; icon?: React.ReactNode; to?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          {icon}
          <h2 className="font-display font-bold text-2xl md:text-3xl">{title}</h2>
        </div>
        {subtitle && <p className="text-muted text-sm mt-1.5">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="text-sm text-gold-400 hover:underline flex items-center gap-1 shrink-0 font-medium">
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

function FlashSaleBanner({ products }: { products: typeof import('@/data/mockData').products }) {
  const first = products[0]
  const { days, hours, mins, secs } = useCountdown(first?.dealEndsAt || new Date(Date.now() + 86400000 * 2).toISOString())
  return (
    <div className="card relative overflow-hidden p-7 bg-gradient-to-r from-red-950/50 via-ink-900 to-ink-950 border-red-500/20">
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/15 rounded-full blur-[100px]" />
      <div className="relative flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center ring-1 ring-red-500/30">
            <Zap className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl">⚡ Flash Sale</h2>
            <p className="text-sm text-muted mt-0.5">Limited time deals — up to 40% off!</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {[['Days', days], ['Hours', hours], ['Mins', mins], ['Secs', secs]].map(([l, v]) => (
            <div key={l} className="card px-4 py-3 text-center min-w-[64px] bg-ink-950/50">
              <p className="font-display font-bold text-2xl text-gold-400 tabular-nums">{String(v).padStart(2, '0')}</p>
              <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wide">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
