export type Role = 'customer' | 'seller' | 'admin'

export interface User {
  id: string
  name: string
  username: string
  email: string
  phone?: string
  avatar: string
  role: Role
  points: number
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  referralCode: string
  joinedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image: string
  parentId: string | null
  description?: string
  productCount: number
}

export interface Brand {
  id: string
  name: string
  logo: string
  productCount: number
}

export interface ProductVariant {
  id: string
  name: string
  options: { name: string; value: string; priceDelta: number }[]
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  brand: string
  brandId: string
  categoryId: string
  storeId: string
  storeName: string
  sellerId: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviewCount: number
  stock: number
  sku: string
  images: string[]
  variants: { name: string; options: string[] }[]
  specifications: { label: string; value: string }[]
  whatsIncluded: string[]
  shippingInfo: string
  returnPolicy: string
  condition: 'New' | 'Refurbished' | 'Used'
  tags: string[]
  createdAt: string
  sold: number
  trending?: boolean
  bestSeller?: boolean
  newArrival?: boolean
  flashSale?: boolean
  dealPrice?: number
  dealEndsAt?: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  title: string
  body: string
  createdAt: string
  verified: boolean
  helpful: number
  images?: string[]
  reported?: boolean
}

export interface Store {
  id: string
  name: string
  slug: string
  logo: string
  banner: string
  description: string
  sellerId: string
  sellerName: string
  rating: number
  reviewCount: number
  productCount: number
  joinedAt: string
  verified: boolean
  location: string
  followers: number
}

export interface CartItem {
  productId: string
  quantity: number
  variant?: Record<string, string>
  savedForLater?: boolean
}

export interface Address {
  id: string
  label: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault?: boolean
}

export interface OrderItem {
  productId: string
  title: string
  image: string
  price: number
  quantity: number
  storeId: string
  storeName: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded'

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  status: OrderStatus
  address: Address
  paymentMethod: string
  createdAt: string
  trackingNumber?: string
  estimatedDelivery?: string
  timeline: { status: OrderStatus; label: string; date: string; done: boolean }[]
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  minPurchase: number
  expiresAt: string
  usageLimit: number
  used: number
  description: string
  categorySpecific?: string
  sellerSpecific?: string
  firstOrderOnly?: boolean
}

export interface Notification {
  id: string
  type: 'order' | 'shipping' | 'delivery' | 'promotion' | 'price_drop' | 'back_in_stock' | 'message' | 'security' | 'reward'
  title: string
  body: string
  read: boolean
  createdAt: string
  link?: string
}

export interface WishlistItem {
  productId: string
  addedAt: string
  collection: string
}

export interface SupportTicket {
  id: string
  subject: string
  category: string
  status: 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  lastUpdate: string
  messages: { from: 'user' | 'agent'; body: string; createdAt: string }[]
}

export interface Promotion {
  id: string
  title: string
  description: string
  type: 'flash_sale' | 'daily_deal' | 'limited_time' | 'bogo' | 'bundle'
  discount: number
  image: string
  endsAt: string
  active: boolean
}
