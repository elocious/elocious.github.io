// BetterHome AI Evaluation Scoring Engine
// Transparent, explainable scoring — never a black box.
// Each sub-score is calculated from documented inputs and weights.

import type { Prisma } from '@prisma/client';

export interface PropertyData {
  price: number;
  rent?: number | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number | null;
  yearBuilt?: number | null;
  schoolRating?: number | null;
  safetyScore?: number | null;
  walkabilityScore?: number | null;
  transitScore?: number | null;
  floodRisk?: string | null;
  hoa?: number;
  propertyTax?: number | null;
}

export interface FinancialInputs {
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  hoa: number;
  insurance: number;
  maintenance: number;
  utilities: number;
  closingCosts: number;
  renovationBudget: number;
}

export interface ConditionInputs {
  roof: number; foundation: number; plumbing: number; electrical: number; hvac: number;
  windows: number; kitchen: number; bathrooms: number; exterior: number; landscaping: number;
}

export interface UserWeights {
  affordability: number; safety: number; schools: number; commute: number; space: number;
  neighborhood: number; investment: number; lifestyle: number; maintenance: number;
  privacy: number; outdoor: number;
}

export interface UserBudget {
  min: number; max: number;
}

export interface ScoreResult {
  overallScore: number;
  financialFitScore: number;
  locationFitScore: number;
  lifestyleFitScore: number;
  conditionScore: number;
  riskScore: number;
  longTermAffordabilityScore: number;
  personalMatchScore: number;
  explanations: ScoreExplanation[];
}

