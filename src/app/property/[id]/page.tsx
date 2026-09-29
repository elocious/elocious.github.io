'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, GitCompare, ClipboardCheck, Bot, Vault, Share2, FileText, MapPin, Bed, Bath, Maximize, Calendar, Car, TreePalm, Sun, Cpu, Waves, School, Shield, Footprints, Bus, Volume2, AlertTriangle, ChevronLeft, Sparkles, CheckSquare, StickyNote, Camera, X } from 'lucide-react';
import { ScoreRing, ScoreBar, MatchBadge } from '@/components/ScoreRing';
import { DataLabel, AIDisclaimer } from '@/components/ui/PageParts';
import { formatCurrency } from '@/lib/calculations';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [tab, setTab] = useState<'overview' | 'financials' | 'neighborhood' | 'condition' | 'documents' | 'tasks' | 'timeline' | 'architecture'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/properties/${id}`).then(r => r.json()).then(d => {
      setProperty(d);
      setNotes(d.notes || []);
      setLoading(false);
    });
  }, [id]);

  const runAnalysis = async () => {
    setAnalysisLoading(true);
    const res = await fetch('/api/property-analysis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propertyId: id }) });
    const data = await res.json();
    setAiAnalysis(data.analysis);
    setAnalysisLoading(false);
  };

  const toggleSave = async () => {
    const res = await fetch('/api/saved/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propertyId: id }) });
    const data = await res.json();
    setProperty({ ...property, saved: data.saved });
  };

  const addNote = async () => {
    if (!note.trim()) return;
    const res = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: note, propertyId: id }) });
    const data = await res.json();
    setNotes([data.note, ...notes]);
    setNote('');
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8"><div className="h-96 skeleton rounded-3xl" /></div>;
  if (!property) return <div className="max-w-6xl mx-auto px-4 py-8 text-center"><p className="text-slate-500">Property not found</p></div>;

  const images: string[] = property.images || [];
  const monthlyCost = property.listingType === 'buy'
    ? ((property.price - property.price * 0.2) * 0.005 + (property.propertyTax || 0) / 12 + property.hoa + (property.insuranceEstimate || 0) / 12 + (property.maintenanceEstimate || 0) + 200)
    : property.rent || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Back */}
      <Link href="/discover" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Discover
      </Link>

      {/* Gallery */}
      <div className="relative aspect-[16/10] lg:aspect-[16/8] rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-4">
        {images[activeImage] && <img src={images[activeImage]} alt={property.title} className="w-full h-full object-cover" />}
        <button onClick={() => setShowGallery(true)} className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 backdrop-blur text-white text-sm hover:bg-black/70 transition">
          <Camera className="w-4 h-4" /> View all {images.length}
        </button>
        {property.matchPercentage != null && (
          <div className="absolute top-4 left-4"><MatchBadge percentage={property.matchPercentage} /></div>
        )}
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 transition ${i === activeImage ? 'ring-2 ring-brand-500' : 'opacity-60'}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${property.listingType === 'rent' ? 'bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            <span className="text-xs text-slate-400 capitalize">{property.propertyType.replace('-', ' ')}</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{property.title}</h1>
          <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="w-4 h-4" /> {property.address}, {property.city}{property.state ? `, ${property.state}` : ''} {property.zipCode || ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {property.listingType === 'rent' ? `${formatCurrency(property.rent)}/mo` : formatCurrency(property.price)}
          </p>
          <p className="text-sm text-slate-500">Est. monthly: {formatCurrency(monthlyCost)}/mo</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={toggleSave} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition min-h-[44px] ${property.saved ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
          <Heart className={`w-4 h-4 ${property.saved ? 'fill-red-500' : ''}`} /> {property.saved ? 'Saved' : 'Save'}
        </button>
        <Link href={`/evaluations?propertyId=${id}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400 hover:bg-brand-100 transition min-h-[44px]">
          <ClipboardCheck className="w-4 h-4" /> Evaluate
        </Link>
        <Link href={`/compare?ids=${id}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
          <GitCompare className="w-4 h-4" /> Compare
        </Link>
        <Link href={`/advisor?propertyId=${id}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
          <Bot className="w-4 h-4" /> Ask AI
        </Link>
        <Link href={`/vault?propertyId=${id}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
          <Vault className="w-4 h-4" /> Add to Vault
        </Link>
        <Link href={`/report?propertyId=${id}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
          <FileText className="w-4 h-4" /> Report
        </Link>
        <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatBox icon={Bed} label="Bedrooms" value={property.bedrooms} />
        <StatBox icon={Bath} label="Bathrooms" value={property.bathrooms} />
        <StatBox icon={Maximize} label="Square Feet" value={property.squareFeet.toLocaleString()} />
        <StatBox icon={Calendar} label="Year Built" value={property.yearBuilt || 'N/A'} />
        <StatBox icon={Car} label="Parking" value={property.parking ? `${property.parking} spaces` : 'None'} />
        <StatBox icon={Maximize} label="Lot Size" value={property.lotSize ? `${property.lotSize.toLocaleString()} ${property.lotSize < 1 ? 'acres' : 'sqft'}` : 'N/A'} />
        <StatBox icon={MapPin} label="Neighborhood" value={property.neighborhood || 'N/A'} />
        <StatBox icon={Calendar} label="Days Listed" value="—" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-slate-200 dark:border-slate-800 mb-6">
        {(['overview', 'financials', 'neighborhood', 'condition', 'documents', 'tasks', 'timeline', 'architecture'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize whitespace-nowrap transition border-b-2 ${tab === t ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Description */}
          <div className="premium-card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">About This Property</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{property.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {property.pool && <Amenity icon={Waves} label="Pool" />}
              {property.garden && <Amenity icon={TreePalm} label="Garden" />}
              {property.solar && <Amenity icon={Sun} label="Solar" />}
              {property.smartHome && <Amenity icon={Cpu} label="Smart Home" />}
              {property.furnished && <Amenity label="Furnished" />}
              {property.parking > 0 && <Amenity label={`${property.parking} Parking`} />}
            </div>
          </div>

          {/* AI Analysis */}
          <div className="premium-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">AI Property Analysis</h3>
              <DataLabel type="ai" />
            </div>
            {aiAnalysis ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{aiAnalysis}</div>
              </div>
            ) : analysisLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                Analyzing property...
              </div>
            ) : (
              <button onClick={runAnalysis} className="text-sm text-brand-500 font-medium hover:underline">
                Generate AI analysis →
              </button>
            )}
            <AIDisclaimer />
          </div>

          {/* Evaluation summary */}
          {property.evaluations?.length > 0 && (
            <div className="premium-card p-5">
              <div className="flex items-center gap-4 mb-4">
                <ScoreRing score={property.evaluations[0].overallScore} size={100} />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Latest Evaluation</h3>
                  <p className="text-sm text-slate-500">Scored on {new Date(property.evaluations[0].createdAt).toLocaleDateString()}</p>
                  <Link href="/evaluations" className="text-sm text-brand-500 font-medium hover:underline">View full evaluation →</Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ScoreBar score={property.evaluations[0].financialFitScore} label="Financial Fit" />
                <ScoreBar score={property.evaluations[0].locationFitScore} label="Location Fit" />
                <ScoreBar score={property.evaluations[0].lifestyleFitScore} label="Lifestyle Fit" />
                <ScoreBar score={property.evaluations[0].conditionScore} label="Condition" />
                <ScoreBar score={property.evaluations[0].riskScore} label="Risk" />
                <ScoreBar score={property.evaluations[0].personalMatchScore} label="Personal Match" />
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="premium-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <StickyNote className="w-5 h-5 text-gold-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">My Notes</h3>
            </div>
            <div className="flex gap-2 mb-3">
              <input value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} placeholder="Add a note about this property..." className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm" />
              <button onClick={addNote} className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600">Add</button>
            </div>
            <div className="space-y-2">
              {notes.map(n => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-sm text-slate-600 dark:text-slate-300">
                  {n.content}
                  <span className="text-xs text-slate-400 block mt-1">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {notes.length === 0 && <p className="text-sm text-slate-400 text-center py-2">No notes yet</p>}
            </div>
          </div>
        </div>
      )}

      {tab === 'financials' && <FinancialsTab property={property} />}
      {tab === 'neighborhood' && <NeighborhoodTab property={property} />}
      {tab === 'condition' && <ConditionTab property={property} />}
      {tab === 'documents' && <DocumentsTab propertyId={id} documents={property.documents} />}
      {tab === 'tasks' && <TasksTab propertyId={id} tasks={property.tasks} />}
      {tab === 'timeline' && <TimelineTab events={property.events} />}
      {tab === 'architecture' && <ArchitectureTab propertyId={id} />}

      {/* Full gallery modal */}
      {showGallery && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setShowGallery(false)}>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white" onClick={() => setShowGallery(false)}><X className="w-6 h-6" /></button>
          <img src={images[activeImage]} alt="" className="max-w-full max-h-full object-contain" />
          <button onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage - 1 + images.length) % images.length); }} className="absolute left-4 p-3 rounded-full bg-white/10 text-white">‹</button>
          <button onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage + 1) % images.length); }} className="absolute right-4 p-3 rounded-full bg-white/10 text-white">›</button>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value }: any) {
  return (
    <div className="premium-card p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}

function Amenity({ icon: Icon, label }: any) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
      {Icon && <Icon className="w-3.5 h-3.5" />} {label}
    </span>
  );
}

