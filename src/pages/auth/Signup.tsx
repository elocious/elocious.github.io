import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check, Store, ShoppingBag, Gift } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function Signup() {
  const { signup, showToast } = useStore()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '', referral: '', terms: false, accountType: 'customer' as 'customer' | 'seller' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const strength = () => {
    let s = 0
    if (form.password.length >= 8) s++
    if (/[A-Z]/.test(form.password)) s++
    if (/[0-9]/.test(form.password)) s++
    if (/[^A-Za-z0-9]/.test(form.password)) s++
    return s
  }
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500']

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name) e.name = 'Full name is required'
    if (!form.username) e.username = 'Username is required'
    else if (form.username.length < 3) e.username = 'Username must be at least 3 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!form.terms) e.terms = 'You must accept the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signup(form)
      showToast('success', 'Welcome to NexaCart! Your account is ready.')
      navigate('/')
    } catch {
      showToast('error', 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-lg relative">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-display font-extrabold text-ink-950 text-2xl mx-auto mb-3">N</div>
          <h1 className="font-display font-bold text-2xl">Create Account</h1>
          <p className="text-muted text-sm mt-1">Join NexaCart and start shopping</p>
        </div>

        {/* Account type */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { val: 'customer', icon: ShoppingBag, label: 'Customer', desc: 'Shop & save' },
            { val: 'seller', icon: Store, label: 'Seller', desc: 'Sell products' },
          ].map(t => (
            <button key={t.val} onClick={() => setForm({ ...form, accountType: t.val as 'customer' | 'seller' })}
              className={cn('card p-4 flex flex-col items-center gap-1 transition', form.accountType === t.val ? 'border-gold-400 bg-gold-500/5' : '')}>
              <t.icon className={cn('w-6 h-6', form.accountType === t.val ? 'text-gold-400' : 'text-muted')} />
              <span className="font-medium text-sm">{t.label}</span>
              <span className="text-xs text-muted">{t.desc}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" className={cn('input', errors.name && 'border-red-500')} />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Username" className={cn('input', errors.username && 'border-red-500')} />
              {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username}</p>}
            </div>
          </div>
          <div>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address" className={cn('input pl-11', errors.email && 'border-red-500')} />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>
          <div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" className={cn('input pl-11 pr-11', errors.password && 'border-red-500')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map(i => <div key={i} className={cn('flex-1 h-1.5 rounded-full transition', i < strength() ? strengthColors[strength() - 1] : 'bg-ink-800')} />)}
                </div>
                <p className="text-xs text-muted mt-1">Password strength: {strengthLabels[strength() - 1] || 'Too weak'}</p>
              </div>
            )}
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>
          <div>
            <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Confirm password" className={cn('input', errors.confirm && 'border-red-500')} />
            {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
          </div>
          <div className="relative">
            <Gift className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input value={form.referral} onChange={e => setForm({ ...form, referral: e.target.value })} placeholder="Referral code (optional)" className="input pl-11" />
          </div>
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })} className="accent-gold-400 mt-0.5" />
            <span className="text-muted">I agree to the <a href="#" className="text-gold-400 hover:underline">Terms of Service</a> and <a href="#" className="text-gold-400 hover:underline">Privacy Policy</a></span>
          </label>
          {errors.terms && <p className="text-xs text-red-400">{errors.terms}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full h-11">
            {loading ? <span className="w-5 h-5 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">Already have an account? <Link to="/login" className="text-gold-400 hover:underline font-medium">Sign in</Link></p>
      </motion.div>
    </div>
  )
}
