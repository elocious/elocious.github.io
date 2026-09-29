import { useId } from 'react';
import type { ArchitecturalArchetype, PropertyInput } from '../types';

/* ═════════════════════════════════════════════════════
   Architectural SVG Renders — one per archetype
   ═════════════════════════════════════════════════════ */

function ContemporaryOrganic({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 800 500" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#${id}-sky)`} />
      <circle cx="640" cy="130" r="45" fill="#fef9c3" opacity="0.5" />
      <path d="M0 310 L160 245 L320 285 L480 235 L640 275 L800 255 L800 400 L0 400 Z" fill="#475569" opacity="0.25" />
      <rect y="398" width="800" height="102" fill="#1e293b" />
      <rect y="392" width="800" height="8" fill="#4d7c0f" />
      {/* Main volume */}
      <rect x="110" y="225" width="580" height="173" fill="#f8fafc" />
      <rect x="110" y="225" width="580" height="38" fill="#92400e" />
      <rect x="100" y="215" width="600" height="12" fill="#0f172a" />
      {/* Left glass section */}
      <rect x="145" y="273" width="115" height="100" fill="#7dd3fc" opacity="0.55" />
      <rect x="145" y="273" width="115" height="100" fill="none" stroke="#475569" strokeWidth="2" />
      <line x1="202" y1="273" x2="202" y2="373" stroke="#475569" strokeWidth="1.5" />
      <line x1="145" y1="323" x2="260" y2="323" stroke="#475569" strokeWidth="1.5" />
      {/* Center glass door */}
      <rect x="285" y="288" width="75" height="85" fill="#7dd3fc" opacity="0.45" />
      <rect x="285" y="288" width="75" height="85" fill="none" stroke="#475569" strokeWidth="2" />
      {/* Right wood section */}
      <rect x="390" y="273" width="145" height="100" fill="#92400e" />
      <rect x="410" y="288" width="105" height="70" fill="#7dd3fc" opacity="0.5" />
      <rect x="410" y="288" width="105" height="70" fill="none" stroke="#451a03" strokeWidth="2" />
      <line x1="462" y1="288" x2="462" y2="358" stroke="#451a03" strokeWidth="1.5" />
      {/* Entry */}
      <rect x="560" y="308" width="48" height="90" fill="#0f172a" />
      <rect x="548" y="250" width="82" height="6" fill="#0f172a" />
      {/* Grass tufts */}
      <g stroke="#84cc16" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M125 398 L120 372 M135 398 L132 367 M145 398 L142 375" />
        <path d="M675 398 L670 372 M685 398 L682 367 M695 398 L692 375" />
      </g>
      {/* Trees */}
      <ellipse cx="60" cy="335" rx="32" ry="35" fill="#4d7c0f" opacity="0.75" />
      <rect x="56" y="358" width="8" height="42" fill="#78350f" />
      <ellipse cx="745" cy="345" rx="26" ry="28" fill="#4d7c0f" opacity="0.75" />
      <rect x="741" y="362" width="8" height="38" fill="#78350f" />
    </svg>
  );
}

