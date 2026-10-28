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
    <div className="relative rounded-2xl bg-amber-500 border-b-4 border-amber-600 p-6 overflow-hidden flex items-center justify-between min-h-[170px]">
      {/* Left Greeting & Duolingo 3D Button */}
      <div className="z-10 space-y-4 max-w-xs sm:max-w-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-100">
            BERANDA UTAMA
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-0.5">
            Halo, {userName}!
          </h2>
          <p className="text-sm text-amber-50 font-bold mt-1">
            Yuk catat keuanganmu hari ini!
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-amber-600 font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl border-2 border-slate-200 border-b-4 active:border-b-2 active:translate-y-0.5 transition cursor-pointer"
        >
          <span>+ CATAT TRANSAKSI</span>
        </button>
      </div>

      {/* Interactive Wallaby Mascot on the Right */}
      <div className="absolute right-4 sm:right-10 md:right-13 top-0 z-0">
        <InteractiveMascot size={320} />
      </div>
    </div>
  );
}
