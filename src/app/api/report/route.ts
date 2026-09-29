import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { aiReport } from '@/lib/ai';
import { calculateScores, type PropertyData, type FinancialInputs, type ConditionInputs, type UserWeights, type UserBudget } from '@/lib/scoring';

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { propertyId } = await req.json();

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const tasks = await prisma.task.findMany({ where: { userId, propertyId } });
  const notes = await prisma.note.findMany({ where: { userId, propertyId } });
  const evals = await prisma.evaluation.findMany({ where: { userId, propertyId }, orderBy: { createdAt: 'desc' }, take: 1 });

  const pData: PropertyData = {
    price: property.price, rent: property.rent, propertyType: property.propertyType,
    bedrooms: property.bedrooms, bathrooms: property.bathrooms, squareFeet: property.squareFeet,
    lotSize: property.lotSize, yearBuilt: property.yearBuilt, schoolRating: property.schoolRating,
    safetyScore: property.safetyScore, walkabilityScore: property.walkabilityScore,
    transitScore: property.transitScore, floodRisk: property.floodRisk, hoa: property.hoa,
    propertyTax: property.propertyTax,
  };
  const financial: FinancialInputs = evals[0] ? {
    downPayment: evals[0].downPayment, interestRate: evals[0].interestRate, loanTerm: evals[0].loanTerm,
    propertyTax: evals[0].propertyTax, hoa: evals[0].hoa, insurance: evals[0].insurance,
    maintenance: evals[0].maintenance, utilities: evals[0].utilities, closingCosts: evals[0].closingCosts,
    renovationBudget: evals[0].renovationBudget,
  } : {
    downPayment: property.price * 0.2, interestRate: 6.5, loanTerm: 30,
    propertyTax: property.propertyTax || 0, hoa: property.hoa, insurance: property.insuranceEstimate || 0,
    maintenance: property.maintenanceEstimate || 0, utilities: 200, closingCosts: property.price * 0.03,
    renovationBudget: 0,
  };
  const condition: ConditionInputs = evals[0] ? {
    roof: evals[0].conditionRoof, foundation: evals[0].conditionFoundation, plumbing: evals[0].conditionPlumbing,
    electrical: evals[0].conditionElectrical, hvac: evals[0].conditionHVAC, windows: evals[0].conditionWindows,
    kitchen: evals[0].conditionKitchen, bathrooms: evals[0].conditionBathrooms, exterior: evals[0].conditionExterior,
    landscaping: evals[0].conditionLandscaping,
  } : { roof: 7, foundation: 7, plumbing: 7, electrical: 7, hvac: 7, windows: 7, kitchen: 7, bathrooms: 7, exterior: 7, landscaping: 7 };

  const weights: UserWeights = user ? {
    affordability: user.weightAffordability, safety: user.weightSafety, schools: user.weightSchools,
    commute: user.weightCommute, space: user.weightSpace, neighborhood: user.weightNeighborhood,
    investment: user.weightInvestment, lifestyle: user.weightLifestyle, maintenance: user.weightMaintenance,
    privacy: user.weightPrivacy, outdoor: user.weightOutdoor,
  } : { affordability: 5, safety: 5, schools: 5, commute: 5, space: 5, neighborhood: 5, investment: 5, lifestyle: 5, maintenance: 5, privacy: 5, outdoor: 5 };
  const budget: UserBudget = { min: user?.budgetMin || 0, max: user?.budgetMax || 1000000 };

  const scores = calculateScores(pData, financial, condition, weights, budget);
  const aiSummary = await aiReport(pData, scores, financial);

  const report = {
    property,
    scores,
    financial,
    condition,
    tasks,
    notes,
    evaluation: evals[0] || null,
    aiSummary,
    generatedAt: new Date().toISOString(),
    assumptions: [
      'All financial calculations are based on user-provided inputs',
      'Neighborhood scores are estimates and should be verified with local sources',
      'Condition ratings are user estimates — a professional inspection is recommended',
      'This report does not constitute financial, legal, or real estate advice',
    ],
    dataSources: [
      'Property listing data',
      'User-provided financial inputs',
      'User-provided condition ratings',
      'Estimated neighborhood data',
    ],
  };

  await prisma.aIReport.create({
    data: { userId, propertyId, content: JSON.stringify(report) },
  });

  return NextResponse.json({ report });
}
