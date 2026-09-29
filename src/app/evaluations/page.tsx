'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ClipboardCheck, ChevronRight, ChevronLeft, Check, Sparkles, RotateCcw } from 'lucide-react';
import { PageHeader, EmptyState, AIDisclaimer, DataLabel } from '@/components/ui/PageParts';
import { ScoreRing, ScoreBar } from '@/components/ScoreRing';
import { formatCurrency } from '@/lib/calculations';

function EvaluationsPage() {
  const searchParams = useSearchParams();
  const propertyIdParam = searchParams.get('propertyId');
  const [mode, setMode] = useState<'list' | 'wizard' | 'result'>('list');
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [financial, setFinancial] = useState({
    downPayment: 80000, interestRate: 6.5, loanTerm: 30, propertyTax: 8000,
    hoa: 0, insurance: 1800, maintenance: 200, utilities: 200, closingCosts: 15000, renovationBudget: 0,
  });
  const [condition, setCondition] = useState({ roof: 7, foundation: 7, plumbing: 7, electrical: 7, hvac: 7, windows: 7, kitchen: 7, bathrooms: 7, exterior: 7, landscaping: 7 });

  useEffect(() => {
    Promise.all([
      fetch('/api/evaluate').then(r => r.json()),
      fetch('/api/properties?limit=50').then(r => r.json()),
    ]).then(([evals, props]) => {
      setEvaluations(evals.evaluations || []);
      setProperties(props.properties || []);
      setLoading(false);
      if (propertyIdParam) {
        setSelectedProperty(propertyIdParam);
        setMode('wizard');
      }
    });
  }, [propertyIdParam]);

  const submit = async () => {
    setSubmitting(true);
    const res = await fetch('/api/evaluate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: selectedProperty, financial, condition }),
    });
    const data = await res.json();
    setResult(data);
    setSubmitting(false);
    setMode('result');
    // Refresh list
    fetch('/api/evaluate').then(r => r.json()).then(d => setEvaluations(d.evaluations || []));
  };

  const resetWizard = () => {
    setStep(1);
    setResult(null);
    setMode('list');
  };

  if (mode === 'wizard') {
    const selectedProp = properties.find(p => p.id === selectedProperty);
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">AI Property Evaluation</h1>
          <button onClick={() => setMode('list')} className="text-sm text-slate-500 hover:text-slate-900">Cancel</button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${s === step ? 'bg-brand-500 text-white' : s < step ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 5 && <div className={`flex-1 h-0.5 mx-1 ${s < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Property */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Step 1 — Select Property</h2>
            {!selectedProperty ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {properties.map(p => (
                  <button key={p.id} onClick={() => setSelectedProperty(p.id)} className="premium-card p-3 text-left hover:border-brand-300 transition">
                    <div className="flex gap-3">
                      <img src={JSON.parse(p.images || '[]')[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.title}</p>
                        <p className="text-xs text-slate-400 truncate">{p.city}, {p.state}</p>
                        <p className="text-sm font-bold text-brand-600 mt-1">{formatCurrency(p.price)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="premium-card p-4">
                <div className="flex gap-3">
                  <img src={JSON.parse(selectedProp?.images || '[]')[0]} alt="" className="w-20 h-20 rounded-xl object-cover" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedProp?.title}</p>
                    <p className="text-sm text-slate-400">{selectedProp?.bedrooms}bd · {selectedProp?.bathrooms}ba · {selectedProp?.squareFeet} sqft</p>
                    <p className="text-lg font-bold text-brand-600">{formatCurrency(selectedProp?.price || 0)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedProperty('')} className="text-sm text-slate-500 hover:underline mt-3">Change property</button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Financials */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Step 2 — Financial Assumptions</h2>
            <div className="grid grid-cols-2 gap-4">
              <NumInput label="Down Payment" value={financial.downPayment} onChange={v => setFinancial({...financial, downPayment: v})} prefix="$" />
              <NumInput label="Interest Rate" value={financial.interestRate} onChange={v => setFinancial({...financial, interestRate: v})} suffix="%" />
              <NumInput label="Loan Term" value={financial.loanTerm} onChange={v => setFinancial({...financial, loanTerm: v})} suffix="yr" />
              <NumInput label="Property Tax (yr)" value={financial.propertyTax} onChange={v => setFinancial({...financial, propertyTax: v})} prefix="$" />
              <NumInput label="HOA (mo)" value={financial.hoa} onChange={v => setFinancial({...financial, hoa: v})} prefix="$" />
              <NumInput label="Insurance (yr)" value={financial.insurance} onChange={v => setFinancial({...financial, insurance: v})} prefix="$" />
              <NumInput label="Maintenance (mo)" value={financial.maintenance} onChange={v => setFinancial({...financial, maintenance: v})} prefix="$" />
              <NumInput label="Utilities (mo)" value={financial.utilities} onChange={v => setFinancial({...financial, utilities: v})} prefix="$" />
              <NumInput label="Closing Costs" value={financial.closingCosts} onChange={v => setFinancial({...financial, closingCosts: v})} prefix="$" />
              <NumInput label="Renovation Budget" value={financial.renovationBudget} onChange={v => setFinancial({...financial, renovationBudget: v})} prefix="$" />
            </div>
          </div>
        )}

        {/* Step 3: Condition */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Step 3 — Property Condition</h2>
            <p className="text-sm text-slate-500">Rate each system from 1 (poor) to 10 (excellent). Use your best estimate or inspection findings.</p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(condition).map(([key, val]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize mb-1 block">{key}</label>
                  <input type="range" min={1} max={10} value={val as number} onChange={e => setCondition({...condition, [key]: parseInt(e.target.value)})} className="w-full accent-brand-500" />
                  <span className="text-xs text-slate-400">{val}/10</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Priorities */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Step 4 — Review & Confirm</h2>
            <div className="premium-card p-4 space-y-2">
              <p className="text-sm text-slate-500">Property: <span className="font-medium text-slate-900 dark:text-white">{selectedProp?.title}</span></p>
              <p className="text-sm text-slate-500">Down Payment: <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(financial.downPayment)}</span></p>
              <p className="text-sm text-slate-500">Interest Rate: <span className="font-medium text-slate-900 dark:text-white">{financial.interestRate}%</span></p>
              <p className="text-sm text-slate-500">Loan Term: <span className="font-medium text-slate-900 dark:text-white">{financial.loanTerm} years</span></p>
              <p className="text-sm text-slate-500">Condition Avg: <span className="font-medium text-slate-900 dark:text-white">{(Object.values(condition).reduce((a, b) => a + b, 0) / 10).toFixed(1)}/10</span></p>
            </div>
            <p className="text-sm text-slate-500">Your priority weights from your profile will be applied to calculate the personal match score. You can adjust these in Settings.</p>
          </div>
        )}

        {/* Step 5: Processing */}
        {step === 5 && (
          <div className="flex flex-col items-center justify-center py-12">
            {submitting ? (
              <>
                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-500">Analyzing property with AI...</p>
              </>
            ) : (
              <button onClick={submit} className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600">Generate Evaluation</button>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 disabled:opacity-50 transition min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !selectedProperty}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 transition min-h-[44px]"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            !submitting && <button onClick={submit} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 min-h-[44px]">Generate Evaluation</button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'result' && result) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Evaluation Results</h1>
          <button onClick={resetWizard} className="flex items-center gap-1 text-sm text-brand-500 font-medium hover:underline">
            <RotateCcw className="w-4 h-4" /> New Evaluation
          </button>
        </div>

        {/* Overall score */}
        <div className="premium-card p-6 mb-6 flex flex-col items-center">
          <ScoreRing score={result.scores.overallScore} size={140} strokeWidth={10} />
          <p className="text-sm text-slate-500 mt-3">Overall BetterHome Score</p>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="premium-card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              <ScoreBar score={result.scores.financialFitScore} label="Financial Fit" />
              <ScoreBar score={result.scores.locationFitScore} label="Location Fit" />
              <ScoreBar score={result.scores.lifestyleFitScore} label="Lifestyle Fit" />
              <ScoreBar score={result.scores.conditionScore} label="Property Condition" />
              <ScoreBar score={result.scores.riskScore} label="Risk Assessment" />
              <ScoreBar score={result.scores.longTermAffordabilityScore} label="Long-Term Affordability" />
              <ScoreBar score={result.scores.personalMatchScore} label="Personal Match" />
            </div>
          </div>

          {/* AI Summary */}
          <div className="premium-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">AI Summary</h3>
              <DataLabel type="ai" />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{result.aiSummary}</div>
          </div>
        </div>

        {/* Why this score */}
        <div className="premium-card p-5 mb-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Why This Score? — Transparent Explanation</h3>
          <div className="space-y-4">
            {result.scores.explanations.map((exp: any, i: number) => (
              <div key={i} className="border-l-2 border-brand-300 dark:border-brand-700 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-slate-900 dark:text-white">{exp.factor}</span>
                  <span className="text-xs text-slate-400">Score: {exp.score}/100 · Weight: {exp.weight}%</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{exp.reasoning}</p>
                <div className="flex flex-wrap gap-1">
                  {exp.dataSources.map((s: string, j: number) => <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{s}</span>)}
                </div>
                {exp.assumptions.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1">Assumptions: {exp.assumptions.join('; ')}</p>
                )}
              </div>
            ))}
          </div>
          <AIDisclaimer />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/property/${result.evaluation.propertyId}`} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition">View Property</Link>
          <Link href={`/report?propertyId=${result.evaluation.propertyId}`} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition">Generate Report</Link>
          <Link href="/compare" className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition">Compare</Link>
        </div>
      </div>
    );
  }

  // List mode
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader
        title="Evaluations"
        subtitle="AI-powered property evaluations with transparent scoring"
        icon={ClipboardCheck}
        action={
          <button onClick={() => { setMode('wizard'); setStep(1); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition min-h-[44px]">
            <ClipboardCheck className="w-4 h-4" /> New Evaluation
          </button>
        }
      />
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
      ) : evaluations.length > 0 ? (
        <div className="space-y-3">
          {evaluations.map(e => (
            <Link key={e.id} href={`/property/${e.propertyId}`} className="block premium-card p-4 hover:shadow-premium transition">
              <div className="flex items-center gap-4">
                <ScoreRing score={e.overallScore} size={64} strokeWidth={6} label={false} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{e.property?.title}</p>
                  <p className="text-sm text-slate-400">{e.property?.city}, {e.property?.state} · {formatCurrency(e.property?.price || 0)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Evaluated {new Date(e.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="hidden sm:flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400">Financial: {e.financialFitScore}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">Match: {e.personalMatchScore}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardCheck}
          title="No evaluations yet"
          description="Run an AI-powered evaluation to get a transparent 0–100 score with detailed explanations for any property."
          action={<button onClick={() => { setMode('wizard'); setStep(1); }} className="px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600">Start Evaluation</button>}
        />
      )}
    </div>
  );
}

function NumInput({ label, value, onChange, prefix, suffix }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm focus:border-brand-400 transition ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}

export default function EvaluationsPageWrapper() {
  return <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8"><div className="h-32 skeleton rounded-2xl" /></div>}><EvaluationsPage /></Suspense>;
}
