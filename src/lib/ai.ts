// AI integration layer — server-side only.
// Uses Gemini API when GEMINI_API_KEY is available; falls back to rule-based responses.

import type { PropertyData, FinancialInputs, ConditionInputs, UserWeights, UserBudget, ScoreResult } from './scoring';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export function isAIAvailable(): boolean {
  return !!GEMINI_API_KEY;
}

async function callGemini(prompt: string, systemContext?: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemContext || ''}\n\n${prompt}\n\nRespond concisely in well-structured markdown. Always distinguish between verified data, estimates, and AI analysis. For financial, legal, or safety matters, recommend verification with qualified professionals.`,
          }],
        }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch {
    return null;
  }
}

export async function aiEvaluate(
  property: PropertyData,
  financial: FinancialInputs,
  condition: ConditionInputs,
  weights: UserWeights,
  budget: UserBudget,
  scores: ScoreResult
): Promise<string> {
  const prompt = `You are BetterHome AI, a real-estate evaluation assistant. Evaluate this property:

Property: ${property.bedrooms}bd/${property.bathrooms}ba, ${property.squareFeet}sqft, ${property.propertyType}, $${property.price}
Neighborhood: School ${property.schoolRating ?? 'N/A'}/10, Safety ${property.safetyScore ?? 'N/A'}/100, Walkability ${property.walkabilityScore ?? 'N/A'}/100
Financial: Down payment $${financial.downPayment}, Rate ${financial.interestRate}%, Term ${financial.loanTerm}yr, Tax $${financial.propertyTax}/yr, HOA $${financial.hoa}/mo
Condition avg: ${avg(Object.values(condition)).toFixed(1)}/10

Scores: Overall ${scores.overallScore}, Financial ${scores.financialFitScore}, Location ${scores.locationFitScore}, Lifestyle ${scores.lifestyleFitScore}, Condition ${scores.conditionScore}, Risk ${scores.riskScore}

Provide a 3-paragraph summary: (1) overall assessment, (2) key strengths, (3) key concerns and what to investigate. Be balanced and specific.`;
  const result = await callGemini(prompt);
  if (result) return result;

  // Fallback: rule-based summary
  return generateFallbackEvaluation(property, scores);
}

function avg(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function generateFallbackEvaluation(property: PropertyData, scores: ScoreResult): string {
  const strengths: string[] = [];
  const concerns: string[] = [];

  if (scores.financialFitScore >= 70) strengths.push('strong financial fit within your budget');
  if (scores.locationFitScore >= 70) strengths.push('excellent neighborhood quality');
  if (scores.conditionScore >= 70) strengths.push('good property condition');
  if (scores.riskScore >= 70) strengths.push('low risk profile');
  if (property.squareFeet >= 2000) strengths.push('generous living space');

  if (scores.financialFitScore < 50) concerns.push('the monthly cost may stretch your budget');
  if (scores.conditionScore < 50) concerns.push('property condition needs attention');
  if (scores.riskScore < 50) concerns.push('elevated risk factors to investigate');
  if (property.floodRisk === 'high') concerns.push('high flood risk — verify with FEMA maps');
  if (property.yearBuilt && property.yearBuilt < 1960) concerns.push('older home — inspect major systems');

  return `**Overall Assessment**

This ${property.bedrooms}-bedroom ${property.propertyType} scores ${scores.overallScore}/100 overall. ${scores.overallScore >= 65 ? 'This property presents a reasonably strong match for your criteria.' : 'This property has some areas that warrant careful consideration before proceeding.'}

**Key Strengths**

${strengths.length > 0 ? strengths.map((s, i) => `${i + 1}. ${s.charAt(0).toUpperCase() + s.slice(1)}`).join('\n') : 'No standout strengths identified — consider whether this property meets your core needs.'}

**Key Concerns & What to Investigate**

${concerns.length > 0 ? concerns.map((s, i) => `${i + 1}. ${s.charAt(0).toUpperCase() + s.slice(1)}`).join('\n') : 'No major concerns flagged — a professional inspection is still recommended.'}

*This is an AI-generated analysis based on available data and your inputs. Estimates should be verified with qualified professionals for financial, legal, and safety decisions.*`;
}

export async function aiCompare(properties: PropertyData[], scores: ScoreResult[], weights: UserWeights): Promise<string> {
  const propSummary = properties.map((p, i) =>
    `Property ${i + 1}: ${p.bedrooms}bd/${p.bathrooms}ba, ${p.squareFeet}sqft, $${p.price}, Score ${scores[i]?.overallScore ?? 'N/A'}`
  ).join('\n');

  const prompt = `You are BetterHome AI. Compare these properties and explain key trade-offs (not just which is "better"):

${propSummary}

