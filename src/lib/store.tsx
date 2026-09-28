import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { CartItem, User, Notification, WishlistItem, Address } from '@/types'
import { currentUser, notifications as initialNotifications, addresses as initialAddresses } from '@/data/mockData'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface StoreCtx {
  // auth
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: { name: string; username: string; email: string; password: string; accountType: 'customer' | 'seller' }) => Promise<boolean>
  logout: () => void
  // theme
  theme: 'dark' | 'light' | 'system'
  setTheme: (t: 'dark' | 'light' | 'system') => void
  // cart
  cart: CartItem[]
  addToCart: (productId: string, quantity?: number, variant?: Record<string, string>) => void
  removeFromCart: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  saveForLater: (productId: string) => void
  moveToCart: (productId: string) => void
  clearCart: () => void
  cartCount: number
  // wishlist
  wishlist: WishlistItem[]
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  // notifications
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  markAllRead: () => void
  unreadCount: number
  // addresses
  addresses: Address[]
  addAddress: (a: Omit<Address, 'id'>) => void
  removeAddress: (id: string) => void
  // toasts
  toasts: Toast[]
  showToast: (type: Toast['type'], message: string) => void
  dismissToast: (id: string) => void
  // search
  searchQuery: string
  setSearchQuery: (q: string) => void
}

const Ctx = createContext<StoreCtx | null>(null)
export const useStore = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStore must be used within StoreProvider')
  return c
}

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load('nc_user', currentUser))
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(() => load('nc_theme', 'dark'))
  const [cart, setCart] = useState<CartItem[]>(() => load('nc_cart', []))
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => load('nc_wishlist', [
    { productId: 'p2', addedAt: '2024-09-20', collection: 'Default' },
    { productId: 'p12', addedAt: '2024-09-22', collection: 'Default' },
  ]))
  const [notifications, setNotifications] = useState<Notification[]>(() => load('nc_notifications', initialNotifications))
  const [addresses, setAddresses] = useState<Address[]>(() => load('nc_addresses', initialAddresses))
  const [toasts, setToasts] = useState<Toast[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // persist
  useEffect(() => save('nc_user', user), [user])
  useEffect(() => save('nc_cart', cart), [cart])
  useEffect(() => save('nc_wishlist', wishlist), [wishlist])
  useEffect(() => save('nc_notifications', notifications), [notifications])
  useEffect(() => save('nc_addresses', addresses), [addresses])

  // theme
  useEffect(() => {
    const root = document.documentElement
    const apply = (t: string) => {
      if (t === 'system') {
        const dark = matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', dark)
      } else {
        root.classList.toggle('dark', t === 'dark')
      }
    }
    apply(theme)
    save('nc_theme', theme)
    if (theme === 'system') {
      const mq = matchMedia('(prefers-color-scheme: dark)')
      const handler = () => apply('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  const setTheme = useCallback((t: 'dark' | 'light' | 'system') => setThemeState(t), [])

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])
  const dismissToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800))
    const u = { ...currentUser, email: email || currentUser.email }
    setUser(u)
    return true
  }, [])

  const signup = useCallback(async (data: { name: string; username: string; email: string; password: string; accountType: 'customer' | 'seller' }) => {
    await new Promise(r => setTimeout(r, 1000))
    const u: User = {
      ...currentUser,
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.accountType,
      points: 100,
      loyaltyTier: 'Bronze',
      referralCode: data.username.toUpperCase() + '-2024',
    }
    setUser(u)
    return true
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const addToCart = useCallback((productId: string, quantity = 1, variant?: Record<string, string>) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === productId && !c.savedForLater)
      if (existing) {
        return prev.map(c => c.productId === productId && !c.savedForLater ? { ...c, quantity: c.quantity + quantity } : c)
      }
      return [...prev, { productId, quantity, variant }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(c => c.productId !== productId))
  }, [])

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty < 1) return
    setCart(prev => prev.map(c => c.productId === productId ? { ...c, quantity: qty } : c))
  }, [])

  const saveForLater = useCallback((productId: string) => {
    setCart(prev => prev.map(c => c.productId === productId ? { ...c, savedForLater: true } : c))
  }, [])

  const moveToCart = useCallback((productId: string) => {
    setCart(prev => prev.map(c => c.productId === productId ? { ...c, savedForLater: false } : c))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      if (prev.some(w => w.productId === productId)) {
        return prev.filter(w => w.productId !== productId)
      }
      return [...prev, { productId, addedAt: new Date().toISOString(), collection: 'Default' }]
    })
  }, [])

  const isWishlisted = useCallback((productId: string) => wishlist.some(w => w.productId === productId), [wishlist])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const addAddress = useCallback((a: Omit<Address, 'id'>) => {
    setAddresses(prev => [...prev, { ...a, id: 'a' + Date.now() }])
  }, [])

  const removeAddress = useCallback((id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }, [])

  const cartCount = cart.filter(c => !c.savedForLater).reduce((s, c) => s + c.quantity, 0)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Ctx.Provider value={{
      user, login, signup, logout,
      theme, setTheme,
      cart, addToCart, removeFromCart, updateQty, saveForLater, moveToCart, clearCart, cartCount,
      wishlist, toggleWishlist, isWishlisted,
      notifications, markNotificationRead, markAllRead, unreadCount,
      addresses, addAddress, removeAddress,
      toasts, showToast, dismissToast,
      searchQuery, setSearchQuery,
    }}>
      {children}
    </Ctx.Provider>
  )
}
