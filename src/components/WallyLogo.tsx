'use client';

import React from 'react';

interface WallyLogoProps {
  className?: string;
  size?: number;
}

export default function WallyLogo({ className = '', size = 36 }: WallyLogoProps) {
  return (
    <div
      className={`relative inline-block select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Background rounded badge */}
        <rect width="100" height="100" rx="24" fill="#fef3c7" />

        {/* Tall Wallaby Left Ear */}
        <path
          d="M33 46 C25 24, 20 8, 30 5 C40 2, 44 22, 45 42 Z"
          fill="#b45309"
        />
        {/* Left Inner Ear (Pink) */}
        <path
          d="M33 40 C28 25, 24 13, 31 11 C36 10, 39 23, 40 38 Z"
          fill="#fca5a5"
        />

        {/* Tall Wallaby Right Ear */}
        <path
          d="M67 46 C75 24, 80 8, 70 5 C60 2, 56 22, 55 42 Z"
          fill="#b45309"
        />
        {/* Right Inner Ear (Pink) */}
        <path
          d="M67 40 C72 25, 76 13, 69 11 C64 10, 61 23, 60 38 Z"
          fill="#fca5a5"
        />

        {/* Head Base */}
        <circle cx="50" cy="56" r="28" fill="#d97706" />

        {/* Snout Area (Lighter muzzle) */}
        <ellipse cx="50" cy="64" rx="16" ry="12" fill="#fef3c7" />

        {/* Nose */}
        <ellipse cx="50" cy="59" rx="5" ry="3.5" fill="#451a03" />

        {/* Smile */}
        <path
          d="M45 65 Q50 69 55 65"
          stroke="#451a03"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Big Expressive Eyes */}
        <circle cx="39" cy="51" r="5.5" fill="#1c1917" />
        <circle cx="61" cy="51" r="5.5" fill="#1c1917" />

        {/* Eye Catchlights */}
        <circle cx="41" cy="49" r="2" fill="#ffffff" />
        <circle cx="63" cy="49" r="2" fill="#ffffff" />
        <circle cx="38" cy="53" r="1" fill="#ffffff" />
        <circle cx="60" cy="53" r="1" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="30" cy="58" rx="4.5" ry="3" fill="#f87171" fillOpacity="0.65" />
        <ellipse cx="70" cy="58" rx="4.5" ry="3" fill="#f87171" fillOpacity="0.65" />

        {/* Golden Scarf collar accent */}
        <path
          d="M32 76 C42 82, 58 82, 68 76 C70 82, 65 87, 50 87 C35 87, 30 82, 32 76 Z"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
