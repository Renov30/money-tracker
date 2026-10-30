'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface InteractiveMascotProps {
  size?: number;
  className?: string;
}

export default function InteractiveMascot({
  size = 230,
  className = '',
}: InteractiveMascotProps) {
  const [isReacting, setIsReacting] = useState(false);

  const handleClick = () => {
    setIsReacting(true);
    setTimeout(() => {
      setIsReacting(false);
    }, 500);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block cursor-pointer select-none transition-transform duration-300 transform hover:scale-105 active:scale-95 ${
        isReacting ? '-translate-y-4 scale-110' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      title="Klik Wally!"
    >
      <style>{`
        /* Animasi Nafas / Idle Bounce untuk seluruh tubuh asli */
        @keyframes wallyFloatIdle {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(0.8deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        /* Animasi Kedip Mata Asli (Blink) */
        @keyframes wallyEyesBlink {
          0%, 92%, 98%, 100% {
            transform: scaleY(1);
            opacity: 1;
          }
          95% {
            transform: scaleY(0.08);
            opacity: 0.9;
          }
        }

        /* Animasi Telinga Kiri Bergoyang (Ear Wiggle Left) */
        @keyframes wallyLeftEarWiggle {
          0%, 75%, 100% {
            transform: rotate(0deg);
          }
          80% {
            transform: rotate(-5deg);
          }
          86% {
            transform: rotate(4deg);
          }
          92% {
            transform: rotate(-2deg);
          }
        }

        /* Animasi Telinga Kanan Bergoyang (Ear Wiggle Right) */
        @keyframes wallyRightEarWiggle {
          0%, 78%, 100% {
            transform: rotate(0deg);
          }
          83% {
            transform: rotate(6deg);
          }
          89% {
            transform: rotate(-4deg);
          }
          94% {
            transform: rotate(2deg);
          }
        }

        /* Animasi Kipas Uang (Cash Fan Wave) */
        @keyframes wallyCashWave {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(-4deg) translateY(-2px) scale(1.02);
          }
        }

        /* Animasi Koin Berkilau Melayang */
        @keyframes coinShineFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.85;
          }
          50% {
            transform: translateY(-8px) scale(1.08);
            opacity: 1;
          }
        }

        .animate-wally-base {
          animation: wallyFloatIdle 3.8s ease-in-out infinite;
        }

        .animate-wally-blink {
          animation: wallyEyesBlink 4.2s infinite;
        }

        .animate-wally-ear-l {
          transform-origin: 32% 35%;
          animation: wallyLeftEarWiggle 3.6s ease-in-out infinite;
        }

        .animate-wally-ear-r {
          transform-origin: 66% 30%;
          animation: wallyRightEarWiggle 3.6s ease-in-out infinite 0.2s;
        }

        .animate-wally-cash {
          transform-origin: 70% 65%;
          animation: wallyCashWave 2.8s ease-in-out infinite;
        }

        .animate-coin-float {
          animation: coinShineFloat 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Container Utuh Gambar Asli Maskot (100% Identik) */}
      <div className="relative w-full h-full animate-wally-base">
        {/* 1. Base Gambar Maskot Asli Beresolusi Tinggi */}
        <Image
          src="/images/mascot-money-transparent.png"
          alt="Wally Mascot"
          width={size}
          height={size}
          className="w-full h-full object-contain drop-shadow-xl pointer-events-none select-none"
          priority
        />

        {/* 2. Layer Telinga Kiri Asli (Ear Wiggle) */}
        <div
          className="absolute pointer-events-none animate-wally-ear-l"
          style={{
            left: '16%',
            top: '5%',
            width: '28%',
            height: '35%',
          }}
        >
          <img
            src="/images/mascot-parts/ear-left.png"
            alt="Left Ear"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 3. Layer Telinga Kanan Asli (Ear Wiggle) */}
        <div
          className="absolute pointer-events-none animate-wally-ear-r"
          style={{
            left: '54%',
            top: '1%',
            width: '24%',
            height: '32%',
          }}
        >
          <img
            src="/images/mascot-parts/ear-right.png"
            alt="Right Ear"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 4. Layer Mata Kiri Asli (Blink) */}
        <div
          className="absolute pointer-events-none animate-wally-blink"
          style={{
            left: '38%',
            top: '31%',
            width: '16%',
            height: '18%',
            transformOrigin: '50% 50%',
          }}
        >
          <img
            src="/images/mascot-parts/eye-left.png"
            alt="Left Eye"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 5. Layer Mata Kanan Asli (Blink) */}
        <div
          className="absolute pointer-events-none animate-wally-blink"
          style={{
            left: '59%',
            top: '25%',
            width: '14%',
            height: '18%',
            transformOrigin: '50% 50%',
          }}
        >
          <img
            src="/images/mascot-parts/eye-right.png"
            alt="Right Eye"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 6. Layer Tangan & Uang Kertas Asli (Cash Wave) */}
        <div
          className="absolute pointer-events-none animate-wally-cash"
          style={{
            left: '57%',
            top: '44%',
            width: '27%',
            height: '28%',
          }}
        >
          <img
            src="/images/mascot-parts/cash-hand.png"
            alt="Cash"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 7. Efek Kilau Koin Emas Melayang (Floating Sparkles) */}
        <div
          className="absolute pointer-events-none animate-coin-float"
          style={{ left: '18%', top: '42%', width: '12%', height: '12%' }}
        >
          <div className="w-full h-full rounded-full bg-yellow-300/30 blur-[2px]" />
        </div>
        <div
          className="absolute pointer-events-none animate-coin-float"
          style={{ right: '8%', top: '32%', width: '14%', height: '14%', animationDelay: '0.8s' }}
        >
          <div className="w-full h-full rounded-full bg-yellow-300/30 blur-[2px]" />
        </div>
      </div>
    </div>
  );
}
