import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { calculateScores, type PropertyData, type FinancialInputs, type ConditionInputs, type UserWeights, type UserBudget } from '@/lib/scoring';
import { aiEvaluate } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const body = await req.json();
  const { propertyId, financial, condition } = body;

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const pData: PropertyData = {
    price: property.price, rent: property.rent, propertyType: property.propertyType,
    bedrooms: property.bedrooms, bathrooms: property.bathrooms, squareFeet: property.squareFeet,
    lotSize: property.lotSize, yearBuilt: property.yearBuilt, schoolRating: property.schoolRating,
    safetyScore: property.safetyScore, walkabilityScore: property.walkabilityScore,
    transitScore: property.transitScore, floodRisk: property.floodRisk, hoa: property.hoa,
    propertyTax: property.propertyTax,
  };

  const weights: UserWeights = {
    affordability: user.weightAffordability, safety: user.weightSafety,
    schools: user.weightSchools, commute: user.weightCommute, space: user.weightSpace,
    neighborhood: user.weightNeighborhood, investment: user.weightInvestment,
    lifestyle: user.weightLifestyle, maintenance: user.weightMaintenance,
    privacy: user.weightPrivacy, outdoor: user.weightOutdoor,
  };
  const budget: UserBudget = { min: user.budgetMin || 0, max: user.budgetMax || 1000000 };

  const scores = calculateScores(pData, financial, condition, weights, budget);

  // Get AI evaluation
  const aiSummary = await aiEvaluate(pData, financial, condition, weights, budget, scores);

  const evaluation = await prisma.evaluation.create({
    data: {
      userId, propertyId,
      downPayment: financial.downPayment, interestRate: financial.interestRate,
      loanTerm: financial.loanTerm, propertyTax: financial.propertyTax,
      hoa: financial.hoa, insurance: financial.insurance, maintenance: financial.maintenance,
      utilities: financial.utilities, closingCosts: financial.closingCosts,
      renovationBudget: financial.renovationBudget,
      conditionRoof: condition.roof, conditionFoundation: condition.foundation,
      conditionPlumbing: condition.plumbing, conditionElectrical: condition.electrical,
      conditionHVAC: condition.hvac, conditionWindows: condition.windows,
      conditionKitchen: condition.kitchen, conditionBathrooms: condition.bathrooms,
      conditionExterior: condition.exterior, conditionLandscaping: condition.landscaping,
      overallScore: scores.overallScore, financialFitScore: scores.financialFitScore,
      locationFitScore: scores.locationFitScore, lifestyleFitScore: scores.lifestyleFitScore,
      conditionScore: scores.conditionScore, riskScore: scores.riskScore,
      longTermAffordabilityScore: scores.longTermAffordabilityScore,
      personalMatchScore: scores.personalMatchScore,
      explanation: JSON.stringify({ scores: scores.explanations, aiSummary }),
    },
  });

  await prisma.propertyEvent.create({
    data: { propertyId, eventType: 'evaluated', description: `Evaluation scored ${scores.overallScore}/100` },
  });

  return NextResponse.json({ evaluation, scores, aiSummary });
}

export async function GET() {
  const userId = await getCurrentUserId();
  const evaluations = await prisma.evaluation.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ evaluations });
}
