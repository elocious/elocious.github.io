import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { evaluateProperty } from '../src/lib/evaluation';
import type { PropertyInput, EvaluatedProperty } from '../src/types';

const app = express();
app.use(express.json());

const PORT = 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// In-memory cache
const cache = new Map<string, { value: string; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.value;
  if (entry) cache.delete(key);
  return null;
}

function setCached(key: string, value: string) {
  cache.set(key, { value, expires: Date.now() + CACHE_TTL });
}

async function callGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini API error:', (err as Error).message);
    return null;
  }
}

/* ── POST /api/evaluate ── */
app.post('/api/evaluate', (req, res) => {
  try {
    const input = req.body as PropertyInput;
    const result = evaluateProperty(input);
    res.json(result);
  } catch {
    res.status(400).json({ error: 'Evaluation failed' });
  }
});

/* ── POST /api/compare ── */
app.post('/api/compare', async (req, res) => {
  try {
    const { properties } = req.body as { properties: EvaluatedProperty[] };
    const cacheKey = `compare:${properties.map(p => p.id).join(',')}`;
    const cached = getCached(cacheKey);
    if (cached) { res.json({ analysis: cached, cached: true }); return; }

    const geminiResult = await callGemini(buildComparisonPrompt(properties));
    const analysis = geminiResult ?? buildFallbackComparison(properties);
    setCached(cacheKey, analysis);
    res.json({ analysis });
  } catch {
    res.status(400).json({ error: 'Comparison failed' });
  }
});

/* ── POST /api/advisor ── */
app.post('/api/advisor', async (req, res) => {
  try {
    const { message, properties } = req.body as { message: string; properties: EvaluatedProperty[] };
    const cacheKey = `advisor:${message}:${properties.map(p => p.id).join(',')}`;
    const cached = getCached(cacheKey);
    if (cached) { res.json({ response: cached, cached: true }); return; }

    const geminiResult = await callGemini(buildAdvisorPrompt(message, properties));
    const response = geminiResult ?? buildFallbackAdvisor(message, properties);
    setCached(cacheKey, response);
    res.json({ response });
  } catch {
    res.status(400).json({ error: 'Advisor request failed' });
  }
});

/* ── Prompt builders ── */
function buildComparisonPrompt(properties: EvaluatedProperty[]): string {
  const ctx = properties.map(p =>
    `${p.title} (${p.address}): ${p.bedrooms}bd/${p.bathrooms}ba ${p.sqft}sqft $${p.price.toLocaleString()} | ` +
    `Score ${p.evaluation.aiScore}/100 (${p.evaluation.verdict}) Monthly $${p.evaluation.monthlyCarryingCost} | ` +
    `Safety ${p.safetyScore}/10 Schools ${p.schoolRating}/10 Walk ${p.walkability} Transit ${p.transitScore} | ` +
    `Flood ${p.floodRisk} Built ${p.yearBuilt} $${p.evaluation.costPerSqft}/sqft`
  ).join('\n');
  return `You are BetterHome AI, a real estate comparison advisor. Compare these properties, identify the best value, and explain trade-offs. Use markdown. Be concise.\n\n${ctx}`;
}

function buildAdvisorPrompt(message: string, properties: EvaluatedProperty[]): string {
  const ctx = properties.map(p =>
    `${p.title} (${p.address}, ${p.city}): ${p.bedrooms}bd/${p.bathrooms}ba ${p.sqft}sqft $${p.price.toLocaleString()} | ` +
    `AI ${p.evaluation.aiScore}/100 (${p.evaluation.verdict}) Carry $${p.evaluation.monthlyCarryingCost}/mo Rent $${p.monthlyRent}/mo | ` +
    `Safety ${p.safetyScore}/10 Schools ${p.schoolRating}/10 Walk ${p.walkability} Transit ${p.transitScore} Flood ${p.floodRisk} Built ${p.yearBuilt}`
  ).join('\n');
  return `You are BetterHome AI, a real estate advisor. Answer concisely with markdown. Use the user's vault data.\n\nVault:\n${ctx}\n\nQuestion: ${message}`;
}

/* ── Fallback responses ── */
function buildFallbackComparison(properties: EvaluatedProperty[]): string {
  const winner = properties.reduce((a, b) => (a.evaluation.aiScore >= b.evaluation.aiScore ? a : b));
  return `**${winner.title}** leads with an AI score of ${winner.evaluation.aiScore}/100 (${winner.evaluation.verdict}).\n\n**Key trade-offs:**\n` +
    properties.map(p =>
      `- **${p.title}**: $${p.evaluation.monthlyCarryingCost}/mo · Safety ${p.safetyScore}/10 · Schools ${p.schoolRating}/10 · Walk ${p.walkability} · Built ${p.yearBuilt}`
    ).join('\n');
}

function buildFallbackAdvisor(message: string, properties: EvaluatedProperty[]): string {
  const lower = message.toLowerCase();
  if (properties.length === 0)
    return 'Your vault is empty — add properties first and I can help you evaluate and compare them.';

  if (lower.includes('buy') || lower.includes('rent')) {
    const best = properties.reduce((a, b) => (a.evaluation.aiScore >= b.evaluation.aiScore ? a : b));
    return `**${best.title}** has the highest AI score (${best.evaluation.aiScore}/100, ${best.evaluation.verdict}).\n\n` +
      `- Monthly carrying cost: **$${best.evaluation.monthlyCarryingCost}**\n- Rent equivalent: **$${best.monthlyRent}**\n\n` +
      (best.evaluation.monthlyCarryingCost < best.monthlyRent
        ? 'Buying appears more cost-effective than renting this property.'
        : 'Renting may be cheaper short-term given the carrying costs.');
  }
  if (lower.includes('flood')) {
    const fp = properties.filter(p => p.floodRisk !== 'low');
    if (!fp.length) return 'None of your vault properties are in flood-risk zones.';
    return fp.map(p =>
      `**${p.title}** — Flood risk: **${p.floodRisk.toUpperCase()}**\n` +
      (p.floodRisk === 'high'
        ? 'High-risk zone: budget for flood insurance ($2,000+/yr), possible elevation requirements, and resale challenges.'
        : 'Moderate risk: investigate historical flooding and obtain an elevation certificate.')
    ).join('\n\n');
  }
  if (lower.includes('cost') || lower.includes('hidden') || lower.includes('carrying')) {
    const p = properties[0];
    return `**${p.title}** — Monthly carrying cost: **$${p.evaluation.monthlyCarryingCost}**\n\n` +
      `| Component | Monthly |\n|---|---|\n` +
      `| Principal & Interest | $${p.evaluation.principalAndInterest} |\n` +
      `| Property Taxes | $${p.evaluation.monthlyTaxes} |\n` +
      `| HOA | $${p.evaluation.monthlyHoa} |\n` +
      `| Insurance | $${p.evaluation.monthlyInsurance} |\n` +
      `| Maintenance Reserve | $${p.evaluation.maintenanceReserve} |\n\n` +
      `Don't forget closing costs (2–5% of price) and moving expenses.`;
  }
  const sorted = [...properties].sort((a, b) => b.evaluation.aiScore - a.evaluation.aiScore);
  return `**Your vault summary:**\n\n` +
    sorted.map((p, i) => `${i + 1}. **${p.title}** — ${p.evaluation.aiScore}/100 (${p.evaluation.verdict}) · $${p.evaluation.monthlyCarryingCost}/mo`).join('\n') +
    `\n\nAsk me about buy vs. rent, flood risks, or hidden carrying costs.`;
}

app.listen(PORT, () => {
  console.log(`BetterHome API server running on port ${PORT}`);
});
