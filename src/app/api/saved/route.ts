import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function GET() {
  const userId = await getCurrentUserId();
  const saved = await prisma.savedProperty.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({
    saved: saved.map(s => ({
      ...s,
      property: { ...s.property, images: JSON.parse(s.property.images || '[]') },
    })),
  });
}

export async function PATCH(req: Request) {
  const userId = await getCurrentUserId();
  const { id, vaultStatus } = await req.json();
  const updated = await prisma.savedProperty.update({
    where: { id },
    data: { vaultStatus },
  });
  if (updated.propertyId) {
    await prisma.propertyEvent.create({
      data: { propertyId: updated.propertyId, eventType: 'status_changed', description: `Status changed to ${vaultStatus}` },
    });
  }
  return NextResponse.json({ saved: updated });
}
