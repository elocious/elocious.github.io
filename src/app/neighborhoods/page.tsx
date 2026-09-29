'use client';

import { useEffect, useState } from 'react';
import { Building2, School, Shield, Footprints, Bus, Volume2, AlertTriangle, MapPin } from 'lucide-react';
import { PageHeader, AIDisclaimer } from '@/components/ui/PageParts';
import { formatCurrency } from '@/lib/calculations';

export default function NeighborhoodsPage() {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from API
    fetch('/api/neighborhoods').then(r => r.json()).then(d => {
      setNeighborhoods(d.neighborhoods || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8"><div className="h-32 skeleton rounded-2xl" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader title="Neighborhood Intelligence" subtitle="Explore neighborhood data, amenities, and quality scores" icon={Building2} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Neighborhood list */}
        <div className="space-y-2 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
          {neighborhoods.map(n => (
            <button key={n.id} onClick={() => setSelected(n)} className={`w-full premium-card p-4 text-left transition ${selected?.id === n.id ? 'border-brand-500' : 'hover:border-brand-300'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{n.name}</p>
                  <p className="text-xs text-slate-400">{n.city}, {n.state}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Avg Price</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(n.averagePrice || 0)}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-slate-500 flex items-center gap-1"><School className="w-3 h-3" /> {n.schoolRating || '—'}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><Shield className="w-3 h-3" /> {n.safetyScore || '—'}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><Footprints className="w-3 h-3" /> {n.walkabilityScore || '—'}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div className="premium-card p-6">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{selected.name}</h2>
                <p className="text-sm text-slate-400">{selected.city}, {selected.state}</p>
                {selected.description && <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">{selected.description}</p>}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <ScoreCard icon={School} label="School Rating" value={`${selected.schoolRating || 'N/A'}/10`} score={selected.schoolRating ? selected.schoolRating * 10 : null} />
                <ScoreCard icon={Shield} label="Safety" value={`${selected.safetyScore || 'N/A'}/100`} score={selected.safetyScore} />
                <ScoreCard icon={Footprints} label="Walkability" value={`${selected.walkabilityScore || 'N/A'}/100`} score={selected.walkabilityScore} />
                <ScoreCard icon={Bus} label="Transit" value={`${selected.transitScore || 'N/A'}/100`} score={selected.transitScore} />
              </div>

              <div className="premium-card p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Key Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow icon={Volume2} label="Noise Level" value={selected.noiseLevel || 'N/A'} />
                  <InfoRow icon={AlertTriangle} label="Flood Risk" value={selected.floodRisk || 'N/A'} />
                  <InfoRow icon={MapPin} label="Avg Price" value={formatCurrency(selected.averagePrice || 0)} />
                  <InfoRow icon={Building2} label="Price Trend" value={selected.priceTrend || 'N/A'} />
                </div>
              </div>

              <div className="premium-card p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Nearby Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {(JSON.parse(selected.amenities || '[]')).map((a: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">{a}</span>
                  ))}
                </div>
              </div>

              <AIDisclaimer text="*Neighborhood data is estimated for demonstration. Verify with local sources, school districts, and municipal records.*" />
            </div>
          ) : (
            <div className="premium-card p-8 text-center">
              <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">Select a neighborhood to see detailed information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ icon: Icon, label, value, score }: any) {
  return (
    <div className="premium-card p-4">
      <Icon className="w-5 h-5 text-brand-500 mb-2" />
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      {score != null && (
        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mt-2 overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${score}%` }} />
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2 py-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-sm text-slate-500">{label}:</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{value}</span>
    </div>
  );
}
