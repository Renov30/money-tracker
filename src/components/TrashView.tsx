'use client';

import React from 'react';
import { Transaction } from '@/types';
import { formatRupiah } from '@/lib/storage';
import {
  IoTrashBinOutline,
  IoArrowUndoOutline,
  IoTrashOutline,
  IoTimeOutline,
} from 'react-icons/io5';

interface TrashViewProps {
  trashItems: Transaction[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyTrash: () => void;
}

export default function TrashView({
  trashItems,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
}: TrashViewProps) {
  const getRemainingDays = (deletedAt?: string | null) => {
    if (!deletedAt) return 30;
    const del = new Date(deletedAt).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - del) / (1000 * 60 * 60 * 24));
    return Math.max(1, 30 - diffDays);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800">
            Tempat Sampah
          </h2>
          <p className="text-xs font-bold text-slate-400">
            Otomatis dihapus permanen setelah 30 hari
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={onEmptyTrash}
            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-rose-600 active:border-b-0 active:translate-y-1 transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <IoTrashOutline className="text-sm" />
            <span>KOSONGKAN</span>
          </button>
        )}
      </div>

      {/* Trash List */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-200">
        {trashItems.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <IoTrashBinOutline className="text-4xl text-slate-300 mx-auto" />
            <div className="text-sm font-extrabold text-slate-600">
              Tempat sampah kosong
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {trashItems.map((tx) => {
              const remainingDays = getRemainingDays(tx.deletedAt);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-2 border-slate-100 hover:border-slate-200 transition"
                >
                  <div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {tx.title}
                    </div>
                    <div className="text-xs text-slate-400 font-bold">
                      {tx.category} • Sisa {remainingDays} hari
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div
                      className={`text-sm font-black ${
                        isIncome ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onRestore(tx.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-2 border-emerald-200 rounded-xl text-xs font-extrabold transition cursor-pointer"
                      >
                        <IoArrowUndoOutline className="text-sm" />
                        <span>Pulihkan</span>
                      </button>

                      <button
                        onClick={() => onPermanentDelete(tx.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition cursor-pointer"
                        title="Hapus Permanen"
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
    </div>
  );
}
