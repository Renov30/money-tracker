'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// 1. 3D Clay Home
export function ClayHome({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="homeRoof" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient id="homeWall" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="70%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="homeDoor" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
        <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
      {/* Wall Base */}
      <rect x="14" y="24" width="36" height="32" rx="8" fill="url(#homeWall)" filter="url(#clayShadow)" />
      {/* Chimney */}
      <rect x="40" y="12" width="7" height="14" rx="3.5" fill="#ea580c" />
      {/* Roof */}
      <path d="M7 26 C9 22, 28 8, 32 6 C36 8, 55 22, 57 26 C59 29, 54 31, 50 28 L32 14 L14 28 C10 31, 5 29, 7 26 Z" fill="url(#homeRoof)" filter="url(#clayShadow)" />
      {/* Roof Highlight */}
      <ellipse cx="32" cy="12" rx="14" ry="2" fill="#ffffff" fillOpacity="0.4" />
      {/* Door */}
      <rect x="25" y="36" width="14" height="20" rx="6" fill="url(#homeDoor)" />
      {/* Doorknob */}
      <circle cx="28" cy="46" r="2" fill="#fbbf24" />
      {/* Window */}
      <circle cx="32" cy="24" r="5" fill="#67e8f9" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

// 2. 3D Clay Income (Money Bag / Coins with Emerald Glow)
export function ClayIncome({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="incomeBag" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="65%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </radialGradient>
        <radialGradient id="incomeCoin" cx="30%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
      </defs>
      {/* Bag Body */}
      <path d="M12 40 C10 52, 20 60, 32 60 C44 60, 54 52, 52 40 C50 30, 44 24, 38 20 L26 20 C20 24, 14 30, 12 40 Z" fill="url(#incomeBag)" />
      {/* Bag Highlights */}
      <ellipse cx="26" cy="34" rx="8" ry="12" fill="#ffffff" fillOpacity="0.25" transform="rotate(-20 26 34)" />
      {/* Bag Tie */}
      <rect x="24" y="16" width="16" height="6" rx="3" fill="#facc15" />
      {/* Bag Top Ruffle */}
      <path d="M22 17 C22 11, 27 10, 32 10 C37 10, 42 11, 42 17 Z" fill="#22c55e" />
      {/* Dollar Symbol / Green Arrow Up */}
      <circle cx="32" cy="42" r="11" fill="url(#incomeCoin)" />
      <path d="M32 36 L36 41 H33.5 V47 H30.5 V41 H28 L32 36 Z" fill="#15803d" />
    </svg>
  );
}

// 3. 3D Clay Expense (Flying Cash / Card with Rose Arrow)
export function ClayExpense({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="expenseCard" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="65%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
        <radialGradient id="expenseBadge" cx="30%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#f43f5e" />
        </radialGradient>
      </defs>
      {/* 3D Angled Card */}
      <rect x="8" y="16" width="46" height="32" rx="8" fill="url(#expenseCard)" transform="rotate(-6 8 16)" />
      {/* Card Stripe */}
      <path d="M6 24 L52 19 L53 26 L7 31 Z" fill="#4c0519" fillOpacity="0.4" />
      {/* Card Highlight */}
      <ellipse cx="28" cy="24" rx="16" ry="4" fill="#ffffff" fillOpacity="0.3" transform="rotate(-6 28 24)" />
      {/* Downward Expense Arrow Badge */}
      <circle cx="44" cy="44" r="14" fill="url(#expenseBadge)" stroke="#ffffff" strokeWidth="2.5" />
      <path d="M44 51 L39 45 H42 V38 H46 V45 H49 L44 51 Z" fill="#ffffff" />
    </svg>
  );
}

// 4. 3D Clay Target (Goals / Bullseye with Arrow)
export function ClayTarget({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="targetRed" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="65%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </radialGradient>
        <radialGradient id="targetWhite" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>
      {/* Outer Ring */}
      <circle cx="32" cy="32" r="28" fill="url(#targetRed)" />
      <ellipse cx="26" cy="16" rx="14" ry="4" fill="#ffffff" fillOpacity="0.4" />
      {/* Middle White Ring */}
      <circle cx="32" cy="32" r="20" fill="url(#targetWhite)" />
      {/* Inner Red Ring */}
      <circle cx="32" cy="32" r="12" fill="url(#targetRed)" />
      {/* Center Bullseye */}
      <circle cx="32" cy="32" r="5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      {/* Dart / Arrow Feather */}
      <path d="M42 16 L56 6 L52 14 L58 18 Z" fill="#38bdf8" />
      <path d="M44 14 L33 27" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 5. 3D Clay Trophy (Leaderboard & Achievements)
export function ClayTrophy({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="trophyGold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>
        <radialGradient id="trophyBase" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
      </defs>
      {/* Handles */}
      <path d="M12 18 C8 28, 16 36, 24 35" stroke="#ca8a04" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M52 18 C56 28, 48 36, 40 35" stroke="#ca8a04" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Cup Body */}
      <path d="M18 10 H46 C46 26, 42 38, 32 38 C22 38, 18 26, 18 10 Z" fill="url(#trophyGold)" />
      {/* Cup Highlight */}
      <ellipse cx="26" cy="18" rx="4" ry="10" fill="#ffffff" fillOpacity="0.4" />
      {/* Stem */}
      <path d="M30 38 H34 V48 H30 Z" fill="#ca8a04" />
      {/* Base Pedestal */}
      <rect x="20" y="48" width="24" height="12" rx="4" fill="url(#trophyBase)" />
      {/* Star on Cup */}
      <polygon points="32,18 34,23 39,23 35,26 36,31 32,28 28,31 29,26 25,23 30,23" fill="#ffffff" />
    </svg>
  );
}

// 6. 3D Clay Flame (Streak Days)
export function ClayFlame({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="flameOuter" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="55%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient id="flameInner" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      {/* Outer Flame */}
      <path d="M32 4 C32 4, 42 16, 42 26 C42 28, 48 24, 50 30 C54 42, 46 58, 32 60 C18 62, 10 46, 14 32 C16 26, 22 22, 22 18 C22 12, 32 4, 32 4 Z" fill="url(#flameOuter)" />
      {/* Flame Highlight */}
      <ellipse cx="22" cy="34" rx="4" ry="10" fill="#ffffff" fillOpacity="0.3" transform="rotate(-15 22 34)" />
      {/* Inner Glowing Core */}
      <path d="M32 26 C32 26, 38 34, 38 40 C38 48, 26 52, 26 44 C26 38, 32 26, 32 26 Z" fill="url(#flameInner)" />
    </svg>
  );
}

// 7. 3D Clay Coin (XP / Balance / Currency)
export function ClayCoin({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="coinGold" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>
      </defs>
      {/* Outer Rim */}
      <circle cx="32" cy="32" r="28" fill="url(#coinGold)" />
      {/* Inner Bevel */}
      <circle cx="32" cy="32" r="22" fill="#ca8a04" />
      <circle cx="32" cy="32" r="20" fill="url(#coinGold)" />
      {/* Highlight Glint */}
      <ellipse cx="24" cy="18" rx="10" ry="3.5" fill="#ffffff" fillOpacity="0.45" />
      {/* Currency Symbol / Star */}
      <text x="32" y="40" textAnchor="middle" fill="#78350f" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif">
        $
      </text>
      {/* Sparkle */}
      <polygon points="46,14 48,20 54,22 48,24 46,30 44,24 38,22 44,20" fill="#ffffff" />
    </svg>
  );
}

// 8. 3D Clay Crown (Wally Plus)
export function ClayCrown({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="crownGold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      {/* Crown Body */}
      <path d="M10 24 L20 48 H44 L54 24 L40 32 L32 16 L24 32 Z" fill="url(#crownGold)" />
      {/* Crown Rim */}
      <rect x="18" y="46" width="28" height="8" rx="4" fill="#92400e" />
      {/* Highlight */}
      <ellipse cx="32" cy="22" rx="4" ry="2" fill="#ffffff" fillOpacity="0.5" />
      {/* Jewels */}
      <circle cx="10" cy="24" r="4" fill="#f43f5e" />
      <circle cx="32" cy="16" r="4.5" fill="#38bdf8" />
      <circle cx="54" cy="24" r="4" fill="#f43f5e" />
    </svg>
  );
}

// 9. 3D Clay Gift (Secret Reward Chest / Mystery Box)
export function ClayGift({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="giftBox" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="65%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <radialGradient id="giftRibbon" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      {/* Box Base */}
      <rect x="12" y="24" width="40" height="34" rx="8" fill="url(#giftBox)" />
      {/* Vertical Ribbon */}
      <rect x="27" y="24" width="10" height="34" fill="url(#giftRibbon)" />
      {/* Box Lid */}
      <rect x="8" y="18" width="48" height="12" rx="5" fill="url(#giftBox)" />
      <rect x="27" y="18" width="10" height="12" fill="url(#giftRibbon)" />
      {/* Puffy 3D Ribbon Bow */}
      <ellipse cx="22" cy="12" rx="8" ry="6" fill="url(#giftRibbon)" transform="rotate(-25 22 12)" />
      <ellipse cx="42" cy="12" rx="8" ry="6" fill="url(#giftRibbon)" transform="rotate(25 42 12)" />
      <circle cx="32" cy="14" r="4.5" fill="#fef08a" />
    </svg>
  );
}

// 10. 3D Clay Gamepad (Nintendo Switch / Gadget Goal)
export function ClayGamepad({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="gamepadBody" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="65%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      {/* Controller Body */}
      <rect x="6" y="16" width="52" height="32" rx="14" fill="url(#gamepadBody)" />
      {/* D-Pad Cross */}
      <rect x="16" y="26" width="12" height="4" rx="2" fill="#78350f" />
      <rect x="20" y="22" width="4" height="12" rx="2" fill="#78350f" />
      {/* ABXY Action Buttons */}
      <circle cx="42" cy="25" r="2.5" fill="#ef4444" />
      <circle cx="48" cy="29" r="2.5" fill="#3b82f6" />
      <circle cx="38" cy="33" r="2.5" fill="#10b981" />
      <circle cx="44" cy="37" r="2.5" fill="#eab308" />
    </svg>
  );
}

// 11. 3D Clay Gear (Settings)
export function ClayGear({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="gearBody" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="65%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="24" fill="url(#gearBody)" />
      {/* Teeth around perimeter */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="28"
          y="4"
          width="8"
          height="10"
          rx="3"
          fill="url(#gearBody)"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
      {/* Center Hole */}
      <circle cx="32" cy="32" r="9" fill="#f8fafc" />
    </svg>
  );
}

// 12. 3D Clay Search Lens
export function ClaySearch({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="searchRim" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="65%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
      </defs>
      {/* Handle */}
      <path d="M42 42 L58 58" stroke="#92400e" strokeWidth="8" strokeLinecap="round" />
      <path d="M42 42 L56 56" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
      {/* Glass Lens Rim */}
      <circle cx="28" cy="28" r="20" fill="#e0f2fe" stroke="url(#searchRim)" strokeWidth="6" />
      {/* Specular Highlight on Lens */}
      <ellipse cx="22" cy="20" rx="8" ry="3.5" fill="#ffffff" fillOpacity="0.7" transform="rotate(-30 22 20)" />
    </svg>
  );
}

// 13. 3D Clay Medal (Gold, Silver, Bronze)
interface ClayMedalProps extends IconProps {
  rank?: 1 | 2 | 3;
}

export function ClayMedal({ size = 24, rank = 1, className = '' }: ClayMedalProps) {
  const medalGradients = {
    1: {
      id: 'goldMedal',
      stop0: '#fef08a',
      stop60: '#f59e0b',
      stop100: '#b45309',
      ribbon: '#ef4444',
      label: '1',
    },
    2: {
      id: 'silverMedal',
      stop0: '#f8fafc',
      stop60: '#94a3b8',
      stop100: '#475569',
      ribbon: '#3b82f6',
      label: '2',
    },
    3: {
      id: 'bronzeMedal',
      stop0: '#fed7aa',
      stop60: '#d97706',
      stop100: '#7c2d12',
      ribbon: '#10b981',
      label: '3',
    },
  }[rank];

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id={medalGradients.id} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={medalGradients.stop0} />
          <stop offset="60%" stopColor={medalGradients.stop60} />
          <stop offset="100%" stopColor={medalGradients.stop100} />
        </radialGradient>
      </defs>
      {/* V-Ribbon */}
      <path d="M22 6 L32 28 L14 18 Z" fill={medalGradients.ribbon} />
      <path d="M42 6 L32 28 L50 18 Z" fill={medalGradients.ribbon} />
      {/* Medal Body */}
      <circle cx="32" cy="38" r="20" fill={`url(#${medalGradients.id})`} />
      {/* Inner Bevel */}
      <circle cx="32" cy="38" r="16" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
      {/* Specular Glint */}
      <ellipse cx="26" cy="28" rx="7" ry="2.5" fill="#ffffff" fillOpacity="0.5" />
      {/* Rank Number */}
      <text
        x="32"
        y="45"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="18"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
      >
        {medalGradients.label}
      </text>
    </svg>
  );
}

// 14. 3D Clay Avatar
export function ClayAvatar({ size = 32, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="avatarFace" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="70%" stopColor="#fba471" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
        <radialGradient id="avatarHair" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="80%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <radialGradient id="avatarShirt" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      {/* Body / Shirt */}
      <path d="M12 60 C12 46, 22 42, 32 42 C42 42, 52 46, 52 60 Z" fill="url(#avatarShirt)" />
      {/* Neck */}
      <rect x="28" y="36" width="8" height="10" rx="4" fill="#fba471" />
      {/* Head */}
      <circle cx="32" cy="26" r="16" fill="url(#avatarFace)" />
      {/* Hair */}
      <path d="M16 24 C16 14, 23 8, 32 8 C41 8, 48 14, 48 24 C48 18, 42 14, 32 14 C22 14, 16 20, 16 24 Z" fill="url(#avatarHair)" />
      {/* Eyes */}
      <circle cx="27" cy="26" r="2.2" fill="#1e293b" />
      <circle cx="37" cy="26" r="2.2" fill="#1e293b" />
      {/* Catchlights */}
      <circle cx="28" cy="25.5" r="0.7" fill="#ffffff" />
      <circle cx="38" cy="25.5" r="0.7" fill="#ffffff" />
      {/* Gentle Smile */}
      <path d="M28 32 C30 35, 34 35, 36 32" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Cheek Blush */}
      <ellipse cx="23" cy="29" rx="3" ry="1.5" fill="#f43f5e" fillOpacity="0.4" />
      <ellipse cx="41" cy="29" rx="3" ry="1.5" fill="#f43f5e" fillOpacity="0.4" />
    </svg>
  );
}

// 15. 3D Clay Checkmark Badge
export function ClayCheck({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="checkGreen" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="65%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#checkGreen)" />
      <ellipse cx="24" cy="18" rx="10" ry="3.5" fill="#ffffff" fillOpacity="0.45" />
      <path
        d="M20 32 L28 40 L44 24"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 16. 3D Clay Star
export function ClayStar({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="starGold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      <polygon
        points="32,6 39,22 57,23 43,35 48,52 32,42 16,52 21,35 7,23 25,22"
        fill="url(#starGold)"
      />
      <ellipse cx="28" cy="20" rx="6" ry="2" fill="#ffffff" fillOpacity="0.5" />
    </svg>
  );
}

// 17. 3D Clay Wallet
export function ClayWallet({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="walletLeather" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="65%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
        <radialGradient id="walletFlap" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
      </defs>
      {/* Emerging Coin */}
      <circle cx="32" cy="18" r="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
      {/* Wallet Body */}
      <rect x="10" y="22" width="44" height="34" rx="8" fill="url(#walletLeather)" />
      {/* Highlight on Wallet */}
      <ellipse cx="28" cy="27" rx="14" ry="3" fill="#ffffff" fillOpacity="0.3" />
      {/* Flap */}
      <path d="M10 28 C10 24, 54 24, 54 28 L54 36 C54 40, 44 42, 32 42 C20 42, 10 40, 10 36 Z" fill="url(#walletFlap)" />
      {/* Clasp Snap Button */}
      <circle cx="32" cy="38" r="4.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
    </svg>
  );
}

// 18. 3D Clay Trash (Tempat Sampah)
export function ClayTrash({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="trashBody" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="65%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </radialGradient>
        <radialGradient id="trashLid" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="65%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </radialGradient>
      </defs>
      {/* Lid Handle */}
      <path d="M26 14 C26 10, 38 10, 38 14" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Lid Rim */}
      <rect x="12" y="14" width="40" height="8" rx="4" fill="url(#trashLid)" />
      {/* Lid Highlight */}
      <ellipse cx="28" cy="16" rx="12" ry="2" fill="#ffffff" fillOpacity="0.4" />
      {/* Can Body */}
      <path d="M16 22 L20 54 C20.5 58, 23 60, 27 60 H37 C41 60, 43.5 58, 44 54 L48 22 Z" fill="url(#trashBody)" />
      {/* Body Highlight */}
      <ellipse cx="24" cy="36" rx="3" ry="12" fill="#ffffff" fillOpacity="0.25" transform="rotate(-5 24 36)" />
      {/* Vertical Ribs */}
      <path d="M26 28 L28 52" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M32 28 L32 52" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M38 28 L36 52" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// 19. 3D Clay Edit (Pencil / Ubah)
export function ClayEdit({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="pencilWood" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <radialGradient id="pencilEraser" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#ef4444" />
        </radialGradient>
        <radialGradient id="pencilMetal" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>
      </defs>
      <g transform="rotate(45 32 32)">
        {/* Eraser */}
        <rect x="26" y="8" width="12" height="10" rx="4" fill="url(#pencilEraser)" />
        {/* Metal Ferrule */}
        <rect x="25" y="16" width="14" height="6" rx="2" fill="url(#pencilMetal)" />
        {/* Pencil Shaft */}
        <rect x="26" y="21" width="12" height="26" rx="3" fill="url(#pencilWood)" />
        {/* Specular Highlight */}
        <ellipse cx="29" cy="32" rx="1.5" ry="10" fill="#ffffff" fillOpacity="0.4" />
        {/* Sharpened Tip */}
        <path d="M26 47 L32 58 L38 47 Z" fill="#fed7aa" />
        {/* Graphite Point */}
        <path d="M30 54 L32 58 L34 54 Z" fill="#1e293b" />
      </g>
    </svg>
  );
}

// 20. 3D Clay Alert / Warning
export function ClayAlert({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block select-none ${className}`}>
      <defs>
        <radialGradient id="alertYellow" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      {/* Rounded Triangle Base */}
      <path
        d="M32 8 C34 4, 38 4, 40 8 L59 46 C61 50, 59 56, 54 56 H10 C5 56, 3 50, 5 46 L24 8 Z"
        fill="url(#alertYellow)"
      />
      {/* Highlight */}
      <ellipse cx="28" cy="20" rx="8" ry="3" fill="#ffffff" fillOpacity="0.4" transform="rotate(-30 28 20)" />
      {/* Exclamation Mark */}
      <rect x="30" y="22" width="4" height="15" rx="2" fill="#78350f" />
      <circle cx="32" cy="44" r="2.8" fill="#78350f" />
    </svg>
  );
}
