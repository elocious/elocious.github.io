'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Printer, Download, Share2, Save } from 'lucide-react';
import { ScoreRing, ScoreBar } from '@/components/ScoreRing';
import { AIDisclaimer } from '@/components/ui/PageParts';
import { formatCurrency } from '@/lib/calculations';

function ReportPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || '';
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) { setLoading(false); return; }
    fetch('/api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ propertyId }) })
      .then(r => r.json()).then(d => { setReport(d.report); setLoading(false); });
  }, [propertyId]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="h-96 skeleton rounded-3xl" /></div>;
  if (!report) return <div className="max-w-4xl mx-auto px-4 py-8 text-center"><p className="text-slate-500">No property selected. Go to a property page and click "Report".</p></div>;

  const p = report.property;
  const s = report.scores;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      {/* Actions */}
      <div className="flex items-center justify-between mb-6 no-print">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Property Report</h1>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition min-h-[44px]">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      {/* Report content */}
      <div className="premium-card p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">BetterHome Report</span>
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">{p.title}</h2>
          <p className="text-sm text-slate-500">{p.address}, {p.city}, {p.state} {p.zipCode}</p>
          <p className="text-sm text-slate-400 mt-1">Generated {new Date(report.generatedAt).toLocaleDateString()}</p>
        </div>

        {/* AI Summary */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Executive Summary</h3>
          <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{report.aiSummary}</div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-6 border-y border-slate-200 dark:border-slate-800 py-6">
          <ScoreRing score={s.overallScore} size={120} strokeWidth={8} />
          <div className="flex-1 grid grid-cols-2 gap-3">
            <ScoreBar score={s.financialFitScore} label="Financial Fit" />
            <ScoreBar score={s.locationFitScore} label="Location Fit" />
            <ScoreBar score={s.lifestyleFitScore} label="Lifestyle Fit" />
            <ScoreBar score={s.conditionScore} label="Condition" />
            <ScoreBar score={s.riskScore} label="Risk" />
            <ScoreBar score={s.personalMatchScore} label="Personal Match" />
          </div>
        </div>

        {/* Property overview */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Property Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div><span className="text-slate-400">Price</span><br /><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(p.price)}</span></div>
            <div><span className="text-slate-400">Bedrooms</span><br /><span className="font-semibold text-slate-900 dark:text-white">{p.bedrooms}</span></div>
            <div><span className="text-slate-400">Bathrooms</span><br /><span className="font-semibold text-slate-900 dark:text-white">{p.bathrooms}</span></div>
            <div><span className="text-slate-400">Square Feet</span><br /><span className="font-semibold text-slate-900 dark:text-white">{p.squareFeet.toLocaleString()}</span></div>
            <div><span className="text-slate-400">Year Built</span><br /><span className="font-semibold text-slate-900 dark:text-white">{p.yearBuilt || 'N/A'}</span></div>
            <div><span className="text-slate-400">Property Type</span><br /><span className="font-semibold text-slate-900 dark:text-white capitalize">{p.propertyType.replace('-', ' ')}</span></div>
            <div><span className="text-slate-400">HOA</span><br /><span className="font-semibold text-slate-900 dark:text-white">{p.hoa ? formatCurrency(p.hoa) + '/mo' : 'None'}</span></div>
            <div><span className="text-slate-400">Parking</span><br /><span className="font-semibold text-slate-900 dark:text-white">{p.parking} spaces</span></div>
          </div>
        </div>

        {/* Financial Analysis */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Financial Analysis</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div><span className="text-slate-400">Down Payment</span><br /><span className="font-semibold">{formatCurrency(report.financial.downPayment)}</span></div>
            <div><span className="text-slate-400">Interest Rate</span><br /><span className="font-semibold">{report.financial.interestRate}%</span></div>
            <div><span className="text-slate-400">Loan Term</span><br /><span className="font-semibold">{report.financial.loanTerm} years</span></div>
            <div><span className="text-slate-400">Property Tax</span><br /><span className="font-semibold">{formatCurrency(report.financial.propertyTax)}/yr</span></div>
            <div><span className="text-slate-400">Insurance</span><br /><span className="font-semibold">{formatCurrency(report.financial.insurance)}/yr</span></div>
            <div><span className="text-slate-400">Maintenance</span><br /><span className="font-semibold">{formatCurrency(report.financial.maintenance)}/mo</span></div>
          </div>
        </div>

        {/* Neighborhood */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Neighborhood Analysis</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div><span className="text-slate-400">School Rating</span><br /><span className="font-semibold">{p.schoolRating || 'N/A'}/10</span></div>
            <div><span className="text-slate-400">Safety Score</span><br /><span className="font-semibold">{p.safetyScore || 'N/A'}/100</span></div>
            <div><span className="text-slate-400">Walkability</span><br /><span className="font-semibold">{p.walkabilityScore || 'N/A'}/100</span></div>
            <div><span className="text-slate-400">Flood Risk</span><br /><span className="font-semibold capitalize">{p.floodRisk || 'N/A'}</span></div>
          </div>
        </div>

        {/* Due Diligence */}
        {report.tasks && report.tasks.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Due Diligence Checklist</h3>
            <div className="space-y-1">
              {report.tasks.map((t: any) => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${t.status === 'complete' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {t.status === 'complete' && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={t.status === 'complete' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assumptions */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Assumptions</h3>
          <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
            {report.assumptions.map((a: string, i: number) => <li key={i}>{a}</li>)}
          </ul>
        </div>

        {/* Data Sources */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Data Sources</h3>
          <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
            {report.dataSources.map((d: string, i: number) => <li key={i}>{d}</li>)}
          </ul>
        </div>

        <AIDisclaimer />
      </div>
    </div>
  );
}

export default function ReportPageWrapper() {
  return <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8"><div className="h-32 skeleton rounded-2xl" /></div>}><ReportPage /></Suspense>;
}
