import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Shield, GraduationCap, Train, TrendingUp, Maximize, Save } from 'lucide-react';
import { useStore } from '../lib/store';
import type { BuyerPersona } from '../types';

interface Props {
  onToast: (msg: string) => void;
}

const horizons = [
  { value: 'short-term' as const, label: 'Short-Term Starter', desc: 'Plan to move within 5 years' },
  { value: 'forever' as const, label: 'Forever Home', desc: 'Long-term settle down' },
];

const tolerances = [
  { value: 'conservative' as const, label: 'Conservative', desc: 'Prioritize safety & stability' },
  { value: 'balanced' as const, label: 'Balanced', desc: 'Mix of growth & security' },
  { value: 'aggressive' as const, label: 'Aggressive', desc: 'Maximize appreciation potential' },
];

const priorities = [
  { key: 'schools' as const, label: 'Schools', icon: GraduationCap },
  { key: 'commute' as const, label: 'Commute', icon: Train },
  { key: 'appreciation' as const, label: 'Appreciation', icon: TrendingUp },
  { key: 'lotSize' as const, label: 'Lot Size', icon: Maximize },
];

export function DecisionProfileView({ onToast }: Props) {
  const { state, dispatch } = useStore();
  const [persona, setPersona] = useState<BuyerPersona>(state.persona);

  const save = () => {
    dispatch({ type: 'UPDATE_PERSONA', persona });
    onToast('Buyer profile updated — vault rankings recalculated');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Buyer Persona</h1>
        <p className="text-sm text-slate-500">Your profile dynamically recalculates vault rankings</p>
      </div>

      {/* Investment Horizon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="flex items-center gap-2 font-display font-bold text-sm text-slate-900 mb-3">
          <Clock className="w-4 h-4 text-cyan-500" /> Investment Horizon
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {horizons.map(h => (
            <button
              key={h.value}
              onClick={() => setPersona(p => ({ ...p, investmentHorizon: h.value }))}
              className={`p-3 rounded-xl border text-left transition-all ${persona.investmentHorizon === h.value ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-500/20' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <p className="text-sm font-semibold text-slate-900">{h.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{h.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Risk Tolerance */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="flex items-center gap-2 font-display font-bold text-sm text-slate-900 mb-3">
          <Shield className="w-4 h-4 text-emerald-500" /> Risk Tolerance
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {tolerances.map(t => (
            <button
              key={t.value}
              onClick={() => setPersona(p => ({ ...p, riskTolerance: t.value }))}
              className={`p-3 rounded-xl border text-left transition-all ${persona.riskTolerance === t.value ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <p className="text-sm font-semibold text-slate-900">{t.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Priority Weightings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-display font-bold text-sm text-slate-900 mb-3">Priority Weightings</h3>
        <div className="space-y-4">
          {priorities.map(p => {
            const Icon = p.icon;
            const value = persona.priorities[p.key];
            return (
              <div key={p.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Icon className="w-4 h-4 text-slate-400" /> {p.label}
                  </span>
                  <span className="text-sm font-bold text-cyan-600">{value}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={value}
                  onChange={e => setPersona(prev => ({ ...prev, priorities: { ...prev.priorities, [p.key]: +e.target.value } }))}
                  className="w-full accent-cyan-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={save}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
      >
        <Save className="w-4 h-4" /> Save Profile & Recalculate
      </motion.button>
    </div>
  );
}
