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
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Badge variant="gold" className="mb-4"><Sparkles className="w-3 h-3" /> #1 Premium Marketplace</Badge>
              <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight mb-4">
                Shop the <span className="gradient-text">Future</span> of <br /> E-Commerce
              </h1>
              <p className="text-muted text-lg mb-8 max-w-md">Discover millions of products from trusted sellers worldwide. Premium quality, unbeatable prices, lightning-fast delivery.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-primary btn-lg"><ShoppingBag className="w-5 h-5" /> Start Shopping</Link>
                <Link to="/stores" className="btn btn-secondary btn-lg"><StoreIcon className="w-5 h-5" /> Browse Stores</Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {[['2M+', 'Products'], ['50K+', 'Sellers'], ['10M+', 'Customers'], ['4.8★', 'Rating']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display font-bold text-2xl gradient-text">{n}</p>
                    <p className="text-xs text-muted">{l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Hero showcase */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((p, i) => (
                  <motion.div key={p.id}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    className={`card overflow-hidden ${i % 2 === 1 ? 'mt-8' : ''}`}>
                    <Link to={`/product/${p.id}`}>
                      <img src={p.images[0]} alt={p.title} className="w-full aspect-square object-cover" />
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{p.title}</p>
                        <p className="text-sm font-bold gradient-text">{formatPrice(p.dealPrice || p.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="Shop by Category" subtitle="Browse our curated categories" to="/products" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mt-6">
          {parentCats.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 0.05}>
              <Link to={`/category/${c.slug}`} className="card card-hover flex flex-col items-center gap-2 p-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-ink-800 overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium">{c.name}</p>
                <p className="text-[10px] text-muted">{c.productCount} items</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <FlashSaleBanner products={flashDeals} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            {flashDeals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* PROMOTIONS BANNER */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4">
          {promotions.map((promo, i) => {
            const { days, hours } = useCountdown(promo.endsAt)
            return (
              <ScrollReveal key={promo.id} delay={i * 0.1}>
                <Link to="/products?filter=deals" className="card card-hover relative overflow-hidden block group">
                  <div className="absolute inset-0">
                    <img src={promo.image} alt={promo.title} className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent" />
                  </div>
                  <div className="relative p-6 min-h-[180px] flex flex-col justify-end">
                    <Badge variant="gold" className="mb-2 self-start"><Zap className="w-3 h-3" /> {promo.type.replace('_', ' ').toUpperCase()}</Badge>
                    <h3 className="font-display font-bold text-xl mb-1">{promo.title}</h3>
                    <p className="text-sm text-muted mb-3">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gold-400">Ends in {days}d {hours}h</span>
                      <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* TRENDING */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="Trending Now" subtitle="What everyone's talking about" icon={<TrendingUp className="w-5 h-5 text-gold-400" />} to="/products?filter=trending" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="Best Sellers" subtitle="Top-rated customer favorites" icon={<Award className="w-5 h-5 text-gold-400" />} to="/products?filter=best" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* POPULAR STORES */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="Popular Stores" subtitle="Shop from trusted sellers" icon={<StoreIcon className="w-5 h-5 text-gold-400" />} to="/stores" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {topStores.map((s, i) => (
            <ScrollReveal key={s.id} delay={i * 0.05}>
              <Link to={`/store/${s.id}`} className="card card-hover overflow-hidden block">
                <div className="h-20 bg-ink-800 relative">
                  <img src={s.banner} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 -mt-8 relative">
                  <img src={s.logo} alt={s.name} className="w-14 h-14 rounded-xl border-2 border-card object-cover mb-2" />
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    {s.verified && <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                    <span className="text-xs">{s.rating}</span>
                    <span className="text-xs text-muted">· {s.productCount} products</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="New Arrivals" subtitle="Fresh products just landed" icon={<Sparkles className="w-5 h-5 text-gold-400" />} to="/products?filter=new" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* POPULAR BRANDS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="Popular Brands" subtitle="Shop your favorite brands" />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mt-6">
          {topBrands.map((b, i) => (
            <ScrollReveal key={b.id} delay={i * 0.03}>
              <Link to={`/products?brand=${b.name}`} className="card card-hover flex flex-col items-center gap-2 p-4">
                <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-xl object-cover" />
                <p className="text-xs font-medium text-center">{b.name}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SELLER SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="card relative overflow-hidden p-8 md:p-12 bg-gradient-to-br from-ink-900 to-ink-950">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px]" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="gold" className="mb-3"><StoreIcon className="w-3 h-3" /> Seller Spotlight</Badge>
              <h2 className="font-display font-bold text-3xl mb-3">Become a NexaCart Seller</h2>
              <p className="text-muted mb-6">Join 50,000+ sellers growing their business on NexaCart. Reach millions of customers with powerful tools, analytics, and support.</p>
              <div className="flex gap-3">
                <Link to="/seller" className="btn btn-primary"><StoreIcon className="w-4 h-4" /> Start Selling</Link>
                <Link to="/stores" className="btn btn-secondary">Explore Stores</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['$2.4B+', 'Seller Revenue'], ['50K+', 'Active Sellers'], ['4.8★', 'Avg Rating'], ['24/7', 'Support']].map(([n, l]) => (
                <div key={l} className="card p-4 text-center">
                  <p className="font-display font-bold text-2xl gradient-text">{n}</p>
                  <p className="text-xs text-muted">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title="What Customers Say" subtitle="Real reviews from real shoppers" icon={<Star className="w-5 h-5 text-gold-400" />} />
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {featuredReviews.map((r, i) => (
            <ScrollReveal key={r.id} delay={i * 0.1}>
              <div className="card p-5">
                <Rating value={r.rating} size="md" />
                <p className="text-sm mt-3 mb-4 line-clamp-3">"{r.body}"</p>
                <div className="flex items-center gap-2">
                  <img src={r.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium">{r.userName}</p>
                    <p className="text-xs text-muted">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Shield className="w-8 h-8" />, title: 'Buyer Protection', desc: 'Full refund if item doesn\'t arrive' },
            { icon: <Truck className="w-8 h-8" />, title: 'Fast & Free Shipping', desc: 'Free on orders over $50' },
            { icon: <Award className="w-8 h-8" />, title: 'Quality Guaranteed', desc: 'Verified sellers only' },
            { icon: <Sparkles className="w-8 h-8" />, title: 'Rewards Program', desc: 'Earn points on every purchase' },
          ].map((t, i) => (
            <ScrollReveal key={t.title} delay={i * 0.05}>
              <div className="card p-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto mb-3">{t.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{t.title}</h3>
                <p className="text-xs text-muted">{t.desc}</p>
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
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-display font-bold text-2xl md:text-3xl">{title}</h2>
        </div>
        {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="text-sm text-gold-400 hover:underline flex items-center gap-1 shrink-0">
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
    <div className="card relative overflow-hidden p-6 bg-gradient-to-r from-red-950/40 via-ink-900 to-ink-950">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />
      <div className="relative flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl">⚡ Flash Sale</h2>
            <p className="text-sm text-muted">Limited time deals — up to 40% off!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[['Days', days], ['Hours', hours], ['Mins', mins], ['Secs', secs]].map(([l, v]) => (
            <div key={l} className="card px-3 py-2 text-center min-w-[56px]">
              <p className="font-display font-bold text-xl text-gold-400 tabular-nums">{String(v).padStart(2, '0')}</p>
              <p className="text-[10px] text-muted">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
