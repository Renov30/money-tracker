'use client';

import React, { useState } from 'react';
import MascotSvg from './MascotSvg';

interface InteractiveMascotProps {
  size?: number;
  className?: string;
}

export default function InteractiveMascot({
  size = 230,
  className = '',
}: InteractiveMascotProps) {
  const [isReacting, setIsReacting] = useState(false);
  const [clicks, setClicks] = useState<
    { id: number; x: number; y: number; text: string }[]
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsReacting(true);

    const texts = [
      '✨ Cuan! ✨',
      '💰 Mantap!',
      '🪙 Semangat!',
      '🎉 Hebat!',
      '❤️ Cerdas!',
      '🚀 Gas Terus!',
    ];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const rect = e.currentTarget.getBoundingClientRect();
    const newClick = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: randomText,
    };
    setClicks((prev) => [...prev.slice(-4), newClick]);

    setTimeout(() => {
      setIsReacting(false);
    }, 600);

    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
    }, 1200);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block cursor-pointer select-none transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        isReacting
          ? '-translate-y-5 scale-110 drop-shadow-2xl'
          : 'drop-shadow-lg'
      } ${className}`}
      style={{ width: size, height: size }}
      title="Klik Wally!"
    >
      <style>{`
        /* 1. Nafas / Idle Floating untuk seluruh tubuh maskot */
        @keyframes wallyFloatIdle {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(0.8deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        /* 2. Kedip Mata Kiri & Kanan (Blink) */
        @keyframes wallyEyesBlink {
          0%, 90%, 96%, 100% {
            transform: scaleY(1);
          }
          93% {
            transform: scaleY(0.08);
          }
        }

        /* 3. Telinga Kiri Bergoyang (Ear Wiggle Left) */
        @keyframes wallyLeftEarWiggle {
          0%, 75%, 100% {
            transform: rotate(0deg);
          }
          80% {
            transform: rotate(-6deg);
          }
          86% {
            transform: rotate(5deg);
          }
          92% {
            transform: rotate(-2deg);
          }
        }

        /* 4. Telinga Kanan Bergoyang (Ear Wiggle Right) */
        @keyframes wallyRightEarWiggle {
          0%, 78%, 100% {
            transform: rotate(0deg);
          }
          83% {
            transform: rotate(6deg);
          }
          89% {
            transform: rotate(-5deg);
          }
          94% {
            transform: rotate(2deg);
          }
        }

        /* 5. Kipas Gepokan Uang Kertas (Cash Fan Wave) */
        @keyframes wallyCashWave {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(-5deg) translateY(-4px) scale(1.02);
          }
        }

        /* 6. Koin Kiri Melayang */
        @keyframes coinFloatL {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }

        /* 7. Koin Kanan Atas Melayang */
        @keyframes coinFloatRT {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(6deg);
          }
        }

        /* 8. Koin Kanan Bawah Melayang */
        @keyframes coinFloatRB {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(-7deg);
          }
        }

        /* Pop-up bubble text saat diklik */
        @keyframes popFloatingText {
          0% {
            opacity: 0;
            transform: translate(-50%, 0px) scale(0.6);
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -15px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -42px) scale(0.9);
          }
        }

        .animate-wally-root {
          animation: wallyFloatIdle 4s ease-in-out infinite;
        }

        .mascot-ear-left {
          transform-box: view-box;
          transform-origin: 380px 380px;
          animation: wallyLeftEarWiggle 3.8s ease-in-out infinite;
        }

        .mascot-ear-right {
          transform-box: view-box;
          transform-origin: 820px 240px;
          animation: wallyRightEarWiggle 3.8s ease-in-out infinite 0.3s;
        }

        .mascot-eye-left {
          transform-box: view-box;
          transform-origin: 568px 502px;
          animation: wallyEyesBlink 4.5s infinite;
        }

        .mascot-eye-right {
          transform-box: view-box;
          transform-origin: 831px 416px;
          animation: wallyEyesBlink 4.5s infinite;
        }

        .mascot-cash {
          transform-box: view-box;
          transform-origin: 806px 783px;
          animation: wallyCashWave 3s ease-in-out infinite;
        }

        .mascot-coin-left {
          transform-box: view-box;
          transform-origin: 320px 580px;
          animation: coinFloatL 2.7s ease-in-out infinite;
        }

        .mascot-coin-right-top {
          transform-box: view-box;
          transform-origin: 1070px 470px;
          animation: coinFloatRT 3.2s ease-in-out infinite 0.4s;
        }

        .mascot-coin-right-bottom {
          transform-box: view-box;
          transform-origin: 1020px 920px;
          animation: coinFloatRB 2.5s ease-in-out infinite 0.8s;
        }
      `}</style>

      {/* SVG Maskot dengan Animasi Hidup */}
      <div className="relative w-full h-full animate-wally-root pointer-events-none">
        <MascotSvg className="w-full h-full object-contain pointer-events-none select-none" />
      </div>

      {/* Interactive floating burst text saat diklik */}
      {clicks.map((c) => (
        <span
          key={c.id}
          className="absolute z-30 font-black text-xs sm:text-sm text-amber-950 bg-amber-100/95 px-3 py-1 rounded-full shadow-lg border border-amber-300 pointer-events-none whitespace-nowrap"
          style={{
            left: c.x,
            top: c.y,
            animation:
              'popFloatingText 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {c.text}
        </span>
      ))}
    </div>
  );
}
