import { motion } from 'motion/react';
import { GitCompare, FileText, Trash2, BedDouble, Bath, Maximize, MapPin, DollarSign } from 'lucide-react';
import type { EvaluatedProperty } from '../types';
import { useStore } from '../lib/store';
import { ArchitecturalImagePreview } from './ArchitecturalImagePreview';
import { ScoreGauge, verdictBg } from './ScoreGauge';
import { getArchetype } from '../lib/archetypes';

interface Props {
  property: EvaluatedProperty;
  onOpenDossier: (property: EvaluatedProperty) => void;
  index?: number;
}

export function PropertyCard({ property, onOpenDossier, index = 0 }: Props) {
  const { state, dispatch } = useStore();
  const inComparison = state.comparisonIds.includes(property.id);
  const arch = getArchetype(property.archetype);
  const ev = property.evaluation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
    >
      {/* Visual */}
      <div className="relative">
        <ArchitecturalImagePreview property={property} />
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur rounded-xl p-1 shadow-sm">
            <ScoreGauge score={ev.aiScore} verdict={ev.verdict} size={72} showLabel={false} />
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${verdictBg[ev.verdict]}`}>
            {ev.verdict}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-base text-slate-900 leading-tight">{property.title}</h3>
          </div>
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3 h-3" />
            {property.address}, {property.city} {property.zipCode}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-slate-400" />{property.bedrooms} bd</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-slate-400" />{property.bathrooms} ba</span>
          <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5 text-slate-400" />{property.sqft.toLocaleString()} sf</span>
        </div>

        {/* Financials */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <p className="text-lg font-display font-bold text-slate-900">${property.price.toLocaleString()}</p>
            <p className="text-xs text-slate-500">${ev.costPerSqft}/sf · {property.yearBuilt}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-cyan-600">${ev.monthlyCarryingCost.toLocaleString()}/mo</p>
            <p className="text-xs text-slate-400">carrying cost</p>
          </div>
        </div>

        {/* Archetype badge */}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
            {arch.shortName}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_COMPARISON', id: property.id })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              inComparison ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            {inComparison ? 'In Compare' : 'Compare'}
          </button>
          <button
            onClick={() => onOpenDossier(property)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Dossier
          </button>
          <button
            onClick={() => dispatch({ type: 'DELETE_PROPERTY', id: property.id })}
            className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function PropertyCardCompact({ property, onOpenDossier, index = 0 }: Props) {
  const { state, dispatch } = useStore();
  const inComparison = state.comparisonIds.includes(property.id);
  const ev = property.evaluation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="group flex gap-3 p-3 bg-white rounded-xl border border-slate-200/80 hover:shadow-md hover:scale-[1.01] transition-all duration-300"
    >
      <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <ArchitecturalImagePreview property={property} className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-sm text-slate-900 truncate">{property.title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${verdictBg[ev.verdict]}`}>
            {ev.verdict}
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate">{property.city}, {property.zipCode}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm font-bold text-slate-900">${(property.price / 1000).toFixed(0)}K</span>
          <span className="text-xs text-cyan-600 font-medium">${ev.monthlyCarryingCost.toLocaleString()}/mo</span>
          <span className="text-xs text-slate-400">Score {ev.aiScore}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_COMPARISON', id: property.id })}
            className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${inComparison ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {inComparison ? '✓ Compare' : 'Compare'}
          </button>
          <button onClick={() => onOpenDossier(property)} className="px-2 py-1 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            Dossier
          </button>
          <button onClick={() => dispatch({ type: 'DELETE_PROPERTY', id: property.id })} className="px-2 py-1 rounded-md text-[10px] font-medium text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
