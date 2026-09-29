import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { address: { contains: q } },
        { city: { contains: q } },
        { neighborhood: { contains: q } },
        { zipCode: { contains: q } },
      ],
    },
    take: 8,
    select: { id: true, title: true, address: true, city: true, neighborhood: true, price: true },
  });

  const neighborhoods = await prisma.neighborhood.findMany({
    where: { OR: [{ name: { contains: q } }, { city: { contains: q } }] },
    take: 5,
    select: { id: true, name: true, city: true },
  });

  return NextResponse.json({
    suggestions: [
      ...properties.map(p => ({ type: 'property', id: p.id, label: p.title, sub: `${p.neighborhood || ''} ${p.city}`.trim(), price: p.price })),
      ...neighborhoods.map(n => ({ type: 'neighborhood', id: n.id, label: n.name, sub: n.city })),
    ],
  });
}
