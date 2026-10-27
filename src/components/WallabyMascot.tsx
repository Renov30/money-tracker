'use client';

import React from 'react';

interface WallabyMascotProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'waving' | 'excited' | 'money-love';
}

export default function WallabyMascot({
  className = '',
  size = 120,
  mood = 'waving',
}: WallabyMascotProps) {
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
        {/* Soft Ground Shadow */}
        <ellipse cx="100" cy="184" rx="55" ry="12" fill="#000000" fillOpacity="0.12" />

        {/* Long Wallaby Tail (Curving back and down) */}
        <path
          d="M75 145 C50 150, 20 162, 16 178 C25 182, 45 174, 82 165 Z"
          fill="#b45309"
        />

        {/* Big Wallaby Feet (Macropod feet) */}
        <ellipse cx="74" cy="180" rx="18" ry="8" fill="#92400e" />
        <ellipse cx="126" cy="180" rx="18" ry="8" fill="#92400e" />
        <ellipse cx="76" cy="179" rx="14" ry="6" fill="#b45309" />
        <ellipse cx="124" cy="179" rx="14" ry="6" fill="#b45309" />

        {/* Hind Thighs */}
        <ellipse cx="68" cy="148" rx="20" ry="24" transform="rotate(-15 68 148)" fill="#b45309" />
        <ellipse cx="132" cy="148" rx="20" ry="24" transform="rotate(15 132 148)" fill="#b45309" />

        {/* Wallaby Tall Left Ear */}
        <path
          d="M72 75 C60 40, 52 18, 65 14 C78 10, 84 38, 86 68 Z"
          fill="#b45309"
        />
        {/* Left Inner Ear (Pink) */}
        <path
          d="M72 65 C64 42, 58 24, 66 22 C73 20, 78 38, 80 62 Z"
          fill="#fca5a5"
        />

        {/* Wallaby Tall Right Ear */}
        <path
          d="M128 75 C140 40, 148 18, 135 14 C122 10, 116 38, 114 68 Z"
          fill="#b45309"
        />
        {/* Right Inner Ear (Pink) */}
        <path
          d="M128 65 C136 42, 142 24, 134 22 C127 20, 122 38, 120 62 Z"
          fill="#fca5a5"
        />

        {/* Wallaby Main Body (Warm Golden-Brown Fur) */}
        <ellipse cx="100" cy="132" rx="46" ry="48" fill="#d97706" />

        {/* Wallaby Head */}
        <circle cx="100" cy="85" r="38" fill="#d97706" />

        {/* Snout Area (Lighter muzzle) */}
        <ellipse cx="100" cy="95" rx="20" ry="15" fill="#fef3c7" />

        {/* Dark Nose */}
        <ellipse cx="100" cy="89" rx="6" ry="4" fill="#451a03" />

        {/* Cute Smile */}
        <path
          d="M94 96 Q100 101 106 96"
          stroke="#451a03"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cream Belly & Wallaby Pouch */}
        <ellipse cx="100" cy="138" rx="32" ry="36" fill="#fef3c7" />

        {/* Pouch Arc (The Kangaroo/Wallaby Pouch that holds money!) */}
        <path
          d="M76 135 C76 158, 124 158, 124 135 Z"
          fill="#fde68a"
          stroke="#d97706"
          strokeWidth="2"
        />

        {/* Shiny Gold Coin Peeking Out of Pouch */}
        <g transform="translate(85, 122)">
          <circle cx="15" cy="15" r="14" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="15" cy="15" r="11" fill="#fbbf24" />
          <text
            x="15"
            y="20"
            textAnchor="middle"
            fill="#78350f"
            fontSize="14"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            $
          </text>
          {/* Sparkle */}
          <polygon
            points="23,5 25,9 29,11 25,13 23,17 21,13 17,11 21,9"
            fill="#ffffff"
          />
        </g>

        {/* Eyes (Large, expressive macropod eyes) */}
        <circle cx="85" cy="78" r="8" fill="#1c1917" />
        <circle cx="115" cy="78" r="8" fill="#1c1917" />
        {/* Eye Catchlights */}
        <circle cx="87" cy="75" r="3" fill="#ffffff" />
        <circle cx="117" cy="75" r="3" fill="#ffffff" />
        <circle cx="83" cy="81" r="1.5" fill="#ffffff" />
        <circle cx="113" cy="81" r="1.5" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="73" cy="88" rx="6" ry="4" fill="#f87171" fillOpacity="0.6" />
        <ellipse cx="127" cy="88" rx="6" ry="4" fill="#f87171" fillOpacity="0.6" />

        {/* Yellow/Orange Scarf (Lingora Style) */}
        <path
          d="M74 98 C86 104, 114 104, 126 98 C130 105, 124 112, 100 112 C76 112, 70 105, 74 98 Z"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="1"
        />
        <path
          d="M120 105 C132 108, 145 102, 154 106 C146 113, 135 116, 120 113 Z"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="1"
        />

        {/* Front Paws / Arms */}
        {mood === 'waving' ? (
          <>
            {/* Left Hand: Waving Up high! */}
            <path
              d="M68 116 C52 100, 38 82, 45 74 C53 66, 68 90, 78 110 Z"
              fill="#b45309"
            />
            <ellipse cx="44" cy="75" rx="6" ry="7" fill="#92400e" />

            {/* Right Hand: Resting gently near pouch coin */}
            <path
              d="M124 118 C136 125, 142 136, 136 142 C130 148, 120 134, 116 124 Z"
              fill="#b45309"
            />
            <circle cx="134" cy="140" r="5" fill="#92400e" />
          </>
        ) : (
          <>
            {/* Resting Paws holding money pouch */}
            <ellipse cx="80" cy="126" rx="8" ry="14" transform="rotate(25 80 126)" fill="#b45309" />
            <ellipse cx="120" cy="126" rx="8" ry="14" transform="rotate(-25 120 126)" fill="#b45309" />
          </>
        )}
      </svg>
    </div>
  );
}

