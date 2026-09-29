import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Building2, Ruler, FileText, Palette, Lightbulb, Wrench, Sparkles } from 'lucide-react';
import type { EvaluatedProperty, ArchitecturalArchetype } from '../types';
import { useStore } from '../lib/store';
import { ArchitecturalRender, BlueprintSchematic } from './ArchitecturalRender';
import { ScoreGauge } from './ScoreGauge';
import { ARCHETYPES, getArchetype, generateArchitecturalPrompt } from '../lib/archetypes';

interface Props {
  property: EvaluatedProperty;
  onClose: () => void;
}

type Tab = 'architecture' | 'dossier';
type ViewMode = 'render' | 'blueprint';

export function ArchitecturalRenderModal({ property, onClose }: Props) {
  const { dispatch } = useStore();
  const [tab, setTab] = useState<Tab>('architecture');
  const [view, setView] = useState<ViewMode>('render');
  const [copied, setCopied] = useState(false);
  const arch = getArchetype(property.archetype);
  const ev = property.evaluation;
  const prompt = generateArchitecturalPrompt(property);

  const switchArchetype = (id: ArchitecturalArchetype) => {
    dispatch({ type: 'UPDATE_PROPERTY', property: { ...property, archetype: id } });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-50 rounded-3xl w-full max-w-5xl my-8 overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-white">{property.title}</h2>
              <p className="text-xs text-slate-400">{property.address}, {property.city} {property.zipCode}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4">
            <button
              onClick={() => setTab('architecture')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${tab === 'architecture' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Building2 className="w-4 h-4" /> Architecture
            </button>
            <button
              onClick={() => setTab('dossier')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${tab === 'dossier' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileText className="w-4 h-4" /> Evaluation Dossier
            </button>
          </div>

          {/* Content */}
          <div className="bg-white p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
            {tab === 'architecture' && (
              <div className="space-y-5">
                {/* Visual */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
                  {view === 'render' ? (
                    <ArchitecturalRender archetype={property.archetype} className="w-full h-full" />
                  ) : (
                    <BlueprintSchematic property={property} />
                  )}
                  <div className="absolute bottom-3 left-3 flex gap-1 bg-slate-900/85 backdrop-blur rounded-lg p-1">
                    <button onClick={() => setView('render')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${view === 'render' ? 'bg-cyan-500 text-white' : 'text-slate-300'}`}>
                      <Building2 className="w-3.5 h-3.5" /> 3D Render
                    </button>
                    <button onClick={() => setView('blueprint')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${view === 'blueprint' ? 'bg-cyan-500 text-white' : 'text-slate-300'}`}>
                      <Ruler className="w-3.5 h-3.5" /> Blueprint
                    </button>
                  </div>
                </div>

                {/* Archetype info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900 mb-1">{arch.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{arch.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Era: {arch.era}</p>
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1"><Palette className="w-3.5 h-3.5 text-cyan-500" /> Primary Facade Materials</p>
                      <div className="flex flex-wrap gap-1">
                        {arch.materials.map(m => <span key={m} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">{m}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1"><Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Lighting Atmosphere</p>
                      <p className="text-xs text-slate-500">{arch.lighting}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1"><Wrench className="w-3.5 h-3.5 text-emerald-500" /> Structural Features</p>
                      <ul className="space-y-0.5">
                        {arch.structuralFeatures.map(f => <li key={f} className="text-xs text-slate-500 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">▸</span>{f}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Style switcher */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 mb-2">Assign Architectural Style</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ARCHETYPES.map(a => (
                      <button
                        key={a.id}
                        onClick={() => switchArchetype(a.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${property.archetype === a.id ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <p className="text-xs font-semibold text-slate-900">{a.shortName}</p>
                        <p className="text-[10px] text-slate-400">{a.era}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt generator */}
                <div>
                  <h3 className="flex items-center gap-1.5 font-display font-bold text-sm text-slate-900 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-500" /> AI Architectural Prompt
                  </h3>
                  <div className="relative">
                    <pre className="text-xs text-slate-600 bg-slate-900 text-slate-300 p-4 rounded-xl whitespace-pre-wrap leading-relaxed pr-12">{prompt}</pre>
                    <button
                      onClick={copyPrompt}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'dossier' && (
              <div className="space-y-5">
                {/* Score */}
                <div className="flex items-center gap-6 p-4 bg-slate-900 rounded-2xl">
                  <ScoreGauge score={ev.aiScore} verdict={ev.verdict} size={100} />
                  <div className="text-white">
                    <p className="text-xs text-slate-400">Monthly Carrying Cost</p>
                    <p className="text-2xl font-display font-bold">${ev.monthlyCarryingCost.toLocaleString()}<span className="text-sm text-slate-400">/mo</span></p>
                    <p className="text-xs text-slate-400 mt-1">vs. Rent: ${property.monthlyRent.toLocaleString()}/mo</p>
                  </div>
                </div>

                {/* Score breakdown */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 mb-2">Score Breakdown</h3>
                  <div className="space-y-1.5">
                    {ev.scoreBreakdown.map(s => (
                      <div key={s.category} className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-24">{s.category}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${s.score}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-700 w-8 text-right">{Math.round(s.score)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carrying cost breakdown */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 mb-2">Monthly Carrying Cost Breakdown</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Principal & Interest', value: ev.principalAndInterest },
                      { label: 'Property Taxes', value: ev.monthlyTaxes },
                      { label: 'HOA Dues', value: ev.monthlyHoa },
                      { label: 'Insurance', value: ev.monthlyInsurance },
                      { label: 'Maintenance Reserve', value: ev.maintenanceReserve },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                        <span className="text-xs text-slate-500">{item.label}</span>
                        <span className="text-sm font-semibold text-slate-900">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5-year projection */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 mb-2">5-Year Projection</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                      <p className="text-xs text-emerald-600">Projected Equity</p>
                      <p className="text-lg font-bold text-emerald-700">${ev.fiveYearEquity.toLocaleString()}</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${ev.fiveYearNetPosition >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                      <p className={`text-xs ${ev.fiveYearNetPosition >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Net vs. Renting</p>
                      <p className={`text-lg font-bold ${ev.fiveYearNetPosition >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{ev.fiveYearNetPosition >= 0 ? '+' : ''}${ev.fiveYearNetPosition.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Due diligence */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 mb-2">Due Diligence Checklist</h3>
                  <ul className="space-y-1.5">
                    {ev.dueDiligence.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 p-2 rounded-lg bg-slate-50">
                        <span className="text-cyan-500 font-bold flex-shrink-0">?</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-emerald-700 mb-1.5">Pros</h3>
                    <ul className="space-y-1">
                      {property.pros.map((p, i) => <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5"><span className="text-emerald-500">+</span>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-red-700 mb-1.5">Cons</h3>
                    <ul className="space-y-1">
                      {property.cons.map((c, i) => <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5"><span className="text-red-500">−</span>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
