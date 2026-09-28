import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import {
  Search, Heart, ShoppingCart, Bell, User, Menu, X, ChevronDown,
  Store, Zap, Moon, Sun, Monitor, LogOut, Package, Settings, Sparkles,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { categories } from '@/data/mockData'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { user, cartCount, unreadCount, wishlist, theme, setTheme, setSearchQuery, logout, showToast } = useStore()
  const navigate = useNavigate()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [catMenu, setCatMenu] = useState(false)
  const [notifMenu, setNotifMenu] = useState(false)
  const [profileMenu, setProfileMenu] = useState(false)
  const [themeMenu, setThemeMenu] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const catRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifMenu(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileMenu(false)
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setThemeMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchVal)
    navigate(`/search?q=${encodeURIComponent(searchVal)}`)
    setMobileMenu(false)
  }

  const parentCats = categories.filter(c => c.parentId === null)
  const themeIcon = theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Monitor className="w-4 h-4" />

  return (
    <>
      {/* Top bar */}
      <div className="bg-ink-950 text-ink-400 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-gold-400" /> Free shipping on orders over $50 — Shop now!</span>
          <div className="flex items-center gap-4">
            <Link to="/seller" className="hover:text-gold-400 transition flex items-center gap-1"><Store className="w-3 h-3" /> Sell on NexaCart</Link>
            <Link to="/support" className="hover:text-gold-400 transition">Help & Support</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="glass sticky top-0 z-50 border-b border-base">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-display font-extrabold text-ink-950 text-lg">N</div>
              <span className="font-display font-extrabold text-xl hidden sm:block">Nexa<span className="gradient-text">Cart</span></span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex relative group">
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products, brands, stores..."
                className="input pl-11 pr-4 h-10"
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            </form>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              <div ref={catRef} className="relative">
                <button onClick={() => setCatMenu(!catMenu)} className="btn btn-ghost px-3 py-2 text-sm">
                  Categories <ChevronDown className={cn('w-4 h-4 transition', catMenu && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {catMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 card shadow-2xl p-2 z-50"
                    >
                      {parentCats.map(c => (
                        <div key={c.id} className="group/cat relative">
                          <Link to={`/category/${c.slug}`} onClick={() => setCatMenu(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ink-800 transition">
                            <span className="text-sm font-medium">{c.name}</span>
                            <span className="text-xs text-muted">{c.productCount}</span>
                          </Link>
                          <div className="hidden group-hover/cat:block absolute left-full top-0 w-48 card shadow-2xl p-2 ml-1">
                            {categories.filter(s => s.parentId === c.id).map(s => (
                              <Link key={s.id} to={`/category/${s.slug}`} onClick={() => setCatMenu(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-ink-800 text-sm transition">{s.name}</Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/products?filter=deals" className="btn btn-ghost px-3 py-2 text-sm flex items-center gap-1.5"><Zap className="w-4 h-4 text-gold-400" /> Deals</Link>
              <Link to="/stores" className="btn btn-ghost px-3 py-2 text-sm">Stores</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Theme */}
              <div ref={themeRef} className="relative">
                <button onClick={() => setThemeMenu(!themeMenu)} className="btn btn-ghost p-2.5" aria-label="Theme">
                  {themeIcon}
                </button>
                <AnimatePresence>
                  {themeMenu && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-40 card shadow-2xl p-2 z-50">
                      {[{ k: 'dark', l: 'Dark', i: <Moon className="w-4 h-4" /> }, { k: 'light', l: 'Light', i: <Sun className="w-4 h-4" /> }, { k: 'system', l: 'System', i: <Monitor className="w-4 h-4" /> }].map(o => (
                        <button key={o.k} onClick={() => { setTheme(o.k as 'dark' | 'light' | 'system'); setThemeMenu(false) }}
                          className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-ink-800 transition', theme === o.k && 'text-gold-400')}>
                          {o.i} {o.l}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <div ref={notifRef} className="relative hidden sm:block">
                <button onClick={() => setNotifMenu(!notifMenu)} className="btn btn-ghost p-2.5 relative" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-gold-400 text-ink-950 text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
                </button>
                <AnimatePresence>
                  {notifMenu && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-80 card shadow-2xl z-50 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b border-base flex items-center justify-between">
                        <span className="font-semibold text-sm">Notifications</span>
                        <Link to="/notifications" onClick={() => setNotifMenu(false)} className="text-xs text-gold-400 hover:underline">View all</Link>
                      </div>
                      <NotifPreview onClose={() => setNotifMenu(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="btn btn-ghost p-2.5 relative" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-gold-400 text-ink-950 text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="btn btn-ghost p-2.5 relative" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-gold-400 text-ink-950 text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
              </Link>

              {/* Profile */}
              <div ref={profileRef} className="relative hidden sm:block">
                <button onClick={() => setProfileMenu(!profileMenu)} className="btn btn-ghost p-1.5 gap-2">
                  <img src={user?.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <ChevronDown className={cn('w-3 h-3 transition', profileMenu && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {profileMenu && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-56 card shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-base mb-1">
                        <p className="font-semibold text-sm">{user?.name}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                        <span className="badge bg-gold-500/20 text-gold-300 mt-1">{user?.loyaltyTier} Member</span>
                      </div>
                      {[
                        { to: '/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
                        { to: '/orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
                        { to: '/rewards', label: 'Rewards & Points', icon: <Sparkles className="w-4 h-4" /> },
                        { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setProfileMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ink-800 text-sm transition">
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      {user?.role === 'seller' && (
                        <Link to="/seller" onClick={() => setProfileMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ink-800 text-sm transition">
                          <Store className="w-4 h-4" /> Seller Dashboard
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setProfileMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ink-800 text-sm transition">
                          <Settings className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <button onClick={() => { logout(); setProfileMenu(false); showToast('info', 'You have been logged out'); navigate('/') }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-ink-800 text-sm transition text-red-400">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileMenu(!mobileMenu)} className="btn btn-ghost p-2.5 lg:hidden" aria-label="Menu">
                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-base">
              <div className="px-4 py-4 space-y-3">
                <form onSubmit={handleSearch} className="relative">
                  <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search..." className="input pl-11 h-10" />
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                </form>
                <div className="grid grid-cols-2 gap-2">
                  {parentCats.map(c => (
                    <Link key={c.id} to={`/category/${c.slug}`} onClick={() => setMobileMenu(false)}
                      className="px-3 py-2 rounded-lg bg-elev text-sm hover:border-gold-500 border border-base transition">{c.name}</Link>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link to="/products?filter=deals" onClick={() => setMobileMenu(false)} className="btn btn-secondary flex-1 text-sm"><Zap className="w-4 h-4 text-gold-400" /> Deals</Link>
                  <Link to="/stores" onClick={() => setMobileMenu(false)} className="btn btn-secondary flex-1 text-sm">Stores</Link>
                </div>
                <div className="flex gap-2">
                  <Link to="/profile" onClick={() => setMobileMenu(false)} className="btn btn-secondary flex-1 text-sm">Profile</Link>
                  <Link to="/seller" onClick={() => setMobileMenu(false)} className="btn btn-secondary flex-1 text-sm">Sell</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

function NotifPreview({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useStore()
  return (
    <div>
      {notifications.slice(0, 5).map(n => (
        <Link key={n.id} to={n.link || '#'} onClick={() => { markNotificationRead(n.id); onClose() }}
          className={cn('block px-3 py-3 hover:bg-ink-800 transition border-b border-base', !n.read && 'bg-gold-500/5')}>
          <div className="flex items-start gap-2">
            {!n.read && <span className="w-2 h-2 rounded-full bg-gold-400 mt-1.5 shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{n.title}</p>
              <p className="text-xs text-muted line-clamp-2">{n.body}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
