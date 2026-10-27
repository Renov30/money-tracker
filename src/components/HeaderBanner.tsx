'use client';

import React, { useState, useEffect } from 'react';

interface HeaderBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  level: number;
  streakDays: number;
}

export default function HeaderBanner({
  searchQuery,
  setSearchQuery,
  level,
  streakDays,
}: HeaderBannerProps) {
  const [currentDate, setCurrentDate] = useState<string>('Hari ini');

  useEffect(() => {
    setCurrentDate(
      new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
      }).format(new Date())
    );
  }, []);

  return (
    <div className="bg-[#0284c7] text-white p-5 md:p-6 pb-20 relative overflow-hidden shrink-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search Input (Simple & Minimal) */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi..."
            className="w-full bg-white/20 border border-white/30 text-white placeholder-blue-100 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:bg-white/30 transition"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="bg-white/15 px-3 py-1 rounded-full text-blue-100">
            {currentDate}
          </span>
          <span className="bg-white/15 px-3 py-1 rounded-full text-blue-100">
            World 1-{level}
          </span>
          <span className="bg-amber-400 text-slate-900 font-bold px-3 py-1 rounded-full shadow-sm">
            Streak {streakDays} Hari
          </span>
        </div>
      </div>
    </div>
  );
}

