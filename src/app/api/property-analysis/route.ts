import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { aiPropertyAnalysis } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { propertyId } = await req.json();
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const pData = {
    price: property.price, rent: property.rent, propertyType: property.propertyType,
    bedrooms: property.bedrooms, bathrooms: property.bathrooms, squareFeet: property.squareFeet,
    lotSize: property.lotSize, yearBuilt: property.yearBuilt, schoolRating: property.schoolRating,
    safetyScore: property.safetyScore, walkabilityScore: property.walkabilityScore,
    transitScore: property.transitScore, floodRisk: property.floodRisk, hoa: property.hoa,
    propertyTax: property.propertyTax, neighborhood: property.neighborhood, city: property.city,
    description: property.description, address: property.address,
  };

  const analysis = await aiPropertyAnalysis(pData as any);
  return NextResponse.json({ analysis });
}
