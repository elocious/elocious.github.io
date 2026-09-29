'use client';

import { Search, Bell, Moon, Sun, Monitor, Command } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function TopBar({ onCmdOpen }: { onCmdOpen: () => void }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    fetch('/api/notifications/count')
      .then(r => r.json())
      .then(d => setNotifCount(d.count || 0))
      .catch(() => {});
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onCmdOpen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCmdOpen]);

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'] as const;
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % 3]);
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-slate-200/60 dark:border-slate-800/60 h-16 flex items-center gap-3 px-4 lg:px-6">
      {/* Search / Command */}
      <button
        onClick={onCmdOpen}
        className="flex-1 max-w-md flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition min-h-[44px]"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search properties, neighborhoods...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={cycleTheme}
        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Toggle theme"
      >
        {theme === 'light' && <Sun className="w-5 h-5 text-gold-500" />}
        {theme === 'dark' && <Moon className="w-5 h-5 text-brand-400" />}
        {theme === 'system' && <Monitor className="w-5 h-5 text-slate-500" />}
      </button>

      {/* Notifications */}
      <button
        onClick={() => router.push('/alerts')}
        className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        {notifCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {notifCount > 9 ? '9+' : notifCount}
          </span>
        )}
      </button>

      {/* Avatar */}
      <button
        onClick={() => router.push('/profile')}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm hover:opacity-90 transition flex-shrink-0"
      >
        AM
      </button>
    </header>
  );
}
