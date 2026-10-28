'use client';

import React, { useState, useEffect } from 'react';
import WallabyMascot from './WallabyMascot';
import { IoAlertCircle, IoClose, IoLockClosed } from 'react-icons/io5';
import { Goal } from '@/types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goalData: { id?: string; title: string; targetAmount: number; currentAmount?: number; category?: string; isMain?: boolean }) => void;
  editingGoal?: Goal | null;
}

export default function GoalModal({
  isOpen,
  onClose,
  onSaveGoal,
  editingGoal = null,
}: GoalModalProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [category, setCategory] = useState('Target Impian');
  const [isMain, setIsMain] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setTargetAmount(editingGoal.targetAmount.toString());
      setCurrentAmount((editingGoal.currentAmount || 0).toString());
      setCategory(editingGoal.category || 'Target Impian');
      setIsMain(Boolean(editingGoal.isMain));
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      setCategory('Target Impian');
      setIsMain(false);
    }
    setError(null);
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(targetAmount, 10);
    const current = parseInt(currentAmount, 10) || 0;

    if (!title.trim()) {
      setError('Mohon isi nama target impian.');
      return;
    }
    if (!target || target <= 0) {
      setError('Mohon isi target nominal yang lebih dari 0.');
      return;
    }
    if (current < 0) {
      setError('Nominal terkumpul tidak boleh negatif.');
      return;
    }

    setError(null);
    onSaveGoal({
      id: editingGoal?.id,
      title: title.trim(),
      targetAmount: target,
      currentAmount: current,
      category: category.trim() || 'Target Impian',
      isMain,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <WallabyMascot size={32} mood="happy" />
            <h3 className="text-sm font-black text-slate-900">
              {editingGoal ? 'Edit Target Celengan' : 'Buat Target Celengan Baru'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-xs transition cursor-pointer"
          >
            <IoClose className="text-base" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
              <IoAlertCircle className="text-lg shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Target Impian
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Beli Laptop Baru, Liburan"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori Target
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Contoh: Gadget Impian, Tabungan Aman, Liburan"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Nominal (Rp)
            </label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Contoh: 5000000"
              required
              min={1}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          {editingGoal && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Terkumpul Saat Ini (Rp)
              </label>
              <input
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="Contoh: 1500000"
                min={0}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
          )}

          {/* Lock In As Main Goal Option */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 cursor-pointer hover:bg-amber-100/50 transition">
              <input
                type="checkbox"
                checked={isMain}
                onChange={(e) => setIsMain(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-md border-amber-300 focus:ring-amber-500 focus:ring-2 accent-amber-600 cursor-pointer"
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <IoLockClosed className="text-amber-600 text-sm" />
                  <span>Lock In sebagai Target Utama (Main Goal)</span>
                </div>
                <div className="text-[10px] text-amber-800/80 mt-0.5 leading-tight">
                  Target ini akan diprioritaskan dan ditampilkan di kartu dashboard utama.
                </div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-full text-xs shadow-sm shadow-amber-600/25 transition active:scale-95 cursor-pointer mt-2"
          >
            {editingGoal ? 'Simpan Perubahan' : 'Simpan Target (+30 XP)'}
          </button>
        </form>
      </div>
    </div>
  );
}
