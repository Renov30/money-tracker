'use client';

import React from 'react';
import { formatRupiah } from '@/lib/storage';
import { IoWalletOutline, IoSaveOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface FinancialSummaryCardsProps {
  safeToSpend?: number; // Kas siap pakai (Total Kas Bersih - Total Tabungan)
  rawCashBalance?: number; // Total Kas Bersih Akumulatif dari pemasukan - pengeluaran
  totalSavings?: number;
  selectedMonth?: string; // YYYY-MM
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  monthlyIncome?: number;
  monthlyExpense?: number;
  onOpenAddTransaction: () => void;
  onOpenAddGoal: () => void;
  onViewGoals?: () => void;
}

export default function FinancialSummaryCards({
  safeToSpend = 0,
  rawCashBalance = 0,
  totalSavings = 0,
  selectedMonth = '',
  onPrevMonth,
  onNextMonth,
  monthlyIncome = 0,
  monthlyExpense = 0,
  onOpenAddTransaction,
  onOpenAddGoal,
  onViewGoals,
}: FinancialSummaryCardsProps) {
  // Format Month Year (Contoh: "Oktober 2026")
  const formatMonthTitle = (monthStr: string) => {
    if (!monthStr) return 'Bulan Ini';
    try {
      const [year, month] = monthStr.split('-');
      if (!year || !month) return 'Bulan Ini';
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  const safeSpendVal = Number(safeToSpend) || 0;
  const rawCashVal = Number(rawCashBalance) || 0;
  const safeIncome = Number(monthlyIncome) || 0;
  const safeExpense = Number(monthlyExpense) || 0;
  const safeSavings = Number(totalSavings) || 0;

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
        {/* Kartu 1: Kas Siap Pakai (Bisa Dipakai) */}
        <div
          onClick={onOpenAddTransaction}
          className="bg-white border-2 border-slate-200 border-b-4 hover:bg-slate-50 rounded-2xl p-4 flex flex-col justify-between transition cursor-pointer active:border-b-2 active:translate-y-0.5"
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shrink-0 ${safeSpendVal < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}>
              <IoWalletOutline className="text-2xl" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                KAS SIAP PAKAI (BEBAS DIGUNAKAN)
              </div>
              <div className={`text-xl font-black mt-0.5 ${safeSpendVal < 0 ? 'text-rose-500' : 'text-slate-800'}`}>
                {formatRupiah(safeSpendVal)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-extrabold pt-3 mt-2 border-t-2 border-slate-100">
            <span className="text-slate-500 font-bold" title="Total akumulasi kas riil Anda">
              Total Kas: {formatRupiah(rawCashVal)}
            </span>
            <span className="text-amber-600 font-bold" title="Tertahan di seluruh celengan impian">
              Di Celengan: -{formatRupiah(safeSavings)}
            </span>
          </div>
        </div>

        {/* Kartu 2: Total Tabungan (Akumulatif & Tidak Boleh Dipakai) */}
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
                TOTAL TABUNGAN (TERTAHAN)
              </div>
              <div className="text-xl font-black text-slate-800 mt-0.5">
                {formatRupiah(safeSavings)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-3 mt-2 border-t-2 border-slate-100">
            <span className="text-emerald-600 font-extrabold">Bulan Ini: +{formatRupiah(safeIncome)}</span>
            <span className="text-rose-500 font-extrabold">Keluar: -{formatRupiah(safeExpense)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
