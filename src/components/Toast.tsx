import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-cyan-400',
};

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type ?? 'success'];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl max-w-sm border border-slate-800"
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${colorMap[toast.type ?? 'success']}`} />
              <p className="text-sm flex-1">{toast.message}</p>
              <button onClick={() => onDismiss(toast.id)} className="text-slate-400 hover:text-white flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