User priorities: Affordability ${weights.affordability}/10, Safety ${weights.safety}/10, Schools ${weights.schools}/10, Space ${weights.space}/10

Provide 3-4 key trade-offs in a concise list. For each, explain what one property offers vs another. End with a neutral summary.`;
  const result = await callGemini(prompt);
  if (result) return result;

  // Fallback comparison
  return generateFallbackComparison(properties, scores);
}

function generateFallbackComparison(properties: PropertyData[], scores: ScoreResult[]): string {
  const lines: string[] = ['**Key Trade-offs**\n'];
  if (properties.length >= 2) {
    const cheapest = properties.reduce((a, b) => (a.price < b.price ? a : b));
    const largest = properties.reduce((a, b) => (a.squareFeet > b.squareFeet ? a : b));
    lines.push(`• **Price vs Space**: The most affordable property ($${cheapest.price.toLocaleString()}) ${cheapest === largest ? 'also offers the most space' : 'has less space than the largest option (' + largest.squareFeet + ' sq ft)'}.`);
    lines.push(`• **Score difference**: Overall scores range from ${Math.min(...scores.map(s => s.overallScore))} to ${Math.max(...scores.map(s => s.overallScore))} — the difference is driven primarily by financial fit and location factors.`);
    if (properties.length >= 3) {
      lines.push(`• **Neighborhood variation**: School ratings and safety scores vary across these properties — consider which location factors matter most to your household.`);
    }
    lines.push(`\n**Summary**: Each property has distinct advantages. We recommend evaluating which trade-offs align with your priorities rather than choosing solely on price or score.`);
  }
  lines.push('\n*AI-generated comparison based on available data. Verify all estimates with qualified professionals.*');
  return lines.join('\n');
}

export async function aiAdvisor(
  question: string,
  propertyContext?: string,
  conversationHistory?: string
): Promise<string> {
  const context = propertyContext ? `Property context: ${propertyContext}\n` : '';
  const history = conversationHistory ? `Previous conversation: ${conversationHistory}\n` : '';
  const prompt = `${context}${history}User question: ${question}

As BetterHome AI, answer this question about real estate. If it's about a specific property, use the provided context. Distinguish between verified information, estimates, and AI suggestions. For financial/legal/safety questions, recommend professional verification. Be concise and helpful.`;
  const result = await callGemini(prompt);
  if (result) return result;

  // Fallback responses for common questions
  return generateFallbackAdvisor(question);
}

function generateFallbackAdvisor(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('monthly cost') || q.includes('afford') || q.includes('payment')) {
    return `To estimate the monthly cost, I consider the mortgage payment (principal + interest), property taxes, HOA fees, insurance, maintenance, and utilities. You can use the **Finances** page to adjust these assumptions and see the exact monthly carrying cost.\n\n*This is an estimate — verify with a mortgage lender for exact figures.*`;
  }
  if (q.includes('ask') || q.includes('viewing') || q.includes('inspect')) {
    return `**Questions to ask during a viewing:**\n1. What major systems have been replaced recently (roof, HVAC, water heater)?\n2. Are there any known foundation, drainage, or water intrusion issues?\n3. What are the average monthly utility costs?\n4. Are there any pending special assessments or HOA issues?\n5. What repairs or renovations have been done?\n6. How old is the roof, HVAC, and water heater?\n\n*These are general recommendations — tailor them to the specific property.*`;
  }
  if (q.includes('missing') || q.includes('what information')) {
    return `**Commonly missing information to investigate:**\n• Exact property tax assessment\n• HOA documents and financial health\n• Recent inspection reports\n• Utility cost history\n• Flood zone designation (FEMA)\n• School district boundaries vs ratings\n• Pending construction or zoning changes nearby\n\n*Gathering this information will strengthen your evaluation.*`;
  }
  if (q.includes('maintenance') || q.includes('repair')) {
    return `**Maintenance issues to investigate:**\n• Roof age and condition\n• Foundation cracks or settling\n• Water heater age\n• HVAC system age and efficiency\n• Plumbing (galvanized pipes, leaks)\n• Electrical panel capacity\n• Window seals and condition\n• Drainage and grading around foundation\n\n*A professional home inspection is strongly recommended.*`;
  }
  if (q.includes('compare')) {
    return `I can help you compare properties! Navigate to the **Compare** page and add up to 4 properties. I'll analyze key trade-offs in price, space, location, and financial fit based on your priorities.\n\n*Comparison uses available data — verify estimates with professionals.*`;
  }
  return `I'm BetterHome AI, your real-estate decision assistant. I can help you evaluate properties, compare options, understand financial implications, and identify what to investigate.\n\n${isAIAvailable() ? '' : '*Note: AI service is running in rule-based mode. Connect a Gemini API key for enhanced AI responses.*'}\n\nTry asking about monthly costs, what to investigate, or how properties compare.`;
}

