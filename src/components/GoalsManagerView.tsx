'use client';

import React from 'react';
import { Goal } from '@/types';
import { formatRupiah } from '@/lib/storage';
import {
  IoFlag,
  IoPencil,
  IoTrashOutline,
  IoLockClosed,
  IoLockOpenOutline,
  IoSparkles,
  IoAdd,
} from 'react-icons/io5';

interface GoalsManagerViewProps {
  goals: Goal[];
  onTopUp: (goalId: string, amount: number) => void;
  onOpenAddGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goal: Goal) => void;
  onLockInGoal: (goalId: string) => void;
}

export default function GoalsManagerView({
  goals,
  onTopUp,
  onOpenAddGoal,
  onEditGoal,
  onDeleteGoal,
  onLockInGoal,
}: GoalsManagerViewProps) {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Manajemen Target Celengan (Savings Goals)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 font-mono">
              {goals.length} Target
            </span>
          </div>
          <p className="text-xs text-amber-800/80 font-medium mt-0.5">
            Kelola, edit, kunci (lock in) target utama celengan impianmu bersama Wally!
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddGoal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-full shadow-xs shadow-amber-600/25 transition active:scale-95 cursor-pointer shrink-0"
        >
          <IoAdd className="text-sm stroke-2" />
          <span>Tambah Target Baru</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-amber-200/70 rounded-3xl bg-amber-50/30">
          <IoFlag className="text-4xl text-amber-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Belum Ada Target Celengan</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto">
            Mulai petualangan finansialmu dengan menentukan target tabungan pertamamu!
          </p>
          <button
            type="button"
            onClick={onOpenAddGoal}
            className="px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-full shadow-xs hover:bg-amber-700 transition cursor-pointer"
          >
            + Buat Target Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.round((goal.currentAmount / goal.targetAmount) * 100)
            );
            const isMain = Boolean(goal.isMain);

            return (
              <div
                key={goal.id}
                className={`relative rounded-3xl p-5 space-y-4 transition-all duration-200 border ${
                  isMain
                    ? 'bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border-amber-300 shadow-xs ring-2 ring-amber-400/30'
                    : 'bg-white/80 border-amber-100/80 hover:bg-amber-50/30 hover:border-amber-200'
                }`}
              >
                {/* Main Goal Badge Indicator */}
                {isMain && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-2xs">
                    <IoLockClosed className="text-xs" />
                    <span>TARGET UTAMA (MAIN GOAL)</span>
                  </div>
                )}

                {/* Card Header & Controls */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                        isMain
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-50 border border-amber-200/80 text-amber-600'
                      }`}
                    >
                      <IoFlag className="text-xl" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">
                        {goal.title}
                      </h4>
                      <span className="text-[11px] text-amber-700/80 font-bold">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Lock In, Edit, Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onLockInGoal(goal.id)}
                      className={`p-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        isMain
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-50 hover:bg-amber-100 text-slate-500 hover:text-amber-700 border border-slate-200/60'
                      }`}
                      title={isMain ? 'Target ini adalah Target Utama' : 'Jadikan Target Utama (Lock In)'}
                    >
                      {isMain ? (
                        <IoLockClosed className="text-sm text-amber-600" />
                      ) : (
                        <IoLockOpenOutline className="text-sm" />
                      )}
                      <span className="text-[10px] hidden sm:inline">
                        {isMain ? 'Terkunci' : 'Lock In'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditGoal(goal)}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/60 transition cursor-pointer"
                      title="Edit Target"
                    >
                      <IoPencil className="text-xs" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteGoal(goal)}
                      className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/60 transition cursor-pointer"
                      title="Hapus Target"
                    >
                      <IoTrashOutline className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Amount Display */}
                <div className="space-y-1.5 bg-amber-50/50 p-3 rounded-2xl border border-amber-100/60">
                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span className="text-slate-700">
                      {formatRupiah(goal.currentAmount)}
                    </span>
                    <span className="text-amber-900 font-mono text-[11px]">
                      {percentage}% ({formatRupiah(goal.targetAmount)})
                    </span>
                  </div>
                  <div className="w-full bg-amber-200/50 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMain
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>
                      Sisa kekurangan: {formatRupiah(Math.max(0, goal.targetAmount - goal.currentAmount))}
                    </span>
                    {percentage >= 100 && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <IoSparkles className="text-xs" /> Tercapai!
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons: Quick Top-Up */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-amber-900/80">
                    Nabung Cepat:
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => onTopUp(goal.id, 25000)}
                      className="text-[10px] font-bold bg-white hover:bg-amber-50 border border-amber-200 text-slate-700 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      +25k
                    </button>
                    <button
                      type="button"
                      onClick={() => onTopUp(goal.id, 50000)}
                      className="text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                    >
                      +50k (+25 XP)
                    </button>
                    <button
                      type="button"
                      onClick={() => onTopUp(goal.id, 100000)}
                      className="text-[10px] font-bold bg-amber-700 hover:bg-amber-800 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                    >
                      +100k
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
