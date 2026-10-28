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
    <div className="flex items-center justify-end gap-3 px-6 py-3.5 bg-white border-b-2 border-slate-200 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Streak Counter - Duolingo style */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition">
          <IoFlame className="text-orange-500 text-lg" />
          <span className="text-sm font-extrabold text-orange-500">{streakDays}</span>
        </div>

        {/* XP Counter - Duolingo style */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition">
          <IoSparkles className="text-amber-500 text-lg" />
          <span className="text-sm font-extrabold text-amber-500">{xpCoins} XP</span>
        </div>
      </div>
    </div>
  );
}
