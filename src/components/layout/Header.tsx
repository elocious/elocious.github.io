'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Home, ClipboardCheck, GitCompare, Vault, Heart, Map, SlidersHorizontal,
  Bot, Bell, MessageSquare, Sun, Moon, Monitor, Command, MoreHorizontal,
  CheckSquare, Calculator, FileText, Building2, User, Settings, Compass,
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const mainNav = [
  { label: 'Evaluate', href: '/evaluations', icon: ClipboardCheck },
  { label: 'Compare', href: '/compare', icon: GitCompare, countKey: 'comparisons' },
  { label: 'Vault', href: '/vault', icon: Vault, countKey: 'vault' },
  { label: 'Saved', href: '/saved', icon: Heart, countKey: 'saved' },
  { label: 'Map Explorer', href: '/map', icon: Map },
  { label: 'Criteria', href: '/onboarding', icon: SlidersHorizontal },
];

const moreNav = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Discover', href: '/discover', icon: Compass },
  { label: 'AI Advisor', href: '/advisor', icon: Bot },
  { label: 'Neighborhoods', href: '/neighborhoods', icon: Building2 },
  { label: 'Finances', href: '/finances', icon: Calculator },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Header({ onCmdOpen }: { onCmdOpen: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notifCount, setNotifCount] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/saved').then(r => r.json()).catch(() => ({})),
      fetch('/api/notifications/count').then(r => r.json()).catch(() => ({})),
    ]).then(([savedData, notifData]) => {
      setCounts({ saved: savedData.saved?.length || 0, vault: savedData.saved?.length || 0 });
      setNotifCount(notifData.count || 0);
    });
  }, [pathname]);

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

  useEffect(() => {
    setShowMore(false);
    setMobileNavOpen(false);
  }, [pathname]);

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'] as const;
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % 3]);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-navy-200/60 shadow-nav">
        {/* Top row */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow">
                <Home className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg text-navy-900 dark:text-white">BetterHome</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400 text-[9px] font-bold tracking-wider">AI DECISION ENGINE</span>
                </div>
                <p className="text-[10px] text-navy-500 dark:text-navy-400 leading-tight">Intelligent House Evaluation (Buy, Rent, or Avoid)</p>
              </div>
            </Link>

            {/* Center nav — pill strip (desktop) */}
            <nav className="hidden lg:flex items-center gap-1 bg-navy-100/60 dark:bg-navy-800/50 rounded-full px-2 py-1.5">
              {mainNav.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const count = counts[item.countKey || ''];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      active
                        ? 'bg-navy-900 text-white dark:bg-brand-500'
                        : 'text-navy-600 dark:text-navy-300 hover:bg-white dark:hover:bg-navy-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
                    <span className="hidden xl:inline">{item.label}</span>
                    {count != null && count > 0 && (
                      <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-brand-500 text-white'
                      }`}>{count}</span>
                    )}
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    showMore ? 'bg-navy-900 text-white dark:bg-brand-500' : 'text-navy-600 dark:text-navy-300 hover:bg-white dark:hover:bg-navy-700/50'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="hidden xl:inline">More</span>
                </button>
                {showMore && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-navy-900 rounded-2xl shadow-premium border border-navy-200 dark:border-navy-800 p-2 z-50 animate-slide-up">
                    {moreNav.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                            active ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400' : 'text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => router.push('/advisor')}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-500 text-brand-600 dark:text-brand-400 text-sm font-semibold hover:bg-brand-50 dark:hover:bg-brand-950/30 transition"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden lg:inline">Run AI Audit</span>
              </button>

              <button
                onClick={() => router.push('/messages')}
                className="relative p-2.5 rounded-full hover:bg-navy-100 dark:hover:bg-navy-800 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Messages"
              >
                <MessageSquare className="w-5 h-5 text-navy-600 dark:text-navy-400" />
              </button>

              <button
                onClick={() => router.push('/alerts')}
                className="relative p-2.5 rounded-full hover:bg-navy-100 dark:hover:bg-navy-800 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-navy-600 dark:text-navy-400" />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>

              <button
                onClick={onCmdOpen}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-navy-900 dark:bg-brand-500 text-white text-sm font-semibold hover:bg-navy-800 dark:hover:bg-brand-600 transition"
              >
                <Command className="w-4 h-4" />
                <span className="hidden lg:inline">Prompt</span>
                <kbd className="hidden xl:flex items-center gap-0.5 text-xs bg-white/15 px-1 py-0.5 rounded">⌘K</kbd>
              </button>

              <button
                onClick={cycleTheme}
                className="p-2.5 rounded-full hover:bg-navy-100 dark:hover:bg-navy-800 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === 'light' && <Sun className="w-5 h-5 text-gold-500" />}
                {theme === 'dark' && <Moon className="w-5 h-5 text-brand-400" />}
                {theme === 'system' && <Monitor className="w-5 h-5 text-navy-500" />}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-navy-100 dark:hover:bg-navy-800 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Menu"
              >
                {mobileNavOpen ? <Command className="w-5 h-5 rotate-45" /> : <MoreHorizontal className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav strip */}
        {mobileNavOpen && (
          <nav className="lg:hidden border-t border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-900 px-4 py-3 animate-slide-up">
            <div className="flex flex-wrap gap-2">
              {[...mainNav, ...moreNav].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition ${
                      active ? 'bg-navy-900 text-white dark:bg-brand-500' : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
