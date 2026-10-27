'use client';

import React from 'react';
import { DailyQuest } from '@/types';
import { formatRupiah } from '@/lib/storage';

interface YellowHighlightCardProps {
  monthlyBudget: number;
  monthlyExpense: number;
  quests: DailyQuest[];
  onClaimQuest: (questId: string, rewardXp: number) => void;
}

export default function YellowHighlightCard({
  monthlyBudget,
  monthlyExpense,
  quests,
  onClaimQuest,
}: YellowHighlightCardProps) {
  const remainingBudget = Math.max(0, monthlyBudget - monthlyExpense);
  const budgetPercentage = Math.min(
    100,
    Math.round((monthlyExpense / monthlyBudget) * 100)
  );

  return (
    <div className="bg-[#facc15] text-slate-950 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
            Status Anggaran & Misi Harian
          </h3>
          <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
            Bulan Ini
          </span>
        </div>

        <p className="text-xs text-amber-950/80 leading-relaxed font-medium">
          Jaga kedisiplinan pengeluaran di bawah batas anggaran untuk menjaga skor kesehatan keuangan dan membuka level berikutnya.
        </p>

        {/* Budget Health Progress Bar (HP Bar Style) */}
        <div className="mt-4 bg-white/70 p-3 rounded-xl border border-amber-300">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-slate-700">Sisa Anggaran Belanja</span>
            <span className="text-slate-900 font-mono">
              {formatRupiah(remainingBudget)} ({100 - budgetPercentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                budgetPercentage > 85 ? 'bg-rose-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${100 - budgetPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="mt-4 pt-3 border-t border-amber-400/50 space-y-2">
        <div className="text-[11px] font-bold uppercase text-amber-900">
          Misi Aktif Hari Ini:
        </div>
        {quests.slice(0, 2).map((quest) => (
          <div
            key={quest.id}
            className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-amber-300/80 text-xs"
          >
            <div>
              <div className="font-bold text-slate-900">{quest.title}</div>
              <div className="text-[10px] text-slate-500">
                Reward: +{quest.xpReward} XP
              </div>
            </div>

            {quest.claimed ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                Selesai
              </span>
            ) : quest.completed ? (
              <button
                onClick={() => onClaimQuest(quest.id, quest.xpReward)}
                className="text-[10px] font-bold bg-[#0066ff] text-white hover:bg-blue-700 px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer"
              >
                Klaim XP
              </button>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                Belum
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

