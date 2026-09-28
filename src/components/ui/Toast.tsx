import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore()
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  }
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="glass card flex items-center gap-3 px-4 py-3 shadow-xl pointer-events-auto min-w-[280px] max-w-sm"
          >
            {icons[t.type]}
            <span className="text-sm flex-1">{t.message}</span>
            <button onClick={() => dismissToast(t.id)} className="text-muted hover:text-current">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
