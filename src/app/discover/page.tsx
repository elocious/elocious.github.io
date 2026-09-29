'use client';

import { useEffect, useState, useCallback } from 'react';
import { PropertyCard, PropertyCardSkeleton } from '@/components/PropertyCard';
import { PageHeader } from '@/components/ui/PageParts';
import { Compass, SlidersHorizontal, LayoutGrid, List, Map } from 'lucide-react';
import Link from 'next/link';

const propertyTypes = ['apartment', 'condo', 'townhouse', 'house', 'villa', 'duplex', 'bungalow', 'fixer-upper', 'waterfront', 'luxury'];
const floodRisks = ['low', 'moderate', 'high'];

export default function DiscoverPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    listingType: '',
    minPrice: '',
    maxPrice: '',
    minBed: '',
    minBath: '',
    propertyType: '',
    city: '',
    minSqft: '',
    minYear: '',
    pool: false,
    garden: false,
    solar: false,
    smartHome: false,
    furnished: false,
    minSchool: '',
    minSafety: '',
    minWalk: '',
    floodRisk: '',
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== '' && val !== false && val != null) params.set(key, String(val));
    });
    const res = await fetch(`/api/properties?${params}`);
    const data = await res.json();
    setProperties(data.properties || []);
    setLoading(false);
  }, [query, filters]);

  useEffect(() => {
    const timer = setTimeout(fetchProperties, 300);
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  return (
    <div className="max-w-8xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader
        title="Discover Properties"
        subtitle="Search and filter homes for sale and rent"
        icon={Compass}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition min-h-[44px] ${showFilters ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg transition ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Search bar */}
      <div className="relative mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by address, city, neighborhood, or ZIP..."
          className="w-full px-4 py-3 pl-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:border-brand-400 transition min-h-[48px]"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="premium-card p-5 mb-4 animate-slide-up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterSelect label="Listing Type" value={filters.listingType} onChange={(v) => setFilters({...filters, listingType: v})} options={[{value: '', label: 'Any'}, {value: 'buy', label: 'Buy'}, {value: 'rent', label: 'Rent'}]} />
            <FilterInput label="Min Price" type="number" value={filters.minPrice} onChange={(v) => setFilters({...filters, minPrice: v})} placeholder="$0" />
            <FilterInput label="Max Price" type="number" value={filters.maxPrice} onChange={(v) => setFilters({...filters, maxPrice: v})} placeholder="$1M+" />
            <FilterSelect label="Property Type" value={filters.propertyType} onChange={(v) => setFilters({...filters, propertyType: v})} options={[{value: '', label: 'Any'}, ...propertyTypes.map(t => ({value: t, label: t.replace('-', ' ')}))]} />
            <FilterInput label="Min Bedrooms" type="number" value={filters.minBed} onChange={(v) => setFilters({...filters, minBed: v})} placeholder="Any" />
            <FilterInput label="Min Bathrooms" type="number" value={filters.minBath} onChange={(v) => setFilters({...filters, minBath: v})} placeholder="Any" />
            <FilterInput label="Min Sqft" type="number" value={filters.minSqft} onChange={(v) => setFilters({...filters, minSqft: v})} placeholder="Any" />
            <FilterInput label="Min Year Built" type="number" value={filters.minYear} onChange={(v) => setFilters({...filters, minYear: v})} placeholder="Any" />
            <FilterInput label="Min School Rating" type="number" value={filters.minSchool} onChange={(v) => setFilters({...filters, minSchool: v})} placeholder="0-10" />
            <FilterInput label="Min Safety Score" type="number" value={filters.minSafety} onChange={(v) => setFilters({...filters, minSafety: v})} placeholder="0-100" />
            <FilterInput label="Min Walkability" type="number" value={filters.minWalk} onChange={(v) => setFilters({...filters, minWalk: v})} placeholder="0-100" />
            <FilterSelect label="Flood Risk" value={filters.floodRisk} onChange={(v) => setFilters({...filters, floodRisk: v})} options={[{value: '', label: 'Any'}, ...floodRisks.map(r => ({value: r, label: r}))]} />
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <FilterCheckbox label="Pool" checked={filters.pool} onChange={(v) => setFilters({...filters, pool: v})} />
            <FilterCheckbox label="Garden" checked={filters.garden} onChange={(v) => setFilters({...filters, garden: v})} />
            <FilterCheckbox label="Solar" checked={filters.solar} onChange={(v) => setFilters({...filters, solar: v})} />
            <FilterCheckbox label="Smart Home" checked={filters.smartHome} onChange={(v) => setFilters({...filters, smartHome: v})} />
            <FilterCheckbox label="Furnished" checked={filters.furnished} onChange={(v) => setFilters({...filters, furnished: v})} />
          </div>
          <button
            onClick={() => setFilters({listingType: '', minPrice: '', maxPrice: '', minBed: '', minBath: '', propertyType: '', city: '', minSqft: '', minYear: '', pool: false, garden: false, solar: false, smartHome: false, furnished: false, minSchool: '', minSafety: '', minWalk: '', floodRisk: ''})}
            className="mt-4 text-sm text-brand-500 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loading ? 'Searching...' : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} found`}
        </p>
        <Link href="/map" className="flex items-center gap-1.5 text-sm text-brand-500 font-medium hover:underline">
          <Map className="w-4 h-4" /> Map view
        </Link>
      </div>

      {/* Property grid/list */}
      {loading ? (
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
        </div>
      ) : properties.length > 0 ? (
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {properties.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No properties found</h3>
          <p className="text-sm text-slate-500 max-w-sm">Try adjusting your filters or search query to find more properties.</p>
        </div>
      )}
    </div>
  );
}

function FilterInput({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm focus:border-brand-400 transition"
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm focus:border-brand-400 transition capitalize"
      >
        {options.map((o: any) => <option key={o.value} value={o.value} className="capitalize">{o.label}</option>)}
      </select>
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 rounded accent-brand-500" />
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
    </label>
  );
}
