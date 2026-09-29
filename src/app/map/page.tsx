'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Map, MapPin, Navigation } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageParts';
import { formatCurrency } from '@/lib/calculations';

export default function MapPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties?limit=50').then(r => r.json()).then(d => {
      setProperties(d.properties || []);
      setLoading(false);
    });
  }, []);

  // Map positions are approximated based on lat/lng relative to Austin area
  const getPos = (lat: number, lng: number) => {
    const minLat = 30.15, maxLat = 30.55, minLng = -98.0, maxLng = -97.6;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="max-w-8xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader title="Map View" subtitle="Explore properties on an interactive map" icon={Map} />
      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        {/* Map */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 map-placeholder">
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(100,116,139,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M 0 60% Q 30% 50%, 60% 55%, 100% 45%" stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M 40% 0 Q 45% 30%, 50% 60%, 55% 100%" stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M 0 30% L 100% 35%" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.3" />
            <path d="M 0 80% L 100% 75%" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.3" />
          </svg>

          {/* Markers */}
          {properties.map(p => {
            if (!p.latitude || !p.longitude) return null;
            const pos = getPos(p.latitude, p.longitude);
            const isSelected = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-full transition-all ${isSelected ? 'z-20 scale-125' : 'z-10 hover:scale-110'}`}
              >
                <div className={`px-2 py-1 rounded-lg shadow-lg text-xs font-semibold whitespace-nowrap ${p.saved ? 'bg-red-500 text-white' : 'bg-brand-500 text-white'}`}>
                  {formatCurrency(p.price).replace('.00', '')}
                </div>
                <div className={`w-2 h-2 ${p.saved ? 'bg-red-500' : 'bg-brand-500'} rotate-45 mx-auto -mt-0.5`} />
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-card p-3 text-xs space-y-1">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-brand-500" /> Available</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500" /> Saved</div>
          </div>

          {loading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}
        </div>

        {/* Property list sidebar */}
        <div className="overflow-y-auto space-y-2">
          {selected ? (
            <Link href={`/property/${selected.id}`} className="block premium-card p-4 hover:shadow-premium transition sticky top-0">
              <img src={JSON.parse(selected.images || '[]')[0]} alt="" className="w-full aspect-[4/3] rounded-xl object-cover mb-3" />
              <p className="font-medium text-slate-900 dark:text-white">{selected.title}</p>
              <p className="text-sm text-slate-400">{selected.bedrooms}bd · {selected.bathrooms}ba · {selected.squareFeet} sqft</p>
              <p className="text-lg font-bold text-brand-600 mt-1">{formatCurrency(selected.price)}</p>
              <p className="text-xs text-brand-500 mt-2">View details →</p>
            </Link>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">Click a marker to see property details</p>
          )}
          {properties.map(p => (
            <button key={p.id} onClick={() => setSelected(p)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${selected?.id === p.id ? 'bg-brand-50 dark:bg-brand-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
              <img src={JSON.parse(p.images || '[]')[0]} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.title}</p>
                <p className="text-xs text-slate-400 truncate">{p.neighborhood}, {p.city}</p>
                <p className="text-sm font-bold text-brand-600">{formatCurrency(p.price)}</p>
              </div>
              {p.saved && <div className="w-2 h-2 rounded-full bg-red-500" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
