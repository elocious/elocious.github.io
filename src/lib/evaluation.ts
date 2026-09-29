import type { PropertyInput, EvaluationResult, BuyerPersona, Verdict, ScoreBreakdownItem } from '../types';

export function calculateMonthlyPayment(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

interface Weights {
  affordability: number;
  safety: number;
  schools: number;
  walkability: number;
  transit: number;
  appreciation: number;
  structural: number;
  sentiment: number;
}

function getWeights(persona?: BuyerPersona): Weights {
  const w: Weights = {
    affordability: 0.22,
    safety: 0.14,
    schools: 0.10,
    walkability: 0.08,
    transit: 0.05,
    appreciation: 0.14,
    structural: 0.12,
    sentiment: 0.15,
  };

  if (!persona) return w;

  if (persona.investmentHorizon === 'short-term') {
    w.appreciation += 0.04;
    w.structural -= 0.02;
  } else {
    w.structural += 0.03;
    w.appreciation += 0.02;
  }

  if (persona.riskTolerance === 'conservative') {
    w.safety += 0.05;
    w.affordability += 0.03;
    w.appreciation -= 0.03;
  } else if (persona.riskTolerance === 'aggressive') {
    w.appreciation += 0.05;
    w.safety -= 0.03;
  }

  const tp = persona.priorities.schools + persona.priorities.commute + persona.priorities.appreciation + persona.priorities.lotSize;
  if (tp > 0) {
    w.schools += (persona.priorities.schools / tp) * 0.04;
    w.walkability += (persona.priorities.commute / tp) * 0.04;
    w.appreciation += (persona.priorities.appreciation / tp) * 0.04;
  }

  return w;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function evaluateProperty(input: PropertyInput, persona?: BuyerPersona): EvaluationResult {
  // ── Monthly carrying cost ──
  const loanAmount = input.price * (1 - input.downPayment / 100);
  const pi = calculateMonthlyPayment(loanAmount, input.interestRate, 30);
  const monthlyTaxes = input.propertyTaxes / 12;
  const monthlyInsurance = input.insurance / 12;
  const maintenanceReserve = (input.price * 0.01) / 12;
  const monthlyCarryingCost = pi + monthlyTaxes + input.hoaDues + monthlyInsurance + maintenanceReserve;

  // ── Score components (0–100) ──
  const affordabilityScore = clamp(input.affordabilityComfort * 10);
  const safetyScoreNum = clamp(input.safetyScore * 10);
  const schoolScoreNum = clamp(input.schoolRating * 10);
  const walkabilityScore = clamp(input.walkability);
  const transitScoreNum = clamp(input.transitScore);
  const appreciationScore = clamp(input.appreciationPotential * 10);

  const ageScore = clamp(100 - (2026 - input.yearBuilt) * 1.2);
  const featureScore =
    (input.heating ? 15 : 0) +
    (input.cooling ? 15 : 0) +
    (input.solar ? 20 : 0) +
    (input.garage ? 15 : 0) +
    (input.yard ? 15 : 0) +
    (input.lotSize > 3000 ? 20 : input.lotSize > 1000 ? 10 : 0);
  const structuralScore = clamp(ageScore * 0.5 + featureScore * 0.5);

  const sentimentScore = clamp((input.appearanceRating * 10 + input.neighborhoodVibe * 10) / 2);

  const floodPenalty = input.floodRisk === 'high' ? -15 : input.floodRisk === 'moderate' ? -7 : 0;
  const noisePenalty = (input.noiseLevel - 5) * 3;

  // ── Weighted AI score ──
  const w = getWeights(persona);
  const breakdown: ScoreBreakdownItem[] = [
    { category: 'Affordability', score: affordabilityScore, weight: w.affordability },
    { category: 'Safety', score: safetyScoreNum, weight: w.safety },
    { category: 'Schools', score: schoolScoreNum, weight: w.schools },
    { category: 'Walkability', score: walkabilityScore, weight: w.walkability },
    { category: 'Transit', score: transitScoreNum, weight: w.transit },
    { category: 'Appreciation', score: appreciationScore, weight: w.appreciation },
    { category: 'Structural', score: structuralScore, weight: w.structural },
    { category: 'Sentiment', score: sentimentScore, weight: w.sentiment },
  ];

  const totalWeight = breakdown.reduce((s, b) => s + b.weight, 0);
  let aiScore = breakdown.reduce((s, b) => s + b.score * b.weight, 0) / totalWeight;
  aiScore = clamp(aiScore + floodPenalty + noisePenalty);

  const verdict: Verdict = aiScore >= 80 ? 'BUY' : aiScore >= 65 ? 'RENT' : aiScore >= 50 ? 'CAUTION' : 'AVOID';

  // ── 5-year projection ──
  const monthlyRate = input.interestRate / 100 / 12;
  let balance = loanAmount;
  let totalPrincipalPaid = 0;
  for (let i = 0; i < 60; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = pi - interestPayment;
    balance -= principalPayment;
    totalPrincipalPaid += principalPayment;
  }
  const annualAppreciation = (input.appreciationPotential / 10) * 0.05;
  const homeValue5yr = input.price * Math.pow(1 + annualAppreciation, 5);
  const equityFromAppreciation = homeValue5yr - input.price;
  const fiveYearEquity = totalPrincipalPaid + equityFromAppreciation;
  const fiveYearOwnCost = monthlyCarryingCost * 60;
  const fiveYearRentCost = input.monthlyRent * 60;
  const fiveYearNetPosition = fiveYearEquity - (fiveYearOwnCost - fiveYearRentCost);

  const costPerSqft = input.sqft > 0 ? input.price / input.sqft : 0;

  return {
    aiScore: Math.round(aiScore),
    verdict,
    monthlyCarryingCost: Math.round(monthlyCarryingCost),
    monthlyRentEquivalent: input.monthlyRent,
    principalAndInterest: Math.round(pi),
    monthlyTaxes: Math.round(monthlyTaxes),
    monthlyHoa: input.hoaDues,
    monthlyInsurance: Math.round(monthlyInsurance),
    maintenanceReserve: Math.round(maintenanceReserve),
    fiveYearEquity: Math.round(fiveYearEquity),
    fiveYearRentCost: Math.round(fiveYearRentCost),
    fiveYearOwnCost: Math.round(fiveYearOwnCost),
    fiveYearNetPosition: Math.round(fiveYearNetPosition),
    costPerSqft: Math.round(costPerSqft),
    dueDiligence: generateDueDiligence(input),
    scoreBreakdown: breakdown,
  };
}

export function recomputeEvaluation(property: EvaluatedProperty, persona?: BuyerPersona): EvaluatedProperty {
  return { ...property, evaluation: evaluateProperty(property, persona) };
}

function generateDueDiligence(input: PropertyInput): string[] {
  const items: string[] = [];

  if (input.yearBuilt < 1980)
    items.push('Request a comprehensive home inspection focusing on electrical, plumbing, and foundation integrity given the property age.');
  if (input.yearBuilt < 2000)
    items.push('Ask about the age and condition of the roof, HVAC system, and water heater.');
  if (input.floodRisk === 'high')
    items.push('Obtain an elevation certificate and verify flood insurance requirements — premiums can exceed $2,000/yr in high-risk zones.');
  if (input.floodRisk === 'moderate')
    items.push('Confirm whether the property is in a FEMA-designated flood zone and investigate historical flooding in the area.');
  if (input.hoaDues > 0)
    items.push(`Request HOA financial statements, reserve study, and meeting minutes — monthly dues are $${input.hoaDues}.`);
  if (input.hoaDues > 400)
    items.push('Scrutinize the HOA reserve fund — high dues may signal deferred maintenance or upcoming special assessments.');
  if (input.propertyType === 'condo' || input.propertyType === 'apartment')
    items.push('Review condo association bylaws, rental restrictions, and pending litigation.');
  if (input.solar)
    items.push('Verify solar panel ownership vs. lease — leased systems can complicate the sale and transfer.');
  if (input.appreciationPotential >= 8)
    items.push('Research upcoming zoning changes, transit expansions, and development plans that could drive appreciation.');
  if (input.safetyScore < 5)
    items.push('Visit the neighborhood at different times of day and request local crime statistics from the police department.');
  if (input.schoolRating >= 8)
    items.push('Confirm school district boundaries — boundaries can change and affect resale value.');
  if (input.price > 800000)
    items.push('Consider a pre-listing appraisal and review comparable sales within the last 90 days.');
  if (input.noiseLevel >= 7)
    items.push('Test noise levels during peak hours — request disclosure of nearby construction or flight paths.');
  items.push('Ask the seller for disclosure of any known defects, water damage, or insurance claims in the past 5 years.');

  return items;
}
