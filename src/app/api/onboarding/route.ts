import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const body = await req.json();
  const { buyerType, budgetMin, budgetMax, locations, weights, timeline } = body;

  const update: any = {};
  if (buyerType) update.buyerType = buyerType;
  if (budgetMin != null) update.budgetMin = budgetMin;
  if (budgetMax != null) update.budgetMax = budgetMax;
  if (locations) update.preferredLocations = JSON.stringify(locations);
  if (timeline) update.timeline = timeline;
  if (weights) {
    Object.assign(update, {
      weightAffordability: weights.affordability ?? 5,
      weightSafety: weights.safety ?? 5,
      weightSchools: weights.schools ?? 5,
      weightCommute: weights.commute ?? 5,
      weightSpace: weights.space ?? 5,
      weightNeighborhood: weights.neighborhood ?? 5,
      weightInvestment: weights.investment ?? 5,
      weightLifestyle: weights.lifestyle ?? 5,
      weightMaintenance: weights.maintenance ?? 5,
      weightPrivacy: weights.privacy ?? 5,
      weightOutdoor: weights.outdoor ?? 5,
    });
  }

  const user = await prisma.user.update({ where: { id: userId }, data: update });
  return NextResponse.json({ user });
}
