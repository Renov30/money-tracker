'use client';

import React from 'react';
import PenguinMascot from './PenguinMascot';

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
    <div className="relative rounded-3xl bg-gradient-to-r from-sky-100 via-sky-200/50 to-blue-200/70 p-6 md:p-8 overflow-hidden shadow-xs border border-sky-200/50 flex flex-col justify-between min-h-[200px]">
      
      {/* Target Tag at Top Right */}
      <div className="self-end z-10">
        <span className="bg-white/80 backdrop-blur-xs border border-white text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-white transition">
          <span>🎯</span>
          <span>Target: {activeGoalTitle} ›</span>
        </span>
      </div>

      {/* Greeting & Action Button */}
      <div className="max-w-md z-10 space-y-3 mt-2 md:mt-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Selamat pagi, <span className="text-blue-600">{userName}!</span> 👋
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
            Penny si penguin siap membantumu mencatat pemasukan, menekan pengeluaran, dan meraih target tabungan impian!
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-sm shadow-blue-500/25 transition active:scale-95 cursor-pointer"
        >
          <span>+ Catat Keuangan</span>
          <span>➔</span>
        </button>
      </div>

      {/* Penguin Mascot on the Right (Matching Lingora Reference Mascot exactly!) */}
      <div className="absolute right-2 sm:right-6 -bottom-2 z-10 pointer-events-none">
        <PenguinMascot size={170} mood="waving" />
      </div>

      {/* Decorative Cloud Shapes in Background */}
      <div className="absolute right-36 bottom-6 w-24 h-12 bg-white/40 rounded-full blur-xs pointer-events-none"></div>
      <div className="absolute right-8 top-8 w-16 h-8 bg-white/30 rounded-full blur-xs pointer-events-none"></div>
    </div>
  );
}

