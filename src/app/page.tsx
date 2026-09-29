'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Home, ClipboardCheck, Bot, Compass, Heart, GitCompare, TrendingUp,
  Calculator, CheckSquare, ArrowRight, Sparkles, MapPin, DollarSign,
  ArrowLeft, Shield, Wallet, AlertTriangle, FileText,
} from 'lucide-react';
import { PropertyCard, PropertyCardSkeleton } from '@/components/PropertyCard';
import { ScoreRing } from '@/components/ScoreRing';
import { formatCurrency } from '@/lib/calculations';

const STEPS = [
  { num: 1, label: 'Basics & Intent' },
  { num: 2, label: 'Finances & Dues' },
  { num: 3, label: 'Safety & Location' },
  { num: 4, label: 'Specs & Watchouts' },
];

const VERDICT_STYLES: Record<string, { label: string; class: string }> = {
  buy: { label: 'BUY', class: 'status-buy' },
  rent: { label: 'RENT', class: 'status-rent' },
  caution: { label: 'PROCEED_WITH_CAUTION', class: 'status-caution' },
  avoid: { label: 'AVOID', class: 'status-avoid' },
};

function getVerdict(p: any): { label: string; class: string } {
  const score = p.matchPercentage || p.overallScore || 0;
  if (score >= 75) return VERDICT_STYLES.buy;
  if (score >= 55) return VERDICT_STYLES.rent;
  if (score >= 40) return VERDICT_STYLES.caution;
  return VERDICT_STYLES.avoid;
}

