'use client';

import React, { useState } from 'react';
import WallabyMascot from './WallabyMascot';

interface InteractiveMascotProps {
  size?: number;
}

export default function InteractiveMascot({
  size = 195,
}: InteractiveMascotProps) {
  const [mood, setMood] = useState<'happy' | 'waving' | 'excited'>('waving');
  const [isReacting, setIsReacting] = useState(false);

  const handleClick = () => {
    // Reaksi sederhana: ganti mood ceria & sedikit reaksi animasi klik
    setIsReacting(true);
    setMood((prev) => (prev === 'waving' ? 'excited' : prev === 'excited' ? 'happy' : 'waving'));

    setTimeout(() => {
      setIsReacting(false);
    }, 400);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block cursor-pointer select-none transition-transform duration-300 transform hover:scale-105 active:scale-95 ${
        isReacting ? '-translate-y-1.5 scale-105' : ''
      }`}
      title="Klik Wally"
    >
      <WallabyMascot size={size} mood={mood} animated={true} />
    </div>
  );
}
