'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDown, IoCheckmark } from 'react-icons/io5';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  isAction?: boolean;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | DropdownOption)[];
  placeholder?: string;
  variant?: 'pill' | 'input';
  className?: string;
  prefixIcon?: React.ReactNode;
  prefixLabel?: string;
  disabled?: boolean;
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  variant = 'input',
  className = '',
  prefixIcon,
  prefixLabel,
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to DropdownOption[]
  const normalizedOptions: DropdownOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  const isPill = variant === 'pill';

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${isPill ? '' : 'w-full'} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 transition cursor-pointer select-none text-left ${
          isPill
            ? 'bg-amber-50/80 hover:bg-amber-100/80 text-slate-800 text-xs font-bold rounded-full px-3 py-1.5 border border-amber-200/80 shadow-2xs'
            : 'w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
        } ${isOpen ? 'ring-2 ring-amber-500/20 border-amber-500' : ''}`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {prefixIcon && <span className="shrink-0">{prefixIcon}</span>}
          {prefixLabel && (
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              {prefixLabel}
            </span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <IoChevronDown
          className={`text-slate-400 text-xs shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          className={`absolute left-0 mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-amber-100 py-1.5 overflow-hidden animate-fade-in ${
            isPill ? 'min-w-[190px] w-max' : 'w-full'
          }`}
        >
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;

              if (opt.isAction) {
                return (
                  <div key={opt.value} className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className="w-full px-3 py-2 text-left text-xs font-bold text-amber-700 hover:bg-amber-50 flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                      </div>
                    </button>
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full px-3.5 py-2 text-left text-xs transition cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-50/90 text-amber-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {opt.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && (
                      <IoCheckmark className="text-amber-700 text-sm font-black" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

