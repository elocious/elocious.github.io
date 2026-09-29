import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { calculateScores, type PropertyData, type FinancialInputs, type ConditionInputs, type UserWeights, type UserBudget } from '@/lib/scoring';
import { aiCompare } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { propertyIds } = await req.json();

  if (!propertyIds || propertyIds.length < 2) {
    return NextResponse.json({ error: 'Select at least 2 properties' }, { status: 400 });
  }
  if (propertyIds.length > 4) {
    return NextResponse.json({ error: 'Maximum 4 properties' }, { status: 400 });
  }

  const properties = await prisma.property.findMany({
    where: { id: { in: propertyIds } },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const weights: UserWeights = {
    affordability: user.weightAffordability, safety: user.weightSafety,
    schools: user.weightSchools, commute: user.weightCommute, space: user.weightSpace,
    neighborhood: user.weightNeighborhood, investment: user.weightInvestment,
    lifestyle: user.weightLifestyle, maintenance: user.weightMaintenance,
    privacy: user.weightPrivacy, outdoor: user.weightOutdoor,
  };
  const budget: UserBudget = { min: user.budgetMin || 0, max: user.budgetMax || 1000000 };

  const results = properties.map(p => {
    const pData: PropertyData = {
      price: p.price, rent: p.rent, propertyType: p.propertyType,
      bedrooms: p.bedrooms, bathrooms: p.bathrooms, squareFeet: p.squareFeet,
      lotSize: p.lotSize, yearBuilt: p.yearBuilt, schoolRating: p.schoolRating,
      safetyScore: p.safetyScore, walkabilityScore: p.walkabilityScore,
      transitScore: p.transitScore, floodRisk: p.floodRisk, hoa: p.hoa,
      propertyTax: p.propertyTax,
    };
    const defaultFinancial: FinancialInputs = {
      downPayment: p.price * 0.2, interestRate: 6.5, loanTerm: 30,
      propertyTax: p.propertyTax || 0, hoa: p.hoa, insurance: (p.insuranceEstimate || 0),
      maintenance: p.maintenanceEstimate || 0, utilities: 200, closingCosts: p.price * 0.03,
      renovationBudget: 0,
    };
    const defaultCondition: ConditionInputs = {
      roof: 7, foundation: 7, plumbing: 7, electrical: 7, hvac: 7,
      windows: 7, kitchen: 7, bathrooms: 7, exterior: 7, landscaping: 7,
    };
    const scores = calculateScores(pData, defaultFinancial, defaultCondition, weights, budget);
    return { property: { ...p, images: JSON.parse(p.images || '[]') }, scores };
  });

  const propData = results.map(r => ({
    price: r.property.price, bedrooms: r.property.bedrooms, bathrooms: r.property.bathrooms,
    squareFeet: r.property.squareFeet, propertyType: r.property.propertyType,
    schoolRating: r.property.schoolRating, safetyScore: r.property.safetyScore,
    walkabilityScore: r.property.walkabilityScore, floodRisk: r.property.floodRisk,
    neighborhood: r.property.neighborhood, city: r.property.city,
    description: r.property.description,
  } as PropertyData));
  const scoreResults = results.map(r => r.scores);

  const aiTradeoffs = await aiCompare(propData, scoreResults, weights);

  // Generate trade-offs
  const tradeoffs = generateTradeoffs(results);

  // Save comparison
  const comparison = await prisma.comparison.create({
    data: {
      userId, name: `Comparison ${new Date().toLocaleDateString()}`,
      propertyIds: JSON.stringify(propertyIds),
      tradeoffs: JSON.stringify({ ai: aiTradeoffs, auto: tradeoffs }),
    },
  });

  return NextResponse.json({ results, tradeoffs, aiTradeoffs, comparisonId: comparison.id });
}

function generateTradeoffs(results: any[]) {
  const tradeoffs: string[] = [];
  if (results.length < 2) return tradeoffs;

  const sorted = [...results].sort((a, b) => a.property.price - b.property.price);
  const cheapest = sorted[0];
  const priciest = sorted[sorted.length - 1];
  if (cheapest.property.price !== priciest.property.price) {
    tradeoffs.push(`**${cheapest.property.title}** costs ${((priciest.property.price - cheapest.property.price) / 1000).toFixed(0)}K less than ${priciest.property.title}, but may differ in space, location, or condition.`);
  }

  const largest = results.reduce((a, b) => a.property.squareFeet > b.property.squareFeet ? a : b);
  const smallest = results.reduce((a, b) => a.property.squareFeet < b.property.squareFeet ? a : b);
  if (largest.property.squareFeet !== smallest.property.squareFeet) {
    tradeoffs.push(`**${largest.property.title}** offers ${(largest.property.squareFeet - smallest.property.squareFeet).toLocaleString()} more sq ft than ${smallest.property.title}.`);
  }

  const bestSchool = results.reduce((a, b) => (a.property.schoolRating || 0) > (b.property.schoolRating || 0) ? a : b);
  if (bestSchool.property.schoolRating) {
    tradeoffs.push(`**${bestSchool.property.title}** has the highest school rating (${bestSchool.property.schoolRating}/10).`);
  }

  const bestScore = results.reduce((a, b) => a.scores.overallScore > b.scores.overallScore ? a : b);
  tradeoffs.push(`**${bestScore.property.title}** has the highest overall evaluation score (${bestScore.scores.overallScore}/100), driven by its ${bestScore.scores.financialFitScore > bestScore.scores.locationFitScore ? 'financial fit' : 'location fit'}.`);

  return tradeoffs;
}
