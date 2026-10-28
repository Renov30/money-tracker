'use client';

import React from 'react';
import { Goal } from '@/types';
import { formatRupiah } from '@/lib/storage';
import { IoFlag } from 'react-icons/io5';

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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          TARGET TABUNGAN UTAMA
        </h3>
        <button
          type="button"
          onClick={onViewAllGoals}
          className="text-xs font-extrabold uppercase tracking-wider text-amber-500 hover:text-amber-600 cursor-pointer"
        >
          LIHAT SEMUA
        </button>
      </div>

      {/* Duolingo Flat Card */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto flex-1">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 text-white">
            <IoFlag className="text-xl" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <h4 className="text-sm font-black text-slate-800">
                {goal.title}
              </h4>
              <span className="text-xs font-extrabold text-amber-600">
                {percentage}%
              </span>
            </div>

            {/* Thick Duolingo Progress Bar */}
            <div className="w-full max-w-xs bg-slate-100 h-3.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="text-xs font-bold text-slate-400">
              {formatRupiah(goal.currentAmount)} / {formatRupiah(goal.targetAmount)}
            </div>
          </div>
        </div>

        {/* Duolingo 3D Action Button */}
        <button
          type="button"
          onClick={() => onTopUp(goal.id, 50000)}
          className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer shrink-0"
        >
          + NABUNG 50RB
        </button>
      </div>
    </div>
  );
}
