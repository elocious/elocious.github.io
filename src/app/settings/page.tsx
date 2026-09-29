'use client';

import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Monitor, DollarSign, Ruler, Save } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageParts';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      setUser(d);
      setForm({
        name: d.name,
        buyerType: d.buyerType,
        budgetMin: d.budgetMin,
        budgetMax: d.budgetMax,
        timeline: d.timeline,
        currency: d.currency,
        units: d.units,
        weightAffordability: d.weightAffordability,
        weightSafety: d.weightSafety,
        weightSchools: d.weightSchools,
        weightCommute: d.weightCommute,
        weightSpace: d.weightSpace,
        weightNeighborhood: d.weightNeighborhood,
        weightInvestment: d.weightInvestment,
        weightLifestyle: d.weightLifestyle,
        weightMaintenance: d.weightMaintenance,
        weightPrivacy: d.weightPrivacy,
        weightOutdoor: d.weightOutdoor,
      });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
  };

  if (!user) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="h-32 skeleton rounded-2xl" /></div>;

  const weightFields = [
    { key: 'weightAffordability', label: 'Affordability' },
    { key: 'weightSafety', label: 'Safety' },
    { key: 'weightSchools', label: 'Schools' },
    { key: 'weightCommute', label: 'Commute' },
    { key: 'weightSpace', label: 'Space' },
    { key: 'weightNeighborhood', label: 'Neighborhood' },
    { key: 'weightInvestment', label: 'Investment' },
    { key: 'weightLifestyle', label: 'Lifestyle' },
    { key: 'weightMaintenance', label: 'Maintenance' },
    { key: 'weightPrivacy', label: 'Privacy' },
    { key: 'weightOutdoor', label: 'Outdoor Space' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader title="Settings" subtitle="Manage your account, preferences, and priorities" icon={SettingsIcon} />

      <div className="space-y-6">
        {/* Account */}
        <div className="premium-card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Account</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Name</label>
              <input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Buyer Type</label>
              <select value={form.buyerType || 'buy'} onChange={e => setForm({...form, buyerType: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm capitalize">
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="explore">Explore</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Min Budget</label>
                <input type="number" value={form.budgetMin || 0} onChange={e => setForm({...form, budgetMin: parseFloat(e.target.value)})} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Max Budget</label>
                <input type="number" value={form.budgetMax || 0} onChange={e => setForm({...form, budgetMax: parseFloat(e.target.value)})} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Timeline</label>
              <select value={form.timeline || '3-6m'} onChange={e => setForm({...form, timeline: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
                <option value="asap">ASAP</option>
                <option value="1-3m">1–3 months</option>
                <option value="3-6m">3–6 months</option>
                <option value="6-12m">6–12 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="premium-card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex gap-3">
            {[
              { val: 'light', icon: Sun, label: 'Light' },
              { val: 'dark', icon: Moon, label: 'Dark' },
              { val: 'system', icon: Monitor, label: 'System' },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button key={t.val} onClick={() => setTheme(t.val as any)} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition ${theme === t.val ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-800'}`}>
                  <Icon className={`w-5 h-5 ${theme === t.val ? 'text-brand-500' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${theme === t.val ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferences */}
        <div className="premium-card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Preferences</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Currency</label>
              <select value={form.currency || 'USD'} onChange={e => setForm({...form, currency: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> Units</label>
              <select value={form.units || 'imperial'} onChange={e => setForm({...form, units: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm">
                <option value="imperial">Imperial (sqft, mi)</option>
                <option value="metric">Metric (m², km)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Priority Weights */}
        <div className="premium-card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Priority Weights</h3>
          <p className="text-sm text-slate-500 mb-4">Adjust how much each factor matters to you. These weights influence AI matching and evaluation scores.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {weightFields.map(w => (
              <div key={w.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{w.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{form[w.key] || 5}/10</span>
                </div>
                <input type="range" min={0} max={10} value={form[w.key] || 5} onChange={e => setForm({...form, [w.key]: parseInt(e.target.value)})} className="w-full accent-brand-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 transition min-h-[48px]">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
