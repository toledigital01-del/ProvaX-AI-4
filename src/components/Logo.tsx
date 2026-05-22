import React from 'react';

interface LogoProps {
  variant?: 'compact' | 'full' | 'shield';
  className?: string;
  theme?: 'dark' | 'light';
}

export default function Logo({ variant = 'full', className = '', theme = 'dark' }: LogoProps) {
  const isFull = variant === 'full';
  const isCompact = variant === 'compact';

  // Core Theme Colors
  const textColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const logoXColor = theme === 'light' ? '#0F172A' : '#FFFFFF';

  // The Majestic Golden Owl & Circuit Wings Vector (Directly matches the provided attachment)
  const LogoIcon = (
    <svg
      viewBox="0 0 240 200"
      className={`${isCompact ? 'w-10 h-10' : 'w-28 h-28 sm:w-36 sm:h-36'} filter drop-shadow-md shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Supreme Golden Gradient */}
        <linearGradient id="owlGoldGrad" x1="20" y1="20" x2="220" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2C3" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="75%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        {/* Shimmer Base (Metallic Silver/Zinc for Contrast) */}
        <linearGradient id="metallicGrad" x1="120" y1="0" x2="120" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.85" />
        </linearGradient>

        <linearGradient id="glowYellow" x1="120" y1="100" x2="120" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        {/* Drop shadow filter for wings */}
        <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#D97706" floodOpacity="0.32" />
        </filter>
      </defs>

      {/* BACKGROUND SHIELD CAST SHADOW */}
      <path
        d="M 120,42 C 114,42 96,55 96,78 C 96,108 120,135 120,135 C 120,135 144,108 144,78 C 144,55 126,42 120,42 Z"
        fill="#070A13"
        opacity="0.3"
      />

      {/* --- CIRCUIT WINGS (LEFT) --- */}
      <g stroke="url(#owlGoldGrad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
        {/* Inner circuit tracks */}
        <path d="M 85,82 L 48,58 L 32,58" />
        <path d="M 85,95 L 42,85 L 24,85" />
        <path d="M 88,110 L 45,115 L 26,115" />
        <path d="M 92,125 L 56,140 L 44,140" />
        
        {/* Joint connecting track lines */}
        <path d="M 48,58 L 42,85 L 45,115 L 56,140" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* Left Wing Node Circles */}
      <g fill="url(#owlGoldGrad)">
        <circle cx="32" cy="58" r="3.2" filter="url(#nodeShadow)" />
        <circle cx="24" cy="85" r="3.2" filter="url(#nodeShadow)" />
        <circle cx="26" cy="115" r="3.2" filter="url(#nodeShadow)" />
        <circle cx="44" cy="140" r="3.2" filter="url(#nodeShadow)" />
        <circle cx="48" cy="58" r="1.8" />
        <circle cx="42" cy="85" r="1.8" />
        <circle cx="45" cy="115" r="1.8" />
        <circle cx="56" cy="140" r="1.8" />
      </g>

      {/* --- CIRCUIT WINGS (RIGHT) --- */}
      <g stroke="url(#owlGoldGrad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
        {/* Inner circuit tracks */}
        <path d="M 155,82 L 192,58 L 208,58" />
        <path d="M 155,95 L 198,85 L 216,85" />
        <path d="M 152,110 L 195,115 L 214,115" />
        <path d="M 148,125 L 184,140 L 196,140" />

        {/* Joint connecting track lines */}
        <path d="M 192,58 L 198,85 L 195,115 L 184,140" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* Right Wing Node Circles */}
      <g fill="url(#owlGoldGrad)">
        <circle cx="208" cy="58" r="3.2" filter="url(#nodeShadow)" />
        <circle cx="216" cy="85" r="3.2" filter="url(#nodeShadow)" />
        <circle cx="214" cy="115" r="3.2" filter="url(#nodeShadow)" />
        <circle cx="196" cy="140" r="3.2" filter="url(#nodeShadow)" />
        <circle cx="192" cy="58" r="1.8" />
        <circle cx="198" cy="85" r="1.8" />
        <circle cx="195" cy="115" r="1.8" />
        <circle cx="184" cy="140" r="1.8" />
      </g>

      {/* --- OWL ICON HEAD & EAR TUFTS --- */}
      {/* Ear Tufts (Left & Right) */}
      <path d="M 94,40 L 102,24 L 114,35 Z" fill="url(#owlGoldGrad)" />
      <path d="M 146,40 L 138,24 L 126,35 Z" fill="url(#owlGoldGrad)" />

      {/* Owl Outer Shield Body (High Contrast Edge) */}
      <path
        d="M 120,40 C 111,40 92,52 92,78 C 92,110 120,138 120,138 C 120,138 148,110 148,78 C 148,52 129,40 120,40 Z"
        fill={theme === 'light' ? '#0F172A' : '#0B1120'}
        stroke="url(#owlGoldGrad)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Symmetrical Left brow/cheek armor */}
      <path
        d="M 120,54 C 118,54 100,45 96,65 L 104,75 Z"
        fill="url(#owlGoldGrad)"
        opacity="0.85"
      />
      {/* Symmetrical Right brow/cheek armor */}
      <path
        d="M 120,54 C 122,54 140,45 144,65 L 136,75 Z"
        fill="url(#owlGoldGrad)"
        opacity="0.85"
      />

      {/* Deep Shadow Mask inside Owl face */}
      <path d="M 98,62 C 98,52 142,52 142,62 C 142,68 120,72 120,72 C 120,72 98,68 98,62 Z" fill="#030712" />

      {/* --- GLOWING INTELLIGENT EYES (Vandals Tech Style) --- */}
      <polygon points="101,54 115,58 114,64 103,63" fill="#FFFFFF" />
      <polygon points="104,56 112,59 111,62 105,61" fill="#000000" />
      <circle cx="108" cy="59" r="1.3" fill="url(#owlGoldGrad)" />

      <polygon points="139,54 125,58 126,64 137,63" fill="#FFFFFF" />
      <polygon points="136,56 128,59 129,62 135,61" fill="#000000" />
      <circle cx="132" cy="59" r="1.3" fill="url(#owlGoldGrad)" />

      {/* Golden Nose/Beak */}
      <polygon points="120,58 123,71 117,71" fill="url(#owlGoldGrad)" />

      {/* --- OWL BODY ARMORED "X" PATTERN (Chest armor) --- */}
      <g opacity="0.9">
        {/* Left-to-Right diagonal golden strap */}
        <path d="M 100,75 L 140,115" stroke="url(#owlGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
        {/* Right-to-Left diagonal dark steel/gold strap for depth */}
        <path d="M 140,75 L 100,115" stroke={theme === 'light' ? '#334155' : '#475569'} strokeWidth="3.5" strokeLinecap="round" />
        {/* Reinforcement gold strip on overlapping strap */}
        <path d="M 136,79 L 126,89" stroke="url(#owlGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 114,101 L 104,111" stroke="url(#owlGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* --- GLOWING BRAIN-LIGHTBULB (At the bottom of the Owl Shield) --- */}
      <g transform="translate(112, 108) scale(0.65)" opacity="0.95">
        {/* External Glow Background */}
        <circle cx="12" cy="12" r="10" fill="#EAB308" opacity="0.15" />
        {/* Lightbulb outline */}
        <path
          d="M 12,2 C 8,2 5,5 5,9 C 5,11.5 6.5,13.5 8,15 L 8,18 C 8,19 9,20 10,20 L 14,20 C 15,20 16,19 16,18 L 16,15 C 17.5,13.5 19,11.5 19,9 C 19,5 16,2 12,2 Z"
          fill="url(#glowYellow)"
          stroke="url(#owlGoldGrad)"
          strokeWidth="1.2"
        />
        {/* Filament lines */}
        <path d="M 10,9 L 12,13 L 14,9" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
        {/* Bulb base stripes */}
        <rect x="9.5" y="20" width="5" height="1.5" rx="0.5" fill="#1E293B" stroke="url(#owlGoldGrad)" strokeWidth="0.8" />
        <rect x="10.5" y="22" width="3" height="1" rx="0.5" fill="#1E293B" />
      </g>

      {/* --- OPEN STRATEGIC BOOK (Sling support at base) --- */}
      <g>
        {/* Book shadow layer */}
        <path
          d="M 120,138 C 104,124 58,124 38,136 L 38,150 C 58,138 104,138 120,152 C 136,138 182,138 202,150 L 202,136 C 182,124 136,124 120,138 Z"
          fill="#030712"
          opacity="0.45"
        />

        {/* Outer golden pages */}
        <path
          d="M 120,140 C 105,126 60,126 40,138 L 40,147 C 60,135 105,135 120,149 C 135,135 180,135 200,147 L 200,138 C 180,126 135,126 120,140 Z"
          fill={theme === 'light' ? '#0F172A' : '#141B2E'}
          stroke="url(#owlGoldGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Middle gold accent sheet leaf */}
        <path
          d="M 120,144 C 106,132 68,132 46,142 L 46,146 C 68,136 106,136 120,148 C 134,136 172,136 194,146 L 194,142 C 172,132 134,132 120,144 Z"
          fill="none"
          stroke="url(#owlGoldGrad)"
          strokeWidth="1.2"
          opacity="0.85"
        />

        {/* Center Golden Spine Holder */}
        <rect x="118.5" y="138" width="3" height="12" rx="1" fill="url(#owlGoldGrad)" />
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
    <div className={`flex ${isCompact ? 'flex-row items-center gap-2.5 sm:gap-3.5' : 'flex-col items-center justify-center text-center'} ${className} select-none`}>
      {/* Icon portion */}
      <div className="relative shrink-0">
        {LogoIcon}
        {isCompact && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#22C55E] rounded-full border border-slate-950 animate-pulse" />
        )}
      </div>

      {/* Typography portion */}
      {isCompact ? (
        <div className="flex flex-col text-left select-text">
          <div className="flex items-center gap-1">
            <span className={`font-sans font-black tracking-widest text-base sm:text-lg leading-none ${textColor}`}>
              PROVA
            </span>
            
            {/* Split Style Sleek X */}
            <div className="flex font-extrabold text-[#F59E0B] text-lg sm:text-xl leading-none font-sans select-none items-center">
              <span style={{ color: logoXColor }} className="opacity-95">X</span>
              <span className="text-[#F59E0B] -ml-1">X</span>
            </div>

            <span className="font-extrabold text-[11px] sm:text-xs text-[#EA580C] leading-none font-mono tracking-wider ml-0.5 self-end pb-0.5">
              AI
            </span>
          </div>
          <span className="text-[8px] sm:text-[9.5px] font-sans font-black text-slate-400 hover:text-slate-350 tracking-widest leading-none uppercase mt-1 transition-colors">
            OPERAÇÕES PRF
          </span>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center text-center max-w-sm sm:max-w-xl">
          <div className="flex items-center justify-center select-text">
            <span className={`font-sans font-black text-3xl sm:text-4xl md:text-5xl tracking-wider leading-none ${textColor}`}>
              PROVA
            </span>
            
            {/* Premium X Logo from Attachment */}
            <div className="flex font-black text-4xl sm:text-5xl md:text-6xl leading-none ml-1 relative">
              <span style={{ color: logoXColor }} className="opacity-20 absolute select-none">X</span>
              {/* Combine dark-side of X and golden-side of X for gorgeous design */}
              <span className="text-[#050B14] dark:text-white filter drop-shadow">X</span>
              <span className="text-[#F59E0B] -ml-5 sm:-ml-7 filter drop-shadow-md">X</span>
            </div>

            <span className="font-sans font-black text-lg sm:text-xl md:text-2xl text-[#F59E0B] leading-none ml-2 tracking-wider">
              AI
            </span>
          </div>

          {/* Slogan with Two Golden Horizontal Lines directly matching the provided image style */}
          <div className="w-full flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-[#F59E0B]" />
            <span className="text-[8.5px] sm:text-[10px] md:text-[11px] font-sans font-extrabold uppercase tracking-widest text-[#F59E0B] whitespace-nowrap">
              INTELIGÊNCIA ESTRATÉGICA PARA APROVAÇÃO
            </span>
            <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-[#F59E0B]" />
          </div>

          {/* Core Strategic Values Indicators (Target, Brain, Results) inside full layout */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 pt-3 border-t border-slate-500/10 text-slate-500 font-sans font-bold text-[9px] sm:text-[11px] uppercase tracking-widest">
            <div className="flex items-center gap-1.5 focus-indigo-400 hover:text-[#FBBF24] transition-colors">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <span>Estratégia</span>
            </div>
            
            <div className="text-slate-500/30 font-light select-none">|</div>
            
            <div className="flex items-center gap-1.5 hover:text-[#FBBF24] transition-colors">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Foco</span>
            </div>

            <div className="text-slate-500/30 font-light select-none">|</div>

            <div className="flex items-center gap-1.5 hover:text-[#FBBF24] transition-colors">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Resultados</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
