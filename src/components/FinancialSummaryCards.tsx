'use client';

import React from 'react';
import { formatRupiah } from '@/lib/storage';
import { IoWalletOutline, IoSaveOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface FinancialSummaryCardsProps {
  totalBalance: number;
  totalSavings: number;
  selectedMonth: string; // YYYY-MM
  onPrevMonth: () => void;
  onNextMonth: () => void;
  monthlyIncome: number;
  monthlyExpense: number;
  onOpenAddTransaction: () => void;
  onOpenAddGoal: () => void;
  onViewGoals?: () => void;
}

export default function FinancialSummaryCards({
  totalBalance,
  totalSavings,
  selectedMonth,
  onPrevMonth,
  onNextMonth,
  monthlyIncome,
  monthlyExpense,
  onOpenAddTransaction,
  onOpenAddGoal,
  onViewGoals,
}: FinancialSummaryCardsProps) {
  // Format Month Year (Contoh: "Oktober 2026")
  const formatMonthTitle = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split('-');
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Header with Month Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          RANGKUMAN KEUANGAN
        </h3>

        {/* Month Selector Pills (Duolingo Style) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
            title="Bulan sebelumnya"
          >
            <IoChevronBack className="text-xs" />
          </button>
          <span className="text-xs font-extrabold text-slate-800 px-2 min-w-[100px] text-center capitalize">
            {formatMonthTitle(selectedMonth)}
          </span>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
            title="Bulan berikutnya"
          >
            <IoChevronForward className="text-xs" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kartu 1: Arus Kas Bulan Ini */}
        <div
          onClick={onOpenAddTransaction}
          className="bg-white border-2 border-slate-200 border-b-4 hover:bg-slate-50 rounded-2xl p-4 flex flex-col justify-between transition cursor-pointer active:border-b-2 active:translate-y-0.5"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <IoWalletOutline className="text-2xl" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                SISA KAS BULAN INI
              </div>
              <div className={`text-xl font-black mt-0.5 ${totalBalance < 0 ? 'text-rose-500' : 'text-slate-800'}`}>
                {formatRupiah(totalBalance)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-extrabold pt-3 mt-2 border-t-2 border-slate-100">
            <span className="text-emerald-600">
              Masuk: +{formatRupiah(monthlyIncome)}
            </span>
            <span className="text-rose-500">
              Keluar: -{formatRupiah(monthlyExpense)}
            </span>
          </div>
        </div>

        {/* Kartu 2: Total Tabungan (Akumulatif & Berjalan Terus) */}
        <div
          onClick={onViewGoals || onOpenAddGoal}
          className="bg-white border-2 border-slate-200 border-b-4 hover:bg-slate-50 rounded-2xl p-4 flex flex-col justify-between transition cursor-pointer active:border-b-2 active:translate-y-0.5"
        >
          <div className="flex items-center gap-3.5">
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

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-3 mt-2 border-t-2 border-slate-100">
            <span>Terkumpul di celengan impian</span>
            <span className="text-amber-600 font-extrabold">Lihat Celengan →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
