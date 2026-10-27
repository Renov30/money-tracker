'use client';

import React from 'react';
import { UserStats } from '@/types';
import { formatRupiah } from '@/lib/storage';

interface ProfileCardProps {
  stats: UserStats;
  totalBalance: number;
  onOpenAddModal: () => void;
  onOpenGoalModal: () => void;
}

export default function ProfileCard({
  stats,
  totalBalance,
  onOpenAddModal,
  onOpenGoalModal,
}: ProfileCardProps) {
  const xpPercentage = Math.min(
    100,
    Math.round((stats.currentXp / stats.xpToNextLevel) * 100)
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center -mt-14 relative z-10">
      {/* Circular Avatar with clean red border and green online dot */}
      <div className="w-20 h-20 rounded-full bg-rose-600 p-1 shadow-md relative -mt-12 mb-3 border-4 border-white">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-2xl text-rose-600">
          M
        </div>
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
      </div>

      {/* Name & Title */}
      <h2 className="text-base font-bold text-slate-900">{stats.name}</h2>
      <p className="text-xs text-slate-500 mt-0.5">{stats.title}</p>

      {/* Saldo & XP Summary */}
      <div className="w-full mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">
            Saldo Kas
          </div>
          <div className="text-xs font-bold text-[#0066ff] mt-0.5 truncate">
            {formatRupiah(totalBalance)}
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">
            Level Progress
          </div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">
            {stats.currentXp} / {stats.xpToNextLevel} XP
          </div>
        </div>
      </div>

      {/* Level XP Bar */}
      <div className="w-full mt-3">
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#0066ff] h-full rounded-full transition-all duration-300"
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
        <button
          onClick={onOpenAddModal}
          className="bg-[#0066ff] hover:bg-blue-700 text-white py-2 px-3 rounded-full text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
        >
          + Catat Uang
        </button>
        <button
          onClick={onOpenGoalModal}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer"
        >
          Target Celengan
        </button>
      </div>
    </div>
  );
}

