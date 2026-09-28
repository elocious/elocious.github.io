import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { StoreProvider } from '@/lib/store'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import ToastContainer from '@/components/ui/Toast'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Skeleton } from '@/components/ui/Common'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Category = lazy(() => import('@/pages/Category'))
const Search = lazy(() => import('@/pages/Search'))
const Cart = lazy(() => import('@/pages/Cart'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const Orders = lazy(() => import('@/pages/Orders'))
const OrderDetail = lazy(() => import('@/pages/OrderDetail'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Stores = lazy(() => import('@/pages/Stores'))
const StoreDetail = lazy(() => import('@/pages/StoreDetail'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))
const Rewards = lazy(() => import('@/pages/Rewards'))
const Notifications = lazy(() => import('@/pages/Notifications'))
const Support = lazy(() => import('@/pages/Support'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Signup = lazy(() => import('@/pages/auth/Signup'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const SellerDashboard = lazy(() => import('@/pages/seller/SellerDashboard'))
const SellerProducts = lazy(() => import('@/pages/seller/SellerProducts'))
const SellerOrders = lazy(() => import('@/pages/seller/SellerOrders'))
const SellerInventory = lazy(() => import('@/pages/seller/SellerInventory'))
const SellerAnalytics = lazy(() => import('@/pages/seller/SellerAnalytics'))
const SellerSettings = lazy(() => import('@/pages/seller/SellerSettings'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminSellers = lazy(() => import('@/pages/admin/AdminSellers'))
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'))
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'))
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'))
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'))

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const loc = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={loc} key={loc.pathname}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
          <Route path="/products" element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
          <Route path="/product/:id" element={<Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>} />
          <Route path="/category/:id" element={<Suspense fallback={<PageLoader />}><Category /></Suspense>} />
          <Route path="/search" element={<Suspense fallback={<PageLoader />}><Search /></Suspense>} />
          <Route path="/cart" element={<Suspense fallback={<PageLoader />}><Cart /></Suspense>} />
          <Route path="/checkout" element={<Suspense fallback={<PageLoader />}><Checkout /></Suspense>} />
          <Route path="/orders" element={<Suspense fallback={<PageLoader />}><Orders /></Suspense>} />
          <Route path="/orders/:id" element={<Suspense fallback={<PageLoader />}><OrderDetail /></Suspense>} />
          <Route path="/wishlist" element={<Suspense fallback={<PageLoader />}><Wishlist /></Suspense>} />
          <Route path="/stores" element={<Suspense fallback={<PageLoader />}><Stores /></Suspense>} />
          <Route path="/store/:id" element={<Suspense fallback={<PageLoader />}><StoreDetail /></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
          <Route path="/rewards" element={<Suspense fallback={<PageLoader />}><Rewards /></Suspense>} />
          <Route path="/notifications" element={<Suspense fallback={<PageLoader />}><Notifications /></Suspense>} />
          <Route path="/support" element={<Suspense fallback={<PageLoader />}><Support /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={<PageLoader />}><Signup /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
        </Route>
        <Route path="/seller" element={<DashboardLayout type="seller" />}>
          <Route index element={<Suspense fallback={<PageLoader />}><SellerDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><SellerProducts /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><SellerOrders /></Suspense>} />
          <Route path="inventory" element={<Suspense fallback={<PageLoader />}><SellerInventory /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<PageLoader />}><SellerAnalytics /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<PageLoader />}><SellerSettings /></Suspense>} />
        </Route>
        <Route path="/admin" element={<DashboardLayout type="admin" />}>
          <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsers /></Suspense>} />
          <Route path="sellers" element={<Suspense fallback={<PageLoader />}><AdminSellers /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminOrders /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<PageLoader />}><AdminCategories /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={<PageLoader />}><AdminReviews /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminSettings /></Suspense>} />
        </Route>
        <Route path="*" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <ToastContainer />
      </BrowserRouter>
    </StoreProvider>
  )
}
