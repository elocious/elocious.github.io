import { useState } from 'react'
import { TrendingUp, DollarSign, ShoppingBag, Star, Users } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Badge } from '@/components/ui/Common'
import { motion } from 'framer-motion'

const revenueData = [
  { month: 'Jan', revenue: 4200, orders: 32 }, { month: 'Feb', revenue: 5100, orders: 41 },
  { month: 'Mar', revenue: 4800, orders: 38 }, { month: 'Apr', revenue: 6200, orders: 52 },
  { month: 'May', revenue: 7100, orders: 61 }, { month: 'Jun', revenue: 8200, orders: 68 },
  { month: 'Jul', revenue: 9100, orders: 75 }, { month: 'Aug', revenue: 10500, orders: 82 },
  { month: 'Sep', revenue: 12400, orders: 95 },
]

const categoryData = [
  { name: 'Electronics', value: 45, color: '#d4a82e' },
  { name: 'Fashion', value: 25, color: '#3b82f6' },
  { name: 'Home', value: 15, color: '#10b981' },
  { name: 'Other', value: 15, color: '#8b5cf6' },
]

const topProducts = [
  { name: 'AuraPhone Pro Max', sales: 842, revenue: 924158 },
  { name: 'AuraBuds Pro ANC', sales: 670, revenue: 133330 },
  { name: 'Lumina UltraBook', sales: 456, revenue: 866064 },
  { name: 'PulseFit Pro Watch', sales: 560, revenue: 167440 },
  { name: 'GlowLab Vitamin C', sales: 3200, revenue: 124800 },
]

export default function SellerAnalytics() {
  const [range, setRange] = useState('30d')

  const stats = [
    { label: 'Revenue', value: '$24,580', change: '+12.5%', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Orders', value: '542', change: '+8.2%', icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Conversion', value: '3.2%', change: '+0.5%', icon: TrendingUp, color: 'text-gold-400' },
    { label: 'Customers', value: '1,240', change: '+15.3%', icon: Users, color: 'text-purple-400' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="font-display font-bold text-2xl">Analytics</h1><p className="text-muted text-sm">Track your store performance</p></div>
        <div className="flex gap-1">
          {['7d', '30d', '3m', '12m'].map(t => (
            <button key={t} onClick={() => setRange(t)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${range === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
        </div>
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
        <h2 className="font-semibold mb-4">Revenue Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4a82e" stopOpacity={0.3} /><stop offset="100%" stopColor="#d4a82e" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#d4a82e" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Orders chart */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Orders per Month</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
              <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label>
                {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {categoryData.map(c => <div key={c.name} className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full" style={{ background: c.color }} /> {c.name}</div>)}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Top Performing Products</h2>
        <div className="space-y-2">
          {topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-elev transition">
              <span className="w-6 h-6 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <div className="flex-1"><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted">{p.sales} sold</p></div>
              <span className="text-sm font-medium">${p.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
