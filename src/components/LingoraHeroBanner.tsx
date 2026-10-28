'use client';

import React from 'react';
import InteractiveMascot from './InteractiveMascot';

interface HeroBannerProps {
  userName: string;
  onOpenAddModal: () => void;
}

export default function LingoraHeroBanner({
  userName,
  onOpenAddModal,
}: HeroBannerProps) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-amber-100/90 via-amber-200/50 to-orange-100/80 p-6 md:p-8 overflow-hidden shadow-xs border border-amber-300/60 flex flex-col justify-between min-h-[200px]">
      
      {/* Greeting & Action Button */}
      <div className="max-w-md z-10 space-y-3 mt-2 md:mt-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Selamat pagi, <span className="text-amber-700">{userName}!</span>
          </h2>
          <p className="text-xs md:text-sm text-amber-950/80 font-medium mt-1 leading-relaxed">
            Wally si wallaby ceria siap membantumu mencatat pemasukan, mengontrol pengeluaran, dan memenuhi kantung tabungan impianmu!
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-sm shadow-amber-600/25 transition active:scale-95 cursor-pointer"
        >
          <span>+ Catat Keuangan</span>
          <span className="text-base leading-none">➔</span>
        </button>
      </div>

      {/* Interactive Animated Wallaby Mascot on the Right (Shifted left and enlarged) */}
      <div className="absolute right-8 sm:right-16 md:right-24 bottom-0 z-20">
        <InteractiveMascot size={195} />
      </div>

      {/* Decorative Warm Sun/Cloud Shapes in Background */}
      <div className="absolute right-36 bottom-6 w-24 h-12 bg-white/40 rounded-full blur-xs pointer-events-none"></div>
      <div className="absolute right-8 top-8 w-16 h-8 bg-amber-300/30 rounded-full blur-xs pointer-events-none"></div>
    </div>
  );
}