function PostmodernGlass({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 800 500" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#${id}-sky)`} />
      {/* Urban silhouettes */}
      <rect x="0" y="200" width="120" height="200" fill="#475569" opacity="0.2" />
      <rect x="680" y="180" width="120" height="220" fill="#475569" opacity="0.2" />
      <rect x="50" y="250" width="60" height="150" fill="#64748b" opacity="0.15" />
      {/* Ground */}
      <rect y="398" width="800" height="102" fill="#1e293b" />
      <rect y="392" width="800" height="8" fill="#334155" />
      {/* Main tower */}
      <rect x="200" y="80" width="400" height="318" fill={`url(#${id}-glass)`} />
      {/* Steel mullion grid */}
      <g stroke="#1e293b" strokeWidth="3" fill="none">
        <rect x="200" y="80" width="400" height="318" />
        <line x1="200" y1="160" x2="600" y2="160" />
        <line x1="200" y1="240" x2="600" y2="240" />
        <line x1="200" y1="320" x2="600" y2="320" />
        <line x1="300" y1="80" x2="300" y2="398" />
        <line x1="400" y1="80" x2="400" y2="398" />
        <line x1="500" y1="80" x2="500" y2="398" />
      </g>
      {/* Balcony projections */}
      <rect x="190" y="170" width="20" height="60" fill="#1e293b" />
      <rect x="590" y="250" width="20" height="60" fill="#1e293b" />
      {/* Lobby entrance */}
      <rect x="350" y="340" width="100" height="58" fill="#0f172a" />
      <rect x="370" y="350" width="60" height="48" fill="#60a5fa" opacity="0.3" />
      {/* Street level accents */}
      <rect y="390" width="800" height="3" fill="#475569" />
      {/* Light poles */}
      <rect x="160" y="350" width="3" height="48" fill="#64748b" />
      <circle cx="161.5" cy="348" r="5" fill="#fbbf24" opacity="0.7" />
      <rect x="640" y="350" width="3" height="48" fill="#64748b" />
      <circle cx="641.5" cy="348" r="5" fill="#fbbf24" opacity="0.7" />
    </svg>
  );
}

function MidCenturyCraftsman({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 800 500" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#${id}-sky)`} />
      {/* Distant hills */}
      <path d="M0 300 Q200 260 400 290 T800 280 L800 400 L0 400 Z" fill="#475569" opacity="0.2" />
      {/* Ground */}
      <rect y="398" width="800" height="102" fill="#1e293b" />
      <rect y="392" width="800" height="8" fill="#65a30d" />
      {/* Stone foundation */}
      <rect x="130" y="340" width="540" height="58" fill="#78716c" />
      <g fill="#57534e" opacity="0.5">
        <rect x="140" y="345" width="40" height="20" />
        <rect x="185" y="350" width="35" height="18" />
        <rect x="225" y="345" width="45" height="22" />
        <rect x="275" y="350" width="38" height="18" />
        <rect x="320" y="343" width="42" height="24" />
        <rect x="370" y="348" width="36" height="20" />
        <rect x="415" y="345" width="40" height="22" />
        <rect x="460" y="350" width="38" height="18" />
        <rect x="505" y="343" width="42" height="24" />
        <rect x="555" y="348" width="36" height="20" />
        <rect x="598" y="345" width="40" height="22" />
      </g>
      {/* Main body - wood shingles */}
      <rect x="150" y="200" width="500" height="140" fill="#92400e" />
      <g stroke="#78350f" strokeWidth="1" opacity="0.4">
        <line x1="150" y1="220" x2="650" y2="220" />
        <line x1="150" y1="240" x2="650" y2="240" />
        <line x1="150" y1="260" x2="650" y2="260" />
        <line x1="150" y1="280" x2="650" y2="280" />
        <line x1="150" y1="300" x2="650" y2="300" />
        <line x1="150" y1="320" x2="650" y2="320" />
      </g>
      {/* Gabled roof */}
      <polygon points="120,200 400,80 680,200" fill="#451a03" />
      <polygon points="135,200 400,92 665,200" fill="#5c2d12" />
      {/* Roof shadow line */}
      <line x1="120" y1="200" x2="680" y2="200" stroke="#1e293b" strokeWidth="3" />
      {/* Exposed rafter tails */}
      <g fill="#78350f">
        <rect x="125" y="198" width="12" height="18" />
        <rect x="155" y="198" width="12" height="18" />
        <rect x="633" y="198" width="12" height="18" />
        <rect x="663" y="198" width="12" height="18" />
      </g>
      {/* Porch */}
      <rect x="270" y="280" width="180" height="60" fill="#78350f" />
      {/* Tapered columns */}
      <polygon points="285,280 295,340 275,340 280,280" fill="#57534e" />
      <polygon points="435,280 440,280 445,340 425,340" fill="#57534e" />
      {/* Windows */}
      <rect x="170" y="240" width="80" height="50" fill="#fbbf24" opacity="0.3" />
      <rect x="170" y="240" width="80" height="50" fill="none" stroke="#451a03" strokeWidth="2" />
      <line x1="210" y1="240" x2="210" y2="290" stroke="#451a03" strokeWidth="1.5" />
      <rect x="490" y="240" width="80" height="50" fill="#fbbf24" opacity="0.3" />
      <rect x="490" y="240" width="80" height="50" fill="none" stroke="#451a03" strokeWidth="2" />
      <line x1="530" y1="240" x2="530" y2="290" stroke="#451a03" strokeWidth="1.5" />
      {/* Porch window */}
      <rect x="310" y="295" width="100" height="40" fill="#fbbf24" opacity="0.25" />
      <rect x="310" y="295" width="100" height="40" fill="none" stroke="#451a03" strokeWidth="2" />
      {/* Door */}
      <rect x="345" y="300" width="30" height="40" fill="#451a03" />
      {/* Garden bushes */}
      <ellipse cx="100" cy="385" rx="40" ry="15" fill="#4d7c0f" opacity="0.7" />
      <ellipse cx="700" cy="385" rx="40" ry="15" fill="#4d7c0f" opacity="0.7" />
      {/* Tree */}
      <ellipse cx="60" cy="320" rx="28" ry="35" fill="#65a30d" opacity="0.7" />
      <rect x="56" y="345" width="8" height="55" fill="#78350f" />
    </svg>
  );
}

