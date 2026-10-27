'use client';

import React from 'react';
import { Goal } from '@/types';
import { formatRupiah } from '@/lib/storage';

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
        <h3 className="text-sm font-black text-slate-900 tracking-tight">
          Target Tabungan Utama
        </h3>
        <button
          onClick={onViewAllGoals}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>

      {/* Wide White Card matching Lingora "Continue Learning" Card */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Icon Badge */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            🎮
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {goal.title}
            </h4>
            <div className="text-xs text-slate-400 font-medium">
              Terkumpul {formatRupiah(goal.currentAmount)} dari {formatRupiah(goal.targetAmount)}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-36 sm:w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-slate-700 font-mono">
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Setor Tabungan */}
        <button
          onClick={() => onTopUp(goal.id, 50000)}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>▷</span>
          <span>Setor Rp 50k (+25 XP)</span>
        </button>
      </div>
    </div>
  );
}