export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [intent, setIntent] = useState<string>('buy');

  useEffect(() => {
    Promise.all([
      fetch('/api/properties?limit=6').then(r => r.json()),
      fetch('/api/saved').then(r => r.json()),
      fetch('/api/tasks').then(r => r.json()),
      fetch('/api/evaluate').then(r => r.json()),
      fetch('/api/profile').then(r => r.json()),
    ]).then(([props, savedData, tasksData, evals, userData]) => {
      setProperties(props.properties || []);
      setSaved(savedData.saved || []);
      setTasks(tasksData.tasks || []);
      setEvaluations(evals.evaluations || []);
      setUser(userData);
    }).finally(() => setLoading(false));
  }, []);

  const pendingTasks = tasks.filter(t => t.status !== 'complete').length;
  const avgScore = evaluations.length > 0
    ? Math.round(evaluations.reduce((a, e) => a + e.overallScore, 0) / evaluations.length)
    : null;

  // Diagnostic readiness — percentage of key profile fields filled
  const profileFields = ['budgetMin', 'budgetMax', 'buyerType', 'timeline', 'weightAffordability', 'weightSafety', 'weightSchools'];
  const filledCount = profileFields.filter(f => user?.[f] != null && user?.[f] !== '').length;
  const readiness = Math.round((filledCount / profileFields.length) * 100);

  const sampleProperties = properties.slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 space-y-8">
      {/* Hero Card — Dark Navy */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 lg:p-10 shadow-premium">
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex-1 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              INSTANT AI EVALUATION
            </span>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-white mt-4 leading-tight">
              Evaluate Any House in Seconds
            </h1>
            <p className="text-navy-300 mt-4 text-sm lg:text-base max-w-lg leading-relaxed">
              Enter the house specs, safety feel, and monthly carrying costs to get an objective AI decision on whether to Buy, Rent, or Avoid.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/evaluations" className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition shadow-glow min-h-[48px]">
                <ClipboardCheck className="w-5 h-5" /> Start Evaluation
              </Link>
              <Link href="/advisor" className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20 min-h-[48px]">
                <Bot className="w-5 h-5" /> Ask AI Advisor
              </Link>
            </div>
          </div>

          {/* Progress Widget */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative w-28 h-28">
              <svg width="112" height="112" className="-rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" strokeWidth="6" className="stroke-white/10" />
                <circle
                  cx="56" cy="56" r="48" fill="none" strokeWidth="6"
                  stroke="#10b981" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - readiness / 100)}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{readiness}%</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-brand-400 tracking-wide">DIAGNOSTIC READINESS</p>
            <p className="text-xs text-navy-400">Fill Key Parameters</p>
          </div>
        </div>
      </section>

      {/* Sample Scenarios */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">Sample Scenarios</h2>
          <Link href="/discover" className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)
            : sampleProperties.slice(0, 4).map(p => <ScenarioCard key={p.id} property={p} />)}
        </div>
        {sampleProperties[4] && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScenarioCard property={sampleProperties[4]} />
          </div>
        )}
      </section>

      {/* Stepper */}
      <section>
        <div className="flex items-center gap-2 bg-navy-100/60 dark:bg-navy-800/50 rounded-full p-2 overflow-x-auto scrollbar-hide">
          {STEPS.map((step) => {
            const active = step.num === activeStep;
            const done = step.num < activeStep;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                  active
                    ? 'bg-navy-900 text-white dark:bg-brand-500 shadow-soft'
                    : done
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-navy-500 dark:text-navy-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  active ? 'bg-white/20' : done ? 'bg-brand-500 text-white' : 'bg-navy-300 dark:bg-navy-700 text-navy-600 dark:text-navy-400'
                }`}>{step.num}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Form Card — Step 1 */}
      <section className="premium-card p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-navy-900 dark:bg-brand-500 flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">Step 1: Property Identity & Your Primary Intent</h2>
        </div>
        <p className="text-sm text-navy-500 dark:text-navy-400 mb-6 ml-11">
          Provide the house name, address, property type, and whether you are evaluating to Buy or Rent.
        </p>

        {/* Intent selector */}
        <div className="flex flex-wrap gap-3 ml-11">
          {[
            { id: 'buy', label: 'Considering Buying', icon: Home },
            { id: 'rent', label: 'Considering Renting', icon: Wallet },
            { id: 'either', label: 'Open to Either', icon: Compass },
          ].map(opt => {
            const active = intent === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setIntent(opt.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all border-2 ${
                  active
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400'
                    : 'border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-400 hover:border-navy-300 dark:hover:border-navy-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 ml-11">
          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1.5 block">House Name</label>
            <input
              placeholder="e.g., Evergreen Crest Residence"
              className="w-full px-4 py-3 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-200 dark:border-navy-700 text-sm focus:border-brand-500 transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1.5 block">Address</label>
            <input
              placeholder="e.g., 123 Evergreen Dr, Bellevue, WA"
              className="w-full px-4 py-3 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-200 dark:border-navy-700 text-sm focus:border-brand-500 transition"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1.5 block">Property Type</label>
            <select className="w-full px-4 py-3 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-200 dark:border-navy-700 text-sm focus:border-brand-500 transition">
              <option>Single Family</option>
              <option>Condominium</option>
              <option>Townhouse</option>
              <option>Multi-Family</option>
              <option>Land</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500 dark:text-navy-400 mb-1.5 block">Listing Price</label>
            <input
              type="number"
              placeholder="e.g., 890000"
              className="w-full px-4 py-3 rounded-2xl bg-navy-50 dark:bg-navy-800/50 border border-navy-200 dark:border-navy-700 text-sm focus:border-brand-500 transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 ml-11">
          <p className="text-xs text-navy-400">Step 1 of 4</p>
          <Link
            href="/evaluations"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-navy-900 dark:bg-brand-500 text-white text-sm font-semibold hover:bg-navy-800 dark:hover:bg-brand-600 transition"
          >
            Continue to Step 2 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStat icon={Heart} label="Saved Properties" value={saved.length} href="/saved" color="text-red-500" bg="bg-red-50 dark:bg-red-950/30" />
        <DashboardStat icon={ClipboardCheck} label="Evaluations" value={evaluations.length} href="/evaluations" color="text-brand-500" bg="bg-brand-50 dark:bg-brand-950/30" />
        <DashboardStat icon={CheckSquare} label="Pending Tasks" value={pendingTasks} href="/tasks" color="text-gold-500" bg="bg-gold-50 dark:bg-gold-950/30" />
        <DashboardStat icon={GitCompare} label="Comparisons" value={evaluations.length > 1 ? Math.floor(evaluations.length / 2) : 0} href="/compare" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-950/30" />
      </section>

      {/* AI Insights + Financial Snapshot */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 premium-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-navy-900 dark:text-white">AI Insights</h2>
            <span className="text-xs text-navy-400 ml-auto">Personalized for you</span>
          </div>
          <div className="space-y-3">
            {saved.length > 0 ? (
              <>
                <InsightItem icon={TrendingUp} text={`You have ${saved.length} saved properties. Your top-rated option scores ${avgScore || '—'}/100. Consider scheduling viewings for your highest-scored properties.`} />
                <InsightItem icon={Calculator} text={`Based on your budget of ${formatCurrency(user?.budgetMin || 0)}–${formatCurrency(user?.budgetMax || 0)}, ${properties.filter(p => p.price <= (user?.budgetMax || 0)).length} of the latest listings are within range.`} />
                <InsightItem icon={CheckSquare} text={`You have ${pendingTasks} pending due-diligence tasks. Completing these will strengthen your decision-making.`} />
              </>
            ) : (
              <p className="text-sm text-navy-500 dark:text-navy-400 py-4">
                Save properties to get personalized AI insights about your search.{' '}
                <Link href="/discover" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Start discovering →</Link>
              </p>
            )}
          </div>
        </div>
        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-brand-500" />
            <h2 className="font-semibold text-navy-900 dark:text-white">Financial Snapshot</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-navy-100 dark:border-navy-800">
              <span className="text-sm text-navy-500">Budget Range</span>
              <span className="text-sm font-semibold text-navy-900 dark:text-white">
                {formatCurrency(user?.budgetMin || 0)} – {formatCurrency(user?.budgetMax || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-navy-100 dark:border-navy-800">
              <span className="text-sm text-navy-500">Est. Monthly Cost</span>
              <span className="text-sm font-semibold text-navy-900 dark:text-white">
                {user?.budgetMax ? formatCurrency((user.budgetMax * 0.005)) + '/mo' : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-navy-100 dark:border-navy-800">
              <span className="text-sm text-navy-500">Buyer Type</span>
              <span className="text-sm font-semibold capitalize text-navy-900 dark:text-white">{user?.buyerType || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-navy-500">Timeline</span>
              <span className="text-sm font-semibold text-navy-900 dark:text-white">{user?.timeline || '—'}</span>
            </div>
            <Link href="/finances" className="block text-center text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline mt-2">
              Open Financial Tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended Homes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">Recommended Homes</h2>
            <p className="text-sm text-navy-500 dark:text-navy-400">Curated based on your profile and preferences</p>
          </div>
          <Link href="/discover" className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.slice(0, 6).map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>
    </div>
  );
}

function ScenarioCard({ property }: { property: any }) {
  const verdict = getVerdict(property);
  return (
    <Link href={`/property/${property.id}`} className="premium-card p-4 hover:shadow-premium transition group block">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-navy-900 dark:text-white line-clamp-1">{property.title}</h3>
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${verdict.class}`}>{verdict.label}</span>
      </div>
      <p className="flex items-center gap-1 text-xs text-navy-500 dark:text-navy-400 mb-1">
        <MapPin className="w-3 h-3" /> {property.city}{property.state ? `, ${property.state}` : ''}
      </p>
      <p className="text-sm font-bold text-navy-900 dark:text-white">{formatCurrency(property.price)}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-100 dark:border-navy-800">
        <span className="text-xs text-navy-400">{property.bedrooms}bd · {property.bathrooms}ba · {property.squareFeet.toLocaleString()} sqft</span>
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">Load →</span>
      </div>
    </Link>
  );
}

function DashboardStat({ icon: Icon, label, value, href, color, bg }: any) {
  return (
    <Link href={href} className="premium-card p-4 hover:shadow-premium transition group">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-navy-900 dark:text-white">{value}</p>
      <p className="text-xs text-navy-500 dark:text-navy-400">{label}</p>
    </Link>
  );
}

function InsightItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/40">
      <Icon className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-navy-600 dark:text-navy-300">{text}</p>
    </div>
  );
}
