'use client';

import React from 'react';
import { Goal } from '@/types';
import { formatRupiah } from '@/lib/storage';

interface GoalsSectionProps {
  goals: Goal[];
  onTopUp: (goalId: string, amount: number) => void;
  onOpenAddGoal: () => void;
}

export default function GoalsSection({
  goals,
  onTopUp,
  onOpenAddGoal,
}: GoalsSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Target Celengan Impian
          </h3>
          <button
            onClick={onOpenAddGoal}
            className="text-[11px] font-bold text-[#0066ff] hover:underline cursor-pointer"
          >
            + Target Baru
          </button>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.round((goal.currentAmount / goal.targetAmount) * 100)
            );

            return (
              <div
                key={goal.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {goal.title}
                    </h4>
                    <div className="text-[10px] text-slate-400">
                      Target: {formatRupiah(goal.targetAmount)}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0066ff] bg-blue-50 px-2 py-0.5 rounded-full">
                    {percentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-[#0066ff] h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1">
                  <span className="text-[10px] text-slate-500">
                    Terkumpul: {formatRupiah(goal.currentAmount)}
                  </span>
                  <button
                    onClick={() => onTopUp(goal.id, 50000)}
                    className="text-[10px] font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer"
                  >
                    + Tabung Rp 50k (+25 XP)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

