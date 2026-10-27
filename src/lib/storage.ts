import { Transaction, Goal, DailyQuest, UserStats } from '@/types';

export const INITIAL_USER_STATS: UserStats = {
  name: 'Alex',
  title: 'Pengatur Bijak (Level 12)',
  level: 12,
  currentXp: 750,
  xpToNextLevel: 1000,
  streakDays: 12,
  lastActiveDate: '2026-10-27',
  monthlyBudget: 7000000,
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Gaji Pokok Bulanan',
    amount: 9500000,
    type: 'income',
    category: 'Gaji & Usaha',
    date: '2026-10-27',
    xpEarned: 50,
  },
  {
    id: 'tx-2',
    title: 'Bonus Project UI/UX',
    amount: 3000000,
    type: 'income',
    category: 'Gaji & Usaha',
    date: '2026-10-26',
    xpEarned: 50,
  },
  {
    id: 'tx-3',
    title: 'Makan Siang & Kopi',
    amount: 35000,
    type: 'expense',
    category: 'Makanan & Minuman',
    date: '2026-10-27',
    xpEarned: 25,
  },
  {
    id: 'tx-4',
    title: 'Bensin Motor Mingguan',
    amount: 45000,
    type: 'expense',
    category: 'Transportasi',
    date: '2026-10-25',
    xpEarned: 25,
  },
  {
    id: 'tx-5',
    title: 'Belanja Kebutuhan Mingguan',
    amount: 350000,
    type: 'expense',
    category: 'Belanja',
    date: '2026-10-24',
    xpEarned: 25,
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Beli Nintendo Switch OLED',
    targetAmount: 4500000,
    currentAmount: 3375000,
    category: 'Gadget Impian',
  },
  {
    id: 'goal-2',
    title: 'Dana Darurat 3 Bulan',
    targetAmount: 10000000,
    currentAmount: 6500000,
    category: 'Tabungan Aman',
  },
  {
    id: 'goal-3',
    title: 'Liburan Akhir Tahun ke Jepang',
    targetAmount: 15000000,
    currentAmount: 4500000,
    category: 'Liburan',
  },
];

export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'quest-1',
    title: 'Catat Pengeluaran Pertama Hari Ini',
    description: 'Bantu Penny mendata arus kas harianmu',
    xpReward: 25,
    completed: true,
    claimed: true,
  },
  {
    id: 'quest-2',
    title: 'Hemat Pengeluaran Harian (< Rp 50.000)',
    description: 'Tahan belanja impulsif hari ini',
    xpReward: 50,
    completed: true,
    claimed: false,
  },
  {
    id: 'quest-3',
    title: 'Setor Tabungan ke Celengan Target',
    description: 'Sisihkan minimal Rp 50.000 untuk target impian',
    xpReward: 40,
    completed: false,
    claimed: false,
  },
];

const KEYS = {
  STATS: 'penny_tracker_stats',
  TRANSACTIONS: 'penny_tracker_transactions',
  GOALS: 'penny_tracker_goals',
  QUESTS: 'penny_tracker_quests',
};

export const storage = {
  getStats: (): UserStats => {
    if (typeof window === 'undefined') return INITIAL_USER_STATS;
    const data = localStorage.getItem(KEYS.STATS);
    return data ? JSON.parse(data) : INITIAL_USER_STATS;
  },
  saveStats: (stats: UserStats) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  },

  getTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  },
  saveTransactions: (txs: Transaction[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
  },

  getGoals: (): Goal[] => {
    if (typeof window === 'undefined') return INITIAL_GOALS;
    const data = localStorage.getItem(KEYS.GOALS);
    return data ? JSON.parse(data) : INITIAL_GOALS;
  },
  saveGoals: (goals: Goal[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  },

  getQuests: (): DailyQuest[] => {
    if (typeof window === 'undefined') return INITIAL_QUESTS;
    const data = localStorage.getItem(KEYS.QUESTS);
    return data ? JSON.parse(data) : INITIAL_QUESTS;
  },
  saveQuests: (quests: DailyQuest[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.QUESTS, JSON.stringify(quests));
  },
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};
