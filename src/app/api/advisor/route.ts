import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { aiAdvisor } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { question, propertyId } = await req.json();

  let propertyContext = '';
  if (propertyId) {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (property) {
      propertyContext = `${property.bedrooms}bd/${property.bathrooms}ba ${property.propertyType}, ${property.squareFeet}sqft, $${property.price}, ${property.address}, ${property.city}. School: ${property.schoolRating ?? 'N/A'}/10, Safety: ${property.safetyScore ?? 'N/A'}/100, Walkability: ${property.walkabilityScore ?? 'N/A'}/100, Flood: ${property.floodRisk ?? 'N/A'}. ${property.description}`;
    }
  }

  // Get conversation history
  let conversation = await prisma.aIConversation.findFirst({
    where: { userId, propertyId: propertyId || null },
    orderBy: { updatedAt: 'desc' },
  });

  const history = conversation ? JSON.parse(conversation.messages).slice(-4).map((m: any) => `${m.role}: ${m.content}`).join('\n') : '';

  const answer = await aiAdvisor(question, propertyContext, history);

  const messages = conversation ? JSON.parse(conversation.messages) : [];
  messages.push({ role: 'user', content: question, timestamp: new Date().toISOString() });
  messages.push({ role: 'assistant', content: answer, timestamp: new Date().toISOString() });

  if (conversation) {
    await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: { messages: JSON.stringify(messages) },
    });
  } else {
    conversation = await prisma.aIConversation.create({
      data: { userId, propertyId: propertyId || null, messages: JSON.stringify(messages) },
    });
  }

  return NextResponse.json({ answer, conversationId: conversation.id });
}

export async function GET() {
  const userId = await getCurrentUserId();
  const conversations = await prisma.aIConversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });
  return NextResponse.json({ conversations: conversations.map(c => ({ ...c, messages: JSON.parse(c.messages) })) });
}
