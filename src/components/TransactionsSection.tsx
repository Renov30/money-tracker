'use client';

import React, { useState } from 'react';
import { Transaction, TransactionType, Category, CustomCategory, DEFAULT_CATEGORIES } from '@/types';
import { formatRupiah } from '@/lib/storage';
import { IoWalletOutline, IoTrashOutline, IoPencil, IoFilter, IoPricetagsOutline } from 'react-icons/io5';
import CustomDropdown, { DropdownOption } from './CustomDropdown';

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

  const categoryDropdownOptions: (string | DropdownOption)[] = [
    { value: 'all', label: 'Semua Kategori' },
    ...availableCategories.map((cat) => ({ value: cat, label: cat })),
    ...(onOpenManageCategories
      ? [{ value: '__MANAGE__', label: '⚙️ Kelola Kategori...', isAction: true }]
      : []),
  ];

  const datePresetOptions: DropdownOption[] = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'today', label: 'Hari Ini' },
    { value: '7days', label: '7 Hari' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'custom', label: 'Pilih Tanggal' },
  ];

  const filtered = transactions.filter((tx) => {
    const matchesFilter = activeFilter === 'all' ? true : tx.type === activeFilter;
    if (!matchesFilter) return false;

    if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tx.title.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

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
    <div className="space-y-3">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          {activeFilter === 'income'
            ? 'RIWAYAT PEMASUKAN'
            : activeFilter === 'expense'
            ? 'RIWAYAT PENGELUARAN'
            : 'TRANSAKSI TERKINI'}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Toggle only on Home Tab */}
          {forcedType === 'all' && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-extrabold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterType === 'income'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-500 hover:text-emerald-600'
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterType === 'expense'
                    ? 'bg-rose-500 text-white'
                    : 'text-slate-500 hover:text-rose-600'
                }`}
              >
                Keluar
              </button>
            </div>
          )}

          {/* Filter Kategori */}
          <CustomDropdown
            value={selectedCategory}
            onChange={(val) => {
              if (val === '__MANAGE__') {
                onOpenManageCategories?.();
              } else {
                setSelectedCategory(val);
              }
            }}
            options={categoryDropdownOptions}
            variant="pill"
            prefixIcon={<IoFilter className="text-amber-600 text-xs shrink-0" />}
          />

          {/* Filter Waktu */}
          <CustomDropdown
            value={dateFilterPreset}
            onChange={(val) => setDateFilterPreset(val as any)}
            options={datePresetOptions}
            variant="pill"
          />

          {dateFilterPreset === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="bg-white border-2 border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
            />
          )}

          {/* Kelola Kategori Button (Flat Duolingo Pill) */}
          {onOpenManageCategories && (
            <button
              type="button"
              onClick={onOpenManageCategories}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border-2 border-amber-200 rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer"
            >
              <IoPricetagsOutline className="text-sm" />
              <span>Kategori</span>
            </button>
          )}

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-xs font-extrabold text-rose-500 hover:text-rose-600 px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* List of Transactions */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center space-y-2">
          <div className="flex justify-center text-slate-300">
            <IoWalletOutline className="text-4xl" />
          </div>
          <div className="text-sm font-extrabold text-slate-600">
            Belum ada transaksi
          </div>
          {forcedType === 'all' && (
            <button
              onClick={() => onOpenAddModal('expense')}
              className="mt-1 inline-block px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer"
            >
              + Catat Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => {
            const isExpense = tx.type === 'expense';
            const sign = isExpense ? '-' : '+';
            const amountColor = isExpense ? 'text-rose-500' : 'text-emerald-500';
            const badgeBg = isExpense
              ? 'bg-rose-50 text-rose-600 border-2 border-rose-200'
              : 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl ${badgeBg}`}>
                    {isExpense ? 'Keluar' : 'Masuk'}
                  </span>
                  <div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {tx.title}
                    </div>
                    <div className="text-xs text-slate-400 font-bold">
                      {tx.category} • {tx.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`text-sm font-black ${amountColor}`}>
                    {sign}{formatRupiah(tx.amount)}
                  </div>

                  <div className="flex items-center gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(tx)}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                        title="Edit"
                      >
                        <IoPencil className="text-sm" />
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(tx.id)}
                      className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition cursor-pointer"
                      title="Hapus"
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
