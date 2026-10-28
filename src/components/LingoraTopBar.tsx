'use client';

import React from 'react';
import { IoFlame, IoSparkles } from 'react-icons/io5';

interface TopBarProps {
  streakDays: number;
  xpCoins: number;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export default function LingoraTopBar({
  streakDays,
  xpCoins,
}: TopBarProps) {
  return (
    <div className="flex items-center justify-end gap-3 p-4 md:px-8 md:pt-6 md:pb-4 bg-[#faf7f2]/95 border-b border-amber-100/60 sticky top-0 z-20 backdrop-blur-md">
      {/* Top Right Badges with Ionicons Flame & Sparkles */}
      <div className="flex items-center gap-3">
        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 bg-white border border-amber-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
          <IoFlame className="text-orange-500 text-base" />
          <span className="text-xs font-bold text-amber-950 font-mono">{streakDays} Hari</span>
        </div>

        {/* Gems / Coins Badge */}
        <div className="flex items-center gap-1.5 bg-white border border-amber-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
          <IoSparkles className="text-amber-500 text-base" />
          <span className="text-xs font-bold text-amber-800 font-mono">{xpCoins} XP</span>
        </div>
      </div>
    </div>
  );
}
