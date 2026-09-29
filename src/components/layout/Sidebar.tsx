'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Map, Heart, Vault, GitCompare, ClipboardCheck, Bot, Building2, Calculator, FileText, CheckSquare, MessageSquare, User, Settings } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Discover', href: '/discover', icon: Compass },
  { label: 'Map', href: '/map', icon: Map },
  { label: 'Saved', href: '/saved', icon: Heart },
  { label: 'My Vault', href: '/vault', icon: Vault },
  { label: 'Compare', href: '/compare', icon: GitCompare },
  { label: 'Evaluations', href: '/evaluations', icon: ClipboardCheck },
  { label: 'AI Advisor', href: '/advisor', icon: Bot },
  { label: 'Neighborhoods', href: '/neighborhoods', icon: Building2 },
  { label: 'Finances', href: '/finances', icon: Calculator },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center shadow-glow">
          <Home className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">BetterHome</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-hide">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
              <span>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="p-3">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 p-4">
          <p className="text-sm font-semibold text-white">BetterHome Pro</p>
          <p className="text-xs text-slate-400 mt-1">Unlimited evaluations, AI reports & comparisons.</p>
          <button className="mt-3 w-full text-xs font-medium text-slate-900 bg-gradient-to-r from-gold-400 to-gold-500 rounded-lg py-2 hover:opacity-90 transition">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
