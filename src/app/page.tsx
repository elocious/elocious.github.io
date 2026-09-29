'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, ClipboardCheck, Bot, Compass, Heart, GitCompare, TrendingUp, Calculator, CheckSquare, ArrowRight, Sparkles, MapPin, DollarSign } from 'lucide-react';
import { PropertyCard, PropertyCardSkeleton } from '@/components/PropertyCard';
import { ScoreRing } from '@/components/ScoreRing';
import { formatCurrency } from '@/lib/calculations';

export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-8xl mx-auto px-4 lg:px-6 py-6 space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 p-8 lg:p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab6000b0b8e7?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white/80 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            AI-Powered Real Estate Intelligence
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-white max-w-2xl leading-tight">
            Find the home that<br />actually fits your life.
          </h1>
          <p className="text-slate-300 mt-3 max-w-lg text-sm lg:text-base">
            Don&apos;t just find a home. Understand it. Discover, evaluate, compare, and make informed decisions with AI-powered insights.
          </p>

          {/* Quick search */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <Link href="/discover" className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition shadow-glow min-h-[48px]">
              <Search className="w-5 h-5" /> Search Homes
            </Link>
            <Link href="/evaluations" className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20 min-h-[48px]">
              <ClipboardCheck className="w-5 h-5" /> Evaluate a Property
            </Link>
            <Link href="/advisor" className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20 min-h-[48px]">
              <Bot className="w-5 h-5" /> Ask AI Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Dashboard summary */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStat icon={Heart} label="Saved Properties" value={saved.length} href="/saved" color="text-red-500" bg="bg-red-50 dark:bg-red-950/30" />
        <DashboardStat icon={ClipboardCheck} label="Evaluations" value={evaluations.length} href="/evaluations" color="text-brand-500" bg="bg-brand-50 dark:bg-brand-950/30" />
        <DashboardStat icon={CheckSquare} label="Pending Tasks" value={pendingTasks} href="/tasks" color="text-gold-500" bg="bg-gold-50 dark:bg-gold-950/30" />
        <DashboardStat icon={GitCompare} label="Comparisons" value={evaluations.length > 1 ? Math.floor(evaluations.length / 2) : 0} href="/compare" color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-950/30" />
      </section>

      {/* AI Insights + Financial Snapshot */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2 premium-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-white">AI Insights</h2>
            <span className="text-xs text-slate-400 ml-auto">Personalized for you</span>
          </div>
          <div className="space-y-3">
            {saved.length > 0 ? (
              <>
                <InsightItem
                  icon={TrendingUp}
                  text={`You have ${saved.length} saved properties. Your top-rated option scores ${avgScore || '—'}/100. Consider scheduling viewings for your highest-scored properties.`}
                />
                <InsightItem
                  icon={Calculator}
                  text={`Based on your budget of ${formatCurrency(user?.budgetMin || 0)}–${formatCurrency(user?.budgetMax || 0)}, ${properties.filter(p => p.price <= (user?.budgetMax || 0)).length} of the latest listings are within range.`}
                />
                <InsightItem
                  icon={CheckSquare}
                  text={`You have ${pendingTasks} pending due-diligence tasks. Completing these will strengthen your decision-making.`}
                />
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-4">
                Save properties to get personalized AI insights about your search.{' '}
                <Link href="/discover" className="text-brand-500 font-medium hover:underline">Start discovering →</Link>
              </p>
            )}
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Financial Snapshot</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-500">Budget Range</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatCurrency(user?.budgetMin || 0)} – {formatCurrency(user?.budgetMax || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-500">Est. Monthly Cost</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.budgetMax ? formatCurrency((user.budgetMax * 0.005)) + '/mo' : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-500">Buyer Type</span>
              <span className="text-sm font-semibold capitalize text-slate-900 dark:text-white">{user?.buyerType || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">Timeline</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.timeline || '—'}</span>
            </div>
            <Link href="/finances" className="block text-center text-sm text-brand-500 font-medium hover:underline mt-2">
              Open Financial Tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended Homes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Recommended Homes</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Curated based on your profile and preferences</p>
          </div>
          <Link href="/discover" className="flex items-center gap-1 text-sm text-brand-500 font-medium hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.slice(0, 6).map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      {/* Saved + Market Insights */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Saved Properties */}
        <div className="premium-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Saved Properties</h2>
            <Link href="/saved" className="text-sm text-brand-500 font-medium hover:underline">View all →</Link>
          </div>
          {saved.length > 0 ? (
            <div className="space-y-2">
              {saved.slice(0, 3).map(s => (
                <Link key={s.id} href={`/property/${s.propertyId}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                    {s.property?.images?.[0] && <img src={s.property.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{s.property?.title}</p>
                    <p className="text-xs text-slate-500 truncate">{s.property?.city}, {s.property?.state}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(s.property?.price || 0)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">No saved properties yet. Start exploring to save homes you like.</p>
          )}
        </div>

        {/* Market Insights */}
        <div className="premium-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Market Snapshot</h2>
            <span className="text-xs text-slate-400 ml-auto">Austin, TX</span>
          </div>
          <div className="space-y-3">
            <MarketRow label="Median Home Price" value="$525,000" change="+3.2%" up />
            <MarketRow label="Avg Days on Market" value="34 days" change="-5" up />
            <MarketRow label="Active Listings" value="2,847" change="+128" up />
            <MarketRow label="Avg Price / Sqft" value="$285" change="+$8" up />
            <p className="text-xs text-slate-400 italic pt-2">*Market data is estimated for demonstration. Verify with local MLS or real estate data sources.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardStat({ icon: Icon, label, value, href, color, bg }: any) {
  return (
    <Link href={href} className="premium-card p-4 hover:shadow-premium transition group">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </Link>
  );
}

function InsightItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
      <Icon className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function MarketRow({ label, value, change, up }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
        <span className={`text-xs font-medium ${up ? 'text-emerald-500' : 'text-red-500'}`}>{change}</span>
      </div>
    </div>
  );
}
