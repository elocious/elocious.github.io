import { Link, useLocation, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Boxes, BarChart3, Settings,
  Store, ChevronRight, Menu, X, Bell, Search,
} from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const sellerNav = [
  { to: '/seller', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/seller/products', label: 'Products', icon: Package },
  { to: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/seller/inventory', label: 'Inventory', icon: Boxes },
  { to: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/seller/settings', label: 'Settings', icon: Settings },
]

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: ShoppingBag },
  { to: '/admin/sellers', label: 'Sellers', icon: Store },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Boxes },
  { to: '/admin/reviews', label: 'Reviews', icon: BarChart3 },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ type }: { type: 'seller' | 'admin' }) {
  const loc = useLocation()
  const { user, unreadCount } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const nav = type === 'seller' ? sellerNav : adminNav
  const title = type === 'seller' ? 'Seller Center' : 'Admin Panel'

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-950 border-r border-base z-40 transition-transform',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-4 border-b border-base">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-display font-extrabold text-ink-950 text-lg">N</div>
            <div>
              <p className="font-display font-bold text-sm">NexaCart</p>
              <p className="text-xs text-gold-400">{title}</p>
            </div>
          </Link>
        </div>
        <nav className="p-2 space-y-1">
          {nav.map(item => {
            const active = loc.pathname === item.to
            return (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition', active ? 'bg-gold-500/10 text-gold-400' : 'text-ink-400 hover:bg-ink-800 hover:text-foreground')}>
                <item.icon className="w-4 h-4" /> {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted hover:text-gold-400 transition">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="glass sticky top-0 z-20 border-b border-base">
          <div className="flex items-center gap-3 px-4 h-14">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden btn btn-ghost p-2">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative flex-1 max-w-md hidden md:block">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input placeholder="Search..." className="input pl-10 h-9 text-sm" />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Link to="/notifications" className="btn btn-ghost p-2 relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-gold-400 text-ink-950 text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
              </Link>
              <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
