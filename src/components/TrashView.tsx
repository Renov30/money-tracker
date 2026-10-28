'use client';

import React from 'react';
import { Transaction } from '@/types';
import { formatRupiah } from '@/lib/storage';
import {
  IoTrashBinOutline,
  IoArrowUndoOutline,
  IoTrashOutline,
  IoTrendingDown,
  IoTrendingUp,
  IoTimeOutline,
  IoAlertCircleOutline,
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

  const formatDeletedDate = (deletedAt?: string | null) => {
    if (!deletedAt) return 'Baru saja';
    try {
      const d = new Date(deletedAt);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 rounded-3xl p-6 border border-rose-200/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs shrink-0">
            <IoTrashBinOutline className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Tempat Sampah (Trash)
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-rose-100 text-rose-700 rounded-full border border-rose-200">
                {trashItems.length} Catatan
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Catatan yang dihapus disimpan di sini dan dapat dipulihkan kapan saja.
            </p>
          </div>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={onEmptyTrash}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 self-start md:self-auto shrink-0"
          >
            <IoTrashOutline className="text-sm" />
            <span>Kosongkan Sampah</span>
          </button>
        )}
      </div>

      {/* 30-Day Auto Purge Policy Notice */}
      <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
        <IoTimeOutline className="text-lg text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="font-bold text-amber-950 block mb-0.5">
            Kebijakan Penghapusan Otomatis 30 Hari:
          </strong>
          Semua catatan keuangan di tempat sampah akan otomatis dihapus secara permanen setelah 30 hari sejak tanggal penghapusan. Anda dapat memulihkannya kembali ke daftar aktif sebelum masa retensi berakhir.
        </div>
      </div>

      {/* Trash Content List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
        {trashItems.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <IoTrashBinOutline className="text-3xl" />
            </div>
            <h3 className="text-sm font-black text-slate-800">
              Tempat Sampah Bersih & Kosong
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Tidak ada catatan keuangan di tempat sampah. Catatan yang Anda hapus akan muncul di sini selama 30 hari.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {trashItems.map((tx) => {
              const remainingDays = getRemainingDays(tx.deletedAt);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-3 rounded-2xl transition group"
                >
                  {/* Left info: Icon, Title, Category */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/70'
                          : 'bg-rose-50 text-rose-600 border border-rose-200/70'
                      }`}
                    >
                      {isIncome ? (
                        <IoTrendingUp className="text-lg" />
                      ) : (
                        <IoTrendingDown className="text-lg" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {tx.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {tx.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-0.5">
                        <span>Tanggal Transaksi: {tx.date}</span>
                        <span>•</span>
                        <span>Dihapus: {formatDeletedDate(tx.deletedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right info: Amount, Expiration Badge, Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div
                        className={`text-xs font-bold font-mono ${
                          isIncome ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatRupiah(tx.amount)}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold mt-0.5">
                        <IoTimeOutline className="text-xs" />
                        <span>Sisa {remainingDays} hari</span>
                      </div>
                    </div>

                    {/* Action Buttons: Restore & Permanent Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onRestore(tx.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs"
                        title="Pulihkan catatan ini ke daftar aktif"
                      >
                        <IoArrowUndoOutline className="text-sm" />
                        <span>Pulihkan</span>
                      </button>

                      <button
                        onClick={() => onPermanentDelete(tx.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 rounded-xl transition active:scale-95 cursor-pointer"
                        title="Hapus permanen dari database"
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
