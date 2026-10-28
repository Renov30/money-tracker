'use client';

import React, { useState } from 'react';
import WallabyMascot from './WallabyMascot';
import {
  IoClose,
  IoAlertCircle,
  IoCheckmarkCircle,
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <WallabyMascot size={32} mood="happy" />
            <h3 className="text-sm font-black text-slate-900">
              Pengaturan Akun
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

        {error && (
          <div className="flex items-center gap-2 p-2.5 mb-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Ganti Nama Akun / Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
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
                placeholder="Nama akun baru"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Nama akun ini yang ditampilkan di sidebar dan halaman dashboard.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="text-xs font-bold text-slate-900 mb-2">
              Ganti Password (Opsional)
            </div>

            {/* Password Baru */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
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
                    placeholder="Kosongkan jika tidak ingin ganti"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
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
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
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
                      placeholder="Ketik ulang password baru"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Konfirmasi Password Saat Ini (Keamanan) */}
          <div className="border-t border-slate-100 pt-3">
            <label className="block text-xs font-bold text-amber-950 mb-1">
              Konfirmasi Password Saat Ini <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoShieldCheckmark className="text-sm" />
              </div>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini untuk simpan"
                required
                className="w-full bg-amber-50/40 border border-amber-200 rounded-2xl pl-10 pr-10 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-full shadow-xs shadow-amber-600/30 transition active:scale-95 cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Akun'}
          </button>
        </form>
      </div>
    </div>
  );
}
