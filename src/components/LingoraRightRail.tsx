'use client';

import React from 'react';
import { ClayFlame, ClayGift, ClayMedal, ClayCrown, ClayCheck } from './Clay3DIcons';

interface RightRailProps {
  streakDays: number;
  dailyExpenseToday: number;
  dailyBudgetLimit: number;
}

export default function LingoraRightRail({
  streakDays,
  dailyExpenseToday = 35000,
  dailyBudgetLimit = 50000,
}: RightRailProps) {
  const percentage = Math.min(
    100,
    Math.round((dailyExpenseToday / dailyBudgetLimit) * 100)
  );

  const days = [
    { day: 'Mon', checked: true },
    { day: 'Tue', checked: true },
    { day: 'Wed', checked: true },
    { day: 'Thu', checked: true },
    { day: 'Fri', checked: false },
    { day: 'Sat', checked: false },
    { day: 'Sun', checked: false },
  ];

  const leaders = [
    { rank: 1, name: 'Sophie', score: '98% Hemat', isUser: false },
    { rank: 2, name: 'You (Alex)', score: '92% Hemat', isUser: true },
    { rank: 3, name: 'Daniel', score: '85% Hemat', isUser: false },
    { rank: 4, name: 'Maya', score: '81% Hemat', isUser: false },
    { rank: 5, name: 'Liam', score: '76% Hemat', isUser: false },
  ];

  return (
    <aside className="w-full xl:w-72 space-y-4 shrink-0">
      
      {/* 1. Your Daily Goal Card (Warm Amber Accent) */}
      <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Batas Belanja Harian
          </h4>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Aman
          </span>
        </div>

        {/* Circular Progress Ring in Warm Amber with 3D Clay Flame */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-amber-50"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-500"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <ClayFlame size={18} />
              <div className="text-[10px] font-black text-amber-950 font-mono mt-0.5">
                {percentage}%
              </div>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900">
              Hebat sekali!
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Kamu menjaga jajan di bawah Rp 50.000 selama {streakDays} hari berturut-turut!
            </p>
          </div>
        </div>

        {/* Week Streak Dots (Mon - Sun) */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-50">
          {days.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold text-slate-400">{item.day}</span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  item.checked
                    ? 'shadow-xs'
                    : 'bg-amber-50 text-amber-200'
                }`}
              >
                {item.checked ? (
                  <ClayCheck size={22} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-200/80"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Leaderboard Card with 3D Clay Medals & Crown */}
      <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Peringkat Hemat
          </h4>
          <span className="text-[10px] font-bold text-amber-700/80">Minggu Ini</span>
        </div>

        <div className="space-y-2">
          {leaders.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-2 rounded-2xl transition ${
                user.isUser ? 'bg-amber-50/90 border border-amber-200/80' : 'hover:bg-amber-50/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {user.rank === 1 ? (
                    <ClayCrown size={22} />
                  ) : user.rank === 2 ? (
                    <ClayMedal size={22} rank={2} />
                  ) : user.rank === 3 ? (
                    <ClayMedal size={22} rank={3} />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {user.rank}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {user.name}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 font-mono">
                {user.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Gift Box / Mystery Quest Box with 3D Clay Gift */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/80 rounded-3xl p-4 shadow-xs flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center shadow-xs shrink-0 animate-bounce">
          <ClayGift size={28} />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-900 leading-tight">
            Peti Koin Rahasia
          </div>
          <p className="text-[10px] text-amber-900/80 font-medium">
            Catat 3 transaksi hari ini untuk membuka peti (2/3).
          </p>
          <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>
      </div>

    </aside>
  );
}
