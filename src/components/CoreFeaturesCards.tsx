'use client';

import React from 'react';
import { formatRupiah } from '@/lib/storage';

interface CoreFeaturesCardsProps {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  onOpenAddGoal: () => void;
}

export default function CoreFeaturesCards({
  totalIncome,
  totalExpense,
  totalSavings,
  onOpenAddIncome,
  onOpenAddExpense,
  onOpenAddGoal,
}: CoreFeaturesCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 tracking-tight">
          3 Fitur Utama Keuangan
        </h3>
        <span className="text-xs font-semibold text-slate-400">
          Ringkasan Bulan Ini
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Fitur 1: Pemasukan */}
        <div
          onClick={onOpenAddIncome}
          className="bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-100 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold">
              📈
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Pemasukan
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {formatRupiah(totalIncome)}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 group-hover:underline">
                + Tambah Pemasukan
              </div>
            </div>
          </div>
          <span className="text-slate-400 text-xs group-hover:translate-x-1 transition-transform">
            ➔
          </span>
        </div>

        {/* Fitur 2: Pengeluaran */}
        <div
          onClick={onOpenAddExpense}
          className="bg-rose-50/70 hover:bg-rose-50 border border-rose-100 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg font-bold">
              📉
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                Pengeluaran
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {formatRupiah(totalExpense)}
              </div>
              <div className="text-[10px] text-rose-600 font-semibold mt-0.5 group-hover:underline">
                - Catat Pengeluaran
              </div>
            </div>
          </div>
          <span className="text-slate-400 text-xs group-hover:translate-x-1 transition-transform">
            ➔
          </span>
        </div>

        {/* Fitur 3: Goals Tabungan */}
        <div
          onClick={onOpenAddGoal}
          className="bg-blue-50/70 hover:bg-blue-50 border border-blue-100 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">
              🎯
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                Goals Tabungan
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {formatRupiah(totalSavings)}
              </div>
              <div className="text-[10px] text-blue-600 font-semibold mt-0.5 group-hover:underline">
                + Buat Target Baru
              </div>
            </div>
          </div>
          <span className="text-slate-400 text-xs group-hover:translate-x-1 transition-transform">
            ➔
          </span>
        </div>
      </div>
    </div>
  );
}

