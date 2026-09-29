'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, Vault, Bot } from 'lucide-react';

const items = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Discover', href: '/discover', icon: Compass },
  { label: 'Saved', href: '/saved', icon: Heart },
  { label: 'Vault', href: '/vault', icon: Vault },
  { label: 'AI', href: '/advisor', icon: Bot },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-slate-200/60 dark:border-slate-800/60 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 h-16">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[44px] min-h-[44px] ${
                active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
