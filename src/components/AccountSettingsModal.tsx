'use client';

import React, { useState } from 'react';
import {
  IoClose,
  IoAlertCircle,
  IoPerson,
  IoLockClosed,
  IoEye,
  IoEyeOff,
  IoShieldCheckmark,
} from 'react-icons/io5';
import { AuthUser } from '@/types';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onUpdateSuccess: (updatedUser: AuthUser) => void;
}

export default function AccountSettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}: AccountSettingsModalProps) {
  const [username, setUsername] = useState(currentUser?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError(null);
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('Masukkan password saat ini untuk memverifikasi perubahan.');
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('Password baru minimal harus 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          newUsername: username.trim(),
          newPassword: newPassword ? newPassword.trim() : undefined,
          currentPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan pengaturan akun.');
        setLoading(false);
        return;
      }

      onUpdateSuccess(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Terjadi kendala saat menghubungi server.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-2xl p-6 border-2 border-slate-200 shadow-xl relative space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Duolingo Style */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">
              PENGATURAN AKUN
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border-2 border-rose-200 rounded-xl text-xs text-rose-600 font-bold">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Nama Akun (Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoPerson className="text-sm" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Ganti Password */}
          <div className="pt-2 border-t-2 border-slate-100 space-y-3">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Ganti Password (Opsional)
            </span>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Password Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <IoLockClosed className="text-sm" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak diganti"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showNewPassword ? <IoEyeOff className="text-base" /> : <IoEye className="text-base" />}
                </button>
              </div>
            </div>

            {newPassword && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Ulangi Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <IoLockClosed className="text-sm" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Konfirmasi Password Saat Ini */}
          <div className="pt-2 border-t-2 border-slate-100">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
              Password Saat Ini <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoShieldCheckmark className="text-sm" />
              </div>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ketik password saat ini"
                required
                className="w-full bg-amber-50/50 border-2 border-amber-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {showCurrentPassword ? <IoEyeOff className="text-base" /> : <IoEye className="text-base" />}
              </button>
            </div>
          </div>

          {/* Action Button Duolingo 3D */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
