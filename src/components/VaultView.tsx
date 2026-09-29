import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, SearchX } from 'lucide-react';
import { useStore } from '../lib/store';
import { FilterBar, defaultFilters, type FilterState } from './FilterBar';
import { PropertyCard, PropertyCardCompact } from './PropertyCard';
import type { EvaluatedProperty } from '../types';

interface Props {
  onOpenDossier: (p: EvaluatedProperty) => void;
  onToast: (msg: string) => void;
}

export function VaultView({ onOpenDossier }: Props) {
  const { state, dispatch } = useStore();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const cities = useMemo(() => [...new Set(state.properties.map(p => p.city))].sort(), [state.properties]);

  const filtered = useMemo(() => {
    let result = [...state.properties];
    const q = filters.search.toLowerCase();
    if (q) result = result.filter(p => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.zipCode.includes(q));
    if (filters.verdicts.length) result = result.filter(p => filters.verdicts.includes(p.evaluation.verdict));
    if (filters.city) result = result.filter(p => p.city === filters.city);
    if (filters.priceMin > 0) result = result.filter(p => p.price >= filters.priceMin);
    if (filters.priceMax > 0) result = result.filter(p => p.price <= filters.priceMax);
    if (filters.scoreTier === 'high') result = result.filter(p => p.evaluation.aiScore >= 80);
    else if (filters.scoreTier === 'medium') result = result.filter(p => p.evaluation.aiScore >= 50 && p.evaluation.aiScore < 80);
    else if (filters.scoreTier === 'low') result = result.filter(p => p.evaluation.aiScore < 50);
    if (filters.propertyType !== 'all') result = result.filter(p => p.propertyType === filters.propertyType);
    if (filters.archetype !== 'all') result = result.filter(p => p.archetype === filters.archetype);

    switch (filters.sort) {
      case 'score-desc': result.sort((a, b) => b.evaluation.aiScore - a.evaluation.aiScore); break;
      case 'score-asc': result.sort((a, b) => a.evaluation.aiScore - b.evaluation.aiScore); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'safety-desc': result.sort((a, b) => b.safetyScore - a.safetyScore); break;
    }
    return result;
  }, [state.properties, filters]);

  if (state.properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 mb-1">Your vault is empty</h2>
          <p className="text-sm text-slate-500 mb-5">Start by evaluating your first property</p>
          <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'evaluate' })} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Evaluate a Property
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-slate-900">Evaluated Vault</h1>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'evaluate' })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} cities={cities} resultCount={filtered.length} />

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <SearchX className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No properties match your filters</p>
        </div>
      ) : filters.visualMode === 'showcase' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => <PropertyCard key={p.id} property={p} onOpenDossier={onOpenDossier} index={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((p, i) => <PropertyCardCompact key={p.id} property={p} onOpenDossier={onOpenDossier} index={i} />)}
        </div>
      )}
    </div>
  );
}
