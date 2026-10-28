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
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 space-y-5 my-6">
        {/* Mascot & Branding Header */}
        <div className="text-center space-y-1.5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 mx-auto flex items-center justify-center">
            <WallabyMascot size={48} mood="waving" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Buat Akun Wally
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border-2 border-rose-200 rounded-xl text-xs text-rose-600 font-bold">
            <IoAlertCircle className="text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
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
                placeholder="Nama lengkap"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
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
                placeholder="Username unik"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Gender & Age Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
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

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                Usia
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <IoCalendar className="text-sm" />
                </div>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="24"
                  min={5}
                  max={120}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
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
                placeholder="Min. 6 karakter"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
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
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
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
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 font-bold text-xs focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'MENDAFTARKAN...' : 'DAFTAR SEKARANG'}</span>
            {!loading && <IoArrowForward className="text-sm" />}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-3 text-center border-t-2 border-slate-100">
          <p className="text-xs font-bold text-slate-500">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-extrabold text-amber-500 hover:text-amber-600 uppercase tracking-wide"
            >
              MASUK
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

