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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800">
            Target Tabungan
          </h2>
          <p className="text-xs font-bold text-slate-400">
            Pilih 1 target utama untuk ditampilkan di Beranda
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddGoal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer shrink-0"
        >
          <IoAdd className="text-base stroke-2" />
          <span>TARGET BARU</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-slate-200 rounded-2xl bg-white space-y-3">
          <IoFlag className="text-4xl text-amber-400 mx-auto" />
          <h4 className="text-sm font-extrabold text-slate-700">Belum ada target tabungan</h4>
          <button
            type="button"
            onClick={onOpenAddGoal}
            className="px-4 py-2.5 bg-amber-500 text-white font-extrabold text-xs uppercase rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer"
          >
            + BUAT TARGET
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
                className={`rounded-2xl p-5 space-y-4 bg-white border-2 transition ${
                  isMain
                    ? 'border-amber-400 border-b-4'
                    : 'border-slate-200'
                }`}
              >
                {/* Header & Controls */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isMain
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IoFlag className="text-xl" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-800">
                          {goal.title}
                        </h4>
                        {isMain && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700">
                            UTAMA
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-bold">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onLockInGoal(goal.id)}
                      className={`p-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        isMain
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                          : 'bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600'
                      }`}
                      title={isMain ? 'Lepas dari Target Utama (Klik untuk Unlock)' : 'Jadikan Target Utama (Lock In)'}
                    >
                      {isMain ? <IoLockClosed className="text-sm text-amber-600" /> : <IoLockOpenOutline className="text-sm" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditGoal(goal)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                      title="Edit"
                    >
                      <IoPencil className="text-sm" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteGoal(goal)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition cursor-pointer"
                      title="Hapus"
                    >
                      <IoTrashOutline className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-slate-700">
                      {formatRupiah(goal.currentAmount)}
                    </span>
                    <span className="text-slate-400">
                      {percentage}% ({formatRupiah(goal.targetAmount)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Quick Top-Up Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onTopUp(goal.id, 25000)}
                    className="flex-1 text-xs font-extrabold bg-white hover:bg-slate-50 border-2 border-slate-200 border-b-4 active:border-b-2 active:translate-y-0.5 text-slate-700 py-2 rounded-xl transition cursor-pointer"
                  >
                    +25rb
                  </button>
                  <button
                    type="button"
                    onClick={() => onTopUp(goal.id, 50000)}
                    className="flex-1 text-xs font-extrabold bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 text-white py-2 rounded-xl transition cursor-pointer"
                  >
                    +50rb
                  </button>
                  <button
                    type="button"
                    onClick={() => onTopUp(goal.id, 100000)}
                    className="flex-1 text-xs font-extrabold bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 text-white py-2 rounded-xl transition cursor-pointer"
                  >
                    +100rb
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
