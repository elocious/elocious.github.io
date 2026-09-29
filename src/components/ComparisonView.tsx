import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Printer, Trophy, AlertTriangle, Waves, Building, Wrench, X, GitCompare } from 'lucide-react';
import { useStore } from '../lib/store';
import { ArchitecturalRender } from './ArchitecturalRender';
import { ScoreGauge, verdictBg } from './ScoreGauge';
import { getArchetype } from '../lib/archetypes';
import { fetchComparison } from '../lib/api';
import type { EvaluatedProperty } from '../types';

interface Props {
  onOpenDossier: (p: EvaluatedProperty) => void;
}

interface Metric {
  label: string;
  getValue: (p: EvaluatedProperty) => string;
  getNum: (p: EvaluatedProperty) => number;
  higherIsBetter: boolean;
  format?: (n: number) => string;
}

const metrics: Metric[] = [
  { label: 'AI Score', getValue: p => `${p.evaluation.aiScore}`, getNum: p => p.evaluation.aiScore, higherIsBetter: true },
  { label: 'Price', getValue: p => `$${p.price.toLocaleString()}`, getNum: p => p.price, higherIsBetter: false },
  { label: 'Monthly Carrying', getValue: p => `$${p.evaluation.monthlyCarryingCost.toLocaleString()}`, getNum: p => p.evaluation.monthlyCarryingCost, higherIsBetter: false },
  { label: 'Monthly Rent', getValue: p => `$${p.monthlyRent.toLocaleString()}`, getNum: p => p.monthlyRent, higherIsBetter: false },
  { label: 'Safety', getValue: p => `${p.safetyScore}/10`, getNum: p => p.safetyScore, higherIsBetter: true },
  { label: 'Schools', getValue: p => `${p.schoolRating}/10`, getNum: p => p.schoolRating, higherIsBetter: true },
  { label: 'Walkability', getValue: p => `${p.walkability}`, getNum: p => p.walkability, higherIsBetter: true },
  { label: 'Transit', getValue: p => `${p.transitScore}`, getNum: p => p.transitScore, higherIsBetter: true },
  { label: 'Year Built', getValue: p => `${p.yearBuilt}`, getNum: p => p.yearBuilt, higherIsBetter: true },
  { label: 'Sqft', getValue: p => p.sqft.toLocaleString(), getNum: p => p.sqft, higherIsBetter: true },
  { label: '$/Sqft', getValue: p => `$${p.evaluation.costPerSqft}`, getNum: p => p.evaluation.costPerSqft, higherIsBetter: false },
  { label: 'HOA', getValue: p => p.hoaDues > 0 ? `$${p.hoaDues}/mo` : 'None', getNum: p => p.hoaDues, higherIsBetter: false },
];

const textMetrics: { label: string; render: (p: EvaluatedProperty) => { text: string; isBest?: boolean } }[] = [
  { label: 'Verdict', render: p => ({ text: p.evaluation.verdict, isBest: p.evaluation.verdict === 'BUY' }) },
  { label: 'Bedrooms', render: p => ({ text: `${p.bedrooms}` }) },
  { label: 'Bathrooms', render: p => ({ text: `${p.bathrooms}` }) },
  { label: 'Parking', render: p => ({ text: p.garage ? 'Garage' : 'None', isBest: p.garage }) },
  { label: 'Flood Risk', render: p => ({ text: p.floodRisk.toUpperCase(), isBest: p.floodRisk === 'low' }) },
  { label: 'Lot Size', render: p => ({ text: p.lotSize ? `${p.lotSize.toLocaleString()} sf` : 'N/A' }) },
];