function BiophilicWaterfront({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 800 500" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#${id}-sky)`} />
      {/* Mist */}
      <ellipse cx="400" cy="200" rx="350" ry="40" fill="#f0f9ff" opacity="0.4" />
      {/* Distant treeline */}
      <path d="M0 260 Q100 230 200 250 Q300 235 400 245 Q500 230 600 250 Q700 235 800 245 L800 300 L0 300 Z" fill="#475569" opacity="0.3" />
      {/* Water */}
      <rect y="350" width="800" height="150" fill={`url(#${id}-water)`} />
      {/* Water ripples */}
      <g stroke="#0c4a6e" strokeWidth="1" fill="none" opacity="0.3">
        <path d="M0 380 Q100 375 200 380 Q300 385 400 380 Q500 375 600 380 Q700 385 800 380" />
        <path d="M0 410 Q100 405 200 410 Q300 415 400 410 Q500 405 600 410 Q700 415 800 410" />
        <path d="M0 440 Q100 435 200 440 Q300 445 400 440 Q500 435 600 440 Q700 445 800 440" />
      </g>
      {/* Lower level */}
      <rect x="150" y="270" width="500" height="90" fill="#1e293b" />
      {/* Cantilevered upper level */}
      <rect x="100" y="170" width="600" height="100" fill="#f8fafc" />
      {/* Upper glass */}
      <rect x="120" y="185" width="560" height="70" fill="#7dd3fc" opacity="0.4" />
      <g stroke="#475569" strokeWidth="2" fill="none">
        <rect x="120" y="185" width="560" height="70" />
        <line x1="260" y1="185" x2="260" y2="255" />
        <line x1="400" y1="185" x2="400" y2="255" />
        <line x1="540" y1="185" x2="540" y2="255" />
      </g>
      {/* Cantilever shadow */}
      <rect x="100" y="268" width="600" height="5" fill="#0f172a" />
      {/* Lower glass doors */}
      <rect x="170" y="280" width="460" height="75" fill="#7dd3fc" opacity="0.3" />
      <g stroke="#334155" strokeWidth="2" fill="none">
        <rect x="170" y="280" width="460" height="75" />
        <line x1="285" y1="280" x2="285" y2="355" />
        <line x1="400" y1="280" x2="400" y2="355" />
        <line x1="515" y1="280" x2="515" y2="355" />
      </g>
      {/* IPE wood decking */}
      <rect x="140" y="358" width="520" height="6" fill="#92400e" />
      {/* Corten steel accent */}
      <rect x="95" y="170" width="10" height="100" fill="#9a3412" />
      <rect x="695" y="170" width="10" height="100" fill="#9a3412" />
      {/* Green roof */}
      <rect x="100" y="162" width="600" height="10" fill="#4d7c0f" />
      <g fill="#65a30d" opacity="0.6">
        <circle cx="150" cy="162" r="6" />
        <circle cx="200" cy="160" r="5" />
        <circle cx="280" cy="162" r="7" />
        <circle cx="380" cy="159" r="6" />
        <circle cx="480" cy="162" r="5" />
        <circle cx="560" cy="160" r="7" />
        <circle cx="640" cy="162" r="6" />
      </g>
      {/* Reflection */}
      <rect x="150" y="360" width="500" height="50" fill="#0f172a" opacity="0.15" />
      {/* Support pillar */}
      <rect x="395" y="358" width="10" height="40" fill="#475569" />
    </svg>
  );
}