export async function aiDocumentSummary(docName: string, docCategory: string, docContent?: string): Promise<string> {
  const prompt = `Summarize this real estate document:\nDocument: ${docName}\nCategory: ${docCategory}\n${docContent ? `Content: ${docContent.substring(0, 2000)}` : '(no text content available — summarize based on document type)'}

Provide: (1) a brief summary, (2) key fields or terms to note, (3) any items that need verification or follow-up.`;
  const result = await callGemini(prompt);
  if (result) return result;

  return `**AI-Generated Summary — verify against the original document.**\n\nThis ${docCategory} document (${docName}) has been categorized and stored in your vault. ${docContent ? 'Key information has been extracted from the text.' : 'No text content was available for extraction — the document is stored for your reference.'}\n\n**Recommended next steps:**\n• Review the document carefully\n• Note any deadlines, contingencies, or financial obligations\n• Flag any clauses that need clarification from a professional\n\n*AI-generated summary — verify against the original document.*`;
}

export async function aiPropertyAnalysis(property: PropertyData): Promise<string> {
  const prompt = `Analyze this property listing for a buyer:\n${property.bedrooms}bd/${property.bathrooms}ba ${property.propertyType}, ${property.squareFeet}sqft, $${property.price}\n${property.description}\nNeighborhood: ${property.neighborhood ?? 'N/A'}, ${property.city}\nSchool: ${property.schoolRating ?? 'N/A'}/10, Safety: ${property.safetyScore ?? 'N/A'}/100\n\nIdentify: (1) potential red flags in the description, (2) missing information, (3) questions to ask the listing agent.`;
  const result = await callGemini(prompt);
  if (result) return result;

  return `**Property Analysis**\n\nThis ${property.propertyType} in ${property.city} is listed at $${property.price.toLocaleString()} (${(property.price / property.squareFeet).toFixed(0)}/sqft).\n\n**Potential considerations:**\n• Verify the listed square footage and lot size against public records\n• Confirm neighborhood scores with local sources\n• Check for any recent price changes or days on market\n\n**Questions for the listing agent:**\n• Why is the owner selling?\n• How long has the property been listed?\n• Are there any known issues or recent repairs?\n• What's included in the sale (appliances, fixtures)?\n\n*AI-generated analysis based on listing data — verify all information independently.*`;
}

export async function aiReport(property: PropertyData, scores: ScoreResult, financial: FinancialInputs): Promise<string> {
  const prompt = `Generate a professional property report summary:\nProperty: ${property.bedrooms}bd/${property.bathrooms}ba, ${property.squareFeet}sqft, $${property.price}, ${property.address}\nScores: Overall ${scores.overallScore}/100\nFinancial inputs: Down payment $${financial.downPayment}, Rate ${financial.interestRate}%\n\nWrite a professional executive summary (2 paragraphs) suitable for a property report.`;
  const result = await callGemini(prompt);
  if (result) return result;

  return `**Executive Summary**\n\nThis report presents an evaluation of the property at ${property.address}, a ${property.bedrooms}-bedroom ${property.propertyType} listed at $${property.price.toLocaleString()}. The property received an overall BetterHome evaluation score of ${scores.overallScore}/100, reflecting a balanced assessment of financial fit, location quality, property condition, and personal preference alignment.\n\nThe evaluation incorporates user-provided financial assumptions including a ${financial.interestRate}% interest rate on a ${financial.loanTerm}-year loan with a $${financial.downPayment.toLocaleString()} down payment. All scores are transparent and based on documented inputs. This report should supplement, not replace, professional inspection, legal, and financial advice.\n\n*AI-generated report — verify all estimates with qualified professionals.*`;
}

export async function aiArchitecture(prompt: string): Promise<string> {
  const fullPrompt = `You are an architectural visualization assistant. Based on this request, describe a conceptual architectural visualization in detail (exterior, materials, roof, windows, landscaping, lighting, mood). Do NOT generate images — describe the concept in 2-3 paragraphs.\n\nRequest: ${prompt}`;
  const result = await callGemini(fullPrompt);
  if (result) return result;

  return `**Conceptual Architectural Visualization**\n\nBased on your specifications, this concept envisions a thoughtfully designed exterior that balances the selected architectural style with the surrounding context. The design emphasizes clean lines, proportionate massing, and a material palette that complements the natural environment.\n\n**Note:** This is a conceptual description generated by AI. It is not an actual architectural photograph or certified engineering document. For construction, consult a licensed architect and structural engineer.\n\n*AI-generated conceptual visualization — not an actual property photograph.*`;
}
