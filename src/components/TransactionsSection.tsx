'use client';

import React, { useState } from 'react';
import { Transaction, TransactionType } from '@/types';
import { formatRupiah } from '@/lib/storage';
import { ClayCoin } from './Clay3DIcons';

interface TransactionsSectionProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onOpenAddModal: (defaultType?: TransactionType) => void;
  searchQuery: string;
  forcedType?: TransactionType | 'all';
}

export default function TransactionsSection({
  transactions,
  onDelete,
  onOpenAddModal,
  searchQuery,
  forcedType = 'all',
}: TransactionsSectionProps) {
  const [filterType, setFilterType] = useState<TransactionType | 'all'>(forcedType);

  const activeFilter = forcedType !== 'all' ? forcedType : filterType;

  const filtered = transactions.filter((tx) => {
    const matchesFilter =
      activeFilter === 'all' ? true : tx.type === activeFilter;
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-5 border border-amber-100/70 shadow-xs space-y-4">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-50">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            {activeFilter === 'income'
              ? 'Riwayat Pemasukan (Income)'
              : activeFilter === 'expense'
              ? 'Riwayat Pengeluaran (Expense)'
              : 'Daftar Transaksi Terkini'}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Total {filtered.length} catatan keuangan
          </p>
        </div>

        <div className="flex items-center gap-2">
          {forcedType === 'all' && (
            <div className="flex items-center gap-1 p-1 bg-amber-50/80 rounded-full text-xs font-semibold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-amber-800 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  filterType === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  filterType === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-700 hover:text-rose-900'
                }`}
              >
                Pengeluaran
              </button>
            </div>
          )}

          <button
            onClick={() => onOpenAddModal(activeFilter === 'all' ? 'expense' : activeFilter)}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-full shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            + Catat {activeFilter === 'income' ? 'Pemasukan' : activeFilter === 'expense' ? 'Pengeluaran' : 'Baru'}
          </button>
        </div>
      </div>

      {/* List of Transactions */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <div className="flex justify-center">
            <ClayCoin size={48} />
          </div>
          <div className="text-xs font-bold text-slate-600">
            Belum ada transaksi ditemukan.
          </div>
          <p className="text-[11px] text-slate-400">
            Klik tombol &quot;+ Catat Baru&quot; untuk menambahkan catatan keuangan pertamamu!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((tx) => {
            const isExpense = tx.type === 'expense';
            const sign = isExpense ? '-' : '+';
            const amountColor = isExpense ? 'text-rose-600' : 'text-emerald-600';
            const badgeBg = isExpense
              ? 'bg-rose-50 text-rose-700 border border-rose-100'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-100';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/30 border border-amber-100/60 hover:bg-amber-50/60 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl ${badgeBg}`}>
                    {isExpense ? 'Pengeluaran' : 'Pemasukan'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {tx.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {tx.date} • {tx.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-xs font-bold font-mono ${amountColor}`}>
                      {sign}{formatRupiah(tx.amount)}
                    </div>
                    <div className="text-[10px] font-bold text-amber-600">
                      +{tx.xpEarned} XP
                    </div>
                  </div>

                  {/* Clean delete button */}
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center text-xs transition cursor-pointer"
                    title="Hapus transaksi"
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
