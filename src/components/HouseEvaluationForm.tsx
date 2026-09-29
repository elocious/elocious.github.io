import { useState, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, Sparkles, Plus, X } from 'lucide-react';
import type { PropertyInput, EvaluatedProperty, ArchitecturalArchetype, PropertyType, FloodRisk } from '../types';
import { useStore } from '../lib/store';
import { evaluateProperty } from '../lib/evaluation';
import { ScoreGauge } from './ScoreGauge';
import { ARCHETYPES } from '../lib/archetypes';

const defaultForm: PropertyInput = {
  title: '', address: '', city: '', zipCode: '',
  propertyType: 'house', archetype: 'contemporary-organic',
  price: 500000, monthlyRent: 2500, propertyTaxes: 6000, hoaDues: 0, insurance: 1500,
  bedrooms: 3, bathrooms: 2, sqft: 1800, yearBuilt: 2000,
  garage: true, lotSize: 5000, heating: true, cooling: true, solar: false, yard: true,
  safetyScore: 7, schoolRating: 7, walkability: 50, transitScore: 40,
  parkAccess: true, floodRisk: 'low', noiseLevel: 4, appreciationPotential: 6,
  affordabilityComfort: 7, appearanceRating: 7, neighborhoodVibe: 7,
  pros: [], cons: [],
  interestRate: 6.5, downPayment: 20,
};

const presets: { name: string; emoji: string; values: Partial<PropertyInput> }[] = [
  { name: 'Suburban Dream', emoji: '🏡', values: { propertyType: 'house', archetype: 'contemporary-organic', price: 850000, monthlyRent: 3200, propertyTaxes: 8400, hoaDues: 0, insurance: 1800, bedrooms: 4, bathrooms: 2.5, sqft: 2400, yearBuilt: 1998, garage: true, lotSize: 7200, heating: true, cooling: true, solar: false, yard: true, safetyScore: 8, schoolRating: 9, walkability: 45, transitScore: 35, parkAccess: true, floodRisk: 'low', noiseLevel: 3, appreciationPotential: 7, affordabilityComfort: 7, appearanceRating: 8, neighborhoodVibe: 8, interestRate: 6.5, downPayment: 20 } },
  { name: 'Downtown Sky Condo', emoji: '🏢', values: { propertyType: 'condo', archetype: 'postmodern-glass', price: 625000, monthlyRent: 2800, propertyTaxes: 5200, hoaDues: 480, insurance: 1200, bedrooms: 2, bathrooms: 2, sqft: 1100, yearBuilt: 2020, garage: true, lotSize: 0, heating: true, cooling: true, solar: false, yard: false, safetyScore: 6, schoolRating: 6, walkability: 92, transitScore: 88, parkAccess: true, floodRisk: 'low', noiseLevel: 7, appreciationPotential: 6, affordabilityComfort: 6, appearanceRating: 9, neighborhoodVibe: 7, interestRate: 6.5, downPayment: 15 } },
  { name: 'Mid-Century Fixer', emoji: '🏚️', values: { propertyType: 'house', archetype: 'mid-century-craftsman', price: 475000, monthlyRent: 2200, propertyTaxes: 5800, hoaDues: 0, insurance: 1400, bedrooms: 3, bathrooms: 1.5, sqft: 1680, yearBuilt: 1962, garage: true, lotSize: 5800, heating: true, cooling: false, solar: false, yard: true, safetyScore: 7, schoolRating: 7, walkability: 68, transitScore: 55, parkAccess: true, floodRisk: 'low', noiseLevel: 4, appreciationPotential: 8, affordabilityComfort: 8, appearanceRating: 5, neighborhoodVibe: 7, interestRate: 6.5, downPayment: 10 } },
  { name: 'Waterfront Flood Risk', emoji: '🌊', values: { propertyType: 'house', archetype: 'biophilic-waterfront', price: 1150000, monthlyRent: 4200, propertyTaxes: 11500, hoaDues: 0, insurance: 2400, bedrooms: 3, bathrooms: 2, sqft: 1950, yearBuilt: 2005, garage: true, lotSize: 8400, heating: true, cooling: true, solar: true, yard: true, safetyScore: 8, schoolRating: 8, walkability: 40, transitScore: 30, parkAccess: true, floodRisk: 'high', noiseLevel: 3, appreciationPotential: 6, affordabilityComfort: 5, appearanceRating: 9, neighborhoodVibe: 9, interestRate: 6.5, downPayment: 20 } },
  { name: 'Modern Luxury Townhome', emoji: '🏘️', values: { propertyType: 'townhouse', archetype: 'urban-monolithic', price: 725000, monthlyRent: 3000, propertyTaxes: 6800, hoaDues: 185, insurance: 1100, bedrooms: 3, bathrooms: 2.5, sqft: 1850, yearBuilt: 2023, garage: true, lotSize: 2200, heating: true, cooling: true, solar: false, yard: true, safetyScore: 7, schoolRating: 8, walkability: 72, transitScore: 60, parkAccess: true, floodRisk: 'low', noiseLevel: 5, appreciationPotential: 7, affordabilityComfort: 7, appearanceRating: 9, neighborhoodVibe: 8, interestRate: 6.5, downPayment: 15 } },
];