function FinancialsTab({ property }: { property: any }) {
  const price = property.price;
  const downPayment = price * 0.2;
  const loanAmount = price - downPayment;
  const rate = 6.5;
  const r = rate / 100 / 12;
  const n = 30 * 12;
  const mortgage = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const tax = (property.propertyTax || 0) / 12;
  const insurance = (property.insuranceEstimate || 0) / 12;
  const hoa = property.hoa || 0;
  const maintenance = property.maintenanceEstimate || 0;
  const utilities = 200;
  const monthly = mortgage + tax + insurance + hoa + maintenance + utilities;
  const annual = monthly * 12;
  const costPerSqft = price / property.squareFeet;

  return (
    <div className="space-y-4">
      <div className="premium-card p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Estimated Monthly Carrying Cost</h3>
        <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-4">{formatCurrency(monthly)}/mo</div>
        <div className="space-y-2">
          <CostRow label="Mortgage (P&I)" value={mortgage} dataLabel="estimate" />
          <CostRow label="Property Tax" value={tax} dataLabel="estimate" />
          <CostRow label="Insurance" value={insurance} dataLabel="estimate" />
          <CostRow label="HOA" value={hoa} dataLabel="verified" />
          <CostRow label="Maintenance" value={maintenance} dataLabel="estimate" />
          <CostRow label="Utilities (est.)" value={utilities} dataLabel="estimate" />
          <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-white">Total Monthly</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{formatCurrency(monthly)}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Down Payment (20%)" value={formatCurrency(downPayment)} />
        <MiniStat label="Loan Amount" value={formatCurrency(loanAmount)} />
        <MiniStat label="Annual Cost" value={formatCurrency(annual)} />
        <MiniStat label="Cost / Sqft" value={formatCurrency(costPerSqft)} />
      </div>
      <div className="premium-card p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How did we calculate this?</h3>
        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
          <p>• Mortgage: {formatCurrency(loanAmount)} at {rate}% over 30 years = {formatCurrency(mortgage)}/mo</p>
          <p>• Property tax: annual estimate ÷ 12</p>
          <p>• Insurance, maintenance, utilities: estimated based on property type and size</p>
          <p>• HOA: from listing data</p>
        </div>
        <Link href="/finances" className="text-sm text-brand-500 font-medium hover:underline mt-3 block">
          Open full financial calculators →
        </Link>
        <AIDisclaimer text="*Estimates based on default assumptions. Adjust in the Finances tab for personalized calculations.*" />
      </div>
    </div>
  );
}

