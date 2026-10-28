'use client';

import React, { useState, useEffect } from 'react';
import { Category, Transaction, TransactionType, CustomCategory, DEFAULT_CATEGORIES } from '@/types';
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
  IoPricetagsOutline,
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
  customCategories = [],
  onOpenManageCategories,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Category>('Makanan & Minuman');
  const [error, setError] = useState<string | null>(null);

  // Custom Amount Presets state
  const [amountPresets, setAmountPresets] = useState<number[]>([]);
  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [newPresetValue, setNewPresetValue] = useState('');
  const [isManagingPresets, setIsManagingPresets] = useState(false);
  const [presetError, setPresetError] = useState<string | null>(null);

  // Combine default categories with custom categories for current type
  const typeCustomCats = customCategories
    .filter((c) => c.type === type)
    .map((c) => c.name);
  const allCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES[type], ...typeCustomCats])
  );

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsAddingPreset(false);
      setIsManagingPresets(false);
      setNewPresetValue('');
      setPresetError(null);
      setAmountPresets(storage.getAmountPresets(type));

      if (editingTransaction) {
        setType(editingTransaction.type);
        setAmount(editingTransaction.amount.toString());
        setTitle(editingTransaction.title);
        setCategory(editingTransaction.category);
      } else {
        setType(initialType);
        setAmount('');
        setTitle('');
        setCategory(initialType === 'income' ? 'Gaji & Usaha' : 'Makanan & Minuman');
      }
    }
  }, [isOpen, initialType, editingTransaction]);

  // Update presets whenever type changes
  useEffect(() => {
    if (isOpen) {
      setAmountPresets(storage.getAmountPresets(type));
      setIsAddingPreset(false);
      setPresetError(null);
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

    setError(null);

    if (editingTransaction && onUpdateTransaction) {
      onUpdateTransaction({
        ...editingTransaction,
        title: title.trim() || (type === 'expense' ? 'Pengeluaran' : 'Pemasukan'),
        amount: numAmount,
        type,
        category,
      });
    } else {
      onAddTransaction({
        title: title.trim() || (type === 'expense' ? 'Pengeluaran' : 'Pemasukan'),
        amount: numAmount,
        type,
        category,
        date: new Date().toISOString().split('T')[0],
      });
    }

    setAmount('');
    setTitle('');
    onClose();
  };

  const handleChip = (val: number) => {
    setAmount(val.toString());
  };

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

  const isEditing = Boolean(editingTransaction);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
        
        {/* Header with mini mascot or edit icon */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {isEditing ? (
              <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs text-amber-600">
                <IoPencil className="text-lg" />
              </div>
            ) : (
              <WallabyMascot size={34} mood="happy" />
            )}
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {isEditing ? 'Ubah Catatan Keuangan' : `Catat ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'} (+25 XP)`}
              </h3>
              {isEditing && (
                <p className="text-[10px] text-amber-700 font-medium">Perbarui rincian transaksi</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-xs transition cursor-pointer"
          >
            <IoClose className="text-base" />
          </button>
        </div>

        {/* In-Form Error Alert (Custom, No Browser alert) */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold animate-pulse">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Type Toggle Pills */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-slate-100 rounded-full">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('Makanan & Minuman');
            }}
            className={`py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <IoTrendingDown className="text-base" />
            <span>Pengeluaran</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('Gaji & Usaha');
            }}
            className={`py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <IoTrendingUp className="text-base" />
            <span>Pemasukan</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal (Rupiah)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="35000"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            {/* Quick Chips & Custom Amount Controls */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500">
                  Nominal Default / Cepat:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingPreset(!isAddingPreset);
                      setPresetError(null);
                    }}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 transition cursor-pointer flex items-center gap-0.5"
                    title="Tambah nominal default baru"
                  >
                    <IoAdd className="text-xs" />
                    <span>{isAddingPreset ? 'Batal' : '+ Nominal'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManagingPresets(!isManagingPresets)}
                    className={`text-[11px] font-semibold transition cursor-pointer flex items-center gap-0.5 ${
                      isManagingPresets
                        ? 'text-rose-600 font-bold'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Kelola & hapus nominal default"
                  >
                    <span>{isManagingPresets ? 'Selesai' : 'Kelola'}</span>
                  </button>
                  {isManagingPresets && (
                    <button
                      type="button"
                      onClick={handleResetPresets}
                      className="text-[11px] font-semibold text-slate-400 hover:text-amber-700 transition cursor-pointer flex items-center gap-0.5"
                      title="Kembalikan ke nominal standar"
                    >
                      <IoRefreshOutline className="text-xs" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Custom Preset Creator */}
              {isAddingPreset && (
                <div className="mb-2 p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-900">
                      Tambah Nominal Default ({type === 'income' ? 'Pemasukan' : 'Pengeluaran'}):
                    </span>
                    {presetError && (
                      <span className="text-[10px] text-rose-600 font-semibold">{presetError}</span>
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
                        className="w-full bg-white border border-amber-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
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
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              )}

              {/* Chips List */}
              <div className="flex gap-1.5 flex-wrap">
                {amountPresets.map((chip) => {
                  const isSelected = amount === chip.toString();
                  return (
                    <div key={chip} className="relative inline-flex items-center">
                      <button
                        type="button"
                        onClick={() => handleChip(chip)}
                        title={formatRupiah(chip)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs font-bold ring-2 ring-amber-400/40'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/50'
                        } ${isManagingPresets ? 'pr-1.5' : ''}`}
                      >
                        <span>{formatChipLabel(chip)}</span>
                        {isManagingPresets && (
                          <span
                            onClick={(e) => handleDeletePreset(chip, e)}
                            title={`Hapus nominal ${formatRupiah(chip)}`}
                            className="w-4 h-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] ml-1 transition"
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
                    className="text-[11px] font-semibold px-2 py-1 border border-dashed border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl transition cursor-pointer flex items-center gap-0.5"
                    title="Tambah nominal default baru"
                  >
                    <IoAdd className="text-xs" />
                    <span>Nominal</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'income' ? 'Misal: Gaji, Bonus, Freelance' : 'Misal: Makan Siang, Kopi, Bensin'}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Kategori
              </label>
              {onOpenManageCategories && (
                <button
                  type="button"
                  onClick={onOpenManageCategories}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 transition cursor-pointer flex items-center gap-1"
                >
                  <IoPricetagsOutline className="text-xs" />
                  <span>Kelola Kategori</span>
                </button>
              )}
            </div>

            <select
              value={category}
              onChange={(e) => {
                if (e.target.value === '__MANAGE__') {
                  onOpenManageCategories?.();
                } else {
                  setCategory(e.target.value);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__MANAGE__">⚙️ Kelola / Tambah Kategori Baru...</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-full text-xs shadow-sm shadow-amber-600/25 transition active:scale-95 cursor-pointer mt-2"
          >
            {isEditing ? 'Simpan Perubahan' : 'Simpan Catatan (+25 XP)'}
          </button>
        </form>
      </div>
    </div>
  );
}
