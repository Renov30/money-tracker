'use client';

import React, { useEffect } from 'react';
import { IoTrashOutline, IoWarningOutline } from 'react-icons/io5';

interface ConfirmDialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning';
}

export default function ConfirmDialogModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah kamu yakin ingin melanjutkan tindakan ini?',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  type = 'danger',
}: ConfirmDialogModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-sm rounded-2xl p-6 border-2 border-slate-200 shadow-xl relative space-y-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Icon Badge */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center">
          {type === 'danger' ? (
            <IoTrashOutline className="text-2xl text-rose-600" />
          ) : (
            <IoWarningOutline className="text-2xl text-amber-600" />
          )}
        </div>

        {/* Text info */}
        <div className="space-y-1.5">
          <h3 className="text-base font-black text-slate-800 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 font-bold leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* Duolingo 3D Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 transition cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-rose-600 active:border-b-0 active:translate-y-1 transition cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
