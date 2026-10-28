'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WallabyMascot from '@/components/WallabyMascot';
import CustomDropdown, { DropdownOption } from '@/components/CustomDropdown';
import {
  IoAlertCircle,
  IoLockClosed,
  IoPerson,
  IoArrowForward,
  IoEye,
  IoEyeOff,
  IoPersonCircle,
  IoCalendar,
} from 'react-icons/io5';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('pria');
  const [age, setAge] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genderOptions: DropdownOption[] = [
    { value: 'pria', label: 'Pria (Laki-laki)' },
    { value: 'wanita', label: 'Wanita (Perempuan)' },
    { value: 'other', label: 'Lainnya / Tidak Disebutkan' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (!parsedAge || parsedAge < 5 || parsedAge > 120) {
      setError('Mohon masukkan usia yang valid antara 5 hingga 120 tahun.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          username: username.trim(),
          password,
          name: name.trim(),
          gender,
          age: parsedAge,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Pendaftaran gagal, silakan periksa data Anda.');
        setLoading(false);
        return;
      }

      // Success, route to home dashboard
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Terjadi kendala saat menghubungi server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xl space-y-5 relative overflow-hidden my-6">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />

        {/* Mascot & Branding Header */}
        <div className="text-center space-y-1.5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 mx-auto flex items-center justify-center shadow-xs">
            <WallabyMascot size={48} mood="waving" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Daftar Akun WallyTracker
          </h1>
          <p className="text-xs text-amber-800/80 font-medium">
            Mulai petualangan finansialmu dan kumpulkan tabungan bersama Wally!
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoPersonCircle className="text-base" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Alex Pratama"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
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
                placeholder="Pilih username unik"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Gender & Age Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Gender with CustomDropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <CustomDropdown
                value={gender}
                onChange={(val) => setGender(val)}
                options={genderOptions}
                variant="input"
                className="w-full"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Usia (Tahun)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <IoCalendar className="text-sm" />
                </div>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Contoh: 24"
                  min={5}
                  max={120}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
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
                placeholder="Minimal 6 karakter"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ulangi Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoLockClosed className="text-sm" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-2xl shadow-xs shadow-amber-600/30 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Mendaftarkan akun...' : 'Buat Akun Sekarang'}</span>
            {!loading && <IoArrowForward className="text-sm" />}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-2 text-center border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2 transition"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

