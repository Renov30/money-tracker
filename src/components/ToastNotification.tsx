'use client';

import React, { useEffect, useState } from 'react';
import {
  IoCheckmarkCircle,
  IoTrashOutline,
  IoPencil,
  IoAlertCircle,
  IoSparkles,
  IoClose,
} from 'react-icons/io5';

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
  const [visible, setVisible] = useState(false);
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);

  useEffect(() => {
    if (toast) {
      setCurrentToast(toast);
      // Trigger fade in next tick
      const animTimer = setTimeout(() => {
        setVisible(true);
      }, 20);

      // Mulai fade-out sebelum tertutup sepenuhnya
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 3300);

      return () => {
        clearTimeout(animTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setVisible(false);
      const clearTimer = setTimeout(() => {
        setCurrentToast(null);
      }, 300);
      return () => clearTimeout(clearTimer);
    }
  }, [toast]);

  if (!currentToast) return null;

  const getIcon = () => {
    switch (currentToast.type) {
      case 'delete':
        return <IoTrashOutline className="text-xl text-rose-600" />;
      case 'edit':
        return <IoPencil className="text-xl text-amber-600" />;
      case 'warning':
        return <IoAlertCircle className="text-xl text-amber-600" />;
      case 'level-up':
        return <IoSparkles className="text-2xl text-amber-500 animate-spin" />;
      case 'success':
      default:
        return <IoCheckmarkCircle className="text-xl text-emerald-600" />;
    }
  };

  const getBadgeStyle = () => {
    switch (currentToast.type) {
      case 'delete':
        return 'border-rose-200 bg-rose-50 text-rose-950';
      case 'edit':
        return 'border-amber-200 bg-amber-50 text-amber-950';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-950';
      case 'level-up':
        return 'border-amber-300 bg-amber-100 text-amber-950';
      case 'success':
      default:
        return 'border-emerald-200 bg-emerald-50 text-emerald-950';
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-opacity duration-300 ease-in-out ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 shadow-lg backdrop-blur-md ${getBadgeStyle()}`}
      >
        <div className="shrink-0">{getIcon()}</div>
        <div className="text-xs font-extrabold leading-snug max-w-xs">{currentToast.message}</div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-slate-400 hover:text-slate-700 font-black text-xs cursor-pointer p-0.5 rounded-lg"
          title="Tutup notifikasi"
        >
          <IoClose className="text-sm" />
        </button>
      </div>
    </div>
  );
}
