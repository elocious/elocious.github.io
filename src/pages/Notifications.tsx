import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Truck, Zap, TrendingDown, Bell, MessageCircle, Shield, Sparkles,
  CheckCheck, Settings,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { timeAgo } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Common'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { cn } from '@/lib/utils'

const typeIcons: Record<string, { icon: typeof Package; color: string }> = {
  order: { icon: Package, color: 'text-blue-400 bg-blue-500/10' },
  shipping: { icon: Truck, color: 'text-purple-400 bg-purple-500/10' },
  delivery: { icon: Package, color: 'text-emerald-400 bg-emerald-500/10' },
  promotion: { icon: Zap, color: 'text-gold-400 bg-gold-500/10' },
  price_drop: { icon: TrendingDown, color: 'text-red-400 bg-red-500/10' },
  back_in_stock: { icon: Bell, color: 'text-cyan-400 bg-cyan-500/10' },
  message: { icon: MessageCircle, color: 'text-blue-400 bg-blue-500/10' },
  security: { icon: Shield, color: 'text-red-400 bg-red-500/10' },
  reward: { icon: Sparkles, color: 'text-gold-400 bg-gold-500/10' },
}

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useStore()

  if (notifications.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]} />
        <EmptyState icon={<Bell className="w-8 h-8 text-muted" />} title="No notifications" message="You're all caught up!" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Notifications</h1>
          <p className="text-muted text-sm mt-1">{unreadCount} unread</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && <Button variant="secondary" size="sm" onClick={markAllRead}><CheckCheck className="w-4 h-4" /> Mark all read</Button>}
          <Link to="/settings" className="btn btn-secondary p-2.5"><Settings className="w-4 h-4" /></Link>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {notifications.map(n => {
            const config = typeIcons[n.type] || typeIcons.order
            return (
              <motion.div key={n.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={cn('card p-4 flex items-start gap-3 transition', !n.read && 'bg-gold-500/5 border-gold-500/20')}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', config.color)}>
                  <config.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                  </div>
                  <p className="text-sm text-muted mt-0.5">{n.body}</p>
                  <p className="text-xs text-muted mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {n.link && (
                  <Link to={n.link} onClick={() => markNotificationRead(n.id)} className="text-gold-400 hover:underline text-sm shrink-0">View</Link>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
