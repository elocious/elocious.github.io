import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/session';
import { aiArchitecture } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const { propertyId, style, materials, roofStyle, windowStyle, landscaping, lighting, colorPalette, interiorMood, era, timeOfDay, prompt } = await req.json();

  const fullPrompt = prompt || `Architectural visualization: ${style} style${materials ? `, ${materials}` : ''}${roofStyle ? `, ${roofStyle} roof` : ''}${windowStyle ? `, ${windowStyle} windows` : ''}${landscaping ? `, ${landscaping} landscaping` : ''}${lighting ? `, ${lighting} lighting` : ''}${colorPalette ? `, ${colorPalette} palette` : ''}${interiorMood ? `, ${interiorMood} mood` : ''}${era ? `, ${era} era` : ''}${timeOfDay ? `, ${timeOfDay} time` : ''}`;

  const description = await aiArchitecture(fullPrompt);

  // Generate SVG blueprint concept
  const svgContent = generateBlueprintSVG(style);

  const concept = await prisma.architecturalConcept.create({
    data: {
      propertyId, style, materials, roofStyle, windowStyle, landscaping,
      lighting, colorPalette, interiorMood, era, timeOfDay,
      prompt: fullPrompt, svgContent,
    },
  });

  return NextResponse.json({ concept, description, svgContent });
}

function generateBlueprintSVG(style: string): string {
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a">
  <rect width="800" height="500" fill="#0f172a"/>
  <g stroke="#22d3ee" stroke-width="1.5" fill="none">
    <!-- Exterior walls -->
    <rect x="80" y="60" width="640" height="380" rx="4"/>
    <!-- Interior walls -->
    <line x1="80" y1="200" x2="400" y2="200"/>
    <line x1="400" y1="60" x2="400" y2="440"/>
    <line x1="400" y1="250" x2="720" y2="250"/>
    <!-- Doors -->
    <path d="M 300 440 A 30 30 0 0 0 330 440" stroke="#34d399"/>
    <!-- Windows -->
    <rect x="120" y="70" width="60" height="8" fill="#22d3ee" opacity="0.3"/>
    <rect x="220" y="70" width="80" height="8" fill="#22d3ee" opacity="0.3"/>
    <rect x="500" y="70" width="100" height="8" fill="#22d3ee" opacity="0.3"/>
    <rect x="620" y="70" width="60" height="8" fill="#22d3ee" opacity="0.3"/>
  </g>
  <g fill="#64748b" font-family="monospace" font-size="11">
    <text x="200" y="130">LIVING ROOM</text>
    <text x="200" y="145" font-size="9" fill="#475569">18' x 14'</text>
    <text x="500" y="160">KITCHEN</text>
    <text x="500" y="175" font-size="9" fill="#475569">14' x 12'</text>
    <text x="500" y="320">BEDROOM</text>
    <text x="500" y="335" font-size="9" fill="#475569">12' x 14'</text>
    <text x="160" y="320">MASTER</text>
    <text x="160" y="335" font-size="9" fill="#475569">16' x 14'</text>
  </g>
  <g fill="#475569" font-family="monospace" font-size="9">
    <text x="80" y="490">CONCEPTUAL BLUEPRINT — ${style.toUpperCase()} — NOT A CERTIFIED ENGINEERING DOCUMENT</text>
  </g>
</svg>`;
}
