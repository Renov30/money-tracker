'use client';

import React from 'react';

interface AnimatedWallySvgProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export default function AnimatedWallySvg({
  className = '',
  size = 240,
  interactive = true,
}: AnimatedWallySvgProps) {
  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="bodyGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#d97736" />
            <stop offset="70%" stopColor="#b4531d" />
            <stop offset="100%" stopColor="#9a3412" />
          </radialGradient>

          <radialGradient id="headGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ea8c4a" />
            <stop offset="65%" stopColor="#c25e1a" />
            <stop offset="100%" stopColor="#9a3412" />
          </radialGradient>

          <radialGradient id="earInnerGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffb3ba" />
            <stop offset="80%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </radialGradient>

          <linearGradient id="snoutGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>

          <linearGradient id="cashGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          <linearGradient id="cashGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          <linearGradient id="cashGrad3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <radialGradient id="coinGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="55%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <style>{`
          /* Animasi Telinga Kiri */
          .wally-ear-left {
            transform-origin: 140px 145px;
            animation: earWiggleLeft 3.6s ease-in-out infinite;
          }
          @keyframes earWiggleLeft {
            0%, 70%, 100% { transform: rotate(0deg); }
            76% { transform: rotate(-8deg); }
            82% { transform: rotate(5deg); }
            88% { transform: rotate(-4deg); }
          }

          /* Animasi Telinga Kanan */
          .wally-ear-right {
            transform-origin: 275px 140px;
            animation: earWiggleRight 3.6s ease-in-out infinite 0.25s;
          }
          @keyframes earWiggleRight {
            0%, 70%, 100% { transform: rotate(0deg); }
            74% { transform: rotate(9deg); }
            80% { transform: rotate(-6deg); }
            86% { transform: rotate(4deg); }
          }

          /* Animasi Mata Berkedip (Blink) */
          .wally-eyes {
            transform-origin: 220px 185px;
            animation: eyesBlink 4.2s infinite;
          }
          @keyframes eyesBlink {
            0%, 94%, 98%, 100% { transform: scaleY(1); }
            96% { transform: scaleY(0.08); }
          }

          /* Animasi Tangan & Kipas Uang */
          .wally-cash-hand {
            transform-origin: 270px 245px;
            animation: cashFan 2.8s ease-in-out infinite alternate;
          }
          @keyframes cashFan {
            0% { transform: rotate(0deg) translateY(0); }
            100% { transform: rotate(-7deg) translateY(-4px); }
          }

          /* Animasi Koin Melayang */
          .wally-floating-coin-1 {
            animation: floatCoin1 2.4s ease-in-out infinite alternate;
          }
          @keyframes floatCoin1 {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-10px) rotate(8deg); }
          }

          .wally-floating-coin-2 {
            animation: floatCoin2 3s ease-in-out infinite alternate 0.4s;
          }
          @keyframes floatCoin2 {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-14px) rotate(-10deg); }
          }

          .wally-floating-coin-3 {
            animation: floatCoin3 2.6s ease-in-out infinite alternate 0.8s;
          }
          @keyframes floatCoin3 {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-8px) rotate(12deg); }
          }

          /* Animasi Nafas / Idle Bounce */
          .wally-body-idle {
            transform-origin: 200px 350px;
            animation: wallyIdle 3s ease-in-out infinite alternate;
          }
          @keyframes wallyIdle {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-3px) scale(1.01, 0.99); }
          }

          /* Animasi Ekor */
          .wally-tail-wag {
            transform-origin: 155px 290px;
            animation: tailSway 3s ease-in-out infinite alternate;
          }
          @keyframes tailSway {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(6deg); }
          }
        `}</style>

        {/* Shadow di tanah */}
        <ellipse cx="205" cy="375" rx="100" ry="16" fill="#000000" fillOpacity="0.16" />

        {/* Ekor Kangguru */}
        <g className="wally-tail-wag">
          <path
            d="M160 270 C120 280, 75 295, 75 330 C75 365, 125 350, 155 330 Z"
            fill="url(#bodyGrad)"
          />
        </g>

        {/* Tubuh & Animasi Utama */}
        <g className="wally-body-idle">
          {/* Kaki Kiri & Kanan */}
          <ellipse cx="165" cy="365" rx="32" ry="15" fill="#782d08" />
          <ellipse cx="270" cy="365" rx="30" ry="14" fill="#782d08" />
          <ellipse cx="165" cy="363" rx="26" ry="11" fill="#9a3412" />
          <ellipse cx="270" cy="363" rx="24" ry="10" fill="#9a3412" />

          {/* Badan Kangguru */}
          <ellipse cx="215" cy="275" rx="76" ry="85" fill="url(#bodyGrad)" />

          {/* Perut / Kantong Kangguru (Pouch) */}
          <ellipse cx="225" cy="295" rx="52" ry="58" fill="#fef3c7" />
          {/* Kantong depan berlapis */}
          <path
            d="M185 285 C185 335, 265 335, 265 285 Q225 305 185 285 Z"
            fill="#fde68a"
            stroke="#f59e0b"
            strokeWidth="3"
          />

          {/* Koin Emas di Dalam Kantong */}
          <g>
            <circle cx="210" cy="290" r="14" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="2" />
            <text x="210" y="295" textAnchor="middle" fill="#78350f" fontSize="13" fontWeight="900" fontFamily="sans-serif">$</text>
            
            <circle cx="230" cy="286" r="15" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="2" />
            <text x="230" y="291" textAnchor="middle" fill="#78350f" fontSize="14" fontWeight="900" fontFamily="sans-serif">$</text>

            <circle cx="246" cy="294" r="13" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="2" />
            <text x="246" y="299" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="900" fontFamily="sans-serif">$</text>
          </g>

          {/* Telinga Kiri (Bisa bergerak) */}
          <g className="wally-ear-left">
            <path
              d="M135 155 C110 90, 65 35, 95 25 C125 15, 155 75, 160 140 Z"
              fill="url(#bodyGrad)"
            />
            {/* Bagian dalam telinga pink */}
            <path
              d="M132 145 C114 95, 82 48, 102 42 C122 36, 142 85, 148 132 Z"
              fill="url(#earInnerGrad)"
            />
          </g>

          {/* Telinga Kanan (Bisa bergerak) */}
          <g className="wally-ear-right">
            <path
              d="M260 145 C285 85, 290 25, 265 18 C240 10, 220 70, 235 135 Z"
              fill="url(#bodyGrad)"
            />
            {/* Bagian dalam telinga kanan pink */}
            <path
              d="M255 135 C275 88, 278 40, 260 36 C242 32, 230 78, 240 128 Z"
              fill="url(#earInnerGrad)"
            />
          </g>

          {/* Jambul Rambut di Antara Telinga */}
          <path
            d="M190 85 C185 70, 200 62, 205 72 C210 60, 225 65, 220 80 Z"
            fill="#b4531d"
          />

          {/* Kepala Kangguru */}
          <circle cx="215" cy="175" r="72" fill="url(#headGrad)" />

          {/* Pipi Tembem Kiri & Kanan */}
          <ellipse cx="165" cy="205" rx="30" ry="24" fill="url(#snoutGrad)" />
          <ellipse cx="265" cy="205" rx="30" ry="24" fill="url(#snoutGrad)" />
          {/* Moncong Tengah */}
          <ellipse cx="215" cy="208" rx="42" ry="32" fill="url(#snoutGrad)" />

          {/* Blush Pipi Merah Muda */}
          <ellipse cx="165" cy="210" rx="12" ry="7" fill="#f87171" fillOpacity="0.4" />
          <ellipse cx="265" cy="210" rx="12" ry="7" fill="#f87171" fillOpacity="0.4" />

          {/* Hidung Cokelat Imut */}
          <path
            d="M205 186 C205 182, 225 182, 225 186 C225 194, 215 197, 205 186 Z"
            fill="#571d05"
          />
          <ellipse cx="211" cy="184" rx="3" ry="1.5" fill="#ffffff" fillOpacity="0.6" />

          {/* Mulut Tersenyum Terbuka Gembira */}
          <path
            d="M200 206 Q215 212 230 206 C232 224, 198 224, 200 206 Z"
            fill="#7f1d1d"
          />
          {/* Lidah Merah Muda */}
          <path
            d="M204 214 Q215 210 226 214 C225 224, 205 224, 204 214 Z"
            fill="#f87171"
          />

          {/* MATA (DENGAN ANIMASI KEDIP MATA BERLOGO DOLLAR EMAS) */}
          <g className="wally-eyes">
            {/* Mata Kiri */}
            <ellipse cx="180" cy="165" rx="24" ry="28" fill="#1e1b4b" />
            <ellipse cx="180" cy="165" rx="22" ry="26" fill="#0f172a" />
            {/* Dollar Sign di Mata Kiri */}
            <text
              x="180"
              y="176"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="30"
              fontWeight="900"
              fontFamily="Impact, sans-serif"
              filter="drop-shadow(0px 0px 3px rgba(251, 191, 36, 0.7))"
            >
              $
            </text>
            {/* Pantulan Cahaya di Mata Kiri */}
            <circle cx="170" cy="148" r="7" fill="#ffffff" />
            <circle cx="188" cy="178" r="3.5" fill="#ffffff" fillOpacity="0.8" />

            {/* Mata Kanan */}
            <ellipse cx="250" cy="165" rx="24" ry="28" fill="#1e1b4b" />
            <ellipse cx="250" cy="165" rx="22" ry="26" fill="#0f172a" />
            {/* Dollar Sign di Mata Kanan */}
            <text
              x="250"
              y="176"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="30"
              fontWeight="900"
              fontFamily="Impact, sans-serif"
              filter="drop-shadow(0px 0px 3px rgba(251, 191, 36, 0.7))"
            >
              $
            </text>
            {/* Pantulan Cahaya di Mata Kanan */}
            <circle cx="240" cy="148" r="7" fill="#ffffff" />
            <circle cx="258" cy="178" r="3.5" fill="#ffffff" fillOpacity="0.8" />

            {/* Alis Ekspresif */}
            <path d="M165 132 Q180 126 195 135" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M235 135 Q250 126 265 132" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          {/* Lengan Kiri Menyangga Badan */}
          <ellipse cx="160" cy="270" rx="16" ry="32" transform="rotate(35 160 270)" fill="#782d08" />

          {/* TANGAN KANAN DENGAN GEPOKAN UANG HIJAU (DAPAT DIKIPAS/DIGERAKKAN) */}
          <g className="wally-cash-hand">
            {/* Lembar Uang 1 (Belakang) */}
            <g transform="rotate(-22 270 230)">
              <rect x="250" y="180" width="48" height="70" rx="5" fill="url(#cashGrad1)" stroke="#166534" strokeWidth="2" />
              <rect x="255" y="186" width="38" height="58" rx="3" fill="none" stroke="#bbf7d0" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="274" cy="215" r="10" fill="#15803d" />
              <text x="274" y="220" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">$</text>
            </g>

            {/* Lembar Uang 2 (Tengah) */}
            <g transform="rotate(-6 270 230)">
              <rect x="250" y="175" width="50" height="72" rx="5" fill="url(#cashGrad2)" stroke="#14532d" strokeWidth="2" />
              <rect x="255" y="181" width="40" height="60" rx="3" fill="none" stroke="#dcfce7" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="275" cy="211" r="11" fill="#166534" />
              <text x="275" y="216" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">$</text>
            </g>

            {/* Lembar Uang 3 (Depan) */}
            <g transform="rotate(12 270 230)">
              <rect x="250" y="172" width="52" height="74" rx="5" fill="url(#cashGrad3)" stroke="#14532d" strokeWidth="2.5" />
              <rect x="255" y="178" width="42" height="62" rx="3" fill="none" stroke="#f0fdf4" strokeWidth="2" />
              <circle cx="276" cy="209" r="12" fill="#15803d" />
              <text x="276" y="215" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900">$</text>
            </g>

            {/* Cakar Tangan Cokelat Menggenggam Uang */}
            <ellipse cx="265" cy="245" rx="18" ry="14" fill="#622305" />
            <circle cx="254" cy="242" r="5" fill="#431407" />
            <circle cx="265" cy="240" r="5" fill="#431407" />
            <circle cx="276" cy="242" r="5" fill="#431407" />
          </g>
        </g>

        {/* KOIN EMAS MELAYANG DI SEKITAR MASKOT */}
        {/* Koin 1 (Kiri Atas) */}
        <g className="wally-floating-coin-1" style={{ transformOrigin: '80px 180px' }}>
          <circle cx="80" cy="180" r="18" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="2.5" filter="url(#softGlow)" />
          <circle cx="80" cy="180" r="14" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="80" y="187" textAnchor="middle" fill="#78350f" fontSize="18" fontWeight="900" fontFamily="sans-serif">$</text>
          {/* Sparkle efek */}
          <path d="M60 155 L64 165 L74 167 L65 174 L68 184 L59 177 L50 183 L54 172 L46 166 L56 164 Z" fill="#fde047" opacity="0.8" transform="scale(0.5) translate(60, 160)" />
        </g>

        {/* Koin 2 (Kanan Atas) */}
        <g className="wally-floating-coin-2" style={{ transformOrigin: '330px 145px' }}>
          <circle cx="330" cy="145" r="21" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="3" filter="url(#softGlow)" />
          <circle cx="330" cy="145" r="16" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 2" />
          <text x="330" y="153" textAnchor="middle" fill="#78350f" fontSize="21" fontWeight="900" fontFamily="sans-serif">$</text>
        </g>

        {/* Koin 3 (Kanan Bawah) */}
        <g className="wally-floating-coin-3" style={{ transformOrigin: '320px 280px' }}>
          <circle cx="320" cy="280" r="16" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="2.5" />
          <text x="320" y="286" textAnchor="middle" fill="#78350f" fontSize="16" fontWeight="900" fontFamily="sans-serif">$</text>
        </g>

        {/* Koin 4 (Kiri Bawah) */}
        <g className="wally-floating-coin-1" style={{ transformOrigin: '120px 245px' }}>
          <circle cx="120" cy="245" r="13" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="2" />
          <text x="120" y="250" textAnchor="middle" fill="#78350f" fontSize="13" fontWeight="900" fontFamily="sans-serif">$</text>
        </g>
      </svg>
    </div>
  );
}

