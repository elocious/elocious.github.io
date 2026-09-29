import { motion } from 'motion/react';
import type { Verdict } from '../types';

const verdictColors: Record<Verdict, string> = {
  BUY: '#10b981',
  RENT: '#06b6d4',
  CAUTION: '#f59e0b',
  AVOID: '#ef4444',
};

const verdictBg: Record<Verdict, string> = {
  BUY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  RENT: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  CAUTION: 'bg-amber-50 text-amber-700 border-amber-200',
  AVOID: 'bg-red-50 text-red-700 border-red-200',
};

interface Props {
  score: number;
  verdict: Verdict;
  size?: number;
  showLabel?: boolean;
}

export function ScoreGauge({ score, verdict, size = 120, showLabel = true }: Props) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = verdictColors[verdict];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-2xl" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] font-medium text-slate-400">/ 100</span>
        </div>
      </div>
      {showLabel && (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${verdictBg[verdict]}`}>
          {verdict}
        </span>
      )}
    </div>
  );
}

export { verdictColors, verdictBg };
