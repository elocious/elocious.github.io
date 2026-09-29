import { Search, SlidersHorizontal, LayoutGrid, Rows3, X } from 'lucide-react';
import { useState } from 'react';
import type { Verdict, PropertyType, ArchitecturalArchetype } from '../types';
import { ARCHETYPES } from '../lib/archetypes';

export type SortOption = 'score-desc' | 'score-asc' | 'price-asc' | 'price-desc' | 'safety-desc';

export interface FilterState {
  search: string;
  verdicts: Verdict[];
  city: string;
  priceMin: number;
  priceMax: number;
  scoreTier: 'all' | 'high' | 'medium' | 'low';
  propertyType: PropertyType | 'all';
  archetype: ArchitecturalArchetype | 'all';
  sort: SortOption;
  visualMode: 'showcase' | 'compact';
}

export const defaultFilters: FilterState = {
  search: '',
  verdicts: [],
  city: '',
  priceMin: 0,
  priceMax: 0,
  scoreTier: 'all',
  propertyType: 'all',
  archetype: 'all',
  sort: 'score-desc',
  visualMode: 'showcase',
};

const verdicts: Verdict[] = ['BUY', 'RENT', 'CAUTION', 'AVOID'];
const verdictStyles: Record<Verdict, string> = {
  BUY: 'bg-emerald-500 text-white border-emerald-500',
  RENT: 'bg-cyan-500 text-white border-cyan-500',
  CAUTION: 'bg-amber-500 text-white border-amber-500',
  AVOID: 'bg-red-500 text-white border-red-500',
};
const verdictStylesInactive: Record<Verdict, string> = {
  BUY: 'bg-transparent text-emerald-600 border-emerald-200 hover:bg-emerald-50',
  RENT: 'bg-transparent text-cyan-600 border-cyan-200 hover:bg-cyan-50',
  CAUTION: 'bg-transparent text-amber-600 border-amber-200 hover:bg-amber-50',
  AVOID: 'bg-transparent text-red-600 border-red-200 hover:bg-red-50',
};

const sortLabels: Record<SortOption, string> = {
  'score-desc': 'Score: High to Low',
  'score-asc': 'Score: Low to High',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'safety-desc': 'Safety Rating',
};

const selectClass = 'rounded-lg border-slate-200 text-sm py-2 px-3 bg-white border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all';

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  cities: string[];
  resultCount: number;
}

export function FilterBar({ filters, onChange, cities, resultCount }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  const toggleVerdict = (v: Verdict) => {
    update({ verdicts: filters.verdicts.includes(v) ? filters.verdicts.filter(x => x !== v) : [...filters.verdicts, v] });
  };

  const hasActiveFilters = filters.verdicts.length > 0 || filters.city || filters.priceMin > 0 || filters.priceMax > 0 || filters.scoreTier !== 'all' || filters.propertyType !== 'all' || filters.archetype !== 'all';

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Sort + Visual mode */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={filters.search}
            onChange={e => update({ search: e.target.value })}
            placeholder="Search by address, title, city, or zip..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
          />
        </div>
        <select value={filters.sort} onChange={e => update({ sort: e.target.value as SortOption })} className={selectClass}>
          {Object.entries(sortLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showAdvanced ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-cyan-500" />}
        </button>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button onClick={() => update({ visualMode: 'showcase' })} className={`p-2.5 transition-colors ${filters.visualMode === 'showcase' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
            <Rows3 className="w-4 h-4" />
          </button>
          <button onClick={() => update({ visualMode: 'compact' })} className={`p-2.5 transition-colors ${filters.visualMode === 'compact' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Verdict pills (always visible) */}
      <div className="flex flex-wrap items-center gap-2">
        {verdicts.map(v => (
          <button
            key={v}
            onClick={() => toggleVerdict(v)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${filters.verdicts.includes(v) ? verdictStyles[v] : verdictStylesInactive[v]}`}
          >
            {v}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-1">{resultCount} {resultCount === 1 ? 'property' : 'properties'}</span>
        {hasActiveFilters && (
          <button onClick={() => onChange({ ...defaultFilters, visualMode: filters.visualMode })} className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 ml-auto">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-4 bg-white rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
            <select value={filters.city} onChange={e => update({ city: e.target.value })} className={selectClass + ' w-full'}>
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Price Min</label>
            <input type="number" step="50000" value={filters.priceMin || ''} onChange={e => update({ priceMin: +e.target.value || 0 })} placeholder="$0" className={selectClass + ' w-full'} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Price Max</label>
            <input type="number" step="50000" value={filters.priceMax || ''} onChange={e => update({ priceMax: +e.target.value || 0 })} placeholder="No max" className={selectClass + ' w-full'} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">AI Score</label>
            <select value={filters.scoreTier} onChange={e => update({ scoreTier: e.target.value as FilterState['scoreTier'] })} className={selectClass + ' w-full'}>
              <option value="all">All Scores</option>
              <option value="high">High (80+)</option>
              <option value="medium">Medium (50–79)</option>
              <option value="low">Low (&lt;50)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Property Type</label>
            <select value={filters.propertyType} onChange={e => update({ propertyType: e.target.value as FilterState['propertyType'] })} className={selectClass + ' w-full'}>
              <option value="all">All Types</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>
          <div className="col-span-2 md:col-span-3 lg:col-span-5">
            <label className="block text-xs font-medium text-slate-500 mb-1">Architectural Archetype</label>
            <select value={filters.archetype} onChange={e => update({ archetype: e.target.value as FilterState['archetype'] })} className={selectClass + ' w-full'}>
              <option value="all">All Archetypes</option>
              {ARCHETYPES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
