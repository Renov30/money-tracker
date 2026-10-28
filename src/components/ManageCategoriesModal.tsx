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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl p-6 border-2 border-slate-200 shadow-xl relative max-h-[90vh] flex flex-col space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Duolingo Style */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600">
              <IoPricetagsOutline className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                MANAJEMEN KATEGORI
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-50 border-2 border-rose-200 rounded-xl text-xs text-rose-600 font-bold shrink-0">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Type Toggle Pills Duolingo Style */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-extrabold shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveType('expense');
              setError(null);
              setEditingId(null);
            }}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 uppercase ${
              activeType === 'expense'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-rose-600'
            }`}
          >
            <IoTrendingDown className="text-base" />
            <span>Pengeluaran ({DEFAULT_CATEGORIES.expense.length + customCategories.filter(c => c.type === 'expense').length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveType('income');
              setError(null);
              setEditingId(null);
            }}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 uppercase ${
              activeType === 'income'
                ? 'bg-emerald-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            <IoTrendingUp className="text-base" />
            <span>Pemasukan ({DEFAULT_CATEGORIES.income.length + customCategories.filter(c => c.type === 'income').length})</span>
          </button>
        </div>

        {/* Add New Category Box */}
        <form onSubmit={handleAdd} className="p-3 bg-slate-50 border-2 border-slate-200 rounded-xl shrink-0 space-y-1.5">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            + Tambah Kategori ({activeType === 'expense' ? 'Pengeluaran' : 'Pemasukan'})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder={activeType === 'expense' ? 'Contoh: Olahraga, Langganan, Zakat' : 'Contoh: Bonus, Dividen, Saham'}
              className="flex-1 bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newCatName.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              <IoAdd className="text-base stroke-2" />
              <span>TAMBAH</span>
            </button>
          </div>
        </form>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[200px]">
          
          {/* Custom Categories Section */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1 pt-1">
              Kategori Kustom ({currentCustoms.length})
            </div>

            {currentCustoms.length === 0 ? (
              <div className="p-4 bg-white border-2 border-dashed border-slate-200 rounded-xl text-center">
                <p className="text-xs font-bold text-slate-400">
                  Belum ada kategori kustom untuk {activeType === 'expense' ? 'pengeluaran' : 'pemasukan'}.
                </p>
              </div>
            ) : (
              currentCustoms.map((cat) => {
                const isEditing = editingId === cat.id;

                if (isEditing) {
                  return (
                    <div
                      key={cat.id}
                      className="p-2.5 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 bg-white border-2 border-amber-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
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
                        className="p-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition cursor-pointer"
                        title="Simpan"
                      >
                        <IoCheckmark className="text-sm stroke-2" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition cursor-pointer"
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
                    className="p-2.5 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between gap-2 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-xs font-extrabold text-slate-800">{cat.name}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                        Kustom
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
                        title="Ubah nama"
                      >
                        <IoPencil className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg transition cursor-pointer"
                        title="Hapus"
                      >
                        <IoTrashOutline className="text-xs" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* System Default Categories Section */}
          <div className="space-y-1.5 pt-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
              Kategori Bawaan ({currentDefaults.length})
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {currentDefaults.map((cat) => (
                <div
                  key={cat}
                  className="p-2 bg-slate-50 border-2 border-slate-100 rounded-xl flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-bold text-slate-700 truncate">{cat}</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded-md shrink-0 flex items-center gap-0.5">
                    <IoLockClosedOutline className="text-[10px]" />
                    <span>Bawaan</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Duolingo Style Button */}
        <div className="pt-2 border-t-2 border-slate-100 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer"
          >
            SELESAI
          </button>
        </div>

      </div>
    </div>
  );
}
