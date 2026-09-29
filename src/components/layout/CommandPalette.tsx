'use client';

import { useRouter } from 'next/navigation';
import { Search, Home, Vault, GitCompare, ClipboardCheck, Bot, Calculator, FileText, CheckSquare, Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const commands = [
  { label: 'Search Properties', href: '/discover', icon: Search },
  { label: 'Open Vault', href: '/vault', icon: Vault },
  { label: 'Compare Properties', href: '/compare', icon: GitCompare },
  { label: 'Start Evaluation', href: '/evaluations', icon: ClipboardCheck },
  { label: 'Ask AI Advisor', href: '/advisor', icon: Bot },
  { label: 'Open Finances', href: '/finances', icon: Calculator },
  { label: 'Upload Document', href: '/documents', icon: FileText },
  { label: 'Create Task', href: '/tasks', icon: CheckSquare },
  { label: 'Open Settings', href: '/settings', icon: Settings },
  { label: 'Go Home', href: '/', icon: Home },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-2xl shadow-premium overflow-hidden animate-slide-up">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.map(cmd => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.label}
                onClick={() => { router.push(cmd.href); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                <Icon className="w-4 h-4" />
                {cmd.label}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-slate-400">No commands found</p>
          )}
        </div>
      </div>
    </div>
  );
}
