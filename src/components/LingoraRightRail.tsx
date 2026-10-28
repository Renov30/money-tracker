'use client';

import React from 'react';
import {
  IoFlame,
  IoGift,
  IoMedal,
  IoSparkles,
  IoCheckmarkCircle,
} from 'react-icons/io5';

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
    { day: 'Sen', checked: true },
    { day: 'Sel', checked: true },
    { day: 'Rab', checked: true },
    { day: 'Kam', checked: true },
    { day: 'Jum', checked: false },
    { day: 'Sab', checked: false },
    { day: 'Min', checked: false },
  ];

  const leaders = [
    { rank: 1, name: 'Sophie', score: '980 XP', isUser: false },
    { rank: 2, name: 'Kamu', score: '920 XP', isUser: true },
    { rank: 3, name: 'Daniel', score: '850 XP', isUser: false },
    { rank: 4, name: 'Maya', score: '810 XP', isUser: false },
    { rank: 5, name: 'Liam', score: '760 XP', isUser: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Streak & Misi Harian */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              BERUNTUN (STREAK)
            </h4>
            <div className="flex items-center gap-1 text-orange-500 font-black text-sm">
              <IoFlame className="text-lg" />
              <span>{streakDays} Hari</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {days.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-slate-400">{item.day}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    item.checked ? 'text-amber-500' : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  {item.checked ? (
                    <IoCheckmarkCircle className="text-2xl text-amber-500" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misi Harian */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            MISI HARIAN
          </h4>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <IoGift className="text-2xl" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span>Catat 3 Transaksi</span>
                <span className="text-amber-600">2 / 3</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '66%' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <IoFlame className="text-2xl" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span>Jajan di Bawah Rp 50rb</span>
                <span className="text-emerald-600">{percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Papan Skor (Leaderboard) */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            PAPAN SKOR MINGGU INI
          </h4>
        </div>

        <div className="space-y-2">
          {leaders.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-xl border-2 transition ${
                user.isUser
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {user.rank === 1 ? (
                    <IoSparkles className="text-amber-500 text-lg" />
                  ) : user.rank === 2 ? (
                    <IoMedal className="text-slate-400 text-lg" />
                  ) : user.rank === 3 ? (
                    <IoMedal className="text-amber-700 text-lg" />
                  ) : (
                    <span className="text-xs font-extrabold text-slate-400">
                      {user.rank}
                    </span>
                  )}
                </div>
                <span className="text-sm font-extrabold text-slate-800">
                  {user.name}
                </span>
              </div>
              <span className="text-xs font-extrabold text-amber-600">
                {user.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
