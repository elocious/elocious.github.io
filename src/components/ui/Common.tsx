import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function Badge({ children, variant = 'default', className }: { children: ReactNode; variant?: 'default' | 'gold' | 'red' | 'green' | 'blue'; className?: string }) {
  const variants = {
    default: 'bg-ink-800 text-ink-200',
    gold: 'bg-gold-500/20 text-gold-300 border border-gold-500/30',
    red: 'bg-red-500/15 text-red-400',
    green: 'bg-emerald-500/15 text-emerald-400',
    blue: 'bg-blue-500/15 text-blue-400',
  }
  return <span className={cn('badge', variants[variant], className)}>{children}</span>
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-xl', className)} />
}

export function EmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-elev flex items-center justify-center mb-4 border border-base">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
      <p className="text-muted max-w-md mb-6">{message}</p>
      {action}
    </div>
  )
}

export function Rating({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' }
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${sizes[size]} ${i <= Math.round(value) ? 'text-gold-400' : 'text-ink-700'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}
