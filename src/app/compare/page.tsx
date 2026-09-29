'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GitCompare, Sparkles, X, Check, Minus, AlertTriangle } from 'lucide-react';
import { PageHeader, EmptyState, AIDisclaimer, DataLabel } from '@/components/ui/PageParts';
import { ScoreBar } from '@/components/ScoreRing';
import { formatCurrency } from '@/lib/calculations';

function ComparePage() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids');
  const [properties, setProperties] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetch('/api/properties?limit=50').then(r => r.json()).then(d => {
      setAllProperties(d.properties || []);
      if (initialIds) {
        setSelected([initialIds]);
        runComparison([initialIds]);
      }
    });
  }, [initialIds]);

  const runComparison = async (ids: string[]) => {
    if (ids.length < 2) return;
    setLoading(true);
    const res = await fetch('/api/compare', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyIds: ids }),
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const toggleProperty = (id: string) => {
    let newSelected: string[];
    if (selected.includes(id)) {
      newSelected = selected.filter(s => s !== id);
    } else {
      if (selected.length >= 4) return;
      newSelected = [...selected, id];
    }
    setSelected(newSelected);
    if (newSelected.length >= 2) runComparison(newSelected);
    else setResults(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader
        title="Compare Properties"
        subtitle="Compare up to 4 properties side by side with AI-powered trade-off analysis"
        icon={GitCompare}
      />

      {/* Property picker */}
      <div className="premium-card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Selected: {selected.length}/4</p>
          <button onClick={() => setShowPicker(!showPicker)} className="text-sm text-brand-500 font-medium hover:underline">
            {showPicker ? 'Done' : 'Add properties'}
          </button>
        </div>
        {selected.length === 0 && !showPicker && (
          <p className="text-sm text-slate-400 text-center py-4">Select at least 2 properties to compare</p>
        )}
        {showPicker && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto mb-3">
            {allProperties.map(p => (
              <button key={p.id} onClick={() => toggleProperty(p.id)} className={`flex items-center gap-3 p-2 rounded-xl border transition ${selected.includes(p.id) ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-800 hover:border-brand-300'}`}>
                <img src={JSON.parse(p.images || '[]')[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-slate-400">{formatCurrency(p.price)}</p>
                </div>
                {selected.includes(p.id) && <Check className="w-4 h-4 text-brand-500 ml-auto" />}
              </button>
            ))}
          </div>
        )}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map(id => {
              const p = allProperties.find(x => x.id === id);
              if (!p) return null;
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{p.title}</span>
                  <button onClick={() => toggleProperty(id)} className="text-slate-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {loading && <div className="text-center py-8"><div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}

      {results && !loading && (
        <div className="space-y-6">
          {/* Comparison table */}
          <div className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left p-4 text-sm font-medium text-slate-500 sticky left-0 bg-white dark:bg-slate-900 z-10">Metric</th>
                    {results.results.map((r: any) => (
                      <th key={r.property.id} className="text-left p-4 min-w-[180px]">
                        <Link href={`/property/${r.property.id}`} className="block">
                          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2">
                            <img src={r.property.images?.[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{r.property.title}</p>
                          <p className="text-xs text-slate-400">{r.property.city}</p>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <CompareRow label="Price" values={results.results.map((r: any) => formatCurrency(r.property.price))} />
                  <CompareRow label="Rent" values={results.results.map((r: any) => r.property.rent ? formatCurrency(r.property.rent) + '/mo' : 'N/A')} />
                  <CompareRow label="Bedrooms" values={results.results.map((r: any) => String(r.property.bedrooms))} />
                  <CompareRow label="Bathrooms" values={results.results.map((r: any) => String(r.property.bathrooms))} />
                  <CompareRow label="Square Feet" values={results.results.map((r: any) => r.property.squareFeet.toLocaleString())} />
                  <CompareRow label="Cost / Sqft" values={results.results.map((r: any) => formatCurrency(r.property.price / r.property.squareFeet))} />
                  <CompareRow label="Year Built" values={results.results.map((r: any) => String(r.property.yearBuilt || 'N/A'))} />
                  <CompareRow label="Lot Size" values={results.results.map((r: any) => r.property.lotSize ? r.property.lotSize.toLocaleString() : 'N/A')} />
                  <CompareRow label="Parking" values={results.results.map((r: any) => String(r.property.parking))} />
                  <CompareRow label="School Rating" values={results.results.map((r: any) => r.property.schoolRating ? `${r.property.schoolRating}/10` : 'N/A')} />
                  <CompareRow label="Safety Score" values={results.results.map((r: any) => r.property.safetyScore ? `${r.property.safetyScore}/100` : 'N/A')} />
                  <CompareRow label="Walkability" values={results.results.map((r: any) => r.property.walkabilityScore ? `${r.property.walkabilityScore}/100` : 'N/A')} />
                  <CompareRow label="Flood Risk" values={results.results.map((r: any) => r.property.floodRisk || 'N/A')} />
                  <CompareRow label="HOA" values={results.results.map((r: any) => r.property.hoa ? formatCurrency(r.property.hoa) + '/mo' : 'None')} />
                  <CompareRow label="Overall Score" values={results.results.map((r: any) => `${r.scores.overallScore}/100`)} highlight />
                  <CompareRow label="Financial Fit" values={results.results.map((r: any) => `${r.scores.financialFitScore}/100`)} />
                  <CompareRow label="Location Fit" values={results.results.map((r: any) => `${r.scores.locationFitScore}/100`)} />
                  <CompareRow label="Personal Match" values={results.results.map((r: any) => `${r.scores.personalMatchScore}/100`)} />
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Trade-offs */}
          <div className="premium-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-gold-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Key Trade-offs</h3>
            </div>
            <div className="space-y-2">
              {results.tradeoffs?.map((t: string, i: number) => (
                <div key={i} className="text-sm text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40" dangerouslySetInnerHTML={{ __html: t }} />
              ))}
            </div>
          </div>

          {/* AI Trade-off Analysis */}
          <div className="premium-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">AI Trade-off Analysis</h3>
              <DataLabel type="ai" />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{results.aiTradeoffs}</div>
            <AIDisclaimer />
          </div>
        </div>
      )}

      {!results && !loading && selected.length < 2 && (
        <EmptyState
          icon={GitCompare}
          title="Select properties to compare"
          description="Choose 2–4 properties to see a detailed side-by-side comparison with AI-powered trade-off analysis."
        />
      )}
    </div>
  );
}

function CompareRow({ label, values, highlight }: { label: string; values: string[]; highlight?: boolean }) {
  // Find best value (for numeric values, lower price is better, higher scores are better)
  const isScore = label.includes('Score') || label.includes('Fit') || label.includes('Match');
  const numericValues = values.map(v => parseFloat(v.replace(/[^0-9.]/g, '')));
  const validIdx = numericValues.map((v, i) => isNaN(v) ? -1 : i).filter(i => i >= 0);
  let bestIdx = -1;
  if (validIdx.length > 0) {
    if (label === 'Price' || label === 'Cost / Sqft' || label === 'HOA' || label === 'Rent') {
      bestIdx = validIdx.reduce((best, i) => numericValues[i] < numericValues[best] ? i : best, validIdx[0]);
    } else if (isScore) {
      bestIdx = validIdx.reduce((best, i) => numericValues[i] > numericValues[best] ? i : best, validIdx[0]);
    }
  }

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/50">
      <td className="p-4 text-sm font-medium text-slate-500 sticky left-0 bg-white dark:bg-slate-900 z-10">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={`p-4 text-sm ${highlight ? 'font-bold' : ''} ${i === bestIdx ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
          {v}{i === bestIdx && <span className="ml-1 text-xs">★</span>}
        </td>
      ))}
    </tr>
  );
}

export default function ComparePageWrapper() {
  return <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8"><div className="h-32 skeleton rounded-2xl" /></div>}><ComparePage /></Suspense>;
}
