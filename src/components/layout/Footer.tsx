import { Link } from 'react-router-dom'
import { Shield, Truck, RefreshCw, Headphones, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@/lib/store'

export default function Footer() {
  const { showToast } = useStore()
  const [email, setEmail] = useState('')
  return (
    <footer className="mt-20 border-t border-base bg-ink-950">
      {/* Trust badges */}
      <div className="border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Shield className="w-6 h-6" />, title: 'Secure Payments', desc: 'Bank-grade encryption' },
            { icon: <Truck className="w-6 h-6" />, title: 'Fast Delivery', desc: '1-5 business days' },
            { icon: <RefreshCw className="w-6 h-6" />, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: <Headphones className="w-6 h-6" />, title: '24/7 Support', desc: 'Always here for you' },
          ].map(t => (
            <div key={t.title} className="flex items-center gap-3 text-ink-300">
              <div className="w-12 h-12 rounded-xl bg-ink-800 flex items-center justify-center text-gold-400 shrink-0">{t.icon}</div>
              <div>
                <p className="font-semibold text-sm text-ink-100">{t.title}</p>
                <p className="text-xs text-ink-400">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl text-ink-100">Join the NexaCart Insider</h3>
            <p className="text-ink-400 text-sm mt-1">Get exclusive deals, early access & 10% off your first order.</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); showToast('success', 'You\'re subscribed! Check your inbox for 10% off.'); setEmail('') }} className="flex gap-2 w-full md:w-auto">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="input bg-ink-900 border-ink-800 h-11 md:w-72" />
            <button className="btn btn-primary h-11 px-6">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-display font-extrabold text-ink-950 text-lg">N</div>
            <span className="font-display font-extrabold text-xl text-ink-100">Nexa<span className="gradient-text">Cart</span></span>
          </Link>
          <p className="text-sm text-ink-400 mb-4">The premium marketplace for everything you need. Shop with confidence.</p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-ink-800 flex items-center justify-center text-ink-400 hover:text-gold-400 hover:bg-ink-700 transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        {[
          { title: 'Shop', links: [['All Products', '/products'], ['Categories', '/'], ['Deals', '/products?filter=deals'], ['Stores', '/stores'], ['New Arrivals', '/products?filter=new']] },
          { title: 'Account', links: [['My Profile', '/profile'], ['My Orders', '/orders'], ['Wishlist', '/wishlist'], ['Rewards', '/rewards'], ['Settings', '/settings']] },
          { title: 'Sellers', links: [['Sell on NexaCart', '/seller'], ['Seller Dashboard', '/seller'], ['Analytics', '/seller/analytics'], ['Inventory', '/seller/inventory']] },
          { title: 'Support', links: [['Help Center', '/support'], ['Contact Us', '/support'], ['Track Order', '/orders'], ['Returns', '/support'], ['FAQ', '/support']] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm text-ink-100 mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm text-ink-400 hover:text-gold-400 transition">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-500">
          <p>© 2024 NexaCart Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-gold-400 transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
