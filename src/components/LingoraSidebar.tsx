'use client';

import React from 'react';
import WallabyMascot from './WallabyMascot';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  level: number;
  userName: string;
}

export default function LingoraSidebar({
  activeTab,
  setActiveTab,
  level,
  userName,
}: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'income', label: 'Pemasukan', icon: '💰' },
    { id: 'expense', label: 'Pengeluaran', icon: '💸' },
    { id: 'goals', label: 'Goals Tabungan', icon: '🎯' },
    { id: 'leaderboard', label: 'Peringkat & Misi', icon: '🏆' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-amber-100/60 flex flex-col justify-between p-4 md:p-6 shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto">
      <div className="space-y-6">
        {/* App Branding with Wallaby Mascot */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center shadow-xs overflow-hidden">
            <WallabyMascot size={36} mood="waving" />
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
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-50 text-amber-800 shadow-xs border border-amber-200/50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-amber-50/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-4 border-t border-amber-100/60">
        {/* Wally Plus Card (Warm Caramel Theme) */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50/60 border border-amber-200/70 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center text-xs shadow-xs font-bold">
              👑
            </span>
            <span className="text-xs font-black text-slate-900">Wally Plus</span>
          </div>
          <p className="text-[11px] text-amber-900/80 font-medium leading-relaxed">
            Klaim bonus XP 2x lipat dan buka kantung tabungan tanpa batas.
          </p>
          <button className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-amber-600/20 transition active:scale-95 cursor-pointer">
            Tingkatkan Level
          </button>
        </div>

        {/* User Profile Footer Row */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100/80 border border-amber-200 flex items-center justify-center text-sm font-bold text-amber-900 shadow-xs">
              👨🏻
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{userName}</div>
              <div className="text-[10px] text-amber-700/80 font-medium">
                Level {level}
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition cursor-pointer text-sm">
            ⚙️
          </button>
        </div>
      </div>
    </aside>
  );
}
