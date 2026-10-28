'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WallabyMascot from '@/components/WallabyMascot';
import { IoAlertCircle, IoLockClosed, IoPerson, IoArrowForward, IoEye, IoEyeOff } from 'react-icons/io5';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login gagal, periksa kembali username dan password Anda.');
        setLoading(false);
        return;
      }

      // If user is admin, can redirect to dashboard or admin
      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi ke server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xl space-y-6 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />

        {/* Mascot & Branding Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 mx-auto flex items-center justify-center shadow-xs">
            <WallabyMascot size={48} mood="happy" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Masuk ke WallyTracker
          </h1>
          <p className="text-xs text-amber-800/80 font-medium">
            Kelola tabungan, transaksi, dan target celengan impianmu!
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoPerson className="text-sm" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoLockClosed className="text-sm" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {showPassword ? <IoEyeOff className="text-base" /> : <IoEye className="text-base" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-[11px] text-amber-900 space-y-1">
            <div className="font-bold">Akun Demo Tersedia:</div>
            <div className="flex justify-between items-center text-[10px] text-amber-800/90 font-mono">
              <span>Admin: <strong>admin</strong> / <strong>admin123</strong></span>
              <span>User: <strong>alex</strong> / <strong>user123</strong></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-2xl shadow-xs shadow-amber-600/30 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Memeriksa kredensial...' : 'Masuk Sekarang'}</span>
            {!loading && <IoArrowForward className="text-sm" />}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="pt-2 text-center border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2 transition"
            >
              Daftar akun baru di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