export interface ScoreExplanation {
  factor: string;
  score: number;
  weight: number;
  reasoning: string;
  dataSources: string[];
  assumptions: string[];
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function calculateScores(
  property: PropertyData,
  financial: FinancialInputs,
  condition: ConditionInputs,
  weights: UserWeights,
  budget: UserBudget
): ScoreResult {
  // 1. Financial Fit — how well does the monthly cost fit a reasonable budget?
  const loanAmount = property.price - financial.downPayment;
  const r = financial.interestRate / 100 / 12;
  const n = financial.loanTerm * 12;
  const mortgage = r === 0 ? loanAmount / n : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const monthlyTotal = mortgage + financial.propertyTax / 12 + financial.hoa + financial.insurance / 12 + financial.maintenance + financial.utilities;
  // Assume monthly income is budget.max / 48 (roughly 25% DTI target at max budget)
  const estIncome = budget.max / 48;
  const dti = estIncome > 0 ? (monthlyTotal / estIncome) * 100 : 50;
  let financialFitScore: number;
  if (dti <= 25) financialFitScore = 95;
  else if (dti <= 28) financialFitScore = 85;
  else if (dti <= 33) financialFitScore = 72;
  else if (dti <= 38) financialFitScore = 58;
  else if (dti <= 43) financialFitScore = 42;
  else financialFitScore = 25;

  const priceFit = property.price <= budget.max
    ? clamp(100 - ((budget.max - property.price) / budget.max) * -20 + (property.price < budget.min ? -10 : 0))
    : clamp(100 - ((property.price - budget.max) / budget.max) * 100);
  financialFitScore = clamp((financialFitScore + priceFit) / 2);

  // 2. Location Fit — neighborhood quality scores
  const schoolScore = property.schoolRating != null ? (property.schoolRating / 10) * 100 : 60;
  const safetyScore = property.safetyScore != null ? property.safetyScore : 65;
  const walkScore = property.walkabilityScore != null ? property.walkabilityScore : 55;
  const transitScore = property.transitScore != null ? property.transitScore : 50;
  const locationFitScore = clamp(avg([schoolScore, safetyScore, walkScore, transitScore]));

  // 3. Lifestyle Fit — space, amenities, type match
  const spaceScore = clamp((property.squareFeet / 2500) * 100);
  const bedroomScore = clamp((property.bedrooms / 4) * 100);
  const amenityBonus = (property.lotSize ? 10 : 0) + 0;
  const lifestyleFitScore = clamp(avg([spaceScore, bedroomScore]) + amenityBonus);

  // 4. Condition Score — average of condition ratings (1-10 scale → 0-100)
  const conditionAvg = avg([
    condition.roof, condition.foundation, condition.plumbing, condition.electrical,
    condition.hvac, condition.windows, condition.kitchen, condition.bathrooms,
    condition.exterior, condition.landscaping,
  ]);
  const conditionScore = clamp((conditionAvg / 10) * 100);

  // 5. Risk Score — flood risk, age, condition
  let riskBase = 80;
  if (property.floodRisk === 'high') riskBase -= 30;
  else if (property.floodRisk === 'moderate') riskBase -= 15;
  if (property.yearBuilt && property.yearBuilt < 1960) riskBase -= 10;
  if (conditionAvg < 5) riskBase -= 15;
  else if (conditionAvg < 7) riskBase -= 8;
  const riskScore = clamp(riskBase); // higher = less risk

  // 6. Long-Term Affordability — total cost of ownership over time
  const annualCost = monthlyTotal * 12;
  const annualCostRatio = property.price > 0 ? annualCost / property.price : 0.5;
  let longTermScore: number;
  if (annualCostRatio <= 0.05) longTermScore = 90;
  else if (annualCostRatio <= 0.07) longTermScore = 78;
  else if (annualCostRatio <= 0.09) longTermScore = 65;
  else if (annualCostRatio <= 0.12) longTermScore = 50;
  else longTermScore = 35;
  const longTermAffordabilityScore = clamp(longTermScore);

  // 7. Personal Match — weighted by user priorities
  const personalMatchScore = clamp(
    (financialFitScore * weights.affordability +
      safetyScore * weights.safety +
      schoolScore * weights.schools +
      transitScore * weights.commute +
      spaceScore * weights.space +
      locationFitScore * weights.neighborhood +
      longTermAffordabilityScore * weights.investment +
      lifestyleFitScore * weights.lifestyle +
      (100 - (conditionAvg < 5 ? 60 : 100)) * weights.maintenance +
      (property.lotSize ? 80 : 40) * weights.privacy +
      (property.lotSize ? 90 : 30) * weights.outdoor) /
    (weights.affordability + weights.safety + weights.schools + weights.commute +
      weights.space + weights.neighborhood + weights.investment + weights.lifestyle +
      weights.maintenance + weights.privacy + weights.outdoor)
  );

  // Overall — weighted combination
  const overallScore = clamp(
    financialFitScore * 0.20 +
    locationFitScore * 0.15 +
    lifestyleFitScore * 0.15 +
    conditionScore * 0.15 +
    riskScore * 0.10 +
    longTermAffordabilityScore * 0.10 +
    personalMatchScore * 0.15
  );

  const explanations: ScoreExplanation[] = [
    {
      factor: 'Financial Fit',
      score: financialFitScore,
      weight: 20,
      reasoning: `Estimated monthly cost of ${formatMonthly(monthlyTotal)} represents ${dti.toFixed(1)}% of an estimated income at your max budget. ${dti <= 28 ? 'This is within healthy debt-to-income ranges.' : 'This exceeds the recommended 28% DTI threshold.'} Property price is ${property.price <= budget.max ? 'within' : 'above'} your budget range.`,
      dataSources: ['User-provided financial inputs', 'Property listing price'],
      assumptions: ['Estimated income derived from max budget at ~25% DTI target', 'Standard 28/36 DTI guideline'],
    },
    {
      factor: 'Location Fit',
      score: locationFitScore,
      weight: 15,
      reasoning: `Composite of school rating (${property.schoolRating ?? 'N/A'}/10), safety (${property.safetyScore ?? 'N/A'}/100), walkability (${property.walkabilityScore ?? 'N/A'}/100), and transit (${property.transitScore ?? 'N/A'}/100). Missing scores default to neutral estimates.`,
      dataSources: ['Neighborhood data (estimated)', 'School rating (estimated)'],
      assumptions: ['Neighborhood scores are estimates and should be verified with local sources'],
    },
    {
      factor: 'Lifestyle Fit',
      score: lifestyleFitScore,
      weight: 15,
      reasoning: `Based on ${property.bedrooms} bedrooms and ${property.squareFeet} sq ft. Space score: ${spaceScore.toFixed(0)}/100. Bedroom score: ${bedroomScore.toFixed(0)}/100.`,
      dataSources: ['Property listing data'],
      assumptions: ['Larger homes generally provide more lifestyle flexibility'],
    },
    {
      factor: 'Property Condition',
      score: conditionScore,
      weight: 15,
      reasoning: `Average condition rating: ${conditionAvg.toFixed(1)}/10 across 10 systems (roof, foundation, plumbing, electrical, HVAC, windows, kitchen, bathrooms, exterior, landscaping). ${conditionAvg >= 7 ? 'Generally good condition.' : conditionAvg >= 5 ? 'Moderate condition — some systems may need attention.' : 'Several systems likely need attention or professional inspection.'}`,
      dataSources: ['User-provided condition ratings'],
      assumptions: ['Ratings are user estimates — a professional inspection is recommended'],
    },
    {
      factor: 'Risk Assessment',
      score: riskScore,
      weight: 10,
      reasoning: `Flood risk: ${property.floodRisk ?? 'unknown'}. Year built: ${property.yearBuilt ?? 'unknown'}. ${property.yearBuilt && property.yearBuilt < 1960 ? 'Older homes may have higher maintenance risk.' : ''} ${conditionAvg < 5 ? 'Below-average condition increases risk.' : ''}`,
      dataSources: ['Flood risk data (estimated)', 'Year built from listing', 'Condition ratings'],
      assumptions: ['Flood risk is an estimate — verify with FEMA flood maps'],
    },
    {
      factor: 'Long-Term Affordability',
      score: longTermAffordabilityScore,
      weight: 10,
      reasoning: `Annual carrying cost is ${formatMonthly(annualCost)}, approximately ${(annualCostRatio * 100).toFixed(1)}% of the property value per year. ${annualCostRatio <= 0.07 ? 'This is within reasonable long-term ownership cost ranges.' : 'Higher carrying costs relative to value — consider long-term sustainability.'}`,
      dataSources: ['Calculated from financial inputs'],
      assumptions: ['Costs assumed constant — taxes, insurance, and maintenance may increase over time'],
    },
    {
      factor: 'Personal Preference Match',
      score: personalMatchScore,
      weight: 15,
      reasoning: `Weighted by your stated priorities. Your highest-weighted factors are applied more heavily. This score reflects how well the property aligns with what matters most to you — it does not override important risk or financial information.`,
      dataSources: ['User priority weights', 'All sub-scores above'],
      assumptions: ['Priority weights reflect your true preferences', 'Important information is never hidden by preferences'],
    },
  ];

  return {
    overallScore: Math.round(overallScore),
    financialFitScore: Math.round(financialFitScore),
    locationFitScore: Math.round(locationFitScore),
    lifestyleFitScore: Math.round(lifestyleFitScore),
    conditionScore: Math.round(conditionScore),
    riskScore: Math.round(riskScore),
    longTermAffordabilityScore: Math.round(longTermAffordabilityScore),
    personalMatchScore: Math.round(personalMatchScore),
    explanations,
  };
}

function formatMonthly(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

export function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Very Good';
  if (score >= 55) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 25) return 'Below Average';
  return 'Poor';
}

export function scoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-500';
  if (score >= 55) return 'text-brand-500';
  if (score >= 40) return 'text-gold-500';
  return 'text-red-500';
}

export function scoreBgColor(score: number): string {
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 55) return 'bg-brand-500';
  if (score >= 40) return 'bg-gold-500';
  return 'bg-red-500';
}

export function matchPercentage(property: PropertyData, weights: UserWeights, budget: UserBudget): number {
  // Simplified match calculation for property cards
  const priceFit = property.price <= budget.max && property.price >= budget.min
    ? 90
    : property.price <= budget.max * 1.1
    ? 70
    : 40;
  const locFit = avg([
    property.schoolRating ? (property.schoolRating / 10) * 100 : 60,
    property.safetyScore ?? 65,
    property.walkabilityScore ?? 55,
  ]);
  const spaceFit = clamp((property.squareFeet / 2500) * 100);
  const match = clamp(
    (priceFit * weights.affordability +
      locFit * (weights.safety + weights.schools + weights.neighborhood) / 3 +
      spaceFit * weights.space +
      70 * weights.lifestyle) /
    (weights.affordability + (weights.safety + weights.schools + weights.neighborhood) / 3 + weights.space + weights.lifestyle)
  );
  return Math.round(match);
}
