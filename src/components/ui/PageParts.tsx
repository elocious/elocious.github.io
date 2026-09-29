import { LucideIcon } from 'lucide-react';

export function PageHeader({ title, subtitle, icon: Icon, action }: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-navy-500 dark:text-navy-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-navy-400" />
      </div>
      <h3 className="font-semibold text-navy-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-navy-500 dark:text-navy-400 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SectionCard({ title, children, action }: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="premium-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-navy-900 dark:text-white">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function InfoPill({ label, value, tone = 'default' }: {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'brand';
}) {
  const tones = {
    default: 'text-navy-600 dark:text-navy-400',
    success: 'text-brand-600 dark:text-brand-400',
    warning: 'text-gold-600 dark:text-gold-400',
    danger: 'text-red-600 dark:text-red-400',
    brand: 'text-brand-600 dark:text-brand-400',
  };
  return (
    <div className="flex flex-col">
      <span className="text-xs text-navy-400">{label}</span>
      <span className={`text-sm font-semibold ${tones[tone]}`}>{value}</span>
    </div>
  );
}

export function AIDisclaimer({ text }: { text?: string }) {
  return (
    <p className="text-xs text-navy-400 italic mt-2">
      {text || '*AI-generated analysis — verify with qualified professionals for financial, legal, and safety decisions.*'}
    </p>
  );
}

export function DataLabel({ type }: { type: 'verified' | 'estimate' | 'user' | 'ai' | 'missing' }) {
  const labels = {
    verified: { text: 'Verified', class: 'bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400' },
    estimate: { text: 'Estimate', class: 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-400' },
    user: { text: 'User Input', class: 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-400' },
    ai: { text: 'AI Analysis', class: 'bg-gold-100 text-gold-600 dark:bg-gold-500/15 dark:text-gold-400' },
    missing: { text: 'Missing', class: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
  };
  const l = labels[type];
  return <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${l.class}`}>{l.text}</span>;
}
