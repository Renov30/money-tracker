'use client';

import React, { useState } from 'react';
import WallabyMascot from './WallabyMascot';
import confetti from 'canvas-confetti';
import {
  IoSparkles,
  IoHeart,
  IoHappy,
  IoCashOutline,
  IoChatbubbleEllipses,
} from 'react-icons/io5';

interface InteractiveMascotProps {
  userName?: string;
  activeGoalTitle?: string;
  size?: number;
}

const WALLY_DIALOGS = [
  'Halo! Yuk sisihkan uang jajanmu hari ini untuk celengan impian! 💰',
  'Keren banget kamu rajin mencatat pengeluaran! Wally bangga padamu! 🦘✨',
  'Tips hemat dari Wally: Bikin daftar belanja sebelum checkout online ya! 🛍️',
  'Ingat target utamamu! Sedikit demi sedikit, lama-lama jadi bukit emas! 🏆',
  'Cek kantong celengan Wally! Masih banyak ruang untuk koin tabunganmu! 🪙',
  'Setiap rupiah yang kamu hemat hari ini adalah investasi masa depanmu! 🚀',
  'Kamu sudah memeriksa misi harianmu hari ini? Ada bonus XP koin menunggumu! ⭐',
];

export default function InteractiveMascot({
  userName = 'Sobat Hemat',
  activeGoalTitle = 'Celengan Impian',
  size = 185,
}: InteractiveMascotProps) {
  const [mood, setMood] = useState<'happy' | 'waving' | 'excited' | 'money-love' | 'surprised'>('waving');
  const [speech, setSpeech] = useState<string | null>(null);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMascotClick = (e: React.MouseEvent) => {
    // Trigger bounce animation
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    // Cycling dialogs & moods
    const nextIndex = (dialogIndex + 1) % WALLY_DIALOGS.length;
    setDialogIndex(nextIndex);
    setSpeech(WALLY_DIALOGS[dialogIndex]);

    // Randomize or cycle mood
    const moods: ('happy' | 'waving' | 'excited' | 'money-love' | 'surprised')[] = [
      'excited',
      'money-love',
      'happy',
      'waving',
      'surprised',
    ];
    const newMood = moods[Math.floor(Math.random() * moods.length)];
    setMood(newMood);

    // Spawn floating heart / coin effect
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setFloatingHearts((prev) => [...prev.slice(-4), newHeart]);

    // Mini confetti burst on excited/money-love
    if (newMood === 'excited' || newMood === 'money-love') {
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
          colors: ['#f59e0b', '#fbbf24', '#f97316', '#10b981'],
        });
      } catch {
        // Safe fallback if confetti isn't available
      }
    }
  };

  const handleCheer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMood('excited');
    setSpeech(`Semangat menabung untuk "${activeGoalTitle}", ${userName}! Kamu pasti bisa! 🎉`);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: 0.8, y: 0.4 },
        colors: ['#f59e0b', '#fbbf24', '#f59e0b', '#3b82f6'],
      });
    } catch {}
  };

  const handlePet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMood('happy');
    setSpeech('Aww, makasih sudah menyapa Wally! Ayo kelola keuangan dengan bijak hari ini! ❤️');
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);
  };

  return (
    <div className="relative group select-none flex flex-col items-center">
      {/* Interactive Speech Bubble */}
      {speech && (
        <div className="absolute -top-16 right-0 sm:-right-4 z-30 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border border-amber-200 rounded-2xl p-3 shadow-lg text-slate-800 text-xs font-semibold animate-fade-in transition-all duration-300">
          <div className="flex items-start gap-2">
            <IoSparkles className="text-amber-500 text-sm shrink-0 mt-0.5" />
            <p className="leading-snug">{speech}</p>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute -bottom-2 right-12 sm:right-16 w-3 h-3 bg-white border-b border-r border-amber-200 rotate-45 transform" />
        </div>
      )}

      {/* Floating Click Hearts / Sparkles */}
      {floatingHearts.map((h) => (
        <span
          key={h.id}
          className="absolute z-40 text-amber-500 pointer-events-none animate-bounce"
          style={{
            left: h.x,
            top: h.y - 20,
            animationDuration: '0.8s',
          }}
        >
          ✨
        </span>
      ))}

      {/* Clickable Mascot Container */}
      <div
        onClick={handleMascotClick}
        className={`cursor-pointer transition-transform duration-300 transform hover:scale-105 active:scale-95 ${
          isBouncing ? 'animate-bounce' : ''
        }`}
        title="Klik Wally untuk berinteraksi dan mengobrol!"
      >
        <WallabyMascot size={size} mood={mood} animated={true} />
      </div>

      {/* Interactive Quick Action Pills (Hover / Focus visible) */}
      <div className="flex items-center gap-1.5 mt-1 bg-white/90 backdrop-blur-xs border border-amber-200/90 rounded-full px-2.5 py-1 shadow-xs opacity-90 hover:opacity-100 transition">
        <button
          type="button"
          onClick={handleMascotClick}
          className="flex items-center gap-1 text-[10px] font-bold text-amber-900 hover:text-amber-700 transition cursor-pointer"
          title="Ajak Wally mengobrol"
        >
          <IoChatbubbleEllipses className="text-amber-600 text-xs" />
          <span>Sapa Wally</span>
        </button>
        <span className="text-amber-300 text-xs">•</span>
        <button
          type="button"
          onClick={handleCheer}
          className="flex items-center gap-1 text-[10px] font-bold text-amber-900 hover:text-amber-700 transition cursor-pointer"
          title="Minta semangat dari Wally"
        >
          <IoHappy className="text-amber-600 text-xs" />
          <span>Semangat</span>
        </button>
        <span className="text-amber-300 text-xs">•</span>
        <button
          type="button"
          onClick={handlePet}
          className="flex items-center gap-1 text-[10px] font-bold text-amber-900 hover:text-amber-700 transition cursor-pointer"
          title="Sayang Wally"
        >
          <IoHeart className="text-rose-500 text-xs" />
          <span>Sayang</span>
        </button>
      </div>
    </div>
  );
}

