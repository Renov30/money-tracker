'use client';

import React, { useState } from 'react';
import { Transaction, TransactionType, Category, CustomCategory, DEFAULT_CATEGORIES } from '@/types';
import { formatRupiah } from '@/lib/storage';
import { IoWalletOutline, IoTrashOutline, IoPencil, IoFilter, IoPricetagsOutline } from 'react-icons/io5';

interface TransactionsSectionProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
  onOpenAddModal: (defaultType?: TransactionType) => void;
  searchQuery: string;
  forcedType?: TransactionType | 'all';
  customCategories?: CustomCategory[];
  onOpenManageCategories?: () => void;
}

export default function TransactionsSection({
  transactions,
  onDelete,
  onEdit,
  onOpenAddModal,
  searchQuery,
  forcedType = 'all',
  customCategories = [],
  onOpenManageCategories,
}: TransactionsSectionProps) {
  const [filterType, setFilterType] = useState<TransactionType | 'all'>(forcedType);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFilterPreset, setDateFilterPreset] = useState<'all' | 'today' | '7days' | 'month' | 'custom'>('all');
  const [customDate, setCustomDate] = useState<string>('');

  const activeFilter = forcedType !== 'all' ? forcedType : filterType;

  // Filter Categories available based on active type including custom categories
  const customNames = customCategories
    .filter((c) => activeFilter === 'all' || c.type === activeFilter)
    .map((c) => c.name);

  const baseCategories =
    activeFilter === 'income'
      ? DEFAULT_CATEGORIES.income
      : activeFilter === 'expense'
      ? DEFAULT_CATEGORIES.expense
      : Array.from(new Set([...DEFAULT_CATEGORIES.income, ...DEFAULT_CATEGORIES.expense]));

  const txCategories = transactions
    .filter((tx) => activeFilter === 'all' || tx.type === activeFilter)
    .map((tx) => tx.category);

  const availableCategories: Category[] = Array.from(
    new Set([...baseCategories, ...customNames, ...txCategories])
  );

  // Filtering transactions
  const filtered = transactions.filter((tx) => {
    // 1. Type Filter
    const matchesFilter = activeFilter === 'all' ? true : tx.type === activeFilter;
    if (!matchesFilter) return false;

    // 2. Category Filter
    if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
      return false;
    }

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tx.title.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // 4. Date Filter
    if (dateFilterPreset !== 'all') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      if (dateFilterPreset === 'today') {
        if (tx.date !== todayStr) return false;
      } else if (dateFilterPreset === '7days') {
        const txTime = new Date(tx.date).getTime();
        const nowTime = today.getTime();
        const diffDays = (nowTime - txTime) / (1000 * 60 * 60 * 24);
        if (diffDays > 7 || diffDays < 0) return false;
      } else if (dateFilterPreset === 'month') {
        const txMonth = tx.date.slice(0, 7);
        const curMonth = todayStr.slice(0, 7);
        if (txMonth !== curMonth) return false;
      } else if (dateFilterPreset === 'custom' && customDate) {
        if (tx.date !== customDate) return false;
      }
    }

    return true;
  });

  const isFiltered = selectedCategory !== 'all' || dateFilterPreset !== 'all';

  const resetFilters = () => {
    setSelectedCategory('all');
    setDateFilterPreset('all');
    setCustomDate('');
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-amber-100/70 shadow-xs space-y-4">
      
      {/* Header and Filter Controls (Sejajar dengan Judul) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-amber-50">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            {activeFilter === 'income'
              ? 'Riwayat Pemasukan (Income)'
              : activeFilter === 'expense'
              ? 'Riwayat Pengeluaran (Expense)'
              : 'Daftar Transaksi Terkini'}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Menampilkan {filtered.length} dari total {transactions.length} catatan
          </p>
        </div>

        {/* Filter Controls (Sejajar dengan Judul) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Toggle only on Home Tab */}
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

          {/* 1. Filter (Kategori) */}
          <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-200/80 rounded-full px-3 py-1.5">
            <IoFilter className="text-amber-700 text-xs shrink-0" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Filter:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                if (e.target.value === '__MANAGE__') {
                  onOpenManageCategories?.();
                } else {
                  setSelectedCategory(e.target.value);
                }
              }}
              className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">Semua Kategori</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__MANAGE__">⚙️ Kelola Kategori...</option>
            </select>
          </div>

          {/* 2. Filter Waktu (Tanggal) */}
          <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-200/80 rounded-full px-3 py-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Waktu:
            </span>
            <select
              value={dateFilterPreset}
              onChange={(e) => setDateFilterPreset(e.target.value as any)}
              className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">Semua Tanggal</option>
              <option value="today">Hari Ini</option>
              <option value="7days">7 Hari Terakhir</option>
              <option value="month">Bulan Ini</option>
              <option value="custom">Pilih Tanggal...</option>
            </select>
          </div>

          {dateFilterPreset === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="bg-amber-50/70 border border-amber-200/80 text-slate-800 text-xs font-bold rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer"
            />
          )}

          {/* 3. Kelola Kategori Button */}
          {onOpenManageCategories && (
            <button
              type="button"
              onClick={onOpenManageCategories}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
              title="Buka Manajemen Kategori"
            >
              <IoPricetagsOutline className="text-sm" />
              <span>Kelola Kategori</span>
            </button>
          )}

          {/* Reset Filters button if any active */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200/60 px-2.5 py-1.5 rounded-full transition cursor-pointer active:scale-95"
            >
              ✕ Reset
            </button>
          )}

          {/* + Catat button only shown on Home tab */}
          {forcedType === 'all' && (
            <button
              onClick={() => onOpenAddModal(filterType === 'all' ? 'expense' : filterType)}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-full shadow-xs transition active:scale-95 cursor-pointer shrink-0"
            >
              + Catat Baru
            </button>
          )}
        </div>
      </div>

      {/* List of Transactions */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <div className="flex justify-center text-amber-500">
            <IoWalletOutline className="text-5xl" />
          </div>
          <div className="text-xs font-bold text-slate-600">
            {isFiltered
              ? 'Tidak ada transaksi dengan filter yang dipilih.'
              : 'Belum ada transaksi ditemukan.'}
          </div>
          <p className="text-[11px] text-slate-400">
            {isFiltered
              ? 'Coba ganti kategori atau rentang tanggal filter di atas.'
              : 'Gunakan tombol catat di atas untuk menambahkan transaksi pertamamu!'}
          </p>
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="mt-2 text-xs font-bold text-amber-700 underline cursor-pointer"
            >
              Reset semua filter
            </button>
          )}
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

                  {/* Action buttons: Edit and Trash */}
                  <div className="flex items-center gap-1.5">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(tx)}
                        className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100/90 text-amber-700 flex items-center justify-center transition active:scale-90 cursor-pointer shadow-xs border border-amber-200/60"
                        title="Edit transaksi"
                      >
                        <IoPencil className="text-sm" />
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(tx.id)}
                      className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition active:scale-90 cursor-pointer shadow-xs border border-rose-200/60"
                      title="Hapus transaksi"
                    >
                      <IoTrashOutline className="text-base" />
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

