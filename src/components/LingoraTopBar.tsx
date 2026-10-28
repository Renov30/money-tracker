'use client';

import React from 'react';
import { IoSearch, IoFlame, IoSparkles } from 'react-icons/io5';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  streakDays: number;
  xpCoins: number;
}

export default function LingoraTopBar({
  searchQuery,
  setSearchQuery,
  streakDays,
  xpCoins,
}: TopBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:px-8 md:pt-6 md:pb-4 bg-[#faf7f2]/95 border-b border-amber-100/60 sticky top-0 z-20 backdrop-blur-md">
      {/* Search Bar with Ionicons Search */}
      <div className="w-full sm:w-80 relative">
        <span className="absolute left-3 top-2.5 text-slate-400">
          <IoSearch className="text-base text-amber-700/70" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari transaksi, pemasukan, target..."
          className="w-full bg-white border border-amber-200/80 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        />
      </div>

      {/* Top Right Badges with Ionicons Flame & Sparkles */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
