'use client';

import React, { useState } from 'react';
import WallabyMascot from './WallabyMascot';
import { IoAlertCircle, IoClose } from 'react-icons/io5';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (title: string, targetAmount: number) => void;
}

export default function AddGoalModal({
  isOpen,
  onClose,
  onAddGoal,
}: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(targetAmount, 10);
    if (!title.trim()) {
      setError('Mohon isi nama target impian.');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Mohon isi target nominal yang lebih dari 0.');
      return;
    }

    setError(null);
    onAddGoal(title.trim(), amount);
    setTitle('');
    setTargetAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <WallabyMascot size={32} mood="happy" />
            <h3 className="text-sm font-black text-slate-900">
              Buat Target Celengan Baru
            </h3>
          </div>
          <button
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
              Target Nominal (Rp)
            </label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Contoh: 5000000"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-full text-xs shadow-sm shadow-amber-600/25 transition active:scale-95 cursor-pointer mt-2"
          >
            Simpan Target (+30 XP)
          </button>
        </form>
      </div>
    </div>
  );
}
