'use client';

import React from 'react';
import { Goal } from '@/types';
import { formatRupiah } from '@/lib/storage';
import { IoFlag } from 'react-icons/io5';

interface GoalsManagerViewProps {
  goals: Goal[];
  onTopUp: (goalId: string, amount: number) => void;
  onOpenAddGoal: () => void;
}

export default function GoalsManagerView({
  goals,
  onTopUp,
  onOpenAddGoal,
}: GoalsManagerViewProps) {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-50">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Target Celengan Impian (Savings Goals)
          </h3>
          <p className="text-[11px] text-amber-800/80 font-medium">
            Kumpulkan koin dan penuhi kantung celengan impianmu bersama Wally!
          </p>
        </div>

        <button
          onClick={onOpenAddGoal}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-full shadow-xs transition active:scale-95 cursor-pointer shrink-0"
        >
          + Tambah Target Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percentage = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );

          return (
            <div
              key={goal.id}
              className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 space-y-3 hover:bg-amber-50/70 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs text-amber-600">
                    <IoFlag className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {goal.title}
                    </h4>
                    <span className="text-[10px] text-amber-700/80 font-medium">
                      {goal.category}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full font-mono">
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Terkumpul: {formatRupiah(goal.currentAmount)}</span>
                  <span>Target: {formatRupiah(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-amber-100/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons: Quick Top-Up */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                <span className="text-[10px] text-slate-400">
                  Sisa: {formatRupiah(Math.max(0, goal.targetAmount - goal.currentAmount))}
                </span>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => onTopUp(goal.id, 25000)}
                    className="text-[10px] font-bold bg-white hover:bg-amber-50 border border-amber-200 text-slate-700 px-2.5 py-1 rounded-xl transition cursor-pointer"
                  >
                    +25k
                  </button>
                  <button
                    onClick={() => onTopUp(goal.id, 50000)}
                    className="text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    +50k (+25 XP)
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