const steps = ['Property Info', 'Financials', 'Structure', 'Neighborhood', 'Sentiment'];

/* ── Form helpers ── */
const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>{children}</div>;
}

function NumField({ label, value, onChange, step, prefix }: { label: string; value: number; onChange: (v: number) => void; step?: number; prefix?: string }) {
  return (
    <Field label={label}>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{prefix}</span>}
        <input type="number" value={value || ''} step={step ?? 1} onChange={e => onChange(+e.target.value || 0)}
          className={inputClass + (prefix ? ' pl-7' : '')} />
      </div>
    </Field>
  );
}

function SliderField({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; suffix?: string }) {
  return (
    <Field label={`${label}: ${value}${suffix ?? ''}`}>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} className="w-full accent-cyan-500" />
    </Field>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-2 py-2">
      <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-slate-200'}`}>
        <div className={`w-4 h-4 rounded-full bg-white m-1 transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <span className="text-sm text-slate-600">{label}</span>
    </button>
  );
}

function ListInput({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState('');
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (input.trim()) { onChange([...items, input.trim()]); setInput(''); } } }} placeholder={placeholder} className={inputClass} />
        <button type="button" onClick={() => { if (input.trim()) { onChange([...items, input.trim()]); setInput(''); } }} className="px-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-600">
            {item}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
    </Field>
  );
}

interface Props {
  onDone: () => void;
  onToast: (msg: string) => void;
}

export function HouseEvaluationForm({ onDone, onToast }: Props) {
  const { dispatch } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PropertyInput>(defaultForm);

  const update = (patch: Partial<PropertyInput>) => setForm(f => ({ ...f, ...patch }));
  const liveEval = useMemo(() => evaluateProperty(form), [form]);

  const loadPreset = (values: Partial<PropertyInput>) => {
    setForm(f => ({ ...f, ...values, title: f.title || 'New Property', address: f.address || '' }));
  };

  const submit = () => {
    if (!form.title || !form.address) {
      onToast('Please fill in the property title and address');
      setStep(0);
      return;
    }
    const property: EvaluatedProperty = {
      ...form,
      id: `prop-${Date.now()}`,
      evaluation: evaluateProperty(form),
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD_PROPERTY', property });
    onToast(`${form.title} added to your vault`);
    onDone();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Main form */}
        <div className="space-y-5">
          {/* Presets */}
          <div>
            <h2 className="flex items-center gap-2 font-display font-bold text-base text-slate-900 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-500" /> Quick Scenario Presets
            </h2>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button key={p.name} onClick={() => loadPreset(p.values)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-cyan-400 hover:bg-cyan-50 transition-all">
                  <span>{p.emoji}</span> {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <button onClick={() => setStep(i)} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-slate-900' : 'text-slate-400'}`}>{s}</span>
                </button>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded ${i < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {step === 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><Field label="Property Title"><input value={form.title} onChange={e => update({ title: e.target.value })} placeholder="e.g. Mercer Island Family Home" className={inputClass} /></Field></div>
                    <div className="col-span-2"><Field label="Address"><input value={form.address} onChange={e => update({ address: e.target.value })} placeholder="123 Main St" className={inputClass} /></Field></div>
                    <Field label="City"><input value={form.city} onChange={e => update({ city: e.target.value })} placeholder="Seattle" className={inputClass} /></Field>
                    <Field label="Zip Code"><input value={form.zipCode} onChange={e => update({ zipCode: e.target.value })} placeholder="98101" className={inputClass} /></Field>
                    <Field label="Property Type">
                      <select value={form.propertyType} onChange={e => update({ propertyType: e.target.value as PropertyType })} className={inputClass}>
                        <option value="house">House</option><option value="condo">Condo</option><option value="townhouse">Townhouse</option><option value="apartment">Apartment</option>
                      </select>
                    </Field>
                    <Field label="Architectural Archetype">
                      <select value={form.archetype} onChange={e => update({ archetype: e.target.value as ArchitecturalArchetype })} className={inputClass}>
                        {ARCHETYPES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </Field>
                  </div>
                )}
                {step === 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    <NumField label="Listing Price" value={form.price} onChange={v => update({ price: v })} step={10000} prefix="$" />
                    <NumField label="Monthly Rent Equivalent" value={form.monthlyRent} onChange={v => update({ monthlyRent: v })} step={100} prefix="$" />
                    <NumField label="Annual Property Taxes" value={form.propertyTaxes} onChange={v => update({ propertyTaxes: v })} step={100} prefix="$" />
                    <NumField label="Monthly HOA Dues" value={form.hoaDues} onChange={v => update({ hoaDues: v })} step={10} prefix="$" />
                    <NumField label="Annual Insurance" value={form.insurance} onChange={v => update({ insurance: v })} step={100} prefix="$" />
                    <NumField label="Interest Rate (%)" value={form.interestRate} onChange={v => update({ interestRate: v })} step={0.1} />
                    <NumField label="Down Payment (%)" value={form.downPayment} onChange={v => update({ downPayment: v })} step={1} />
                  </div>
                )}
                {step === 2 && (
                  <div className="grid grid-cols-2 gap-3">
                    <NumField label="Bedrooms" value={form.bedrooms} onChange={v => update({ bedrooms: v })} />
                    <NumField label="Bathrooms" value={form.bathrooms} onChange={v => update({ bathrooms: v })} step={0.5} />
                    <NumField label="Square Footage" value={form.sqft} onChange={v => update({ sqft: v })} step={50} />
                    <NumField label="Year Built" value={form.yearBuilt} onChange={v => update({ yearBuilt: v })} />
                    <NumField label="Lot Size (sqft)" value={form.lotSize} onChange={v => update({ lotSize: v })} step={100} />
                    <div className="grid grid-cols-2 gap-2 col-span-2">
                      <Toggle label="Garage" checked={form.garage} onChange={v => update({ garage: v })} />
                      <Toggle label="Heating" checked={form.heating} onChange={v => update({ heating: v })} />
                      <Toggle label="Cooling / AC" checked={form.cooling} onChange={v => update({ cooling: v })} />
                      <Toggle label="Solar Panels" checked={form.solar} onChange={v => update({ solar: v })} />
                      <Toggle label="Yard" checked={form.yard} onChange={v => update({ yard: v })} />
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="grid grid-cols-2 gap-3">
                    <SliderField label="Safety Score" value={form.safetyScore} onChange={v => update({ safetyScore: v })} min={1} max={10} />
                    <SliderField label="School Rating" value={form.schoolRating} onChange={v => update({ schoolRating: v })} min={1} max={10} />
                    <SliderField label="Walkability" value={form.walkability} onChange={v => update({ walkability: v })} min={0} max={100} />
                    <SliderField label="Transit Score" value={form.transitScore} onChange={v => update({ transitScore: v })} min={0} max={100} />
                    <SliderField label="Noise Level" value={form.noiseLevel} onChange={v => update({ noiseLevel: v })} min={1} max={10} />
                    <SliderField label="Appreciation Potential" value={form.appreciationPotential} onChange={v => update({ appreciationPotential: v })} min={1} max={10} />
                    <Field label="Flood Risk">
                      <select value={form.floodRisk} onChange={e => update({ floodRisk: e.target.value as FloodRisk })} className={inputClass}>
                        <option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option>
                      </select>
                    </Field>
                    <Toggle label="Park Access" checked={form.parkAccess} onChange={v => update({ parkAccess: v })} />
                  </div>
                )}
                {step === 4 && (
                  <div className="grid grid-cols-2 gap-3">
                    <SliderField label="Affordability Comfort" value={form.affordabilityComfort} onChange={v => update({ affordabilityComfort: v })} min={1} max={10} />
                    <SliderField label="Appearance Rating" value={form.appearanceRating} onChange={v => update({ appearanceRating: v })} min={1} max={10} />
                    <SliderField label="Neighborhood Vibe" value={form.neighborhoodVibe} onChange={v => update({ neighborhoodVibe: v })} min={1} max={10} />
                    <div className="col-span-2 grid grid-cols-2 gap-3">
                      <ListInput label="Pros" items={form.pros} onChange={v => update({ pros: v })} placeholder="Great schools" />
                      <ListInput label="Cons" items={form.cons} onChange={v => update({ cons: v })} placeholder="High HOA" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                <Check className="w-4 h-4" /> Evaluate & Save
              </button>
            )}
          </div>
        </div>

        {/* Live evaluation preview */}
        <div className="hidden lg:block">
          <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900">Live Evaluation Preview</h3>
            <div className="flex justify-center">
              <ScoreGauge score={liveEval.aiScore} verdict={liveEval.verdict} size={120} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span className="text-slate-500">Monthly Carrying Cost</span><span className="font-semibold text-slate-900">${liveEval.monthlyCarryingCost.toLocaleString()}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Rent Equivalent</span><span className="font-semibold text-slate-900">${form.monthlyRent.toLocaleString()}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Cost per Sqft</span><span className="font-semibold text-slate-900">${liveEval.costPerSqft}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">5yr Equity</span><span className="font-semibold text-emerald-600">${liveEval.fiveYearEquity.toLocaleString()}</span></div>
            </div>
            <div className="space-y-1.5">
              {liveEval.scoreBreakdown.map(s => (
                <div key={s.category} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-20">{s.category}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
