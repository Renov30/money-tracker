'use client';

import React, { useState } from 'react';
import { Transaction, TransactionType } from '@/types';
import { formatRupiah } from '@/lib/storage';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  searchQuery: string;
}

export default function TransactionList({
  transactions,
  onDelete,
  searchQuery,
}: TransactionListProps) {
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

  const filtered = transactions.filter((tx) => {
    const matchesFilter =
      filterType === 'all' ? true : tx.type === filterType;
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
          Riwayat Pencatatan Keuangan
        </h3>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              filterType === 'expense'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-rose-600'
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              filterType === 'income'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            Pemasukan
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs">
          Belum ada transaksi yang sesuai.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((tx) => {
            const isExpense = tx.type === 'expense';
            const sign = isExpense ? '-' : '+';
            const amountColor = isExpense ? 'text-rose-600' : 'text-emerald-600';
            const badgeBg = isExpense ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${badgeBg}`}>
                    {isExpense ? 'Keluar' : 'Masuk'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {tx.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tx.date} • {tx.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-xs font-bold font-mono ${amountColor}`}>
                      {sign}{formatRupiah(tx.amount)}
                    </div>
                    <div className="text-[10px] font-bold text-amber-500">
                      +{tx.xpEarned} XP
                    </div>
                  </div>

                  {/* Clean delete button */}
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="text-slate-300 hover:text-rose-500 text-xs p-1 rounded transition cursor-pointer"
                    title="Hapus Transaksi"
                  >
                    ✕
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

