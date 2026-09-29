import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { aiDocumentSummary } from '@/lib/ai';

export async function GET() {
  const userId = await getCurrentUserId();
  const documents = await prisma.propertyDocument.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const body = await req.json();
  const { name, category, propertyId, fileUrl, fileSize, fileType } = body;

  const doc = await prisma.propertyDocument.create({
    data: { userId, name, category, propertyId: propertyId || null, fileUrl, fileSize, fileType },
  });

  if (propertyId) {
    await prisma.propertyEvent.create({
      data: { propertyId, eventType: 'document_uploaded', description: `Document uploaded: ${name}` },
    });
  }

  // Generate AI summary asynchronously (simplified — runs inline)
  const summary = await aiDocumentSummary(name, category);
  await prisma.propertyDocument.update({
    where: { id: doc.id },
    data: { aiSummary: summary },
  });

  return NextResponse.json({ document: { ...doc, aiSummary: summary } });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.propertyDocument.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
