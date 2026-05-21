import React from 'react';

interface LogoProps {
  variant?: 'compact' | 'full' | 'shield';
  className?: string;
  theme?: 'dark' | 'light';
}

export default function Logo({ variant = 'full', className = '', theme = 'dark' }: LogoProps) {
  // Select styling colors depending on theme
  const textColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const sloganColor = theme === 'light' ? 'text-slate-600' : 'text-slate-400';
  const sloganBgColor = theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/40 border-slate-800/65';

  const isFull = variant === 'full';
  const isCompact = variant === 'compact';

  // The Pure SVG Shield Logo Icon
  const LogoIcon = (
    <svg 
      viewBox="0 0 100 100" 
      className={`${isCompact ? 'w-10 h-10' : 'w-24 h-24 sm:w-32 sm:h-32'} filter drop-shadow-md shrink-0`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Left Shield Border Gradient (Shining Rich Gold) */}
        <linearGradient id="shieldGoldLeft" x1="15" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBDF7E" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Right Shield Border Gradient (Metallic Steel / Shadow Gold) */}
        <linearGradient id="shieldShadeRight" x1="85" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="30%" stopColor="#1C1C1E" />
          <stop offset="70%" stopColor="#0B3C5D" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Central "X" Top-Left to Bottom-Right Gradient */}
        <linearGradient id="orangeGoldA" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="40%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        {/* Central "X" Top-Right to Bottom-Left Gradient */}
        <linearGradient id="orangeGoldB" x1="80" y1="20" x2="20" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF1C5" />
          <stop offset="50%" stopColor="#EF6A0F" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>

        {/* Tactical Crosshair Ring */}
        <radialGradient id="targetRad" cx="50" cy="52" r="30" fx="50" fy="52">
          <stop offset="70%" stopColor="#1E293B" stopOpacity="0" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.15" />
        </radialGradient>

        {/* Bevel Highlights */}
        <linearGradient id="bevelLight" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Target Crosshair Circle behind X */}
      <circle cx="50" cy="52" r="23" stroke="#475569" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="2 1" />
      <circle cx="50" cy="52" r="23" fill="url(#targetRad)" />
      
      {/* Crosshair Horizontal Ticks */}
      <line x1="20" y1="52" x2="26" y2="52" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="74" y1="52" x2="80" y2="52" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.8" />
      {/* Crosshair Vertical Ticks */}
      <line x1="50" y1="22" x2="50" y2="28" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="50" y1="76" x2="50" y2="82" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Underlayer Shadow of Shield */}
      <path 
        d="M 50,7 L 82,16 L 82,54 C 82,72 50,91 50,91 C 50,91 18,72 18,54 L 18,16 Z" 
        fill={theme === 'light' ? '#E2E8F0' : '#020617'} 
        opacity="0.8"
      />

      {/* Left Shield Outline (Golden Protection Armor) */}
      <path 
        d="M 50,5 L 15,15 L 15,55 C 15,75 50,93 50,93 Z" 
        fill="none" 
        stroke="url(#shieldGoldLeft)" 
        strokeWidth="4" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Shield Outline (Tactical Dark Slate Grid Armor) */}
      <path 
        d="M 50,5 L 85,15 L 85,55 C 85,75 50,93 50,93 Z" 
        fill="none" 
        stroke="url(#shieldShadeRight)" 
        strokeWidth="4" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Shield Inner Split Bevel Shadow */}
      <path d="M 50,5 L 50,93 L 85,55 L 85,15 Z" fill="#4B5563" opacity="0.08" />

      {/* Tactical Police/DUDH Cross (Bottom Position inside Shield) */}
      <g opacity="0.85">
        {/* Vertical Pole */}
        <path d="M 50,65 L 50,84" stroke={theme === 'light' ? '#334155' : '#94A3B8'} strokeWidth="2.5" strokeLinecap="round" />
        {/* Horizontal Bar */}
        <path d="M 44,70 L 56,70" stroke={theme === 'light' ? '#334155' : '#94A3B8'} strokeWidth="2.5" strokeLinecap="round" />
        {/* Arrow/Base curve anchor */}
        <path d="M 41,75 C 41,75 45,82 50,82 C 55,82 59,75 59,75" fill="none" stroke={theme === 'light' ? '#334155' : '#94A3B8'} strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* Intellectual Neural Brain + Circuit (Top Position inside Shield) */}
      <g transform="translate(42, 10) scale(0.165)" strokeWidth="1.2">
        {/* Left Organic Brain Half */}
        <path 
          d="M48.5,39.5 C43.2,39.5 38.3,35.6 38.3,30.3 C38.3,25.4 42.4,22.4 44,22.2 C40,16.5 45.4,11 50.8,11 C54.3,11 57.5,13.6 57.8,17.4 C60.9,13.8 66.8,14.6 67.4,19.3 C71.2,19.3 74,22.4 74,26.2 C74,30.8 70.3,34.5 65.7,34.5 C65.7,36 64.9,39.5 59.8,39.5 C56.6,39.5 54.4,37.5 53.6,35.8 C51.2,38.3 49.3,39.5 48.5,39.5 Z" 
          fill="none" 
          stroke={theme === 'light' ? '#475569' : '#94A3B8'} 
          strokeWidth="3.5" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M48.4,25.3 C44,26.5 44,31.2 48.4,31.2" stroke={theme === 'light' ? '#475569' : '#94A3B8'} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M57.6,18.8 C54.2,21.1 54.2,26.6 57.6,28.8" stroke={theme === 'light' ? '#475569' : '#94A3B8'} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Right Digital Circuit Brain Half */}
        <path 
          d="M49.5,39.5 C54.8,39.5 59.7,35.6 59.7,30.3 C59.7,25.4 55.6,22.4 54,22.2 C58,16.5 52.6,11 47.2,11 C43.7,11 40.5,13.6 40.2,17.4 C37.1,13.8 31.2,14.6 30.6,19.3 C26.8,19.3 24,22.4 24,26.2 C24,30.8 27.7,34.5 32.3,34.5 C32.3,36 33.1,39.5 38.2,39.5 C41.4,39.5 43.6,37.5 44.4,35.8 C46.8,38.3 48.7,39.5 49.5,39.5 Z" 
          fill="none" 
          stroke="#F59E0B" 
          strokeWidth="3.5" 
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(98, 0) scale(-1, 1)"
        />
        {/* Tech Nodes connections */}
        <circle cx="58" cy="22" r="3" fill="#F59E0B" />
        <circle cx="68" cy="27" r="3" fill="#FBBF24" />
        <circle cx="65" cy="18" r="2.5" fill="#F59E0B" />
        <circle cx="58" cy="34" r="3" fill="#F1F5F9" />

        {/* Connections circuitry lines */}
        <path d="M49.5,30 L55,30 L58,22" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
        <path d="M49.5,23 L62,23 L65,18" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
        <path d="M49.5,35 L53,35 L58,34" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
        <path d="M55,30 L65,30 L68,27" stroke="#FBBF24" strokeWidth="2" fill="none" />
        
        {/* Support Base under the brain */}
        <path d="M48.5,40.5 L48.5,47" stroke={theme === 'light' ? '#475569' : '#94A3B8'} strokeWidth="4" />
        <path d="M41,47 L56,47" stroke={theme === 'light' ? '#475569' : '#94A3B8'} strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Main Stylized Beveled Golden "X" of ProvaX */}
      <g>
        {/* Arm A (Top-Left to Bottom-Right) shadow layer */}
        <path 
          d="M 28,32 L 38,24 L 75,70 L 65,78 Z" 
          fill="#1E293B" 
          opacity="0.5" 
          transform="translate(1, 2)"
        />
        {/* Arm B (Top-Right to Bottom-Left) shadow layer */}
        <path 
          d="M 72,32 L 62,24 L 25,70 L 35,78 Z" 
          fill="#1E293B" 
          opacity="0.5" 
          transform="translate(-1, 2)"
        />

        {/* Arm A (Top-Left to Bottom-Right) with gloss gradient */}
        <path 
          d="M 28,32 L 38,24 L 75,70 L 65,78 Z" 
          fill="url(#orangeGoldA)" 
          stroke="#FBDF7E" 
          strokeWidth="1.2"
        />

        {/* Arm B (Top-Right to Bottom-Left) with highlight gradient */}
        <path 
          d="M 72,32 L 62,24 L 25,70 L 35,78 Z" 
          fill="url(#orangeGoldB)" 
          stroke="#FFF1C5" 
          strokeWidth="1"
        />

        {/* Overlapping intersection bevel node in golden orange */}
        <polygon 
          points="50,44 57,51 50,58 43,51" 
          fill="url(#orangeGoldA)" 
          stroke="#FEE2E2" 
          strokeWidth="0.8" 
          opacity="0.95"
        />
      </g>
    </svg>
  );

  if (variant === 'shield') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  return (
    <div className={`flex ${isCompact ? 'flex-row items-center gap-2 sm:gap-3' : 'flex-col items-center justify-center text-center'} ${className} select-none`}>
      {/* Icon portion */}
      <div className="relative">
        {LogoIcon}
        {isCompact && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] rounded-full border border-slate-900 animate-pulse" />
        )}
      </div>

      {/* Typography portion */}
      {isCompact ? (
        <div className="flex flex-col text-left select-text">
          <div className="flex items-baseline gap-1">
            <span className={`font-mono font-black text-sm sm:text-base tracking-widest leading-none ${textColor}`}>
              PROVA
            </span>
            <span className="font-extrabold text-base sm:text-xl text-[#F59E0B] leading-none">
              X
            </span>
            <span className="font-bold text-[10px] sm:text-xs text-[#EA580C] leading-none font-mono">
              AI
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold font-mono text-slate-400 leading-none uppercase tracking-widest mt-1">
            OPERAÇÕES PRF
          </span>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center text-center max-w-sm sm:max-w-md">
          <div className="flex items-baseline justify-center select-text">
            <span className={`font-sans font-black text-3xl sm:text-4xl md:text-5xl tracking-widest leading-none ${textColor}`}>
              PROVA
            </span>
            <span className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#F59E0B] leading-none ml-1">
              X
            </span>
            <span className="font-mono font-black text-[15px] sm:text-lg md:text-xl text-[#EA580C] leading-none ml-1 tracking-wider">
              AI
            </span>
          </div>

          {/* Golden Highlight Border Slogan bar */}
          <div className={`mt-3 py-1.5 px-3 rounded-full border text-[8px] sm:text-[10px] md:text-xs font-bold font-mono uppercase tracking-wider ${sloganBgColor} ${sloganColor} overflow-hidden shadow-sm`}>
            ESTUDE COM <span className="text-amber-500 font-extrabold">INTELICE®NCIA</span>. EVOLUA COM <span className="text-amber-500 font-extrabold">ESTRATÉGIA</span>. APROVE COM <span className="text-[#EA580C] font-extrabold">PRECISÃO</span>.
          </div>
        </div>
      )}
    </div>
  );
}