export function ComparisonView({ onOpenDossier }: Props) {
  const { state, dispatch } = useStore();
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const properties = useMemo(
    () => state.comparisonIds.map(id => state.properties.find(p => p.id === id)).filter(Boolean) as EvaluatedProperty[],
    [state.comparisonIds, state.properties]
  );

  useEffect(() => {
    if (properties.length < 2) { setAnalysis(''); return; }
    setLoading(true);
    fetchComparison(properties)
      .then(setAnalysis)
      .catch(() => setAnalysis('Unable to generate AI analysis. Please try again.'))
      .finally(() => setLoading(false));
  }, [state.comparisonIds]);

  const winner = properties.length > 0 ? properties.reduce((a, b) => (a.evaluation.aiScore >= b.evaluation.aiScore ? a : b)) : null;

  if (properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <GitCompare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="font-display font-bold text-xl text-slate-900 mb-1">No properties to compare</h2>
        <p className="text-sm text-slate-500 mb-5">Add properties to the comparison workspace from your vault</p>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'vault' })} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
          Go to Vault
        </button>
      </div>
    );
  }

  const colWidth = `${100 / (properties.length + 1)}%`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Comparison Workspace</h1>
          <p className="text-sm text-slate-500">{properties.length} of 4 properties · side-by-side analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors">
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
          <button onClick={() => dispatch({ type: 'CLEAR_COMPARISON' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>

      {/* AI Winner badge */}
      {winner && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">AI Winner: {winner.title}</p>
            <p className="text-xs text-slate-500">Score {winner.evaluation.aiScore}/100 · {winner.evaluation.verdict} · ${winner.evaluation.monthlyCarryingCost.toLocaleString()}/mo</p>
          </div>
        </motion.div>
      )}

      {/* AI Analysis */}
      {properties.length >= 2 && (
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-300">
          <p className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> AI Trade-off Analysis
          </p>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              Analyzing properties...
            </div>
          ) : (
            <div className="markdown text-sm" dangerouslySetInnerHTML={{ __html: analysis }} />
          )}
        </div>
      )}

      {/* Comparison matrix */}
      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[600px] space-y-px">
          {/* Header row: renders */}
          <div className="flex gap-px">
            <div style={{ width: colWidth }} className="flex-shrink-0" />
            {properties.map(p => {
              const arch = getArchetype(p.archetype);
              const isWinner = winner?.id === p.id;
              return (
                <div key={p.id} style={{ width: colWidth }} className={`flex-shrink-0 p-2 ${isWinner ? 'bg-emerald-50' : 'bg-white'} rounded-t-2xl border-b-2 ${isWinner ? 'border-emerald-500' : 'border-transparent'}`}>
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-2">
                    <ArchitecturalRender archetype={p.archetype} className="w-full h-full" />
                  </div>
                  <p className="font-display font-bold text-sm text-slate-900 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400 truncate">{p.city}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${verdictBg[p.evaluation.verdict]}`}>{p.evaluation.verdict}</span>
                    <span className="text-[10px] text-slate-400">{arch.shortName}</span>
                  </div>
                  <button onClick={() => onOpenDossier(p)} className="mt-2 w-full py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                    View Dossier
                  </button>
                </div>
              );
            })}
          </div>

          {/* Numeric metrics */}
          {metrics.map(m => {
            const bestVal = m.higherIsBetter ? Math.max(...properties.map(m.getNum)) : Math.min(...properties.map(m.getNum));
            return (
              <div key={m.label} className="flex gap-px">
                <div style={{ width: colWidth }} className="flex-shrink-0 px-3 py-2.5 bg-slate-100 text-xs font-medium text-slate-500 flex items-center">{m.label}</div>
                {properties.map(p => {
                  const isBest = m.getNum(p) === bestVal && properties.length > 1;
                  return (
                    <div key={p.id} style={{ width: colWidth }} className={`flex-shrink-0 px-3 py-2.5 text-sm font-semibold ${isBest ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-700'} flex items-center`}>
                      {m.getValue(p)}
                      {isBest && <span className="ml-1 text-emerald-500 text-xs">★</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Text metrics */}
          {textMetrics.map(m => (
            <div key={m.label} className="flex gap-px">
              <div style={{ width: colWidth }} className="flex-shrink-0 px-3 py-2.5 bg-slate-100 text-xs font-medium text-slate-500 flex items-center">{m.label}</div>
              {properties.map(p => {
                const r = m.render(p);
                return (
                  <div key={p.id} style={{ width: colWidth }} className={`flex-shrink-0 px-3 py-2.5 text-sm font-semibold ${r.isBest ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-700'} flex items-center`}>
                    {r.text}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Risk flags */}
          <div className="flex gap-px pt-2">
            <div style={{ width: colWidth }} className="flex-shrink-0 px-3 py-2 bg-slate-100 text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Risk Flags
            </div>
            {properties.map(p => (
              <div key={p.id} style={{ width: colWidth }} className="flex-shrink-0 px-3 py-2 bg-white space-y-1">
                {p.floodRisk === 'high' && <span className="flex items-center gap-1 text-xs text-red-600"><Waves className="w-3 h-3" /> Flood Zone</span>}
                {p.hoaDues > 400 && <span className="flex items-center gap-1 text-xs text-amber-600"><Building className="w-3 h-3" /> High HOA</span>}
                {p.yearBuilt < 1980 && <span className="flex items-center gap-1 text-xs text-amber-600"><Wrench className="w-3 h-3" /> Deferred Maint.</span>}
                {p.floodRisk !== 'high' && p.hoaDues <= 400 && p.yearBuilt >= 1980 && <span className="text-xs text-emerald-600">No major risks</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


