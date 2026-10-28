'use client';

import React from 'react';
import WallabyMascot from './WallabyMascot';
import { IoFlag } from 'react-icons/io5';

interface HeroBannerProps {
  userName: string;
  onOpenAddModal: () => void;
  activeGoalTitle: string;
}

export default function LingoraHeroBanner({
  userName,
  onOpenAddModal,
  activeGoalTitle,
}: HeroBannerProps) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-amber-100/90 via-amber-200/50 to-orange-100/80 p-6 md:p-8 overflow-hidden shadow-xs border border-amber-300/60 flex flex-col justify-between min-h-[200px]">
      
      {/* Target Tag at Top Right with Ionicons Flag */}
      <div className="self-end z-10">
        <span className="bg-white/90 backdrop-blur-xs border border-amber-200/80 text-amber-950 text-[11px] font-bold px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-white transition">
          <IoFlag className="text-amber-600 text-sm" />
          <span>Target: {activeGoalTitle} ›</span>
        </span>
      </div>

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

      {/* Wallaby Mascot on the Right */}
      <div className="absolute right-2 sm:right-6 -bottom-1 z-10 pointer-events-none">
        <WallabyMascot size={185} mood="waving" />
      </div>

      {/* Decorative Warm Sun/Cloud Shapes in Background */}
      <div className="absolute right-36 bottom-6 w-24 h-12 bg-white/40 rounded-full blur-xs pointer-events-none"></div>
      <div className="absolute right-8 top-8 w-16 h-8 bg-amber-300/30 rounded-full blur-xs pointer-events-none"></div>
    </div>
  );
}
