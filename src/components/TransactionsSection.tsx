'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Transaction, TransactionType, Category, CustomCategory, DEFAULT_CATEGORIES } from '@/types';
import { formatRupiah } from '@/lib/storage';
import {
  IoWalletOutline,
  IoTrashOutline,
  IoPencil,
  IoFilter,
  IoChevronBack,
  IoChevronForward,
  IoCheckmark,
  IoClose,
} from 'react-icons/io5';

interface TransactionsSectionProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
  onOpenAddModal: (defaultType?: TransactionType) => void;
  searchQuery: string;
  forcedType?: TransactionType | 'all';
  customCategories?: CustomCategory[];
  onOpenManageCategories?: () => void;
  monthFilter?: string; // Format YYYY-MM
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
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
  monthFilter,
  onPrevMonth,
  onNextMonth,
}: TransactionsSectionProps) {
  const [filterType, setFilterType] = useState<TransactionType | 'all'>(forcedType);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Filter Rentang Jumlah
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  // Dropdown "Filter by" popup state
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'category' | 'range'>('category');
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const activeFilter = forcedType !== 'all' ? forcedType : filterType;

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    if (isFilterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterMenuOpen]);

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

  // Format Nama Bulan (Contoh: "Oktober 2026")
  const formatMonthTitle = (mStr?: string) => {
    if (!mStr) return '';
    try {
      const [year, month] = mStr.split('-');
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    } catch {
      return mStr;
    }
  };

  // Filter Data Transaksi
  const filtered = transactions.filter((tx) => {
    // 1. Month scope filter
    if (monthFilter && !tx.date.startsWith(monthFilter)) {
      return false;
    }

    // 2. Type Filter
    const matchesFilter = activeFilter === 'all' ? true : tx.type === activeFilter;
    if (!matchesFilter) return false;

    // 3. Category Filter
    if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
      return false;
    }

    // 4. Amount Range Filter
    const numAmount = Number(tx.amount) || 0;
    if (minAmount && numAmount < Number(minAmount)) {
      return false;
    }
    if (maxAmount && numAmount > Number(maxAmount)) {
      return false;
    }

    // 5. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tx.title.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const isFiltered = selectedCategory !== 'all' || Boolean(minAmount) || Boolean(maxAmount);

  const resetFilters = () => {
    setSelectedCategory('all');
    setMinAmount('');
    setMaxAmount('');
    setIsFilterMenuOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          {activeFilter === 'income'
            ? 'RIWAYAT PEMASUKAN'
            : activeFilter === 'expense'
            ? 'RIWAYAT PENGELUARAN'
            : 'DAFTAR TRANSAKSI'}
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

          {/* 1. Tombol "Filter by" dengan Pop-up Kategori & Rentang Jumlah */}
          <div className="relative" ref={filterMenuRef}>
            <button
              type="button"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 transition cursor-pointer ${
                isFiltered || isFilterMenuOpen
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <IoFilter className="text-sm text-amber-600" />
              <span>Filter by</span>
              {isFiltered && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Pop-up Dialog Filter */}
            {isFilterMenuOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 bg-white rounded-2xl border-2 border-slate-200 shadow-xl z-30 p-3 space-y-3 animate-fade-in">
                {/* Tabs Kategori vs Rentang */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => setActiveFilterTab('category')}
                    className={`py-1.5 rounded-lg transition cursor-pointer ${
                      activeFilterTab === 'category'
                        ? 'bg-white text-slate-800 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Kategori
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilterTab('range')}
                    className={`py-1.5 rounded-lg transition cursor-pointer ${
                      activeFilterTab === 'range'
                        ? 'bg-white text-slate-800 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Rentang
                  </button>
                </div>

                {/* Tab Konten 1: Kategori */}
                {activeFilterTab === 'category' && (
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-left transition cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-amber-50 text-amber-700'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>Semua Kategori</span>
                      {selectedCategory === 'all' && <IoCheckmark className="text-base text-amber-600" />}
                    </button>
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-left transition cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-amber-50 text-amber-700'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {selectedCategory === cat && <IoCheckmark className="text-base text-amber-600" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab Konten 2: Rentang Jumlah */}
                {activeFilterTab === 'range' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                        Jumlah Minimal (Rp)
                      </label>
                      <input
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        placeholder="Contoh: 10000"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                        Jumlah Maksimal (Rp)
                      </label>
                      <input
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Contoh: 500000"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                {/* Footer Pop-up: Reset & Tutup */}
                <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-extrabold text-rose-500 hover:text-rose-600 cursor-pointer"
                  >
                    Reset Filter
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterMenuOpen(false)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase rounded-lg border-b-2 border-amber-600 active:border-b-0 transition cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Navigator Bulan di Samping Tombol Filter (Bisa Diklik Kiri dan Kanan) */}
          {monthFilter && onPrevMonth && onNextMonth && (
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={onPrevMonth}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs"
                title="Bulan sebelumnya"
              >
                <IoChevronBack className="text-xs" />
              </button>
              <span className="text-xs font-extrabold text-slate-800 px-2 min-w-[95px] text-center capitalize">
                {formatMonthTitle(monthFilter)}
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

          {/* Indikator Reset Cepat saat Terfilter */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="text-xs font-extrabold text-rose-500 hover:text-rose-600 px-2 py-1 cursor-pointer flex items-center gap-0.5"
              title="Reset semua filter aktif"
            >
              <IoClose className="text-sm" />
              <span>Reset</span>
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
            {isFiltered
              ? 'Tidak ada transaksi yang cocok dengan filter'
              : 'Belum ada transaksi di bulan ini'}
          </div>
          {isFiltered ? (
            <button
              onClick={resetFilters}
              className="mt-1 inline-block text-xs font-extrabold text-amber-600 hover:text-amber-700 underline cursor-pointer"
            >
              Reset Filter
            </button>
          ) : forcedType === 'all' ? (
            <button
              onClick={() => onOpenAddModal('expense')}
              className="mt-1 inline-block px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer"
            >
              + Catat Sekarang
            </button>
          ) : null}
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
