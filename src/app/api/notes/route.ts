import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');
  const notes = await prisma.note.findMany({
    where: { userId, ...(propertyId ? { propertyId } : {}) },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { content, propertyId } = await req.json();
  const note = await prisma.note.create({
    data: { userId, content, propertyId: propertyId || null },
  });
  if (propertyId) {
    await prisma.propertyEvent.create({
      data: { propertyId, eventType: 'note_added', description: 'Note added' },
    });
  }
  return NextResponse.json({ note });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
