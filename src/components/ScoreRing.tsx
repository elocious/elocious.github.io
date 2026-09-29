'use client';

import { scoreColor, scoreBgColor, scoreLabel } from '@/lib/scoring';

export function ScoreRing({ score, size = 120, strokeWidth = 8, label = true }: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 55 ? '#06b6d4' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={strokeWidth}
          stroke={color} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${scoreColor(score)}`} style={{ color }}>{score}</span>
        {label && <span className="text-[10px] font-medium text-slate-400 mt-0.5">{scoreLabel(score)}</span>}
      </div>
    </div>
  );
}

export function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 55 ? 'bg-brand-500' : score >= 40 ? 'bg-gold-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
        <span className="text-xs font-bold text-slate-900 dark:text-white">{score}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%`, transition: 'width 0.8s ease-out' }}
        />
      </div>
    </div>
  );
}

export function MatchBadge({ percentage }: { percentage: number }) {
  const color = percentage >= 75 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400'
    : percentage >= 50 ? 'text-brand-600 bg-brand-50 dark:bg-brand-950/30 dark:text-brand-400'
    : 'text-gold-600 bg-gold-50 dark:bg-gold-950/30 dark:text-gold-400';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {percentage}% Match
    </span>
  );
}
