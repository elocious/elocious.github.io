'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Vault, ChevronRight } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/ui/PageParts';
import { formatCurrency } from '@/lib/calculations';

const STATUSES = ['interested', 'researching', 'viewing', 'negotiating', 'offer', 'under_contract', 'rented', 'purchased', 'rejected', 'archived'];
const STATUS_COLORS: Record<string, string> = {
  interested: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  researching: 'bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400',
  viewing: 'bg-gold-50 text-gold-600 dark:bg-gold-950/30 dark:text-gold-400',
  negotiating: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  offer: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
  under_contract: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
  rented: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
  purchased: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  rejected: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
  archived: 'bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-600',
};

export default function VaultPage() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/saved').then(r => r.json()).then(d => {
      setSaved(d.saved || []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/saved', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, vaultStatus: status }) });
    setSaved(prev => prev.map(s => s.id === id ? { ...s, vaultStatus: status } : s));
  };

  const filtered = filter === 'all' ? saved : saved.filter(s => s.vaultStatus === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader title="My Vault" subtitle="Your personal property workspace" icon={Vault} />

      {/* Status filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>All</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap capitalize transition ${filter === s ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(s => (
            <div key={s.id} className="premium-card p-4">
              <div className="flex items-center gap-4">
                <Link href={`/property/${s.propertyId}`} className="flex-shrink-0">
                  <img src={s.property?.images?.[0]} alt="" className="w-20 h-20 rounded-xl object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/property/${s.propertyId}`}>
                    <p className="font-medium text-slate-900 dark:text-white truncate hover:text-brand-500">{s.property?.title}</p>
                  </Link>
                  <p className="text-sm text-slate-400">{s.property?.city}, {s.property?.state} · {formatCurrency(s.property?.price || 0)}</p>
                  <select
                    value={s.vaultStatus}
                    onChange={e => updateStatus(s.id, e.target.value)}
                    className={`mt-2 text-xs font-medium px-2 py-1 rounded-full capitalize border-0 cursor-pointer ${STATUS_COLORS[s.vaultStatus] || ''}`}
                  >
                    {STATUSES.map(st => <option key={st} value={st} className="capitalize">{st.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <Link href={`/property/${s.propertyId}`} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Vault}
          title="Your vault is empty"
          description="Save properties to organize them in your personal vault with status tracking, notes, and documents."
          action={<Link href="/discover" className="px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600">Discover Properties</Link>}
        />
      )}
    </div>
  );
}
