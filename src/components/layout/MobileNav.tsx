import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function MobileNav() {
  const { cartCount, wishlist } = useStore()
  const loc = useLocation()
  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlist.length },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { to: '/profile', icon: User, label: 'Profile' },
  ]
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-base">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(item => {
          const active = loc.pathname === item.to || (item.to !== '/' && loc.pathname.startsWith(item.to))
          return (
            <Link key={item.to} to={item.to} className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5">
              <item.icon className={cn('w-5 h-5 transition', active ? 'text-gold-400' : 'text-muted')} />
              <span className={cn('text-[10px] font-medium', active ? 'text-gold-400' : 'text-muted')}>{item.label}</span>
              {item.badge ? <span className="absolute top-0 right-1 w-4 h-4 bg-gold-400 text-ink-950 text-[9px] font-bold rounded-full flex items-center justify-center">{item.badge}</span> : null}
              {active && <motion.div layoutId="mobileNavIndicator" className="absolute -top-px h-0.5 w-8 rounded-full bg-gold-400" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
