'use client';

import React, { useState, useMemo } from 'react';
import { Transaction, Goal, UserStats } from '@/types';
import { formatRupiah } from '@/lib/storage';
import {
  IoCalendarOutline,
  IoTrendingUp,
  IoTrendingDown,
  IoWalletOutline,
  IoSaveOutline,
  IoChevronBack,
  IoChevronForward,
  IoPencil,
  IoCheckmark,
  IoClose,
  IoPieChartOutline,
  IoBarChartOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';

interface FinancialReportsViewProps {
  transactions: Transaction[];
  goals: Goal[];
  goalTopups: { id: string; goalId: string; amount: number; date: string }[];
  stats: UserStats;
  totalCash: number;
  onUpdateTotalCash: (amount: number) => void;
  selectedMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
  onOpenAddTransaction?: (type: 'income' | 'expense') => void;
}

// Format ringkas nominal untuk chip kalender (misal: 1500000 -> 1.5jt, 50000 -> 50rb)
function formatCompactRupiah(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(amount) >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'jt';
  }
  if (Math.abs(amount) >= 1_000) {
    return Math.round(amount / 1_000) + 'rb';
  }
  return amount.toString();
}

export default function FinancialReportsView({
  transactions,
  goals,
  goalTopups,
  stats,
  totalCash,
  onUpdateTotalCash,
  selectedMonth,
  onMonthChange,
  onOpenAddTransaction,
}: FinancialReportsViewProps) {
  // State Edit Total Uang
  const [isEditingCash, setIsEditingCash] = useState(false);
  const [cashInputValue, setCashInputValue] = useState('');

  // State Kalender (Selected Date detail)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // State Tooltip Grafik
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{
    day: number;
    dateStr: string;
    income: number;
    expense: number;
    x: number;
    y: number;
  } | null>(null);

  // Format Nama Bulan
  const currentMonthDate = useMemo(() => {
    if (!selectedMonth) return new Date();
    const [y, m] = selectedMonth.split('-').map(Number);
    return new Date(y, (m || 1) - 1, 1);
  }, [selectedMonth]);

  const monthLabel = useMemo(() => {
    return currentMonthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [currentMonthDate]);

  const handlePrevMonth = () => {
    const y = currentMonthDate.getFullYear();
    const m = currentMonthDate.getMonth();
    const prev = new Date(y, m - 1, 1);
    const prevStr = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(prevStr);
    setSelectedCalendarDate(null);
  };

  const handleNextMonth = () => {
    const y = currentMonthDate.getFullYear();
    const m = currentMonthDate.getMonth();
    const next = new Date(y, m + 1, 1);
    const nextStr = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(nextStr);
    setSelectedCalendarDate(null);
  };

  // Filter Transaksi Bulan Terpilih
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(
      (tx) => tx && typeof tx.date === 'string' && tx.date.startsWith(selectedMonth)
    );
  }, [transactions, selectedMonth]);

  // Perhitungan Keuangan Bulan Ini
  const monthlyIncome = useMemo(() => {
    return monthlyTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [monthlyTransactions]);

  const monthlyExpense = useMemo(() => {
    return monthlyTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [monthlyTransactions]);

  const monthlySavings = useMemo(() => {
    return goalTopups
      .filter((t) => t.date && t.date.startsWith(selectedMonth))
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [goalTopups, selectedMonth]);

  const totalSavings = useMemo(() => {
    return goals.reduce((acc, curr) => acc + (Number(curr.currentAmount) || 0), 0);
  }, [goals]);

  // Kas Bersih: Pemasukan - Pengeluaran - Tabungan bulan ini
  const netCash = monthlyIncome - monthlyExpense - monthlySavings;

  // Rasio Tabungan & Pengeluaran
  const expenseRatio = monthlyIncome > 0 ? Math.round((monthlyExpense / monthlyIncome) * 100) : 0;
  const daysInMonth = useMemo(() => {
    const y = currentMonthDate.getFullYear();
    const m = currentMonthDate.getMonth();
    return new Date(y, m + 1, 0).getDate();
  }, [currentMonthDate]);

  const avgDailyExpense = Math.round(monthlyExpense / (daysInMonth || 30));

  // Kategori Pengeluaran Terbesar
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyTransactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        const cat = tx.category || 'Lainnya';
        map[cat] = (map[cat] || 0) + Number(tx.amount || 0);
      });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyTransactions]);

  // Data Harian untuk Kalender & Grafik
  const dailyDataMap = useMemo(() => {
    const map: Record<string, { income: number; expense: number; txs: Transaction[] }> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      map[dayStr] = { income: 0, expense: 0, txs: [] };
    }

    monthlyTransactions.forEach((tx) => {
      const datePart = tx.date ? tx.date.split('T')[0] : '';
      if (map[datePart]) {
        if (tx.type === 'income') {
          map[datePart].income += Number(tx.amount || 0);
        } else {
          map[datePart].expense += Number(tx.amount || 0);
        }
        map[datePart].txs.push(tx);
      }
    });

    return map;
  }, [monthlyTransactions, daysInMonth, selectedMonth]);

  // Data titik untuk grafik SVG
  const chartPoints = useMemo(() => {
    const points: { day: number; dateStr: string; income: number; expense: number }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const d = dailyDataMap[dateStr] || { income: 0, expense: 0, txs: [] };
      points.push({
        day,
        dateStr,
        income: d.income,
        expense: d.expense,
      });
    }
    return points;
  }, [dailyDataMap, daysInMonth, selectedMonth]);

  // Hitung max value untuk skala grafik
  const maxChartValue = useMemo(() => {
    const maxVal = Math.max(
      ...chartPoints.map((p) => Math.max(p.income, p.expense)),
      100000 // minimum scale
    );
    return Math.ceil(maxVal * 1.15); // beri padding 15% atas
  }, [chartPoints]);

  // Grid Kalender: Menghitung offset hari pertama (Senin = 0, Minggu = 6)
  const calendarDays = useMemo(() => {
    const y = currentMonthDate.getFullYear();
    const m = currentMonthDate.getMonth();
    const firstDayIndex = (new Date(y, m, 1).getDay() + 6) % 7; // Sesuaikan agar Senin = 0

    const cells: {
      type: 'padding' | 'day';
      day?: number;
      dateStr?: string;
      income?: number;
      expense?: number;
      txCount?: number;
    }[] = [];

    // Hari kosong sebelum tanggal 1
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ type: 'padding' });
    }

    // Tanggal 1 s.d. daysInMonth
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const data = dailyDataMap[dateStr] || { income: 0, expense: 0, txs: [] };
      cells.push({
        type: 'day',
        day,
        dateStr,
        income: data.income,
        expense: data.expense,
        txCount: data.txs.length,
      });
    }

    return cells;
  }, [currentMonthDate, daysInMonth, selectedMonth, dailyDataMap]);

  // Handler Simpan Total Uang
  const handleStartEditCash = () => {
    setCashInputValue(totalCash ? totalCash.toString() : '');
    setIsEditingCash(true);
  };

  const handleSaveCash = () => {
    const parsed = parseInt(cashInputValue.replace(/\D/g, ''), 10);
    onUpdateTotalCash(isNaN(parsed) ? 0 : parsed);
    setIsEditingCash(false);
  };

  const handleCancelCash = () => {
    setIsEditingCash(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman Rekap: Total Uang Yang Dimiliki (Gaya Header Halaman Pemasukan, Teks Hitam & Besar) */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              TOTAL UANG YANG DIMILIKI
            </span>
            {!isEditingCash && (
              <button
                type="button"
                onClick={handleStartEditCash}
                className="p-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 transition cursor-pointer"
                title="Ubah Total Uang"
              >
                <IoPencil className="text-xs" />
              </button>
            )}
          </div>

          {isEditingCash ? (
            <div className="flex items-center gap-2 mt-2">
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  autoFocus
                  value={cashInputValue}
                  onChange={(e) => setCashInputValue(e.target.value)}
                  placeholder="0"
                  className="w-48 md:w-60 bg-slate-50 border-2 border-amber-400 rounded-xl pl-9 pr-3 py-1.5 text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveCash();
                    if (e.key === 'Escape') handleCancelCash();
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleSaveCash}
                className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <IoCheckmark className="text-base stroke-2" />
                <span>Simpan</span>
              </button>
              <button
                type="button"
                onClick={handleCancelCash}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-extrabold rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <IoClose className="text-base" />
                <span>Batal</span>
              </button>
            </div>
          ) : (
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-0.5 tracking-tight">
              {formatRupiah(totalCash)}
            </h2>
          )}
        </div>

        {/* Pemilih Bulan (Duolingo Style Pill) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs border border-slate-200/60 active:scale-95"
            title="Bulan sebelumnya"
          >
            <IoChevronBack className="text-sm" />
          </button>
          <span className="text-xs md:text-sm font-extrabold text-slate-800 px-3 min-w-[130px] text-center capitalize">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs border border-slate-200/60 active:scale-95"
            title="Bulan berikutnya"
          >
            <IoChevronForward className="text-sm" />
          </button>
        </div>
      </div>

      {/* 4 KARTU METRIK ARUS KAS: DITATA PER 2 BARIS (2 KOLOM X 2 BARIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Baris 1 - Kolom 1: Pemasukan */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Pemasukan
            </span>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-xl font-black text-emerald-500 truncate">
              +{formatRupiah(monthlyIncome)}
            </div>
            <span className="text-[10px] font-bold text-slate-400">Total bulan ini</span>
          </div>
        </div>

        {/* Baris 1 - Kolom 2: Pengeluaran */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Pengeluaran
            </span>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-xl font-black text-rose-500 truncate">
              -{formatRupiah(monthlyExpense)}
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Rata-rata {formatRupiah(avgDailyExpense)}/hari
            </span>
          </div>
        </div>

        {/* Baris 2 - Kolom 1: Kas Bersih (Warna Biru Khas Duolingo/Tema Website: Sky Blue) */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Kas Bersih
            </span>
          </div>
          <div className="mt-2">
            <div className={`text-lg sm:text-xl font-black truncate ${netCash < 0 ? 'text-rose-500' : 'text-sky-500'}`}>
              {netCash >= 0 ? '+' : ''}{formatRupiah(netCash)}
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Pemasukan - Pengeluaran - Tabungan
            </span>
          </div>
        </div>

        {/* Baris 2 - Kolom 2: Total Tabungan (Warna Amber-500 Cerah sama seperti di Halaman Target) */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Total Tabungan
            </span>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-xl font-black text-amber-500 truncate">
              {formatRupiah(totalSavings)}
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              +{formatRupiah(monthlySavings)} di bulan ini
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: KALENDER KEUANGAN (MUNCUL SEBELUM GRAFIK) */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <IoCalendarOutline className="text-amber-500" />
              <span>Kalender Keuangan ({monthLabel})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              +Masuk
            </span>
            <span className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              -Keluar
            </span>
          </div>
        </div>

        {/* Hari dalam Seminggu Header */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center">
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((dayName, idx) => (
            <div
              key={dayName}
              className={`text-xs font-extrabold uppercase tracking-wider py-1.5 ${
                idx >= 5 ? 'text-amber-600' : 'text-slate-400'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Grid Tanggal Kalender */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {calendarDays.map((cell, idx) => {
            if (cell.type === 'padding') {
              return (
                <div
                  key={`pad-${idx}`}
                  className="min-h-[64px] md:min-h-[82px] bg-slate-50/50 rounded-xl border border-dashed border-slate-100"
                />
              );
            }

            const isSelected = selectedCalendarDate === cell.dateStr;
            const hasIncome = (cell.income || 0) > 0;
            const hasExpense = (cell.expense || 0) > 0;
            const isToday =
              cell.dateStr === new Date().toISOString().split('T')[0];

            return (
              <div
                key={cell.dateStr}
                onClick={() => {
                  if (cell.txCount && cell.txCount > 0) {
                    setSelectedCalendarDate(isSelected ? null : (cell.dateStr || null));
                  }
                }}
                className={`min-h-[64px] md:min-h-[82px] p-1.5 md:p-2 rounded-xl md:rounded-2xl border-2 transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                    : isToday
                    ? 'border-amber-400 bg-amber-50/30'
                    : 'border-slate-100 hover:border-slate-300 bg-white'
                } ${cell.txCount && cell.txCount > 0 ? 'cursor-pointer hover:shadow-xs' : 'opacity-80'}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs md:text-sm font-black ${
                      isToday
                        ? 'w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px]'
                        : isSelected
                        ? 'text-indigo-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {cell.txCount && cell.txCount > 0 ? (
                    <span className="text-[9px] font-black px-1 rounded-sm bg-slate-100 text-slate-500 hidden md:inline">
                      {cell.txCount} tx
                    </span>
                  ) : null}
                </div>

                {/* Badges Pemasukan / Pengeluaran di Kalender */}
                <div className="space-y-0.5 mt-1">
                  {hasIncome && (
                    <div
                      className="text-[9px] md:text-[10px] font-black text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded truncate text-right"
                      title={`Pemasukan: +${formatRupiah(cell.income || 0)}`}
                    >
                      +{formatCompactRupiah(cell.income || 0)}
                    </div>
                  )}
                  {hasExpense && (
                    <div
                      className="text-[9px] md:text-[10px] font-black text-rose-500 bg-rose-50 px-1 py-0.5 rounded truncate text-right"
                      title={`Pengeluaran: -${formatRupiah(cell.expense || 0)}`}
                    >
                      -{formatCompactRupiah(cell.expense || 0)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel Detail Transaksi Tanggal Terpilih */}
        {selectedCalendarDate && (
          <div className="mt-5 p-4 bg-slate-50 border-2 border-indigo-200 rounded-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <h3 className="text-sm font-black text-slate-800">
                  Transaksi Tanggal {selectedCalendarDate}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalendarDate(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <IoClose className="text-base" />
              </button>
            </div>

            <div className="space-y-2">
              {dailyDataMap[selectedCalendarDate]?.txs.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs ${
                        tx.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    >
                      {tx.type === 'income' ? <IoTrendingUp /> : <IoTrendingDown />}
                    </span>
                    <div>
                      <div className="text-xs font-black text-slate-800">{tx.title}</div>
                      <div className="text-[10px] font-bold text-slate-400">{tx.category}</div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-black ${
                      tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatRupiah(Number(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION: GRAFIK NAIK TURUN PEMASUKAN & PENGELUARAN (TREND CHART) */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <IoBarChartOutline className="text-violet-400" />
              <span>Grafik Tren Harian (Pemasukan vs Pengeluaran)</span>
            </h2>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-extrabold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
              <span className="text-slate-600">Pemasukan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500"></span>
              <span className="text-slate-600">Pengeluaran</span>
            </div>
          </div>
        </div>

        {/* SVG Cashflow Chart Container */}
        <div className="relative w-full h-72 sm:h-84 md:h-96 select-none">
          {/* Tooltip Hover Popover */}
          {hoveredChartPoint && (
            <div
              className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700 min-w-[140px]"
              style={{
                left: `${Math.min(Math.max(hoveredChartPoint.x, 8), 92)}%`,
                top: `${Math.max(hoveredChartPoint.y, 8)}%`,
              }}
            >
              <div className="font-black text-slate-200 pb-1 border-b border-slate-700 mb-1">
                Tgl {hoveredChartPoint.day} {monthLabel.split(' ')[0]}
              </div>
              <div className="text-emerald-500 font-extrabold">
                Masuk: +{formatRupiah(hoveredChartPoint.income)}
              </div>
              <div className="text-rose-400 font-extrabold">
                Keluar: -{formatRupiah(hoveredChartPoint.expense)}
              </div>
            </div>
          )}

          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 360">
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Grid Horizontal Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 290 - ratio * 240;
              const val = Math.round(ratio * maxChartValue);
              return (
                <g key={ratio}>
                  <line
                    x1="55"
                    y1={y}
                    x2="780"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                    strokeDasharray={ratio > 0 && ratio < 1 ? '4 4' : undefined}
                  />
                  <text
                    x="50"
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fontWeight="700"
                    fill="#94a3b8"
                  >
                    {formatCompactRupiah(val)}
                  </text>
                </g>
              );
            })}

            {/* Area & Line Pemasukan (Hijau) */}
            {(() => {
              const points = chartPoints.map((p, idx) => {
                const x = 65 + (idx / Math.max(chartPoints.length - 1, 1)) * 705;
                const y = 290 - (p.income / maxChartValue) * 240;
                return { x, y, ...p };
              });

              const pathD = points.reduce((acc, curr, idx) => {
                return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
              }, '');

              return (
                <>
                  <path
                    d={`${pathD} L ${points[points.length - 1]?.x || 770} 290 L 65 290 Z`}
                    fill="url(#incomeGradient)"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              );
            })()}

            {/* Area & Line Pengeluaran (Merah/Rose) */}
            {(() => {
              const points = chartPoints.map((p, idx) => {
                const x = 65 + (idx / Math.max(chartPoints.length - 1, 1)) * 705;
                const y = 290 - (p.expense / maxChartValue) * 240;
                return { x, y, ...p };
              });

              const pathD = points.reduce((acc, curr, idx) => {
                return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
              }, '');

              return (
                <>
                  <path
                    d={`${pathD} L ${points[points.length - 1]?.x || 770} 290 L 65 290 Z`}
                    fill="url(#expenseGradient)"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              );
            })()}

            {/* Interactive Data Dots & Hover Overlay */}
            {chartPoints.map((p, idx) => {
              const x = 65 + (idx / Math.max(chartPoints.length - 1, 1)) * 705;
              const yInc = 290 - (p.income / maxChartValue) * 240;
              const yExp = 290 - (p.expense / maxChartValue) * 240;
              const hasActivity = p.income > 0 || p.expense > 0;

              return (
                <g
                  key={p.day}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    const topY = Math.min(yInc, yExp);
                    setHoveredChartPoint({
                      day: p.day,
                      dateStr: p.dateStr,
                      income: p.income,
                      expense: p.expense,
                      x: (x / 800) * 100,
                      y: (topY / 360) * 100,
                    });
                  }}
                  onMouseLeave={() => setHoveredChartPoint(null)}
                >
                  {/* Invisible hit column */}
                  <rect
                    x={x - 12}
                    y={30}
                    width={24}
                    height={270}
                    fill="transparent"
                  />

                  {/* Dot Pemasukan */}
                  {p.income > 0 && (
                    <circle
                      cx={x}
                      cy={yInc}
                      r="4.5"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Dot Pengeluaran */}
                  {p.expense > 0 && (
                    <circle
                      cx={x}
                      cy={yExp}
                      r="4.5"
                      fill="#f43f5e"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Date labels on X-axis (every 5 days and last day) */}
                  {(p.day === 1 || p.day % 5 === 0 || p.day === daysInMonth) && (
                    <text
                      x={x}
                      y={322}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill={hasActivity ? '#334155' : '#94a3b8'}
                    >
                      {p.day}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* SECTION 5: KOMPOSISI PENGELUARAN PER KATEGORI */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <IoPieChartOutline className="text-xl text-rose-500" />
            <h2 className="text-base font-black text-slate-800 tracking-tight">
              Kategori Pengeluaran Terbesar ({monthLabel})
            </h2>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.map((cat, idx) => {
              const pct = monthlyExpense > 0 ? Math.round((cat.amount / monthlyExpense) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center font-black text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800">{formatRupiah(cat.amount)}</span>
                      <span className="text-slate-400 font-semibold w-10 text-right">({pct}%)</span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