function CostRow({ label, value, dataLabel }: any) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">{label} <DataLabel type={dataLabel} /></span>
      <span className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(value)}</span>
    </div>
  );
}

function MiniStat({ label, value }: any) {
  return (
    <div className="premium-card p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function NeighborhoodTab({ property }: { property: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ScoreCard icon={School} label="School Rating" value={property.schoolRating ? `${property.schoolRating}/10` : 'N/A'} score={property.schoolRating ? property.schoolRating * 10 : null} />
        <ScoreCard icon={Shield} label="Safety Score" value={property.safetyScore ? `${property.safetyScore}/100` : 'N/A'} score={property.safetyScore} />
        <ScoreCard icon={Footprints} label="Walkability" value={property.walkabilityScore ? `${property.walkabilityScore}/100` : 'N/A'} score={property.walkabilityScore} />
        <ScoreCard icon={Bus} label="Transit" value={property.transitScore ? `${property.transitScore}/100` : 'N/A'} score={property.transitScore} />
      </div>
      <div className="premium-card p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Neighborhood Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <DetailRow icon={Volume2} label="Noise Level" value={property.noiseLevel || 'N/A'} />
          <DetailRow icon={AlertTriangle} label="Flood Risk" value={property.floodRisk || 'N/A'} />
          <DetailRow icon={MapPin} label="Neighborhood" value={property.neighborhood || 'N/A'} />
          <DetailRow icon={MapPin} label="City" value={property.city} />
        </div>
        <AIDisclaimer text="*Neighborhood scores are estimates. Verify with local sources and visit the area.*" />
      </div>
      <Link href="/neighborhoods" className="block text-center text-sm text-brand-500 font-medium hover:underline">
        Explore all neighborhoods →
      </Link>
    </div>
  );
}

