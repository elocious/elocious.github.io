import { useState } from 'react'
import { DollarSign, Users, Store, Package, TrendingUp } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Badge } from '@/components/ui/Common'
import { motion } from 'framer-motion'

const data = [
  { month: 'Jan', revenue: 42000, orders: 320, users: 450 },
  { month: 'Feb', revenue: 51000, orders: 410, users: 520 },
  { month: 'Mar', revenue: 48000, orders: 380, users: 480 },
  { month: 'Apr', revenue: 62000, orders: 520, users: 610 },
  { month: 'May', revenue: 71000, orders: 610, users: 720 },
  { month: 'Jun', revenue: 82000, orders: 680, users: 810 },
  { month: 'Jul', revenue: 91000, orders: 750, users: 920 },
  { month: 'Aug', revenue: 105000, orders: 820, users: 1050 },
  { month: 'Sep', revenue: 124000, orders: 950, users: 1240 },
]

const categoryDist = [
  { name: 'Electronics', value: 35, color: '#d4a82e' },
  { name: 'Fashion', value: 28, color: '#3b82f6' },
  { name: 'Home', value: 18, color: '#10b981' },
  { name: 'Sports', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 7, color: '#8b5cf6' },
]

export default function AdminAnalytics() {
  const [range, setRange] = useState('30d')

  const stats = [
    { label: 'Gross Revenue', value: '$1.24M', change: '+18.2%', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Active Users', value: '12,450', change: '+12.5%', icon: Users, color: 'text-blue-400' },
    { label: 'Sellers', value: '50K+', change: '+3.2%', icon: Store, color: 'text-gold-400' },
    { label: 'Products', value: '2M+', change: '+8.1%', icon: Package, color: 'text-purple-400' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="font-display font-bold text-2xl">Platform Analytics</h1><p className="text-muted text-sm">Comprehensive platform insights</p></div>
        <div className="flex gap-1">
          {['7d', '30d', '3m', '12m'].map(t => (
            <button key={t} onClick={() => setRange(t)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${range === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
        </div>
      </div>

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

      <div className="card p-5 mb-6">
        <h2 className="font-semibold mb-4">Revenue & Orders</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs><linearGradient id="aRev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4a82e" stopOpacity={0.3} /><stop offset="100%" stopColor="#d4a82e" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#d4a82e" strokeWidth={2} fill="url(#aRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label>
                {categoryDist.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {categoryDist.map(c => <div key={c.name} className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full" style={{ background: c.color }} /> {c.name}</div>)}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-4">Orders per Month</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }} />
            <Bar dataKey="orders" fill="#d4a82e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
