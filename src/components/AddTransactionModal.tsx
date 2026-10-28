'use client';

import React, { useState, useEffect } from 'react';
import { Category, Transaction, TransactionType } from '@/types';
import WallabyMascot from './WallabyMascot';
import { ClayExpense, ClayIncome } from './Clay3DIcons';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'xpEarned'>) => void;
  initialType?: TransactionType;
}

const CATEGORIES: Record<TransactionType, Category[]> = {
  expense: [
    'Makanan & Minuman',
    'Transportasi',
    'Belanja',
    'Tagihan & Utilitas',
    'Hiburan',
    'Lainnya',
  ],
  income: [
    'Gaji & Usaha',
    'Lainnya',
  ],
};

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  initialType = 'expense',
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Category>('Makanan & Minuman');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setCategory(initialType === 'income' ? 'Gaji & Usaha' : 'Makanan & Minuman');
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (!numAmount || numAmount <= 0) {
      alert('Masukkan nominal yang valid!');
      return;
    }

    onAddTransaction({
      title: title.trim() || (type === 'expense' ? 'Pengeluaran' : 'Pemasukan'),
      amount: numAmount,
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    });

    setAmount('');
    setTitle('');
    onClose();
  };

  const handleChip = (val: number) => {
    setAmount(val.toString());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
        
        {/* Header with mini mascot */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <WallabyMascot size={34} mood="happy" />
            <h3 className="text-sm font-black text-slate-900">
              Catat {type === 'income' ? 'Pemasukan' : 'Pengeluaran'} (+25 XP)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-xs transition cursor-pointer"
          >
            ✕
          </button>
        </div>

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
            <ClayExpense size={16} />
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
            <ClayIncome size={16} />
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

            {/* Quick Chips */}
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {[15000, 25000, 50000, 100000, 250000, 1000000].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => handleChip(chip)}
                  className="text-[11px] font-semibold px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl transition cursor-pointer"
                >
                  {chip >= 1000000
                    ? `${chip / 1000000}jt`
                    : chip >= 1000
                    ? `${chip / 1000}k`
                    : chip}
                </button>
              ))}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            >
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-full text-xs shadow-sm shadow-amber-600/25 transition active:scale-95 cursor-pointer mt-2"
          >
            Simpan Catatan (+25 XP)
          </button>
        </form>
      </div>
    </div>
  );
}
