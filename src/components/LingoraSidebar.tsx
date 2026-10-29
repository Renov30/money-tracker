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
  IoSettingsOutline,
  IoPersonCircle,
  IoTrashBinOutline,
  IoShieldCheckmark,
  IoLogOutOutline,
  IoLogInOutline,
  IoBarChart,
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
    { id: 'home', label: 'BERANDA', icon: <IoHome className="text-xl text-amber-500" /> },
    { id: 'income', label: 'PEMASUKAN', icon: <IoTrendingUp className="text-xl text-emerald-500" /> },
    { id: 'expense', label: 'PENGELUARAN', icon: <IoTrendingDown className="text-xl text-rose-500" /> },
    { id: 'goals', label: 'TARGET', icon: <IoFlag className="text-xl text-sky-500" /> },
    { id: 'reports', label: 'REKAP', icon: <IoBarChart className="text-xl text-violet-400" /> },
    { id: 'leaderboard', label: 'MISI & SKOR', icon: <IoTrophy className="text-xl text-amber-500" /> },
    {
      id: 'trash',
      label: 'SAMPAH',
      icon: <IoTrashBinOutline className="text-xl text-slate-400" />,
      badge: trashCount > 0 ? trashCount : null,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r-2 border-slate-200 flex flex-col justify-between p-4 md:p-5 shrink-0 md:h-screen md:sticky md:top-0">
      <div className="space-y-6">
        {/* App Branding (Duolingo bold header style) */}
        <div className="flex items-center gap-3 px-3 pt-1">
          <WallyLogo size={40} />
          <span className="text-xl font-black text-amber-500 tracking-tight">
            wally
          </span>
        </div>

        {/* Navigation Menu (Duolingo Pill Style) */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold tracking-wider transition-all duration-150 cursor-pointer select-none outline-none focus:outline-none border-2 ${
                  isActive
                    ? 'bg-amber-50 text-amber-600 border-amber-300'
                    : 'border-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Account Trigger at Bottom */}
      <div className="pt-4 border-t-2 border-slate-100">
        <div className="relative" ref={accountMenuRef}>
          {isAccountMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-2 z-50 space-y-1 animate-fade-in">
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                <div className="text-xs font-black text-slate-800 truncate">
                  @{currentUser ? currentUser.username : userName}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  if (onOpenSettings) onOpenSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <IoSettingsOutline className="text-base text-slate-500" />
                <span>Pengaturan</span>
              </button>

              {currentUser?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-extrabold text-amber-600 hover:bg-amber-50 rounded-xl transition cursor-pointer"
                >
                  <IoShieldCheckmark className="text-base" />
                  <span>Panel Admin</span>
                </Link>
              )}

              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-extrabold text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                >
                  <IoLogOutOutline className="text-base" />
                  <span>Keluar</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-extrabold text-amber-600 hover:bg-amber-50 rounded-xl transition cursor-pointer"
                >
                  <IoLogInOutline className="text-base" />
                  <span>Masuk</span>
                </Link>
              )}
            </div>
          )}

          <div
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className={`flex items-center justify-between p-2.5 rounded-2xl border-2 transition cursor-pointer select-none ${
              isAccountMenuOpen
                ? 'bg-amber-50 border-amber-300'
                : 'border-transparent hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <IoPersonCircle className="text-3xl text-amber-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-slate-800 truncate flex items-center gap-1">
                  <span>{currentUser ? currentUser.username : userName}</span>
                  {currentUser?.role === 'admin' && (
                    <IoShieldCheckmark className="text-amber-500 text-xs shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  {currentUser?.role === 'admin' ? 'Admin' : 'Akun'}
                </div>
              </div>
            </div>
            <IoSettingsOutline className="text-base text-slate-400 shrink-0" />
          </div>
        </div>
      </div>
    </aside>
  );
}
