'use client';

import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, CustomCategory } from '@/types';
import { storage, formatRupiah } from '@/lib/storage';
import WallabyMascot from './WallabyMascot';
import {
  IoTrendingDown,
  IoTrendingUp,
  IoPencil,
  IoAlertCircle,
  IoClose,
  IoAdd,
  IoRefreshOutline,
  IoCalendarOutline,
  IoArrowUp,
  IoArrowDown,
  IoChevronDown,
  IoChevronUp,
} from 'react-icons/io5';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'xpEarned'>) => void;
  onUpdateTransaction?: (tx: Transaction) => void;
  editingTransaction?: Transaction | null;
  initialType?: TransactionType;
  customCategories?: CustomCategory[];
  onOpenManageCategories?: () => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction = null,
  initialType = 'expense',
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  // Custom Amount Presets state
  const [amountPresets, setAmountPresets] = useState<number[]>([]);
  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [newPresetValue, setNewPresetValue] = useState('');
  const [isManagingPresets, setIsManagingPresets] = useState(false);
  const [presetError, setPresetError] = useState<string | null>(null);

  // Category Presets state (In-modal management)
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsAddingPreset(false);
      setIsManagingPresets(false);
      setNewPresetValue('');
      setPresetError(null);

      setIsManagingCategories(false);
      setIsAddingCategory(false);
      setNewCategoryName('');
      setCategoryError(null);
      setShowAllCategories(false);

      const presets = storage.getAmountPresets(type);
      setAmountPresets(presets);

      const cats = storage.getCategoryList(type);
      setCategoriesList(cats);

      if (editingTransaction) {
        setType(editingTransaction.type);
        setAmount(editingTransaction.amount.toString());
        setTitle(editingTransaction.title);
        setCategory(editingTransaction.category);
        setDate(editingTransaction.date || new Date().toISOString().split('T')[0]);
      } else {
        setType(initialType);
        setAmount('');
        setTitle('');
        const defaultCat = cats.length > 0 ? cats[0] : (initialType === 'income' ? 'Gaji & Usaha' : 'Makanan & Minuman');
        setCategory(defaultCat);
        setDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, initialType, editingTransaction]);

  // Update presets & categories whenever type changes
  useEffect(() => {
    if (isOpen) {
      setAmountPresets(storage.getAmountPresets(type));
      setIsAddingPreset(false);
      setPresetError(null);

      const cats = storage.getCategoryList(type);
      setCategoriesList(cats);
      setIsAddingCategory(false);
      setCategoryError(null);

      if (!editingTransaction && cats.length > 0) {
        setCategory(cats[0]);
      }
    }
  }, [type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (!numAmount || numAmount <= 0) {
      setError('Nominal harus lebih besar dari 0.');
      return;
    }

    if (!category) {
      setError('Pilih minimal satu kategori transaksi.');
      return;
    }

    if (!date) {
      setError('Tanggal transaksi wajib dipilih.');
      return;
    }

    setError(null);

    if (editingTransaction && onUpdateTransaction) {
      onUpdateTransaction({
        ...editingTransaction,
        title: title.trim() || (type === 'expense' ? 'Pengeluaran' : 'Pemasukan'),
        amount: numAmount,
        type,
        category,
        date,
      });
    } else {
      onAddTransaction({
        title: title.trim() || (type === 'expense' ? 'Pengeluaran' : 'Pemasukan'),
        amount: numAmount,
        type,
        category,
        date,
      });
    }

    setAmount('');
    setTitle('');
    onClose();
  };

  const handleChip = (val: number) => {
    setAmount(val.toString());
  };

  // Preset Nominal Handlers
  const handleAddPreset = () => {
    const raw = parseInt(newPresetValue.replace(/\D/g, ''), 10);
    if (!raw || raw <= 0) {
      setPresetError('Nominal harus lebih dari 0.');
      return;
    }
    if (amountPresets.includes(raw)) {
      setPresetError(`Nominal ${formatRupiah(raw)} sudah ada di daftar.`);
      return;
    }
    const updated = [...amountPresets, raw].sort((a, b) => a - b);
    setAmountPresets(updated);
    storage.saveAmountPresets(type, updated);
    setAmount(raw.toString());
    setNewPresetValue('');
    setIsAddingPreset(false);
    setPresetError(null);
  };

  const handleDeletePreset = (valToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = amountPresets.filter((v) => v !== valToDelete);
    setAmountPresets(updated);
    storage.saveAmountPresets(type, updated);
  };

  const handleResetPresets = () => {
    const defaults = storage.resetAmountPresets(type);
    setAmountPresets(defaults);
  };

  const formatChipLabel = (val: number) => {
    if (val >= 1000000) {
      const jt = val / 1000000;
      return `${Number.isInteger(jt) ? jt : jt.toFixed(1).replace('.0', '')}jt`;
    }
    if (val >= 1000) {
      const k = val / 1000;
      return `${Number.isInteger(k) ? k : k.toFixed(1).replace('.0', '')}k`;
    }
    return val.toLocaleString('id-ID');
  };

  // Category Handlers (Inline Manage, Add, Delete, Reorder)
  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryError('Nama kategori tidak boleh kosong.');
      return;
    }
    if (trimmed.length > 20) {
      setCategoryError('Maksimal 20 karakter.');
      return;
    }
    if (categoriesList.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setCategoryError(`Kategori "${trimmed}" sudah ada.`);
      return;
    }

    const updated = [trimmed, ...categoriesList]; // Masuk ke urutan pertama
    setCategoriesList(updated);
    storage.saveCategoryList(type, updated);
    setCategory(trimmed);
    setNewCategoryName('');
    setIsAddingCategory(false);
    setCategoryError(null);
  };

  const handleDeleteCategory = (catToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categoriesList.length <= 1) {
      setCategoryError('Harus ada minimal 1 kategori.');
      return;
    }
    const updated = categoriesList.filter((c) => c !== catToDelete);
    setCategoriesList(updated);
    storage.saveCategoryList(type, updated);
    if (category === catToDelete) {
      setCategory(updated[0]);
    }
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoriesList.length) return;

    const updated = [...categoriesList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setCategoriesList(updated);
    storage.saveCategoryList(type, updated);
  };

  const handleResetCategories = () => {
    const defaults = storage.resetCategoryList(type);
    setCategoriesList(defaults);
    if (defaults.length > 0 && !defaults.includes(category)) {
      setCategory(defaults[0]);
    }
    setCategoryError(null);
  };

  // Potong tampilan teks kategori agar tidak kepanjangan
  const truncateCategory = (name: string, maxLen = 14) => {
    if (name.length <= maxLen) return name;
    return `${name.substring(0, maxLen)}…`;
  };

  const isEditing = Boolean(editingTransaction);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-2xl p-6 border-2 border-slate-200 shadow-xl relative space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Duolingo style */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2.5">
            {isEditing ? (
              <div className="w-9 h-9 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600">
                <IoPencil className="text-lg" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                <WallabyMascot size={26} mood="happy" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                {isEditing ? 'Ubah Catatan Keuangan' : `Catat ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border-2 border-rose-200 rounded-xl text-xs text-rose-600 font-bold">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Type Toggle Pills (Duolingo style) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-extrabold">
          <button
            type="button"
            onClick={() => {
              setType('expense');
            }}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 uppercase ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-rose-600'
            }`}
          >
            <IoTrendingDown className="text-base" />
            <span>Pengeluaran</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
            }}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 uppercase ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            <IoTrendingUp className="text-base" />
            <span>Pemasukan</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Nominal */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Nominal (Rupiah)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-black text-slate-400">
                Rp
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="35000"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-800 font-black text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Quick Chips Nominal Controls */}
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Nominal Cepat:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsManagingPresets(!isManagingPresets)}
                    className={`text-[11px] font-extrabold transition cursor-pointer flex items-center gap-0.5 ${
                      isManagingPresets
                        ? 'text-rose-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>{isManagingPresets ? 'Selesai' : 'Kelola'}</span>
                  </button>
                  {isManagingPresets && (
                    <button
                      type="button"
                      onClick={handleResetPresets}
                      className="text-[11px] font-extrabold text-slate-400 hover:text-amber-600 transition cursor-pointer flex items-center gap-0.5"
                    >
                      <IoRefreshOutline className="text-xs" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Custom Preset Creator */}
              {isAddingPreset && (
                <div className="p-2.5 bg-amber-50 border-2 border-amber-200 rounded-xl space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-amber-800">
                      Tambah Nominal ({type === 'income' ? 'Pemasukan' : 'Pengeluaran'}):
                    </span>
                    {presetError && (
                      <span className="text-[10px] text-rose-600 font-bold">{presetError}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1.5 text-xs font-bold text-amber-700">Rp</span>
                      <input
                        type="number"
                        value={newPresetValue}
                        onChange={(e) => setNewPresetValue(e.target.value)}
                        placeholder={type === 'income' ? '1500000' : '75000'}
                        className="w-full bg-white border-2 border-amber-200 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-800 font-black focus:outline-none focus:border-amber-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPreset();
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPreset}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase rounded-lg border-b-2 border-amber-600 active:border-b-0 transition cursor-pointer shrink-0"
                    >
                      Tambah
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPreset(false);
                        setPresetError(null);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-lg transition cursor-pointer shrink-0"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* Chips List Nominal */}
              <div className="flex gap-1.5 flex-wrap">
                {amountPresets.map((chip) => {
                  const isSelected = amount === chip.toString();
                  return (
                    <div key={chip} className="relative inline-flex items-center">
                      <button
                        type="button"
                        onClick={() => handleChip(chip)}
                        className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border-2 transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        } ${isManagingPresets ? 'pr-1.5' : ''}`}
                      >
                        <span>{formatChipLabel(chip)}</span>
                        {isManagingPresets && (
                          <span
                            onClick={(e) => handleDeletePreset(chip, e)}
                            className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] ml-1 transition"
                            title="Hapus nominal"
                          >
                            <IoClose className="text-xs" />
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
                {!isAddingPreset && (
                  <button
                    type="button"
                    onClick={() => setIsAddingPreset(true)}
                    className="text-xs font-extrabold px-2.5 py-1.5 border-2 border-dashed border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl transition cursor-pointer flex items-center gap-0.5"
                  >
                    <IoAdd className="text-xs" />
                    <span>Nominal</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Kategori (Tepat setelah nominal cepat, format chips, 2 baris batas, inline manage) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Kategori {category && `(${category})`}:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsManagingCategories(!isManagingCategories)}
                  className={`text-[11px] font-extrabold transition cursor-pointer flex items-center gap-0.5 ${
                    isManagingCategories
                      ? 'text-rose-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span>{isManagingCategories ? 'Selesai' : 'Kelola'}</span>
                </button>
                {isManagingCategories && (
                  <button
                    type="button"
                    onClick={handleResetCategories}
                    className="text-[11px] font-extrabold text-slate-400 hover:text-amber-600 transition cursor-pointer flex items-center gap-0.5"
                    title="Kembalikan kategori default"
                  >
                    <IoRefreshOutline className="text-xs" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inline Custom Category Creator */}
            {isAddingCategory && (
              <div className="p-2.5 bg-amber-50 border-2 border-amber-200 rounded-xl space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-amber-800">
                    Tambah Kategori ({type === 'income' ? 'Pemasukan' : 'Pengeluaran'}):
                  </span>
                  {categoryError && (
                    <span className="text-[10px] text-rose-600 font-bold">{categoryError}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={20}
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Maks. 20 karakter"
                      className="w-full bg-white border-2 border-amber-200 rounded-lg px-3 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    <span className="absolute right-2 top-1 text-[9px] text-slate-400">
                      {newCategoryName.length}/20
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase rounded-lg border-b-2 border-amber-600 active:border-b-0 transition cursor-pointer shrink-0"
                  >
                    Tambah
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setCategoryError(null);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-lg transition cursor-pointer shrink-0"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Chips List Kategori dengan Batas 2 Baris (max-h-[82px] overflow-hidden jika tidak showAll) */}
            <div
              className={`flex gap-1.5 flex-wrap transition-all duration-200 ${
                showAllCategories || isManagingCategories
                  ? 'max-h-none'
                  : 'max-h-[82px] overflow-hidden'
              }`}
            >
              {categoriesList.map((cat, idx) => {
                const isSelected = category === cat;
                return (
                  <div key={cat} className="relative inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => setCategory(cat)}
                      title={cat}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border-2 transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      } ${isManagingCategories ? 'pr-1.5' : ''}`}
                    >
                      <span className="max-w-[130px] truncate">{truncateCategory(cat)}</span>

                      {/* Controls saat Kelola: Naik, Turun, Hapus */}
                      {isManagingCategories && (
                        <div className="flex items-center gap-0.5 ml-1">
                          {idx > 0 && (
                            <span
                              onClick={(e) => handleMoveCategory(idx, 'up', e)}
                              className="w-4 h-4 rounded-full bg-slate-200 hover:bg-amber-400 text-slate-700 flex items-center justify-center text-[9px] transition"
                              title="Pindah ke depan"
                            >
                              <IoArrowUp />
                            </span>
                          )}
                          {idx < categoriesList.length - 1 && (
                            <span
                              onClick={(e) => handleMoveCategory(idx, 'down', e)}
                              className="w-4 h-4 rounded-full bg-slate-200 hover:bg-amber-400 text-slate-700 flex items-center justify-center text-[9px] transition"
                              title="Pindah ke belakang"
                            >
                              <IoArrowDown />
                            </span>
                          )}
                          <span
                            onClick={(e) => handleDeleteCategory(cat, e)}
                            className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] transition ml-0.5"
                            title="Hapus kategori"
                          >
                            <IoClose />
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}

              {!isAddingCategory && (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="text-xs font-extrabold px-2.5 py-1.5 border-2 border-dashed border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl transition cursor-pointer flex items-center gap-0.5"
                >
                  <IoAdd className="text-xs" />
                  <span>Kategori</span>
                </button>
              )}
            </div>

            {/* Tombol Lihat Lebih Banyak / Sedikit jika kategori panjang */}
            {!isManagingCategories && categoriesList.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-[11px] font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 pt-0.5 cursor-pointer"
              >
                <span>{showAllCategories ? 'Tampilkan Lebih Sedikit' : `Lihat Lebih Banyak (${categoriesList.length} kategori)`}</span>
                {showAllCategories ? <IoChevronUp className="text-xs" /> : <IoChevronDown className="text-xs" />}
              </button>
            )}
          </div>

          {/* 3. Tanggal Transaksi (Default Hari Ini) */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Tanggal Transaksi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoCalendarOutline className="text-base text-amber-600" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Keterangan */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Keterangan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'income' ? 'Contoh: Gaji, Bonus, Freelance' : 'Contoh: Makan Siang, Bensin'}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Submit Button Duolingo 3D */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer"
            >
              {isEditing ? 'SIMPAN PERUBAHAN' : 'CATAT TRANSAKSI (+25 XP)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
