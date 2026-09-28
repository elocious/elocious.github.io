import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Check, ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'

export default function ForgotPassword() {
  const { showToast } = useStore()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md relative">
        <Link to="/login" className="btn btn-ghost text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Back to login</Link>

        {step === 1 && (
          <>
            <h1 className="font-display font-bold text-2xl mb-2">Forgot Password?</h1>
            <p className="text-muted text-sm mb-6">Enter your email and we'll send you a recovery code.</p>
            <div className="relative mb-4">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="input pl-11" />
            </div>
            <Button className="w-full" onClick={() => { if (email) { setStep(2); showToast('success', 'Recovery code sent!') } else showToast('error', 'Please enter your email') }}>Send Recovery Code <ArrowRight className="w-4 h-4" /></Button>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="font-display font-bold text-2xl mb-2">Enter Recovery Code</h1>
            <p className="text-muted text-sm mb-6">We sent a 6-digit code to {email}</p>
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} className="input text-center text-2xl tracking-widest mb-4" />
            <Button className="w-full mb-2" onClick={() => { if (code.length === 6) { setStep(3); showToast('success', 'Code verified!') } else showToast('error', 'Please enter the 6-digit code') }}>Verify Code</Button>
            <button onClick={() => showToast('info', 'New code sent!')} className="text-sm text-gold-400 hover:underline w-full text-center">Resend code</button>
          </>
        )}
        {step === 3 && (
          <div className="text-center py-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <h1 className="font-display font-bold text-2xl mb-2">Password Reset!</h1>
            <p className="text-muted text-sm mb-6">Your password has been successfully reset. You can now log in with your new password.</p>
            <Link to="/login" className="btn btn-primary w-full">Back to Login</Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