function UrbanMonolithic({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 800 500" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#${id}-sky)`} />
      {/* Adjacent rowhouses */}
      <rect x="0" y="120" width="140" height="280" fill="#64748b" opacity="0.3" />
      <rect x="660" y="120" width="140" height="280" fill="#64748b" opacity="0.3" />
      <polygon points="0,120 70,80 140,120" fill="#475569" opacity="0.3" />
      <polygon points="660,120 730,80 800,120" fill="#475569" opacity="0.3" />
      {/* Street */}
      <rect y="398" width="800" height="102" fill="#1e293b" />
      <rect y="395" width="800" height="5" fill="#475569" />
      {/* Sidewalk */}
      <rect y="385" width="800" height="13" fill="#64748b" />
      {/* Main townhouse */}
      <rect x="280" y="100" width="240" height="298" fill="#7c2d12" />
      {/* Brick texture */}
      <g stroke="#9a3412" strokeWidth="1" opacity="0.4">
        <line x1="280" y1="130" x2="520" y2="130" />
        <line x1="280" y1="160" x2="520" y2="160" />
        <line x1="280" y1="190" x2="520" y2="190" />
        <line x1="280" y1="220" x2="520" y2="220" />
        <line x1="280" y1="250" x2="520" y2="250" />
        <line x1="280" y1="280" x2="520" y2="280" />
        <line x1="280" y1="310" x2="520" y2="310" />
        <line x1="280" y1="340" x2="520" y2="340" />
        <line x1="280" y1="370" x2="520" y2="370" />
      </g>
      <g stroke="#9a3412" strokeWidth="1" opacity="0.3">
        <line x1="320" y1="100" x2="320" y2="130" />
        <line x1="380" y1="130" x2="380" y2="160" />
        <line x1="440" y1="100" x2="440" y2="130" />
        <line x1="350" y1="160" x2="350" y2="190" />
        <line x1="450" y1="190" x2="450" y2="220" />
        <line x1="320" y1="220" x2="320" y2="250" />
        <line x1="420" y1="250" x2="420" y2="280" />
      </g>
      {/* Slate roof */}
      <polygon points="270,100 400,60 530,100" fill="#1e293b" />
      <polygon points="278,100 400,68 522,100" fill="#334155" />
      {/* Lintels */}
      <rect x="300" y="145" width="100" height="6" fill="#e7e5e4" />
      <rect x="300" y="225" width="100" height="6" fill="#e7e5e4" />
      <rect x="300" y="305" width="100" height="6" fill="#e7e5e4" />
      {/* Bay windows */}
      <rect x="300" y="150" width="100" height="70" fill="#fbbf24" opacity="0.3" />
      <rect x="300" y="150" width="100" height="70" fill="none" stroke="#e7e5e4" strokeWidth="2" />
      <line x1="350" y1="150" x2="350" y2="220" stroke="#e7e5e4" strokeWidth="1.5" />
      <rect x="300" y="230" width="100" height="70" fill="#fbbf24" opacity="0.3" />
      <rect x="300" y="230" width="100" height="70" fill="none" stroke="#e7e5e4" strokeWidth="2" />
      <line x1="350" y1="230" x2="350" y2="300" stroke="#e7e5e4" strokeWidth="1.5" />
      {/* Top window */}
      <rect x="340" y="115" width="30" height="30" fill="#fbbf24" opacity="0.25" />
      <rect x="380" y="115" width="30" height="30" fill="#fbbf24" opacity="0.25" />
      {/* Stoop */}
      <rect x="340" y="370" width="80" height="28" fill="#57534e" />
      <rect x="345" y="365" width="70" height="6" fill="#78716c" />
      {/* Door */}
      <rect x="355" y="310" width="50" height="60" fill="#1e1b1a" />
      <rect x="360" y="315" width="40" height="50" fill="#451a03" />
      <circle cx="392" cy="340" r="2" fill="#fbbf24" />
      {/* Street lamp */}
      <rect x="240" y="340" width="3" height="55" fill="#475569" />
      <circle cx="241.5" cy="338" r="5" fill="#fde68a" opacity="0.7" />
    </svg>
  );
}

