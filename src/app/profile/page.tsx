'use client';

import { useEffect, useState } from 'react';
import { User, MapPin, DollarSign, Calendar, Target } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageParts';
import { formatCurrency } from '@/lib/calculations';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      setUser(d);
      setLoading(false);
    });
  }, []);

  if (loading || !user) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="h-32 skeleton rounded-2xl" /></div>;

  const locations = user.preferredLocations || [];
  const weights = [
    { label: 'Affordability', value: user.weightAffordability },
    { label: 'Safety', value: user.weightSafety },
    { label: 'Schools', value: user.weightSchools },
    { label: 'Commute', value: user.weightCommute },
    { label: 'Space', value: user.weightSpace },
    { label: 'Neighborhood', value: user.weightNeighborhood },
    { label: 'Investment', value: user.weightInvestment },
    { label: 'Lifestyle', value: user.weightLifestyle },
    { label: 'Maintenance', value: user.weightMaintenance },
    { label: 'Privacy', value: user.weightPrivacy },
    { label: 'Outdoor Space', value: user.weightOutdoor },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader title="My Profile" subtitle="Your decision profile and preferences" icon={User} />

      {/* Profile header */}
      <div className="premium-card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
            {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-slate-400">{user.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-xs font-medium capitalize">
              {user.buyerType || 'buyer'}
            </span>
          </div>
        </div>
      </div>

      {/* Decision Profile */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="premium-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Budget</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(user.budgetMin || 0)} – {formatCurrency(user.budgetMax || 0)}
          </p>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gold-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Timeline</h3>
          </div>
          <p className="text-lg font-medium text-slate-900 dark:text-white capitalize">{(user.timeline || '—').replace('-', ' ')}</p>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-brand-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Preferred Locations</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {locations.map((l: string, i: number) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">{l}</span>
            ))}
            {locations.length === 0 && <p className="text-sm text-slate-400">No locations set</p>}
          </div>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Priority Weights</h3>
          </div>
          <div className="space-y-2">
            {weights.map(w => (
              <div key={w.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{w.label}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{w.value}/10</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${w.value * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a href="/settings" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
          Edit Profile & Settings →
        </a>
      </div>
    </div>
  );
}
