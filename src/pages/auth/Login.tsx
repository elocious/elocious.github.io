import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Shield, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function Login() {
  const { login, showToast } = useStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'email' | 'username'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ identifier: '', password: '', remember: true })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.identifier) e.identifier = `${mode === 'email' ? 'Email' : 'Username'} is required`
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.identifier, form.password)
      showToast('success', 'Welcome back to NexaCart!')
      navigate('/')
    } catch {
      showToast('error', 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md relative">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-display font-extrabold text-ink-950 text-2xl mx-auto mb-3">N</div>
          <h1 className="font-display font-bold text-2xl">Welcome Back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your NexaCart account</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-elev rounded-xl mb-4">
          {(['email', 'username'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={cn('flex-1 py-2 rounded-lg text-sm font-medium capitalize transition', mode === m ? 'bg-gold-500/15 text-gold-400' : 'text-muted')}>{m}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <div className="relative">
              {mode === 'email' ? <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" /> : <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />}
              <input type={mode === 'email' ? 'email' : 'text'} value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} placeholder={mode === 'email' ? 'Email address' : 'Username'} className={cn('input pl-11', errors.identifier && 'border-red-500')} />
            </div>
            {errors.identifier && <p className="text-xs text-red-400 mt-1">{errors.identifier}</p>}
          </div>
          <div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" className={cn('input pl-11 pr-11', errors.password && 'border-red-500')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} className="accent-gold-400" /> Remember me</label>
            <Link to="/forgot-password" className="text-sm text-gold-400 hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full h-11">
            {loading ? <span className="w-5 h-5 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Social login */}
        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-base" /><span className="text-xs text-muted">or continue with</span><div className="flex-1 h-px bg-base" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['Google', 'Apple', 'Facebook'].map(p => (
            <button key={p} onClick={() => showToast('info', `${p} login would open`)} className="btn btn-secondary text-sm py-2.5">{p}</button>
          ))}
        </div>

        <p className="text-center text-sm text-muted mt-6">Don't have an account? <Link to="/signup" className="text-gold-400 hover:underline font-medium">Sign up</Link></p>

        <div className="mt-4 p-3 bg-elev rounded-lg text-xs text-muted flex items-center gap-2">
          <Shield className="w-4 h-4 text-gold-400" /> Admin access is protected by server-side role authorization.
        </div>
      </motion.div>
    </div>
  )
}
