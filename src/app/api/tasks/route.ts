import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function GET() {
  const userId = await getCurrentUserId();
  const tasks = await prisma.task.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { title, category, propertyId, dueDate } = await req.json();
  const task = await prisma.task.create({
    data: { userId, title, category, propertyId: propertyId || null, dueDate: dueDate ? new Date(dueDate) : null },
  });
  if (propertyId) {
    await prisma.propertyEvent.create({
      data: { propertyId, eventType: 'task_completed', description: `Task created: ${title}` },
    });
  }
  return NextResponse.json({ task });
}

export async function PATCH(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { id, status } = await req.json();
  const task = await prisma.task.update({
    where: { id },
    data: { status },
  });
  if (task.propertyId && status === 'complete') {
    await prisma.propertyEvent.create({
      data: { propertyId: task.propertyId, eventType: 'task_completed', description: `Task completed: ${task.title}` },
    });
  }
  return NextResponse.json({ task });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
