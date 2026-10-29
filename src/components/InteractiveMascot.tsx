'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface InteractiveMascotProps {
  size?: number;
  className?: string;
}

export default function InteractiveMascot({
  size = 200,
  className = '',
}: InteractiveMascotProps) {
  const [isReacting, setIsReacting] = useState(false);

  const handleClick = () => {
    setIsReacting(true);
    setTimeout(() => {
      setIsReacting(false);
    }, 450);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block cursor-pointer select-none transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        isReacting ? '-translate-y-3 scale-110 rotate-3' : ''
      } ${className}`}
      title="Klik Wally Si Kangguru Keuangan!"
    >
      <Image
        src="/images/mascot-money-transparent.png"
        alt="Wally Mascot"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-xl pointer-events-none select-none"
        priority
      />
    </div>
  );
}