/* ═════════════════════════════════════════════════════
   Blueprint Schematic — CAD elevation drawing
   ═════════════════════════════════════════════════════ */

export function BlueprintSchematic({ property }: { property: PropertyInput }) {
  const id = useId().replace(/:/g, '');
  const w = property.sqft > 2000 ? 420 : 340;
  const h = property.propertyType === 'condo' || property.propertyType === 'apartment' ? 260 : 180;
  const x = (800 - w) / 2;
  const y = 180;

  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e3a5f" strokeWidth="0.5" />
        </pattern>
        <pattern id={`${id}-grid-major`} width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1e3a5f" strokeWidth="1" />
        </pattern>
      </defs>
      {/* Background */}
      <rect width="800" height="500" fill="#0a1929" />
      <rect width="800" height="500" fill={`url(#${id}-grid)`} />
      <rect width="800" height="500" fill={`url(#${id}-grid-major)`} />

      {/* Building outline */}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#22d3ee" strokeWidth="2" />
      {/* Interior walls */}
      <g stroke="#22d3ee" strokeWidth="1" opacity="0.6">
        <line x1={x + w / 3} y1={y} x2={x + w / 3} y2={y + h} />
        <line x1={x + (2 * w) / 3} y1={y} x2={x + (2 * w) / 3} y2={y + h} />
        <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} />
      </g>
      {/* Door swings */}
      <g fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.5">
        <path d={`M ${x + w / 3} ${y + h / 2} A 25 25 0 0 1 ${x + w / 3 + 25} ${y + h / 2 + 25}`} />
        <path d={`M ${x + (2 * w) / 3} ${y + h / 2} A 25 25 0 0 0 ${x + (2 * w) / 3 - 25} ${y + h / 2 + 25}`} />
      </g>

      {/* Dimension lines — width */}
      <g stroke="#67e8f9" strokeWidth="1" fill="none">
        <line x1={x} y1={y - 25} x2={x + w} y2={y - 25} />
        <line x1={x} y1={y - 30} x2={x} y2={y - 20} />
        <line x1={x + w} y1={y - 30} x2={x + w} y2={y - 20} />
      </g>
      <text x={x + w / 2} y={y - 30} fill="#67e8f9" fontSize="12" textAnchor="middle" fontFamily="monospace">
        {Math.round(Math.sqrt(property.sqft))}'
      </text>

      {/* Dimension lines — height */}
      <g stroke="#67e8f9" strokeWidth="1" fill="none">
        <line x1={x + w + 25} y1={y} x2={x + w + 25} y2={y + h} />
        <line x1={x + w + 20} y1={y} x2={x + w + 30} y2={y} />
        <line x1={x + w + 20} y1={y + h} x2={x + w + 30} y2={y + h} />
      </g>
      <text x={x + w + 38} y={y + h / 2} fill="#67e8f9" fontSize="12" textAnchor="middle" fontFamily="monospace" transform={`rotate(90 ${x + w + 38} ${y + h / 2})`}>
        {Math.round(h * 0.1)}'
      </text>

      {/* Labels */}
      <text x={x + w / 6} y={y + h / 4} fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" opacity="0.7">BR</text>
      <text x={x + w / 2} y={y + h / 4} fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" opacity="0.7">LIVING</text>
      <text x={x + (5 * w) / 6} y={y + h / 4} fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" opacity="0.7">KITCH</text>
      <text x={x + w / 6} y={y + (3 * h) / 4} fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" opacity="0.7">BATH</text>
      <text x={x + w / 2} y={y + (3 * h) / 4} fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" opacity="0.7">DINING</text>
      <text x={x + (5 * w) / 6} y={y + (3 * h) / 4} fill="#22d3ee" fontSize="11" textAnchor="middle" fontFamily="monospace" opacity="0.7">BR</text>

      {/* Title block */}
      <rect x="20" y="430" width="760" height="55" fill="#0c1e3e" stroke="#1e3a5f" strokeWidth="1" />
      <line x1="200" y1="430" x2="200" y2="485" stroke="#1e3a5f" strokeWidth="1" />
      <line x1="440" y1="430" x2="440" y2="485" stroke="#1e3a5f" strokeWidth="1" />
      <line x1="600" y1="430" x2="600" y2="485" stroke="#1e3a5f" strokeWidth="1" />
      <text x="30" y="448" fill="#67e8f9" fontSize="9" fontFamily="monospace">PROJECT</text>
      <text x="30" y="468" fill="#e2e8f0" fontSize="11" fontFamily="monospace">{property.title}</text>
      <text x="210" y="448" fill="#67e8f9" fontSize="9" fontFamily="monospace">ADDRESS</text>
      <text x="210" y="468" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{property.address}, {property.city}</text>
      <text x="450" y="448" fill="#67e8f9" fontSize="9" fontFamily="monospace">SPECS</text>
      <text x="450" y="468" fill="#e2e8f0" fontSize="10" fontFamily="monospace">{property.bedrooms}BR / {property.bathrooms}BA / {property.sqft}SF</text>
      <text x="610" y="448" fill="#67e8f9" fontSize="9" fontFamily="monospace">SCALE</text>
      <text x="610" y="468" fill="#e2e8f0" fontSize="11" fontFamily="monospace">1:100 | {property.yearBuilt}</text>

      {/* Scale stamp */}
      <g transform="translate(580 70)">
        <rect width="180" height="28" fill="none" stroke="#22d3ee" strokeWidth="1" />
        <rect x="0" y="8" width="30" height="12" fill="#22d3ee" />
        <rect x="60" y="8" width="30" height="12" fill="#22d3ee" />
        <rect x="120" y="8" width="30" height="12" fill="#22d3ee" />
        <text x="90" y="6" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">SCALE 1:100</text>
      </g>

      {/* North arrow */}
      <g transform="translate(60 70)">
        <circle r="18" fill="none" stroke="#22d3ee" strokeWidth="1" />
        <polygon points="0,-14 5,5 0,0 -5,5" fill="#22d3ee" />
        <text y="-22" fill="#22d3ee" fontSize="10" textAnchor="middle" fontFamily="monospace">N</text>
      </g>
    </svg>
  );
}

/* ═════════════════════════════════════════════════════
   Main export — selects the right render by archetype
   ═════════════════════════════════════════════════════ */

interface RenderProps {
  archetype: ArchitecturalArchetype;
  className?: string;
}

export function ArchitecturalRender({ archetype, className }: RenderProps) {
  switch (archetype) {
    case 'contemporary-organic': return <ContemporaryOrganic className={className} />;
    case 'postmodern-glass': return <PostmodernGlass className={className} />;
    case 'mid-century-craftsman': return <MidCenturyCraftsman className={className} />;
    case 'biophilic-waterfront': return <BiophilicWaterfront className={className} />;
    case 'urban-monolithic': return <UrbanMonolithic className={className} />;
    default: return <ContemporaryOrganic className={className} />;
  }
}
