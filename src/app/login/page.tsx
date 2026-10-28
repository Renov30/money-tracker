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
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 space-y-6">
        {/* Mascot & Branding Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 mx-auto flex items-center justify-center">
            <WallabyMascot size={48} mood="happy" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Masuk ke Wally
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border-2 border-rose-200 rounded-xl text-xs text-rose-600 font-bold">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
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
                placeholder="Username"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
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
                placeholder="Password"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'MEMPROSES...' : 'MASUK'}</span>
            {!loading && <IoArrowForward className="text-sm" />}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="pt-3 text-center border-t-2 border-slate-100">
          <p className="text-xs font-bold text-slate-500">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-extrabold text-amber-500 hover:text-amber-600 uppercase tracking-wide"
            >
              DAFTAR
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
