'use client';

import React from 'react';
import { ClayCheck, ClayTrash, ClayAlert, ClayCoin, ClayStar, ClayEdit } from './Clay3DIcons';

export type ToastType = 'success' | 'delete' | 'edit' | 'warning' | 'level-up';

export interface ToastData {
  message: string;
  type?: ToastType;
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
}

export default function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'delete':
        return <ClayTrash size={22} />;
      case 'edit':
        return <ClayEdit size={22} />;
      case 'warning':
        return <ClayAlert size={22} />;
      case 'level-up':
        return <ClayStar size={24} />;
      case 'success':
      default:
        return <ClayCheck size={22} />;
    }
  };

  const getBadgeStyle = () => {
    switch (toast.type) {
      case 'delete':
        return 'border-rose-300 bg-rose-50 text-rose-950 shadow-rose-900/10';
      case 'edit':
        return 'border-amber-300 bg-amber-50 text-amber-950 shadow-amber-900/10';
      case 'warning':
        return 'border-amber-300 bg-amber-50 text-amber-950 shadow-amber-900/10';
      case 'level-up':
        return 'border-amber-400 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-950 shadow-amber-900/15';
      case 'success':
      default:
        return 'border-emerald-300 bg-emerald-50 text-emerald-950 shadow-emerald-900/10';
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-bounce duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${getBadgeStyle()}`}
      >
        <div className="shrink-0">{getIcon()}</div>
        <div className="text-xs font-bold leading-snug max-w-xs">{toast.message}</div>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-slate-700 font-black text-xs cursor-pointer p-0.5 rounded-lg"
          title="Tutup notifikasi"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

