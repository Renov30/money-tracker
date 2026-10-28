'use client';

import React from 'react';
import Link from 'next/link';
import WallyLogo from './WallyLogo';
import {
  IoHome,
  IoTrendingUp,
  IoTrendingDown,
  IoFlag,
  IoTrophy,
  IoSparkles,
  IoSettingsOutline,
  IoPersonCircle,
  IoTrashBinOutline,
  IoShieldCheckmark,
  IoLogOutOutline,
  IoLogInOutline,
} from 'react-icons/io5';
import { AuthUser } from '@/types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
  trashCount?: number;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenSettings?: () => void;
}

export default function LingoraSidebar({
  activeTab,
  setActiveTab,
  userName,
  trashCount = 0,
  currentUser = null,
  onLogout,
  onOpenSettings,
}: SidebarProps) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = React.useState(false);
  const accountMenuRef = React.useRef<HTMLDivElement>(null);

  // Close popup menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const navItems = [
    { id: 'home', label: 'Home', icon: <IoHome className="text-lg" /> },
    { id: 'income', label: 'Pemasukan', icon: <IoTrendingUp className="text-lg text-emerald-600" /> },
    { id: 'expense', label: 'Pengeluaran', icon: <IoTrendingDown className="text-lg text-rose-600" /> },
    { id: 'goals', label: 'Goals Tabungan', icon: <IoFlag className="text-lg text-amber-600" /> },
    { id: 'leaderboard', label: 'Peringkat & Misi', icon: <IoTrophy className="text-lg text-amber-500" /> },
    {
      id: 'trash',
      label: 'Tempat Sampah',
      icon: <IoTrashBinOutline className="text-lg text-rose-500" />,
      badge: trashCount > 0 ? trashCount : null,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-amber-100/60 flex flex-col justify-between p-4 md:p-6 shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto">
      <div className="space-y-6">
        {/* App Branding with Wally Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
            <WallyLogo size={38} />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
              WallyTracker
            </h1>
            <p className="text-[10px] text-amber-700/80 font-bold tracking-wide mt-1">
              Save • Track • Grow
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative group w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-out cursor-pointer select-none outline-none focus:outline-none focus-visible:outline-none border ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-100/90 via-amber-50 to-orange-50/70 text-amber-950 shadow-xs border-amber-300/80 translate-x-1.5'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-amber-50/50 hover:translate-x-1 active:scale-[0.98]'
                }`}
              >
                {/* Active Left Pill Accent Indicator */}
                <span
                  className={`absolute -left-[1px] top-1/2 -translate-y-1/2 w-1.5 h-5 bg-gradient-to-b from-amber-500 to-amber-600 rounded-r-full shadow-xs shadow-amber-500/50 transition-all duration-300 pointer-events-none ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                />

                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                      isActive
                        ? 'bg-white shadow-xs text-amber-700 scale-105 border-amber-200/60'
                        : 'border-transparent text-slate-500 group-hover:text-amber-700 group-hover:scale-110 group-hover:bg-white/70'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`transition-colors duration-200 ${
                      isActive ? 'font-black text-amber-950' : 'font-semibold'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all duration-300 border ${
                      isActive
                        ? 'bg-rose-500 text-white shadow-xs scale-105 border-rose-600/20'
                        : 'border-transparent bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-4 border-t border-amber-100/60">
        {/* Wally Plus Card (Ionicons Sparkles Theme) */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50/60 border border-amber-200/70 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-2">
            <IoSparkles className="text-amber-500 text-lg" />
            <span className="text-xs font-black text-slate-900">Wally Plus</span>
          </div>
          <p className="text-[11px] text-amber-900/80 font-medium leading-relaxed">
            Klaim bonus XP 2x lipat dan buka kantung tabungan tanpa batas.
          </p>
          <button
            type="button"
            className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-amber-600/20 transition active:scale-95 cursor-pointer outline-none focus:outline-none"
          >
            Tingkatkan Level
          </button>
        </div>

        {/* User Profile Footer Row with Interactive Popup Menu */}
        <div className="relative" ref={accountMenuRef}>
          {/* Popup Menu when info akun is clicked */}
          {isAccountMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-amber-200/80 p-2 z-50 space-y-1 animate-fade-in">
              <div className="px-3 py-1.5 border-b border-amber-100/60 mb-1">
                <div className="text-[11px] font-bold text-slate-800 truncate">
                  {currentUser ? currentUser.name : userName}
                </div>
                <div className="text-[10px] text-amber-700 font-mono">
                  @{currentUser ? currentUser.username : userName}
                </div>
              </div>

              {/* Opsi Pengaturan (Ganti nama akun & password) */}
              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  if (onOpenSettings) onOpenSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-amber-900 hover:bg-amber-50 rounded-xl transition cursor-pointer"
              >
                <IoSettingsOutline className="text-sm text-amber-600" />
                <span>Pengaturan Akun</span>
              </button>

              {/* Opsi Admin (khusus admin) */}
              {currentUser?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 rounded-xl transition cursor-pointer"
                >
                  <IoShieldCheckmark className="text-sm text-amber-600" />
                  <span>Panel Administrasi</span>
                </Link>
              )}

              {/* Opsi Logout */}
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer border-t border-slate-100 mt-1"
                >
                  <IoLogOutOutline className="text-sm" />
                  <span>Keluar (Logout)</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-xl transition cursor-pointer"
                >
                  <IoLogInOutline className="text-sm" />
                  <span>Masuk Akun</span>
                </Link>
              )}
            </div>
          )}

          {/* Trigger: Clickable Info Akun Card */}
          <div
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className={`flex items-center justify-between p-2 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
              isAccountMenuOpen
                ? 'bg-amber-50 border-amber-300 shadow-xs'
                : 'hover:bg-amber-50/60 border-transparent hover:border-amber-200/70'
            }`}
            title="Klik untuk membuka menu akun"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-200/80 flex items-center justify-center bg-amber-50 shadow-xs shrink-0 text-amber-800">
                <IoPersonCircle className="text-3xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                  <span>{currentUser ? currentUser.username : userName}</span>
                  {currentUser?.role === 'admin' && (
                    <span title="Administrator">
                      <IoShieldCheckmark className="text-amber-600 text-xs shrink-0" />
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-amber-700/80 font-medium">
                  {currentUser?.role === 'admin' ? 'Administrator' : 'Pengguna Aktif'}
                </div>
              </div>
            </div>

            <div className="text-slate-400 hover:text-slate-600 pl-1 shrink-0">
              <IoSettingsOutline className={`text-base transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-45 text-amber-700' : ''}`} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
