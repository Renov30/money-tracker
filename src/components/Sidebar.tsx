'use client';

import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  level: number;
}

export default function Sidebar({ activeTab, setActiveTab, level }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Ringkasan' },
    { id: 'transactions', label: 'Transaksi' },
    { id: 'goals', label: 'Target' },
    { id: 'quests', label: 'Misi' },
  ];

  return (
    <aside className="w-full md:w-24 bg-[#0066ff] text-white flex flex-row md:flex-col items-center justify-between p-3 md:py-6 shrink-0 border-b md:border-b-0 md:border-r border-blue-500">
      <div className="flex flex-row md:flex-col items-center gap-6 w-full">
        {/* App Logo / Brand */}
        <div className="w-11 h-11 bg-white text-[#0066ff] font-black text-xl rounded-2xl flex items-center justify-center shadow-md select-none">
          M
        </div>

        {/* Navigation Items (Clean Text, No Icon Clutter) */}
        <nav className="flex flex-row md:flex-col items-center gap-2 w-full">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 md:py-2.5 rounded-xl text-xs font-bold transition w-auto md:w-full text-center ${
                  isActive
                    ? 'bg-white text-[#0066ff] shadow-sm'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Star Pass / Level Badge at Bottom (Solid Yellow block) */}
      <div className="hidden md:block w-full px-2">
        <div className="w-full bg-[#facc15] text-slate-950 p-2.5 rounded-xl text-center shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-amber-900">
            LEVEL {level}
          </div>
          <div className="text-xs font-black mt-0.5">
            STAR PASS
          </div>
        </div>
      </div>
    </aside>
  );
}

