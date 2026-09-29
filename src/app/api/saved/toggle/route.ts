import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { propertyId } = await req.json();

  const existing = await prisma.savedProperty.findFirst({ where: { userId, propertyId } });
  if (existing) {
    await prisma.savedProperty.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedProperty.create({ data: { userId, propertyId } });
  await prisma.propertyEvent.create({
    data: { propertyId, eventType: 'saved', description: 'Saved to vault' },
  });
  return NextResponse.json({ saved: true });
}
