import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function GET() {
  const userId = await getCurrentUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    ...user,
    preferredLocations: user.preferredLocations ? JSON.parse(user.preferredLocations) : [],
  });
}

export async function PATCH(req: NextRequest) {
  const userId = await getCurrentUserId();
  const body = await req.json();
  const update: any = {};
  const allowed = ['name', 'buyerType', 'budgetMin', 'budgetMax', 'timeline', 'theme', 'currency', 'units',
    'weightAffordability', 'weightSafety', 'weightSchools', 'weightCommute', 'weightSpace',
    'weightNeighborhood', 'weightInvestment', 'weightLifestyle', 'weightMaintenance', 'weightPrivacy', 'weightOutdoor'];
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key];
  }
  if (body.preferredLocations) update.preferredLocations = JSON.stringify(body.preferredLocations);
  const user = await prisma.user.update({ where: { id: userId }, data: update });
  return NextResponse.json({ user });
}
