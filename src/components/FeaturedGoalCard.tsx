'use client';

import React from 'react';
import { Goal } from '@/types';
import { formatRupiah } from '@/lib/storage';
import { IoFlag, IoLockClosed } from 'react-icons/io5';

interface FeaturedGoalCardProps {
  goal: Goal;
  onTopUp: (goalId: string, amount: number) => void;
  onViewAllGoals: () => void;
}

export default function FeaturedGoalCard({
  goal,
  onTopUp,
  onViewAllGoals,
}: FeaturedGoalCardProps) {
  const percentage = Math.min(
    100,
    Math.round((goal.currentAmount / goal.targetAmount) * 100)
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Target Tabungan Utama
          </h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            <IoLockClosed className="text-xs text-amber-600" />
            <span>Lock-in</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onViewAllGoals}
          className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
        >
          Kelola Semua Target →
        </button>
      </div>

      {/* Wide White Card with Main Goal Indicator */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle accent highlight on top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />

        {/* Left Icon Badge with Ionicons Flag */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xs shrink-0 text-white">
            <IoFlag className="text-2xl" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {goal.title}
              </h4>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                {goal.category}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Terkumpul {formatRupiah(goal.currentAmount)} dari {formatRupiah(goal.targetAmount)}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-36 sm:w-48 bg-amber-100/60 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-amber-800 font-mono">
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Setor Tabungan */}
        <button
          type="button"
          onClick={() => onTopUp(goal.id, 50000)}
          className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-full shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <span className="text-sm">▷</span>
          <span>Setor Rp 50k (+25 XP)</span>
        </button>
      </div>
    </div>
  );
}
