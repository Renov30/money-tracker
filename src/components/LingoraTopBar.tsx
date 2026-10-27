'use client';

import React from 'react';

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:px-8 md:pt-6 md:pb-4 bg-[#f8fafc] border-b border-slate-100/60 sticky top-0 z-20 backdrop-blur-md bg-[#f8fafc]/95">
      {/* Search Bar matching Lingora pill style */}
      <div className="w-full sm:w-80 relative">
        <span className="absolute left-3.5 top-2.5 text-xs text-slate-400">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari transaksi, pemasukan, target..."
          className="w-full bg-white border border-slate-200/80 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />
      </div>

      {/* Top Right Badges (Matching Lingora Streak Fire & Gems) */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-bold text-slate-800">{streakDays}</span>
        </div>

        {/* Gems / Coins Badge */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
          <span className="text-sm">💎</span>
          <span className="text-xs font-bold text-blue-600">{xpCoins}</span>
        </div>
      </div>
    </div>
  );
}

