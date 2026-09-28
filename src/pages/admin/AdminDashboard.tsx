import { Link } from 'react-router-dom'
import { Users, Store, Package, DollarSign, TrendingUp, AlertTriangle, ShoppingBag, Star, ArrowRight } from 'lucide-react'
import { products, stores, orders, users } from '@/data/mockData'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Common'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const platformData = [
  { month: 'Jan', revenue: 42000, orders: 320 }, { month: 'Feb', revenue: 51000, orders: 410 },
  { month: 'Mar', revenue: 48000, orders: 380 }, { month: 'Apr', revenue: 62000, orders: 520 },
  { month: 'May', revenue: 71000, orders: 610 }, { month: 'Jun', revenue: 82000, orders: 680 },
  { month: 'Jul', revenue: 91000, orders: 750 }, { month: 'Aug', revenue: 105000, orders: 820 },
  { month: 'Sep', revenue: 124000, orders: 950 },
]

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$1.24M', change: '+18.2%', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Total Users', value: '12,450', change: '+12.5%', icon: Users, color: 'text-blue-400' },
    { label: 'Active Sellers', value: stores.length, change: '+3', icon: Store, color: 'text-gold-400' },
    { label: 'Total Orders', value: '5,420', change: '+8.2%', icon: ShoppingBag, color: 'text-purple-400' },
  ]

  const pendingSellers = stores.filter(s => !s.verified)
  const recentUsers = users.slice(0, 5)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="font-display font-bold text-2xl">Admin Dashboard</h1><p className="text-muted text-sm">Platform overview & management</p></div>
        <Badge variant="gold">Admin Access — Server-side Authorized</Badge>
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

      {/* Revenue chart */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold mb-4">Platform Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={platformData}>
            <defs><linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4a82e" stopOpacity={0.3} /><stop offset="100%" stopColor="#d4a82e" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#d4a82e" strokeWidth={2} fill="url(#adminRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Pending seller applications */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Pending Seller Applications</h2>
            <Link to="/admin/sellers" className="text-sm text-gold-400 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {pendingSellers.length > 0 ? pendingSellers.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-elev">
                <img src={s.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1"><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted">{s.location}</p></div>
                <Badge variant="gold">Pending</Badge>
              </div>
            )) : <p className="text-sm text-muted py-4 text-center">No pending applications</p>}
          </div>
        </div>

        {/* Recent users */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-gold-400" /> Recent Users</h2>
            <Link to="/admin/users" className="text-sm text-gold-400 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-elev">
                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1"><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted">{u.email}</p></div>
                <Badge variant={u.role === 'admin' ? 'gold' : u.role === 'seller' ? 'blue' : 'default'} className="capitalize">{u.role}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { label: 'Manage Users', icon: Users, to: '/admin/users' },
          { label: 'Manage Sellers', icon: Store, to: '/admin/sellers' },
          { label: 'All Products', icon: Package, to: '/admin/products' },
          { label: 'All Orders', icon: ShoppingBag, to: '/admin/orders' },
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
