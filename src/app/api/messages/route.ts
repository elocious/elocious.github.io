import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');
  const messages = await prisma.message.findMany({
    where: { userId, ...(propertyId ? { propertyId } : {}) },
    include: { property: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { content, propertyId, authorName, authorRole } = await req.json();
  const message = await prisma.message.create({
    data: {
      userId,
      content,
      propertyId: propertyId || null,
      authorName: authorName || 'You',
      authorRole: authorRole || 'buyer',
    },
    include: { property: true },
  });
  if (propertyId) {
    await prisma.propertyEvent.create({
      data: { propertyId, eventType: 'message', description: `${authorName || 'You'}: ${content.slice(0, 60)}` },
    });
  }
  return NextResponse.json({ message });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.message.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
