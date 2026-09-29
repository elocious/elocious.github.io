import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { matchPercentage, type PropertyData, type UserWeights, type UserBudget } from '@/lib/scoring';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      events: { orderBy: { createdAt: 'desc' }, take: 20 },
      documents: { where: { userId }, orderBy: { createdAt: 'desc' } },
      tasks: { where: { userId }, orderBy: { createdAt: 'desc' } },
      notes: { where: { userId }, orderBy: { createdAt: 'desc' } },
      concepts: { orderBy: { createdAt: 'desc' } },
      evaluations: { where: { userId }, orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const saved = await prisma.savedProperty.findFirst({ where: { userId, propertyId: params.id } });
  const user = await prisma.user.findUnique({ where: { id: userId } });

  let matchPct: number | null = null;
  if (user) {
    const weights: UserWeights = {
      affordability: user.weightAffordability, safety: user.weightSafety,
      schools: user.weightSchools, commute: user.weightCommute, space: user.weightSpace,
      neighborhood: user.weightNeighborhood, investment: user.weightInvestment,
      lifestyle: user.weightLifestyle, maintenance: user.weightMaintenance,
      privacy: user.weightPrivacy, outdoor: user.weightOutdoor,
    };
    const budget: UserBudget = { min: user.budgetMin || 0, max: user.budgetMax || 1000000 };
    const pData: PropertyData = {
      price: property.price, rent: property.rent, propertyType: property.propertyType,
      bedrooms: property.bedrooms, bathrooms: property.bathrooms, squareFeet: property.squareFeet,
      lotSize: property.lotSize, yearBuilt: property.yearBuilt, schoolRating: property.schoolRating,
      safetyScore: property.safetyScore, walkabilityScore: property.walkabilityScore,
      transitScore: property.transitScore, floodRisk: property.floodRisk, hoa: property.hoa,
      propertyTax: property.propertyTax,
    };
    matchPct = matchPercentage(pData, weights, budget);
  }

  // Track viewing
  await prisma.propertyEvent.create({
    data: { propertyId: params.id, eventType: 'viewed', description: 'Property viewed' },
  });

  return NextResponse.json({
    ...property,
    images: JSON.parse(property.images || '[]'),
    saved: !!saved,
    vaultStatus: saved?.vaultStatus || null,
    matchPercentage: matchPct,
  });
}
