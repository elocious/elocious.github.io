import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const neighborhoods = await prisma.neighborhood.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({ neighborhoods });
}
