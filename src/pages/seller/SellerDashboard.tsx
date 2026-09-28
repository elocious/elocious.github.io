import { Link } from 'react-router-dom'
import { DollarSign, Package, ShoppingBag, Star, TrendingUp, ArrowRight, Plus, Eye } from 'lucide-react'
import { products, orders, stores } from '@/data/mockData'
import { formatPrice } from '@/lib/utils'
import { Badge, Skeleton } from '@/components/ui/Common'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'

export default function SellerDashboard() {
  const { user } = useStore()
  const store = stores.find(s => s.sellerId === user?.id) || stores[0]
  const myProducts = products.filter(p => p.storeId === store.id)
  const myOrders = orders

  const stats = [
    { label: 'Revenue', value: '$24,580', change: '+12.5%', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Orders', value: myOrders.length, change: '+8.2%', icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Products', value: myProducts.length, change: '+3', icon: Package, color: 'text-gold-400' },
    { label: 'Avg Rating', value: store.rating, change: '+0.1', icon: Star, color: 'text-purple-400' },
  ]

  const recentOrders = myOrders.slice(0, 5)
  const topProducts = [...myProducts].sort((a, b) => b.sold - a.sold).slice(0, 5)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted text-sm">Here's what's happening with {store.name}</p>
        </div>
        <Link to="/seller/products"><Button><Plus className="w-4 h-4" /> Add Product</Button></Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <Badge variant="green">{s.change}</Badge>
            </div>
            <p className="font-display font-bold text-2xl">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link to="/seller/orders" className="text-sm text-gold-400 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-elev transition">
                <div className="flex -space-x-2">
                  {o.items.slice(0, 2).map(item => <img key={item.productId} src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-card" />)}
                </div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{o.id}</p><p className="text-xs text-muted">{o.items.length} items · {formatPrice(o.total)}</p></div>
                <Badge variant={o.status === 'delivered' ? 'green' : 'blue'} className="capitalize text-xs">{o.status.replace(/_/g, ' ')}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Top Products</h2>
            <Link to="/seller/products" className="text-sm text-gold-400 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {topProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-elev transition">
                <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.title}</p><p className="text-xs text-muted">{p.sold} sold · {formatPrice(p.price)}</p></div>
                <div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 text-gold-400 fill-gold-400" /> {p.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { label: 'Add Product', icon: Plus, to: '/seller/products' },
          { label: 'View Orders', icon: ShoppingBag, to: '/seller/orders' },
          { label: 'Inventory', icon: Package, to: '/seller/inventory' },
          { label: 'Analytics', icon: TrendingUp, to: '/seller/analytics' },
        ].map(a => (
          <Link key={a.label} to={a.to} className="card card-hover p-4 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center"><a.icon className="w-5 h-5" /></div>
            <span className="text-sm font-medium">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
