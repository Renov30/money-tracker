'use client';

import React from 'react';

interface PenguinMascotProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'waving' | 'excited' | 'money-love';
}

export default function PenguinMascot({
  className = '',
  size = 120,
  mood = 'waving',
}: PenguinMascotProps) {
  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Glow / Shadow under feet */}
        <ellipse cx="100" cy="180" rx="45" ry="12" fill="#000000" fillOpacity="0.12" />

        {/* Penguin Feet */}
        <ellipse cx="80" cy="178" rx="16" ry="9" fill="#f97316" />
        <ellipse cx="120" cy="178" rx="16" ry="9" fill="#f97316" />

        {/* Penguin Main Body (Navy / Bright Cerulean Blue) */}
        <ellipse cx="100" cy="115" rx="58" ry="62" fill="#2563eb" />
        
        {/* Head Dome */}
        <circle cx="100" cy="85" r="48" fill="#2563eb" />

        {/* White Belly */}
        <ellipse cx="100" cy="125" rx="38" ry="46" fill="#ffffff" />

        {/* Left Wing */}
        {mood === 'waving' ? (
          /* Raised waving wing */
          <path
            d="M52 105 C40 85, 25 70, 32 60 C40 50, 58 75, 62 95 Z"
            fill="#1d4ed8"
          />
        ) : (
          /* Rest wing */
          <ellipse cx="48" cy="120" rx="12" ry="28" transform="rotate(15 48 120)" fill="#1d4ed8" />
        )}

        {/* Right Wing (holding coin or gesturing) */}
        <ellipse cx="152" cy="120" rx="12" ry="28" transform="rotate(-15 152 120)" fill="#1d4ed8" />

        {/* Face Mask (White Eye patches) */}
        <ellipse cx="85" cy="82" rx="15" ry="18" fill="#ffffff" />
        <ellipse cx="115" cy="82" rx="15" ry="18" fill="#ffffff" />

        {/* Eyes (Cute big cartoon eyes) */}
        <ellipse cx="87" cy="82" rx="8" ry="11" fill="#0f172a" />
        <ellipse cx="113" cy="82" rx="8" ry="11" fill="#0f172a" />

        {/* Eye Sparkles */}
        <circle cx="89" cy="78" r="3.5" fill="#ffffff" />
        <circle cx="115" cy="78" r="3.5" fill="#ffffff" />
        <circle cx="85" cy="86" r="1.5" fill="#ffffff" />
        <circle cx="111" cy="86" r="1.5" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="72" cy="94" rx="8" ry="5" fill="#fca5a5" fillOpacity="0.8" />
        <ellipse cx="128" cy="94" rx="8" ry="5" fill="#fca5a5" fillOpacity="0.8" />

        {/* Cute Beak */}
        <path
          d="M92 88 Q100 84 108 88 Q100 102 92 88 Z"
          fill="#fb923c"
          stroke="#ea580c"
          strokeWidth="1.5"
        />

        {/* Yellow Aviator Scarf (Matching Lingora reference mascot!) */}
        <path
          d="M68 98 C80 106, 120 106, 132 98 C138 106, 130 114, 100 114 C70 114, 62 106, 68 98 Z"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="1"
        />
        {/* Scarf tails waving to the right */}
        <path
          d="M125 106 C140 108, 155 100, 168 104 C158 112, 145 116, 126 114 Z"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="1"
        />

        {/* Shiny Gold Coin in hand / chest */}
        <g transform="translate(132, 110)">
          <circle cx="16" cy="16" r="16" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="13" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          {/* Coin Symbol: Dollar / Star / Coin Rim */}
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fill="#78350f"
            fontSize="14"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            $
          </text>
          {/* Sparkle on coin */}
          <polygon
            points="24,6 26,11 31,13 26,15 24,20 22,15 17,13 22,11"
            fill="#ffffff"
          />
        </g>
      </svg>
    </div>
  );
}

