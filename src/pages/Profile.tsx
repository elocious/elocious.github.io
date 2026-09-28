import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, Package, Heart, Star, MapPin, CreditCard, Bell, Shield,
  Sparkles, Settings, ChevronRight, Award, TrendingUp,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { orders, reviews } from '@/data/mockData'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Common'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function Profile() {
  const { user, wishlist } = useStore()
  if (!user) return null

  const stats = [
    { label: 'Orders', value: orders.length, icon: Package, to: '/orders' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, to: '/wishlist' },
    { label: 'Reviews', value: reviews.filter(r => r.userId === user.id).length, icon: Star, to: '/profile' },
    { label: 'Points', value: user.points, icon: Sparkles, to: '/rewards' },
  ]

  const menu = [
    { label: 'Personal Information', icon: User, to: '/settings', desc: 'Name, email, phone' },
    { label: 'My Orders', icon: Package, to: '/orders', desc: 'Track, return, buy again' },
    { label: 'Addresses', icon: MapPin, to: '/settings', desc: 'Manage shipping addresses' },
    { label: 'Payment Methods', icon: CreditCard, to: '/settings', desc: 'Cards & wallets' },
    { label: 'Wishlist', icon: Heart, to: '/wishlist', desc: 'Saved items & collections' },
    { label: 'Rewards & Loyalty', icon: Award, to: '/rewards', desc: 'Points & benefits' },
    { label: 'Notifications', icon: Bell, to: '/notifications', desc: 'Alerts & preferences' },
    { label: 'Security', icon: Shield, to: '/settings', desc: 'Password & 2FA' },
    { label: 'Settings', icon: Settings, to: '/settings', desc: 'Privacy & preferences' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Profile' }]} />

      {/* Profile header */}
      <div className="card relative overflow-hidden p-6 mb-6 bg-gradient-to-br from-ink-900 to-ink-950">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px]" />
        <div className="relative flex items-center gap-4 flex-wrap">
          <img src={user.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-gold-400" />
          <div className="flex-1">
            <h1 className="font-display font-bold text-2xl">{user.name}</h1>
            <p className="text-muted text-sm">@{user.username} · {user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="gold"><Award className="w-3 h-3" /> {user.loyaltyTier} Member</Badge>
              <Badge variant="green"><Sparkles className="w-3 h-3" /> {user.points} points</Badge>
              <span className="text-xs text-muted">Member since {formatDate(user.joinedAt)}</span>
            </div>
          </div>
          <Link to="/settings" className="btn btn-secondary"><Settings className="w-4 h-4" /> Edit Profile</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.05}>
            <Link to={s.to} className="card card-hover p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center"><s.icon className="w-5 h-5" /></div>
              <div><p className="font-display font-bold text-xl">{s.value}</p><p className="text-xs text-muted">{s.label}</p></div>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {/* Recent orders preview */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-gold-400 hover:underline">View all</Link>
        </div>
        <div className="space-y-2">
          {orders.slice(0, 2).map(o => (
            <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-elev transition">
              <div className="flex -space-x-2">
                {o.items.slice(0, 3).map(item => <img key={item.productId} src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-card" />)}
              </div>
              <div className="flex-1"><p className="text-sm font-medium">{o.id}</p><p className="text-xs text-muted">{formatDate(o.createdAt)} · {formatPrice(o.total)}</p></div>
              <Badge variant={o.status === 'delivered' ? 'green' : 'blue'} className="capitalize">{o.status.replace(/_/g, ' ')}</Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="card p-2">
        {menu.map((item, i) => (
          <Link key={i} to={item.to} className="flex items-center gap-3 p-3 rounded-lg hover:bg-elev transition">
            <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center text-gold-400"><item.icon className="w-5 h-5" /></div>
            <div className="flex-1"><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted">{item.desc}</p></div>
            <ChevronRight className="w-4 h-4 text-muted" />
          </Link>
        ))}
      </div>
    </div>
  )
}
