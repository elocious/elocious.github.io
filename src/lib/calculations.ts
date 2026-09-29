// Financial calculation engine for BetterHome
// All formulas are transparent and documented. See "How did we calculate this?" UI.

export interface MortgageParams {
  price: number;
  downPayment: number;
  interestRate: number; // annual %
  loanTerm: number; // years
  propertyTax?: number; // annual
  hoa?: number; // monthly
  insurance?: number; // annual
  maintenance?: number; // monthly
  utilities?: number; // monthly
}

export function monthlyMortgage(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function monthlyCarryingCost(params: MortgageParams): number {
  const loanAmount = params.price - params.downPayment;
  const mortgage = monthlyMortgage(loanAmount, params.interestRate, params.loanTerm);
  const tax = (params.propertyTax || 0) / 12;
  const insurance = (params.insurance || 0) / 12;
  return mortgage + tax + (params.hoa || 0) + insurance + (params.maintenance || 0) + (params.utilities || 0);
}

export function annualOwnershipCost(params: MortgageParams): number {
  return monthlyCarryingCost(params) * 12;
}

export function costPerSquareFoot(price: number, sqft: number): number {
  if (sqft <= 0) return 0;
  return price / sqft;
}

export function debtToIncomeRatio(monthlyDebt: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  return (monthlyDebt / monthlyIncome) * 100;
}

export function rentToIncomeRatio(monthlyRent: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  return (monthlyRent / monthlyIncome) * 100;
}

export interface EquityProjectionParams {
  price: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  annualAppreciation: number; // %
  years: number;
}

export interface EquityPoint {
  year: number;
  homeValue: number;
  loanBalance: number;
  equity: number;
  totalPaid: number;
}

export function equityProjection(params: EquityProjectionParams): EquityPoint[] {
  const loanAmount = params.price - params.downPayment;
  const r = params.interestRate / 100 / 12;
  const n = params.loanTerm * 12;
  const monthlyPayment = r === 0 ? loanAmount / n : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const points: EquityPoint[] = [];
  let balance = loanAmount;
  let homeValue = params.price;
  let totalPaid = params.downPayment;

  points.push({ year: 0, homeValue, loanBalance: balance, equity: homeValue - balance, totalPaid });

  for (let y = 1; y <= params.years; y++) {
    for (let m = 0; m < 12; m++) {
      const interest = balance * r;
      const principalPaid = monthlyPayment - interest;
      balance = Math.max(0, balance - principalPaid);
      totalPaid += monthlyPayment;
    }
    homeValue *= 1 + params.annualAppreciation / 100;
    points.push({ year: y, homeValue, loanBalance: balance, equity: homeValue - balance, totalPaid });
  }
  return points;
}

export interface BuyVsRentParams {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  hoa: number;
  insurance: number;
  maintenance: number;
  utilities: number;
  closingCosts: number;
  annualAppreciation: number;
  monthlyRent: number;
  rentIncrease: number; // % annual
  investmentReturn: number; // % annual opportunity cost
  years: number;
}

export interface BuyVsRentResult {
  year: number;
  buyMonthly: number;
  rentMonthly: number;
  buyTotal: number;
  rentTotal: number;
  buyEquity: number;
  rentInvestment: number;
  netAdvantage: number; // positive = buy better
}

export function buyVsRentAnalysis(params: BuyVsRentParams): BuyVsRentResult[] {
  const loanAmount = params.homePrice - params.downPayment;
  const r = params.interestRate / 100 / 12;
  const n = params.loanTerm * 12;
  const mortgage = r === 0 ? loanAmount / n : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const results: BuyVsRentResult[] = [];
  let balance = loanAmount;
  let homeValue = params.homePrice;
  let buyTotal = params.downPayment + params.closingCosts;
  let rentTotal = 0;
  let currentRent = params.monthlyRent;
  let rentInvestment = params.downPayment + params.closingCosts; // invested instead of down payment

  for (let y = 1; y <= params.years; y++) {
    const yearBuyMonthly = mortgage + params.propertyTax / 12 + params.hoa + params.insurance / 12 + params.maintenance + params.utilities;
    const yearRentMonthly = currentRent;
    for (let m = 0; m < 12; m++) {
      const interest = balance * r;
      balance = Math.max(0, balance - (mortgage - interest));
      buyTotal += yearBuyMonthly;
      rentTotal += yearRentMonthly;
    }
    homeValue *= 1 + params.annualAppreciation / 100;
    rentInvestment = rentInvestment * (1 + params.investmentReturn / 100) + (yearBuyMonthly - yearRentMonthly > 0 ? (yearBuyMonthly - yearRentMonthly) * 12 * (1 + params.investmentReturn / 200) : 0);
    currentRent *= 1 + params.rentIncrease / 100;
    const buyEquity = homeValue - balance;
    const netAdvantage = buyEquity - rentInvestment + (rentTotal - buyTotal);
    results.push({ year: y, buyMonthly: yearBuyMonthly, rentMonthly: yearRentMonthly, buyTotal, rentTotal, buyEquity, rentInvestment, netAdvantage });
  }
  return results;
}

export function closingCostsEstimate(price: number, state?: string): number {
  // Typical closing costs: 2-5% of price
  const rate = state === 'TX' ? 0.025 : state === 'WA' ? 0.03 : state === 'NY' ? 0.045 : 0.03;
  return price * rate;
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function formatCurrencyDetailed(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}
