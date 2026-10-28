'use client';

import React, { useState } from 'react';
import { formatRupiah } from '@/lib/storage';
import {
  IoWalletOutline,
  IoSaveOutline,
  IoChevronBack,
  IoChevronForward,
  IoPencil,
  IoCheckmark,
  IoClose,
} from 'react-icons/io5';

interface FinancialSummaryCardsProps {
  totalCash: number; // Total Uang Keseluruhan (Diisi/diedit oleh user)
  onUpdateTotalCash: (amount: number) => void;
  monthlyIncome?: number;
  monthlyExpense?: number;
  totalSavings?: number; // Akumulasi seluruh tabungan
  monthlySavings?: number; // Tabungan pada bulan terpilih
  selectedMonth?: string; // YYYY-MM
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onOpenAddTransaction: () => void;
  onOpenAddGoal: () => void;
  onViewGoals?: () => void;
  onViewReports?: () => void;
}

export default function FinancialSummaryCards({
  totalCash = 0,
  onUpdateTotalCash,
  monthlyIncome = 0,
  monthlyExpense = 0,
  totalSavings = 0,
  monthlySavings = 0,
  selectedMonth = '',
  onPrevMonth,
  onNextMonth,
  onOpenAddTransaction,
  onOpenAddGoal,
  onViewGoals,
  onViewReports,
}: FinancialSummaryCardsProps) {
  const [isEditingCash, setIsEditingCash] = useState(false);
  const [cashInputValue, setCashInputValue] = useState('');

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

  const safeTotalCash = Number(totalCash) || 0;
  const safeIncome = Number(monthlyIncome) || 0;
  const safeExpense = Number(monthlyExpense) || 0;
  const safeTotalSavings = Number(totalSavings) || 0;
  const safeMonthlySavings = Number(monthlySavings) || 0;

  // Kas Bersih: (pemasukan - pengeluaran - tabungan bulan ini)
  const netCash = safeIncome - safeExpense - safeMonthlySavings;

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCashInputValue(safeTotalCash ? safeTotalCash.toString() : '');
    setIsEditingCash(true);
  };

  const handleSaveEdit = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    const parsed = parseInt(cashInputValue.replace(/\D/g, ''), 10);
    onUpdateTotalCash(isNaN(parsed) ? 0 : parsed);
    setIsEditingCash(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingCash(false);
  };

  return (
    <div className="space-y-2.5">
      {/* Header with Month Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          RANGKUMAN KEUANGAN
        </h3>

        {/* Month Selector Pills (Duolingo Style) */}
        {onPrevMonth && onNextMonth && (
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
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kartu 1: Total Uang */}
        <div
          onClick={() => {
            if (!isEditingCash) onOpenAddTransaction();
          }}
          className="bg-white border-2 border-slate-200 border-b-4 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between transition cursor-pointer active:border-b-2 active:translate-y-0.5"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <IoWalletOutline className="text-2xl" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      TOTAL UANG
                    </span>
                    {!isEditingCash && (
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="p-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 transition cursor-pointer"
                        title="Ubah Total Uang"
                      >
                        <IoPencil className="text-xs" />
                      </button>
                    )}
                  </div>

                  {isEditingCash ? (
                    <div className="flex items-center gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <span className="absolute left-2 top-1 text-xs font-bold text-slate-400">Rp</span>
                        <input
                          type="number"
                          autoFocus
                          value={cashInputValue}
                          onChange={(e) => setCashInputValue(e.target.value)}
                          placeholder="0"
                          className="w-36 bg-slate-50 border-2 border-amber-300 rounded-lg pl-7 pr-2 py-0.5 text-xs font-black text-slate-800 focus:outline-none focus:border-amber-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') setIsEditingCash(false);
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
                        title="Simpan"
                      >
                        <IoCheckmark className="text-xs stroke-2" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="p-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 cursor-pointer"
                        title="Batal"
                      >
                        <IoClose className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 tracking-tight">
                      {formatRupiah(safeTotalCash)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Pemasukan & Pengeluaran Bulan Ini (Hanya Angka, Keterangan saat Hover) */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-slate-100">
            {/* Tooltip Hover Pemasukan */}
            <div className="relative group cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewReports?.(); }}>
              <span className="text-xs sm:text-sm font-black text-emerald-600">
                +{formatRupiah(safeIncome)}
              </span>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col items-start bg-slate-900 text-white text-[11px] font-bold rounded-xl px-2.5 py-1.5 shadow-xl whitespace-nowrap z-30 pointer-events-none">
                <span>Pemasukan: +{formatRupiah(safeIncome)}</span>
                <span className="text-[9px] text-emerald-400 font-semibold">Klik untuk lihat rekap lengkap ↗</span>
                <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-3"></div>
              </div>
            </div>

            {/* Tooltip Hover Pengeluaran */}
            <div className="relative group cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewReports?.(); }}>
              <span className="text-xs sm:text-sm font-black text-rose-500">
                -{formatRupiah(safeExpense)}
              </span>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex flex-col items-end bg-slate-900 text-white text-[11px] font-bold rounded-xl px-2.5 py-1.5 shadow-xl whitespace-nowrap z-30 pointer-events-none">
                <span>Pengeluaran: -{formatRupiah(safeExpense)}</span>
                <span className="text-[9px] text-rose-400 font-semibold">Klik untuk lihat rekap lengkap ↗</span>
                <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 right-3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Kartu 2: Total Tabungan */}
        <div
          onClick={onViewGoals || onOpenAddGoal}
          className="bg-white border-2 border-slate-200 border-b-4 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between transition cursor-pointer active:border-b-2 active:translate-y-0.5"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <IoSaveOutline className="text-2xl" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  TOTAL TABUNGAN
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 tracking-tight">
                  {formatRupiah(safeTotalSavings)}
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Kas Bersih & Tabungan Bulan Ini (Hanya Angka, Keterangan saat Hover) */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-slate-100">
            {/* Tooltip Hover Kas Bersih */}
            <div className="relative group cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewReports?.(); }}>
              <span className={`text-xs sm:text-sm font-black ${netCash < 0 ? 'text-rose-500' : 'text-slate-800'}`}>
                {netCash >= 0 ? '+' : ''}{formatRupiah(netCash)}
              </span>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col items-start bg-slate-900 text-white text-[11px] font-bold rounded-xl px-2.5 py-1.5 shadow-xl whitespace-nowrap z-30 pointer-events-none">
                <span>Kas Bersih (Pemasukan - Pengeluaran - Tabungan)</span>
                <span className="text-[10px] text-slate-300 font-extrabold">{netCash >= 0 ? '+' : ''}{formatRupiah(netCash)}</span>
                <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-3"></div>
              </div>
            </div>

            {/* Tooltip Hover Tabungan */}
            <div className="relative group cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewGoals?.(); }}>
              <span className="text-xs sm:text-sm font-black text-amber-600">
                -{formatRupiah(safeMonthlySavings)}
              </span>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex flex-col items-end bg-slate-900 text-white text-[11px] font-bold rounded-xl px-2.5 py-1.5 shadow-xl whitespace-nowrap z-30 pointer-events-none">
                <span>Tabungan Bulan Ini: -{formatRupiah(safeMonthlySavings)}</span>
                <span className="text-[9px] text-amber-400 font-semibold">Klik untuk lihat target celengan ↗</span>
                <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 right-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
