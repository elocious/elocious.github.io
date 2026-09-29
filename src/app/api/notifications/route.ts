import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function GET() {
  const userId = await getCurrentUserId();
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({ notifications });
}

export async function PATCH() {
  const userId = await getCurrentUserId();
  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  return NextResponse.json({ success: true });
}
