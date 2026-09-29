'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Home, DollarSign, Info } from 'lucide-react';
import { PageHeader, AIDisclaimer } from '@/components/ui/PageParts';
import { monthlyMortgage, monthlyCarryingCost, formatCurrency, equityProjection, buyVsRentAnalysis, costPerSquareFoot } from '@/lib/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, ReferenceLine } from 'recharts';

export default function FinancesPage() {
  const [tab, setTab] = useState<'mortgage' | 'buyvsrent' | 'equity'>('mortgage');

  // Mortgage calculator inputs
  const [price, setPrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(8000);
  const [hoa, setHoa] = useState(0);
  const [insurance, setInsurance] = useState(1800);
  const [maintenance, setMaintenance] = useState(200);
  const [utilities, setUtilities] = useState(200);

  // Buy vs rent inputs
  const [rent, setRent] = useState(2400);
  const [appreciation, setAppreciation] = useState(3);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [closingCosts, setClosingCosts] = useState(15000);
  const [years, setYears] = useState(10);

  const loanAmount = price - downPayment;
  const mortgage = monthlyMortgage(loanAmount, rate, term);
  const monthly = monthlyCarryingCost({ price, downPayment, interestRate: rate, loanTerm: term, propertyTax, hoa, insurance, maintenance, utilities });
  const annual = monthly * 12;
  const costSqft = costPerSquareFoot(price, 2000);

  const equityData = useMemo(() => equityProjection({
    price, downPayment, interestRate: rate, loanTerm: term, annualAppreciation: appreciation, years,
  }), [price, downPayment, rate, term, appreciation, years]);

  const buyRentData = useMemo(() => buyVsRentAnalysis({
    homePrice: price, downPayment, interestRate: rate, loanTerm: term,
    propertyTax, hoa, insurance, maintenance, utilities, closingCosts,
    annualAppreciation: appreciation, monthlyRent: rent, rentIncrease, investmentReturn, years,
  }), [price, downPayment, rate, term, propertyTax, hoa, insurance, maintenance, utilities, closingCosts, appreciation, rent, rentIncrease, investmentReturn, years]);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      <PageHeader title="Financial Tools" subtitle="Advanced real estate calculators with transparent formulas" icon={Calculator} />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'mortgage', label: 'Mortgage & Carrying Cost' },
          { key: 'buyvsrent', label: 'Buy vs Rent' },
          { key: 'equity', label: 'Equity Projection' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition border-b-2 ${tab === t.key ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'mortgage' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Loan Assumptions</h3>
            <Slider label="Home Price" value={price} onChange={setPrice} min={50000} max={2000000} step={10000} format={formatCurrency} />
            <Slider label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} max={price} step={5000} format={formatCurrency} />
            <Slider label="Interest Rate" value={rate} onChange={setRate} min={0} max={12} step={0.1} format={(v) => `${v.toFixed(1)}%`} />
            <Slider label="Loan Term" value={term} onChange={setTerm} min={5} max={40} step={5} format={(v) => `${v} years`} />
            <Slider label="Property Tax (yr)" value={propertyTax} onChange={setPropertyTax} min={0} max={30000} step={500} format={formatCurrency} />
            <Slider label="HOA (mo)" value={hoa} onChange={setHoa} min={0} max={1000} step={10} format={formatCurrency} />
            <Slider label="Insurance (yr)" value={insurance} onChange={setInsurance} min={0} max={10000} step={100} format={formatCurrency} />
            <Slider label="Maintenance (mo)" value={maintenance} onChange={setMaintenance} min={0} max={2000} step={50} format={formatCurrency} />
            <Slider label="Utilities (mo)" value={utilities} onChange={setUtilities} min={0} max={1000} step={25} format={formatCurrency} />
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="premium-card p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Estimated Monthly Carrying Cost</p>
              <p className="text-4xl font-bold gradient-text">{formatCurrency(monthly)}/mo</p>
              <p className="text-sm text-slate-400 mt-1">{formatCurrency(annual)}/year</p>
            </div>
            <div className="premium-card p-5">
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">Cost Breakdown</h4>
              <div className="space-y-2">
                <CostLine label="Mortgage (P&I)" value={mortgage} total={monthly} />
                <CostLine label="Property Tax" value={propertyTax / 12} total={monthly} />
                <CostLine label="Insurance" value={insurance / 12} total={monthly} />
                <CostLine label="HOA" value={hoa} total={monthly} />
                <CostLine label="Maintenance" value={maintenance} total={monthly} />
                <CostLine label="Utilities" value={utilities} total={monthly} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <MiniCard label="Loan Amount" value={formatCurrency(loanAmount)} />
              <MiniCard label="Cost / Sqft" value={formatCurrency(costSqft)} />
              <MiniCard label="Down %" value={`${((downPayment / price) * 100).toFixed(0)}%`} />
            </div>
            <div className="premium-card p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-500">
                  <p className="font-medium mb-1">How did we calculate this?</p>
                  <p>Mortgage: {formatCurrency(loanAmount)} at {rate}% over {term} years using standard amortization formula: M = P × r(1+r)^n / ((1+r)^n - 1)</p>
                </div>
              </div>
              <AIDisclaimer text="*All calculations are estimates based on your inputs. Verify with a mortgage lender for exact figures.*" />
            </div>
          </div>
        </div>
      )}

      {tab === 'buyvsrent' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="premium-card p-5 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Buy Assumptions</h3>
              <Slider label="Home Price" value={price} onChange={setPrice} min={50000} max={2000000} step={10000} format={formatCurrency} />
              <Slider label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} max={price} step={5000} format={formatCurrency} />
              <Slider label="Interest Rate" value={rate} onChange={setRate} min={0} max={12} step={0.1} format={(v) => `${v.toFixed(1)}%`} />
              <Slider label="Closing Costs" value={closingCosts} onChange={setClosingCosts} min={0} max={100000} step={1000} format={formatCurrency} />
              <Slider label="Annual Appreciation" value={appreciation} onChange={setAppreciation} min={-5} max={15} step={0.5} format={(v) => `${v.toFixed(1)}%`} />
            </div>
            <div className="premium-card p-5 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Rent Assumptions</h3>
              <Slider label="Monthly Rent" value={rent} onChange={setRent} min={500} max={10000} step={50} format={formatCurrency} />
              <Slider label="Annual Rent Increase" value={rentIncrease} onChange={setRentIncrease} min={0} max={10} step={0.5} format={(v) => `${v.toFixed(1)}%`} />
              <Slider label="Investment Return (opportunity cost)" value={investmentReturn} onChange={setInvestmentReturn} min={0} max={15} step={0.5} format={(v) => `${v.toFixed(1)}%`} />
              <Slider label="Time Horizon" value={years} onChange={setYears} min={1} max={30} step={1} format={(v) => `${v} years`} />
            </div>
          </div>

          {/* Chart */}
          <div className="premium-card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Cumulative Cost: Buy vs Rent over {years} years</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={buyRentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="year" tickFormatter={v => `Yr ${v}`} stroke="#94a3b8" fontSize={12} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={l => `Year ${l}`} />
                <Legend />
                <Area type="monotone" dataKey="buyTotal" name="Buy Total Cost" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
                <Area type="monotone" dataKey="rentTotal" name="Rent Total Cost" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MiniCard label="Buy Monthly" value={formatCurrency(buyRentData[buyRentData.length - 1]?.buyMonthly || 0)} />
            <MiniCard label="Rent Monthly" value={formatCurrency(buyRentData[buyRentData.length - 1]?.rentMonthly || 0)} />
            <MiniCard label={`Buy ${years}yr Total`} value={formatCurrency(buyRentData[buyRentData.length - 1]?.buyTotal || 0)} />
            <MiniCard label={`Rent ${years}yr Total`} value={formatCurrency(buyRentData[buyRentData.length - 1]?.rentTotal || 0)} />
          </div>

          <div className="premium-card p-5">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p className="font-medium mb-1">How this analysis works</p>
                <p>The buy scenario includes mortgage payments, taxes, insurance, HOA, maintenance, utilities, and closing costs. The rent scenario includes monthly rent (increasing annually) plus the opportunity cost of investing the down payment and closing costs at the specified return rate.</p>
                <p className="mt-2">This is a neutral comparison — neither option is inherently better. The right choice depends on your timeline, flexibility needs, and local market conditions.</p>
              </div>
            </div>
            <AIDisclaimer />
          </div>
        </div>
      )}

      {tab === 'equity' && (
        <div className="space-y-6">
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Equity Projection Assumptions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Slider label="Home Price" value={price} onChange={setPrice} min={50000} max={2000000} step={10000} format={formatCurrency} />
              <Slider label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} max={price} step={5000} format={formatCurrency} />
              <Slider label="Interest Rate" value={rate} onChange={setRate} min={0} max={12} step={0.1} format={(v) => `${v.toFixed(1)}%`} />
              <Slider label="Appreciation" value={appreciation} onChange={setAppreciation} min={-5} max={15} step={0.5} format={(v) => `${v.toFixed(1)}%`} />
            </div>
            <Slider label="Time Horizon" value={years} onChange={setYears} min={1} max={30} step={1} format={(v) => `${v} years`} />
          </div>

          <div className="premium-card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Equity Build-up Over {years} Years</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="year" tickFormatter={v => `Yr ${v}`} stroke="#94a3b8" fontSize={12} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={l => `Year ${l}`} />
                <Legend />
                <Line type="monotone" dataKey="homeValue" name="Home Value" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="loanBalance" name="Loan Balance" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="equity" name="Equity" stroke="#06b6d4" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MiniCard label="Home Value (Yr " value={formatCurrency(equityData[equityData.length - 1]?.homeValue || 0)} />
            <MiniCard label="Loan Balance" value={formatCurrency(equityData[equityData.length - 1]?.loanBalance || 0)} />
            <MiniCard label="Total Equity" value={formatCurrency(equityData[equityData.length - 1]?.equity || 0)} />
            <MiniCard label="Total Paid" value={formatCurrency(equityData[equityData.length - 1]?.totalPaid || 0)} />
          </div>

          <div className="premium-card p-5">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p className="font-medium mb-1">How this projection works</p>
                <p>Home value grows at the assumed annual appreciation rate. Loan balance decreases with each mortgage payment. Equity = Home Value − Loan Balance. This projection assumes constant appreciation and does not account for market volatility, refinancing, or early payoff.</p>
              </div>
            </div>
            <AIDisclaimer text="*Projection based on assumptions. Real estate markets are unpredictable — past performance does not guarantee future results.*" />
          </div>
        </div>
      )}
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step, format }: any) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</label>
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full accent-brand-500" />
    </div>
  );
}

function CostLine({ label, value, total }: any) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(value)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MiniCard({ label, value }: any) {
  return (
    <div className="premium-card p-3 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
