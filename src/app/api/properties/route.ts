import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { matchPercentage, type PropertyData, type UserWeights, type UserBudget } from '@/lib/scoring';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = await getCurrentUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const where: any = {};
  const listingType = searchParams.get('listingType');
  if (listingType) where.listingType = listingType;

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  const minBed = searchParams.get('minBed');
  if (minBed) where.bedrooms = { gte: parseFloat(minBed) };

  const minBath = searchParams.get('minBath');
  if (minBath) where.bathrooms = { gte: parseFloat(minBath) };

  const propertyType = searchParams.get('propertyType');
  if (propertyType) where.propertyType = propertyType;

  const city = searchParams.get('city');
  if (city) where.city = { contains: city };

  const q = searchParams.get('q');
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { address: { contains: q } },
      { city: { contains: q } },
      { neighborhood: { contains: q } },
      { zipCode: { contains: q } },
    ];
  }

  const minSqft = searchParams.get('minSqft');
  if (minSqft) where.squareFeet = { gte: parseFloat(minSqft) };

  const minYear = searchParams.get('minYear');
  if (minYear) where.yearBuilt = { gte: parseInt(minYear) };

  const hasPool = searchParams.get('pool');
  if (hasPool === 'true') where.pool = true;
  const hasGarden = searchParams.get('garden');
  if (hasGarden === 'true') where.garden = true;
  const hasSolar = searchParams.get('solar');
  if (hasSolar === 'true') where.solar = true;
  const hasSmartHome = searchParams.get('smartHome');
  if (hasSmartHome === 'true') where.smartHome = true;
  const isFurnished = searchParams.get('furnished');
  if (isFurnished === 'true') where.furnished = true;

  const minSchool = searchParams.get('minSchool');
  if (minSchool) where.schoolRating = { gte: parseFloat(minSchool) };

  const minSafety = searchParams.get('minSafety');
  if (minSafety) where.safetyScore = { gte: parseFloat(minSafety) };

  const minWalk = searchParams.get('minWalk');
  if (minWalk) where.walkabilityScore = { gte: parseFloat(minWalk) };

  const floodRisk = searchParams.get('floodRisk');
  if (floodRisk) where.floodRisk = floodRisk;

  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  const properties = await prisma.property.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
  });

  // Get saved status
  const saved = await prisma.savedProperty.findMany({
    where: { userId },
    select: { propertyId: true },
  });
  const savedSet = new Set(saved.map(s => s.propertyId));

  // Calculate match percentages
  const weights: UserWeights = {
    affordability: user.weightAffordability,
    safety: user.weightSafety,
    schools: user.weightSchools,
    commute: user.weightCommute,
    space: user.weightSpace,
    neighborhood: user.weightNeighborhood,
    investment: user.weightInvestment,
    lifestyle: user.weightLifestyle,
    maintenance: user.weightMaintenance,
    privacy: user.weightPrivacy,
    outdoor: user.weightOutdoor,
  };
  const budget: UserBudget = { min: user.budgetMin || 0, max: user.budgetMax || 1000000 };

  const result = properties.map(p => {
    const pData: PropertyData = {
      price: p.price, rent: p.rent, propertyType: p.propertyType,
      bedrooms: p.bedrooms, bathrooms: p.bathrooms, squareFeet: p.squareFeet,
      lotSize: p.lotSize, yearBuilt: p.yearBuilt, schoolRating: p.schoolRating,
      safetyScore: p.safetyScore, walkabilityScore: p.walkabilityScore,
      transitScore: p.transitScore, floodRisk: p.floodRisk, hoa: p.hoa,
      propertyTax: p.propertyTax,
    };
    return {
      ...p,
      images: p.images,
      saved: savedSet.has(p.id),
      matchPercentage: matchPercentage(pData, weights, budget),
    };
  });

  return NextResponse.json({ properties: result, total: result.length });
}
