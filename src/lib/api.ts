import type { PropertyInput, EvaluatedProperty } from '../types';
import type { EvaluationResult } from '../types';

export async function fetchEvaluation(input: PropertyInput): Promise<EvaluationResult> {
  const res = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Evaluation failed');
  return res.json();
}

export async function fetchComparison(properties: EvaluatedProperty[]): Promise<string> {
  const res = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) throw new Error('Comparison failed');
  const data = await res.json();
  return data.analysis as string;
}

export async function fetchAdvisorResponse(message: string, properties: EvaluatedProperty[]): Promise<string> {
  const res = await fetch('/api/advisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, properties }),
  });
  if (!res.ok) throw new Error('Advisor request failed');
  const data = await res.json();
  return data.response as string;
}