function ScoreCard({ icon: Icon, label, value, score }: any) {
  return (
    <div className="premium-card p-4">
      <Icon className="w-5 h-5 text-brand-500 mb-2" />
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      {score != null && (
        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mt-2 overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${score}%` }} />
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2 py-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-sm text-slate-500">{label}:</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{value}</span>
    </div>
  );
}

function ConditionTab({ property }: { property: any }) {
  const systems = ['Roof', 'Foundation', 'Plumbing', 'Electrical', 'HVAC', 'Windows', 'Kitchen', 'Bathrooms', 'Exterior', 'Landscaping'];
  return (
    <div className="premium-card p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Property Condition Assessment</h3>
      <p className="text-sm text-slate-500 mb-4">Run a full evaluation to rate each system. These are default estimates.</p>
      <div className="space-y-2">
        {systems.map(s => (
          <div key={s} className="flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400 w-28">{s}</span>
            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gold-500" style={{ width: '70%' }} />
            </div>
            <span className="text-xs text-slate-400">7/10</span>
          </div>
        ))}
      </div>
      <Link href={`/evaluations?propertyId=${property.id}`} className="block text-center text-sm text-brand-500 font-medium hover:underline mt-4">
        Run full evaluation →
      </Link>
      <AIDisclaimer text="*Default condition estimates. A professional home inspection is strongly recommended.*" />
    </div>
  );
}

function DocumentsTab({ propertyId, documents }: { propertyId: string; documents: any[] }) {
  return (
    <div className="space-y-4">
      <Link href={`/documents?propertyId=${propertyId}`} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition">
        <FileText className="w-4 h-4" /> Upload Document
      </Link>
      {documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map(d => (
            <div key={d.id} className="premium-card p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{d.name}</p>
                <p className="text-xs text-slate-400 capitalize">{d.category} · {new Date(d.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-4">No documents uploaded yet</p>
      )}
    </div>
  );
}

function TasksTab({ propertyId, tasks }: { propertyId: string; tasks: any[] }) {
  return (
    <div className="space-y-4">
      <Link href={`/tasks?propertyId=${propertyId}`} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition">
        <CheckSquare className="w-4 h-4" /> Add Task
      </Link>
      {tasks && tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map(t => (
            <div key={t.id} className="premium-card p-3 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${t.status === 'complete' ? 'bg-emerald-500' : t.status === 'in_progress' ? 'bg-gold-500' : 'bg-slate-300'}`} />
              <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{t.title}</span>
              <span className="text-xs text-slate-400 capitalize">{t.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-4">No tasks yet</p>
      )}
    </div>
  );
}

function TimelineTab({ events }: { events: any[] }) {
  return (
    <div className="premium-card p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Property Timeline</h3>
      <div className="space-y-4">
        {events?.map((e, i) => (
          <div key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-950/40" />
              {i < events.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{e.description}</p>
              <p className="text-xs text-slate-400">{new Date(e.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
        {(!events || events.length === 0) && <p className="text-sm text-slate-400">No activity yet</p>}
      </div>
    </div>
  );
}

function ArchitectureTab({ propertyId }: { propertyId: string }) {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState('Contemporary');
  const [result, setResult] = useState<any>(null);

  const styles = ['Contemporary', 'Modern', 'Minimalist', 'Mid-Century', 'Craftsman', 'Tropical Modern', 'Mediterranean', 'Colonial', 'Industrial', 'Biophilic', 'Luxury Modern', 'Urban Townhouse'];

  const generate = async () => {
    setLoading(true);
    const res = await fetch('/api/architecture', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, style }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="premium-card p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Architectural Visualization Studio</h3>
        <p className="text-sm text-slate-500 mb-4">Generate conceptual architectural visualizations and blueprints based on property information.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {styles.map(s => (
            <button key={s} onClick={() => setStyle(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${style === s ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={generate} disabled={loading} className="px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition min-h-[44px]">
          {loading ? 'Generating...' : 'Generate Concept'}
        </button>
      </div>

      {result && (
        <>
          <div className="premium-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">Conceptual Visualization</h3>
              <DataLabel type="ai" />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{result.description}</div>
            <AIDisclaimer text="*AI-generated conceptual visualization — not an actual property photograph. For construction, consult a licensed architect.*" />
          </div>
          {result.svgContent && (
            <div className="premium-card p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Conceptual Blueprint</h3>
              <div className="rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: result.svgContent }} />
              <AIDisclaimer text="*AI-generated schematic — not a certified engineering document.*" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
