'use client';

import React, { useState, useEffect } from 'react';
import { CustomCategory, TransactionType, DEFAULT_CATEGORIES } from '@/types';
import {
  IoPricetagsOutline,
  IoTrendingDown,
  IoTrendingUp,
  IoAdd,
  IoPencil,
  IoTrashOutline,
  IoCheckmark,
  IoClose,
  IoAlertCircle,
  IoLockClosedOutline,
} from 'react-icons/io5';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCategories: CustomCategory[];
  onAddCategory: (name: string, type: TransactionType) => Promise<boolean | void> | void;
  onUpdateCategory: (id: string, name: string) => Promise<boolean | void> | void;
  onDeleteCategory: (id: string) => Promise<boolean | void> | void;
  initialType?: TransactionType;
}

export default function ManageCategoriesModal({
  isOpen,
  onClose,
  customCategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  initialType = 'expense',
}: ManageCategoriesModalProps) {
  const [activeType, setActiveType] = useState<TransactionType>(initialType);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveType(initialType);
      setNewCatName('');
      setEditingId(null);
      setEditingName('');
      setError(null);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const currentDefaults = DEFAULT_CATEGORIES[activeType] || [];
  const currentCustoms = customCategories.filter((c) => c.type === activeType);
  const allCurrentNames = [
    ...currentDefaults.map((c) => c.toLowerCase()),
    ...currentCustoms.map((c) => c.name.toLowerCase()),
  ];

  const handleAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setError('Nama kategori tidak boleh kosong.');
      return;
    }
    if (allCurrentNames.includes(trimmed.toLowerCase())) {
      setError(`Kategori "${trimmed}" sudah ada di daftar.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddCategory(trimmed, activeType);
      setNewCatName('');
    } catch {
      setError('Gagal menambahkan kategori.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (cat: CustomCategory) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setError(null);
  };

  const handleSaveEdit = async (id: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setError('Nama kategori tidak boleh kosong.');
      return;
    }

    // Check duplicate among other categories
    const isDuplicate =
      currentDefaults.some((c) => c.toLowerCase() === trimmed.toLowerCase()) ||
      currentCustoms.some((c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase());

    if (isDuplicate) {
      setError(`Kategori "${trimmed}" sudah ada.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onUpdateCategory(id, trimmed);
      setEditingId(null);
      setEditingName('');
    } catch {
      setError('Gagal memperbarui nama kategori.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      setError(null);
      await onDeleteCategory(id);
    } catch {
      setError(`Gagal menghapus kategori "${name}".`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-xs text-amber-700">
              <IoPricetagsOutline className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Manajemen Kategori
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Tambah, ubah nama, atau hapus kategori keuangan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-xs transition cursor-pointer"
          >
            <IoClose className="text-base" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="my-3 flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold shrink-0">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Type Toggle Pills */}
        <div className="grid grid-cols-2 gap-2 my-3 p-1 bg-slate-100 rounded-full shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveType('expense');
              setError(null);
              setEditingId(null);
            }}
            className={`py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeType === 'expense'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <IoTrendingDown className="text-base" />
            <span>Kategori Pengeluaran ({DEFAULT_CATEGORIES.expense.length + customCategories.filter(c => c.type === 'expense').length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveType('income');
              setError(null);
              setEditingId(null);
            }}
            className={`py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeType === 'income'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <IoTrendingUp className="text-base" />
            <span>Kategori Pemasukan ({DEFAULT_CATEGORIES.income.length + customCategories.filter(c => c.type === 'income').length})</span>
          </button>
        </div>

        {/* Add New Category Box */}
        <form onSubmit={handleAdd} className="mb-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl shrink-0">
          <label className="block text-[11px] font-bold text-amber-950 mb-1.5">
            + Tambah Kategori Baru ({activeType === 'expense' ? 'Pengeluaran' : 'Pemasukan'}):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder={activeType === 'expense' ? 'Contoh: Olahraga, Langganan, Zakat...' : 'Contoh: Bonus, Dividen, Saham...'}
              className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newCatName.trim()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
            >
              <IoAdd className="text-base" />
              <span>Tambah</span>
            </button>
          </div>
        </form>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          
          {/* Custom Categories Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 pt-1">
              <span>Kategori Kustom Anda ({currentCustoms.length})</span>
            </div>

            {currentCustoms.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Belum ada kategori kustom untuk {activeType === 'expense' ? 'pengeluaran' : 'pemasukan'}.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Gunakan form di atas untuk menambahkan kategori barumu.
                </p>
              </div>
            ) : (
              currentCustoms.map((cat) => {
                const isEditing = editingId === cat.id;

                if (isEditing) {
                  return (
                    <div
                      key={cat.id}
                      className="p-2.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-2 animate-fade-in"
                    >
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEdit(cat.id);
                          } else if (e.key === 'Escape') {
                            cancelEdit();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cat.id)}
                        disabled={isSubmitting || !editingName.trim()}
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                        title="Simpan Perubahan"
                      >
                        <IoCheckmark className="text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition cursor-pointer"
                        title="Batal"
                      >
                        <IoClose className="text-sm" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={cat.id}
                    className="p-2.5 bg-white border border-slate-200/80 hover:border-amber-300 rounded-2xl flex items-center justify-between gap-2 shadow-2xs transition group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200/60">
                        Kustom
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="p-1.5 hover:bg-amber-100 text-slate-500 hover:text-amber-800 rounded-xl transition cursor-pointer"
                        title={`Ubah nama kategori "${cat.name}"`}
                      >
                        <IoPencil className="text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition cursor-pointer"
                        title={`Hapus kategori "${cat.name}"`}
                      >
                        <IoTrashOutline className="text-sm" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* System Default Categories Section */}
          <div className="space-y-1.5 pt-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Kategori Bawaan ({currentDefaults.length})</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {currentDefaults.map((cat) => (
                <div
                  key={cat}
                  className="p-2 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-slate-600 truncate">{cat}</span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 bg-slate-200/80 text-slate-500 rounded-md shrink-0 flex items-center gap-0.5" title="Kategori standar sistem">
                    <IoLockClosedOutline className="text-[10px]" />
                    <span>Bawaan</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-full shadow-xs transition active:scale-95 cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
