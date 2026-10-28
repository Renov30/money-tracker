'use client';

import React from 'react';
import { formatRupiah } from '@/lib/storage';
import { IoWalletOutline, IoSaveOutline } from 'react-icons/io5';

interface FinancialSummaryCardsProps {
  totalBalance: number;
  totalSavings: number;
  onOpenAddTransaction: () => void;
  onOpenAddGoal: () => void;
  onViewGoals?: () => void;
}

export default function FinancialSummaryCards({
  totalBalance,
  totalSavings,
  onOpenAddTransaction,
  onOpenAddGoal,
  onViewGoals,
}: FinancialSummaryCardsProps) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
        RANGKUMAN KEUANGAN
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kartu 1: Uang Dimiliki */}
        <div
          onClick={onOpenAddTransaction}
          className="bg-white border-2 border-slate-200 border-b-4 hover:bg-slate-50 rounded-2xl p-4 flex items-center gap-4 transition cursor-pointer active:border-b-2 active:translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <IoWalletOutline className="text-2xl" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              UANG DIMILIKI
            </div>
            <div className={`text-xl font-black mt-0.5 ${totalBalance < 0 ? 'text-rose-500' : 'text-slate-800'}`}>
              {formatRupiah(totalBalance)}
            </div>
          </div>
        </div>

        {/* Kartu 2: Total Tabungan */}
        <div
          onClick={onViewGoals || onOpenAddGoal}
          className="bg-white border-2 border-slate-200 border-b-4 hover:bg-slate-50 rounded-2xl p-4 flex items-center gap-4 transition cursor-pointer active:border-b-2 active:translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <IoSaveOutline className="text-2xl" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              TOTAL TABUNGAN
            </div>
            <div className="text-xl font-black text-slate-800 mt-0.5">
              {formatRupiah(totalSavings)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
