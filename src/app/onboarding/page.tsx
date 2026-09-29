'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, MapPin, DollarSign, Target, Calendar, Check, ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    buyerType: 'buy',
    location: '',
    budgetMin: 400000,
    budgetMax: 800000,
    priorities: { affordability: 8, safety: 7, schools: 5, commute: 7, space: 8, neighborhood: 6, investment: 5, privacy: 6, outdoor: 7 },
    timeline: '3-6m',
  });

  const finish = async () => {
    await fetch('/api/onboarding', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyerType: data.buyerType,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        locations: data.location ? [data.location] : [],
        weights: data.priorities,
        timeline: data.timeline,
      }),
    });
    router.push('/');
  };

  const steps = [
    { num: 1, icon: Home, title: 'What are you looking for?', subtitle: 'Tell us your goal' },
    { num: 2, icon: MapPin, title: 'Where?', subtitle: 'Preferred location' },
    { num: 3, icon: DollarSign, title: "What's your budget?", subtitle: 'Price range' },
    { num: 4, icon: Target, title: 'What matters most?', subtitle: 'Rank your priorities' },
    { num: 5, icon: Calendar, title: 'What\'s your timeline?', subtitle: 'When do you need to move?' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center shadow-glow">
            <Home className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-slate-900 dark:text-white">BetterHome</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map(s => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${s.num === step ? 'bg-brand-500 text-white' : s.num < step ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                {s.num < step ? <Check className="w-4 h-4" /> : s.num}
              </div>
              {s.num < 5 && <div className={`flex-1 h-0.5 mx-1 ${s.num < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        <div className="premium-card p-8">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">{steps[0].title}</h2>
              <p className="text-sm text-slate-500 mb-6">{steps[0].subtitle}</p>
              <div className="space-y-2">
                {[
                  { val: 'buy', label: 'Buy a home', desc: 'I want to purchase a property' },
                  { val: 'rent', label: 'Rent a home', desc: 'I want to rent a property' },
                  { val: 'explore', label: 'Just exploring', desc: 'I want to browse and learn' },
                ].map(o => (
                  <button key={o.val} onClick={() => setData({...data, buyerType: o.val})} className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition ${data.buyerType === o.val ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-800 hover:border-brand-300'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.buyerType === o.val ? 'border-brand-500' : 'border-slate-300'}`}>
                      {data.buyerType === o.val && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{o.label}</p>
                      <p className="text-xs text-slate-400">{o.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">{steps[1].title}</h2>
              <p className="text-sm text-slate-500 mb-6">{steps[1].subtitle}</p>
              <input value={data.location} onChange={e => setData({...data, location: e.target.value})} placeholder="e.g., Austin, TX" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm" />
              <div className="flex flex-wrap gap-2 mt-3">
                {['Austin, TX', 'Seattle, WA', 'Denver, CO', 'Portland, OR', 'Nashville, TN'].map(c => (
                  <button key={c} onClick={() => setData({...data, location: c})} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-600 transition">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">{steps[2].title}</h2>
              <p className="text-sm text-slate-500 mb-6">{steps[2].subtitle}</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Minimum</label>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${(data.budgetMin / 1000).toFixed(0)}K</span>
                  </div>
                  <input type="range" min={50000} max={2000000} step={25000} value={data.budgetMin} onChange={e => setData({...data, budgetMin: parseInt(e.target.value)})} className="w-full accent-brand-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Maximum</label>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${(data.budgetMax / 1000).toFixed(0)}K</span>
                  </div>
                  <input type="range" min={50000} max={3000000} step={25000} value={data.budgetMax} onChange={e => setData({...data, budgetMax: parseInt(e.target.value)})} className="w-full accent-brand-500" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">{steps[3].title}</h2>
              <p className="text-sm text-slate-500 mb-6">{steps[3].subtitle}</p>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {Object.entries(data.priorities).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400 capitalize">{key}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{val}/10</span>
                    </div>
                    <input type="range" min={0} max={10} value={val} onChange={e => setData({...data, priorities: {...data.priorities, [key]: parseInt(e.target.value)}})} className="w-full accent-brand-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">{steps[4].title}</h2>
              <p className="text-sm text-slate-500 mb-6">{steps[4].subtitle}</p>
              <div className="space-y-2">
                {[
                  { val: 'asap', label: 'ASAP', desc: 'I need to move immediately' },
                  { val: '1-3m', label: '1–3 months', desc: 'Within the next quarter' },
                  { val: '3-6m', label: '3–6 months', desc: 'In the next half year' },
                  { val: '6-12m', label: '6–12 months', desc: 'Within the next year' },
                  { val: 'exploring', label: 'Just exploring', desc: 'No specific timeline' },
                ].map(o => (
                  <button key={o.val} onClick={() => setData({...data, timeline: o.val})} className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition ${data.timeline === o.val ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'border-slate-200 dark:border-slate-800 hover:border-brand-300'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.timeline === o.val ? 'border-brand-500' : 'border-slate-300'}`}>
                      {data.timeline === o.val && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{o.label}</p>
                      <p className="text-xs text-slate-400">{o.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 disabled:opacity-50 transition min-h-[44px]">
              Back
            </button>
            {step < 5 ? (
              <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition min-h-[44px]">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={finish} className="flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition min-h-[44px]">
                <Check className="w-4 h-4" /> Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
