'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WallabyMascot from '@/components/WallabyMascot';
import CustomDropdown, { DropdownOption } from '@/components/CustomDropdown';
import ConfirmDialogModal from '@/components/ConfirmDialogModal';
import ToastNotification, { ToastData } from '@/components/ToastNotification';
import { AuthUser, UserGender, UserRole } from '@/types';
import {
  IoShieldCheckmark,
  IoPersonAdd,
  IoPencil,
  IoTrashOutline,
  IoArrowBack,
  IoLogOutOutline,
  IoClose,
  IoCheckmarkCircle,
  IoLockClosed,
  IoSearch,
} from 'react-icons/io5';

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [formUsername, setFormUsername] = useState('');
  const [formName, setFormName] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('user');
  const [formGender, setFormGender] = useState<UserGender>('pria');
  const [formAge, setFormAge] = useState('20');
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirm State
  const [userToDelete, setUserToDelete] = useState<AuthUser | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'delete' | 'edit' = 'success') => {
    setToast({ message, type });
  };

  const roleOptions: DropdownOption[] = [
    { value: 'user', label: 'User Biasa (Regular)' },
    { value: 'admin', label: 'Administrator' },
  ];

  const genderOptions: DropdownOption[] = [
    { value: 'pria', label: 'Pria' },
    { value: 'wanita', label: 'Wanita' },
    { value: 'other', label: 'Lainnya' },
  ];

  // Fetch Current Auth & Users List
  const loadData = async () => {
    try {
      setLoading(true);
      // Check auth
      const authRes = await fetch('/api/auth');
      const authData = await authRes.json();
      if (!authData.user || authData.user.role !== 'admin') {
        router.push('/login');
        return;
      }
      setCurrentUser(authData.user);

      // Fetch users
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (e) {
      console.error(e);
      showToast('Gagal memuat data admin', 'delete');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormName('');
    setFormPassword('');
    setFormRole('user');
    setFormGender('pria');
    setFormAge('22');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AuthUser) => {
    setEditingUser(user);
    setFormUsername(user.username);
    setFormName(user.name);
    setFormPassword(''); // empty means keep existing password
    setFormRole(user.role);
    setFormGender(user.gender);
    setFormAge(user.age.toString());
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAge = parseInt(formAge, 10);
    if (!parsedAge || parsedAge < 5 || parsedAge > 120) {
      setFormError('Usia harus antara 5 hingga 120 tahun.');
      return;
    }

    try {
      if (editingUser) {
        // Edit
        const res = await fetch('/api/admin/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingUser.id,
            name: formName.trim(),
            role: formRole,
            gender: formGender,
            age: parsedAge,
            newPassword: formPassword ? formPassword.trim() : undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || 'Gagal memperbarui akun.');
          return;
        }

        setUsers(data.users);
        setIsModalOpen(false);
        showToast(`Akun "${formName}" berhasil diperbarui!`, 'edit');
      } else {
        // Create
        if (!formPassword || formPassword.length < 6) {
          setFormError('Password minimal 6 karakter.');
          return;
        }

        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formUsername.trim(),
            password: formPassword,
            name: formName.trim(),
            role: formRole,
            gender: formGender,
            age: parsedAge,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || 'Gagal membuat akun baru.');
          return;
        }

        setUsers(data.users);
        setIsModalOpen(false);
        showToast(`Akun baru "${formUsername}" berhasil ditambahkan!`, 'success');
      }
    } catch (e) {
      console.error(e);
      setFormError('Terjadi kesalahan sistem saat menyimpan.');
    }
  };

  const promptDeleteUser = (user: AuthUser) => {
    if (user.id === currentUser?.id) {
      showToast('Anda tidak dapat menghapus akun Anda sendiri.', 'delete');
      return;
    }
    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Gagal menghapus user.', 'delete');
        return;
      }
      setUsers(data.users);
      showToast(`Akun "${userToDelete.name}" telah dihapus dari sistem.`, 'delete');
    } catch (e) {
      console.error(e);
      showToast('Gagal menghapus user.', 'delete');
    } finally {
      setUserToDelete(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push('/login');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] p-4 sm:p-8">
      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navigation & Profile Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 border border-amber-100 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <IoShieldCheckmark className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Panel Administrasi Money Tracker
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Kelola hak akses pengguna, reset password, dan pantau akun terdaftar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/80 transition cursor-pointer"
            >
              <IoArrowBack className="text-sm" />
              <span>Kembali ke Aplikasi</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200/80 transition cursor-pointer"
            >
              <IoLogOutOutline className="text-base" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Action Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-3xl p-5 border border-amber-100 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IoSearch className="text-sm" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari user berdasarkan username atau nama..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-full shadow-xs shadow-amber-600/30 transition active:scale-95 cursor-pointer shrink-0"
          >
            <IoPersonAdd className="text-sm" />
            <span>Tambah User Baru</span>
          </button>
        </div>

        {/* Users Table / Grid Card */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-100/60 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Daftar Pengguna ({filteredUsers.length} Terdaftar)
            </h2>
            <span className="text-[11px] text-amber-800 font-semibold">
              Otentikasi: Internal Database
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-semibold">
              Memuat data pengguna...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              Tidak ada pengguna yang sesuai dengan pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3 px-5">Nama & Username</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Usia</th>
                    <th className="py-3 px-4">Terdaftar</th>
                    <th className="py-3 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser?.id;
                    return (
                      <tr key={user.id} className="hover:bg-amber-50/40 transition">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isSelf && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                                    Anda
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              user.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {user.role === 'admin' && <IoShieldCheckmark className="text-xs text-amber-600" />}
                            <span>{user.role === 'admin' ? 'Administrator' : 'User Biasa'}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 capitalize font-medium text-slate-700">
                          {user.gender === 'pria' ? 'Pria' : user.gender === 'wanita' ? 'Wanita' : 'Lainnya'}
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-slate-700">
                          {user.age} thn
                        </td>

                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                        </td>

                        <td className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(user)}
                              className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                              title="Edit Akun"
                            >
                              <IoPencil className="text-xs" />
                            </button>

                            <button
                              type="button"
                              onClick={() => promptDeleteUser(user)}
                              disabled={isSelf}
                              className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title={isSelf ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Akun'}
                            >
                              <IoTrashOutline className="text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <WallabyMascot size={32} mood="happy" />
                <h3 className="text-sm font-black text-slate-900">
                  {editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-xs transition cursor-pointer"
              >
                <IoClose className="text-base" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              {formError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="Contoh: budi123"
                  required
                  disabled={Boolean(editingUser)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {editingUser ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUser ? 'Minimal 6 karakter' : 'Minimal 6 karakter'}
                  required={!editingUser}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Hak Akses
                  </label>
                  <CustomDropdown
                    value={formRole}
                    onChange={(val) => setFormRole(val as UserRole)}
                    options={roleOptions}
                    variant="input"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <CustomDropdown
                    value={formGender}
                    onChange={(val) => setFormGender(val as UserGender)}
                    options={genderOptions}
                    variant="input"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Usia (Tahun)
                </label>
                <input
                  type="number"
                  value={formAge}
                  onChange={(e) => setFormAge(e.target.value)}
                  placeholder="Contoh: 25"
                  min={5}
                  max={120}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-full text-xs shadow-sm shadow-amber-600/25 transition active:scale-95 cursor-pointer mt-2"
              >
                {editingUser ? 'Simpan Perubahan' : 'Buat Akun'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Akun Pengguna?"
        message={`Akun "${userToDelete?.name}" (@${userToDelete?.username}) akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Akun"
        cancelLabel="Batal"
        type="danger"
      />
    </div>
  );
}

