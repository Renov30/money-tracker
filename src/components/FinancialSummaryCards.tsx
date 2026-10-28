'use client';

import React from 'react';
import { formatRupiah } from '@/lib/storage';
import { IoWalletOutline, IoSaveOutline, IoAdd, IoArrowForward } from 'react-icons/io5';

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 tracking-tight">
          Rangkuman Keuangan
        </h3>
        <span className="text-xs font-semibold text-slate-400">
          Saldo & Tabungan Terkini
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kartu 1: Total Uang Yang Dimiliki (Saldo Bersih Kas) */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <IoWalletOutline className="text-2xl" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Total Uang yang Dimiliki
                </span>
                <div className={`text-xl sm:text-2xl font-black tracking-tight mt-0.5 ${totalBalance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {formatRupiah(totalBalance)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAddTransaction}
              className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition active:scale-95 cursor-pointer shrink-0"
              title="Catat Keuangan Baru"
            >
              <IoAdd className="text-lg" />
            </button>
          </div>

          <div className="pt-4 mt-3 border-t border-emerald-100/60 flex items-center justify-between text-xs">
            <span className="text-[11px] text-emerald-700/80 font-medium">
              Akumulasi pemasukan dikurangi pengeluaran
            </span>
            <button
              type="button"
              onClick={onOpenAddTransaction}
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition cursor-pointer"
            >
              <span>+ Catat</span>
              <IoArrowForward className="text-xs" />
            </button>
          </div>
        </div>

        {/* Kartu 2: Total Tabungan (Total Terkumpul di Celengan Goals) */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border border-amber-200/80 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <IoSaveOutline className="text-2xl" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  Total Tabungan
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {formatRupiah(totalSavings)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAddGoal}
              className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition active:scale-95 cursor-pointer shrink-0"
              title="Buat Target Celengan Baru"
            >
              <IoAdd className="text-lg" />
            </button>
          </div>

          <div className="pt-4 mt-3 border-t border-amber-100/60 flex items-center justify-between text-xs">
            <span className="text-[11px] text-amber-800/80 font-medium">
              Terkumpul di seluruh celengan target impian
            </span>
            <button
              type="button"
              onClick={onViewGoals || onOpenAddGoal}
              className="font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Lihat Celengan</span>
              <IoArrowForward className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
