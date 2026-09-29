import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';

export async function GET() {
  const userId = await getCurrentUserId();
  const count = await prisma.notification.count({ where: { userId, read: false } });
  return NextResponse.json({ count });
}
