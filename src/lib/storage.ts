import { Transaction, Goal, DailyQuest, UserStats, CustomCategory } from '@/types';

export const INITIAL_USER_STATS: UserStats = {
  name: 'Pengguna',
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
    isMain: true,
  },
  {
    id: 'goal-2',
    title: 'Dana Darurat 3 Bulan',
    targetAmount: 10000000,
    currentAmount: 6500000,
    category: 'Tabungan Aman',
    isMain: false,
  },
  {
    id: 'goal-3',
    title: 'Liburan Akhir Tahun ke Jepang',
    targetAmount: 15000000,
    currentAmount: 4500000,
    category: 'Liburan',
    isMain: false,
  },
];

export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'quest-1',
    title: 'Catat Pengeluaran Pertama Hari Ini',
    description: 'Bantu Wally mendata arus kas harianmu',
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
  CATEGORIES: 'penny_tracker_custom_categories',
  AMOUNT_PRESETS: 'penny_tracker_amount_presets',
  CATEGORY_PRESETS: 'penny_tracker_category_presets',
};

export const DEFAULT_AMOUNT_PRESETS: Record<'expense' | 'income', number[]> = {
  expense: [15000, 25000, 50000, 100000, 250000, 500000, 1000000],
  income: [500000, 1000000, 2500000, 5000000, 10000000],
};

export const storage = {
  getCategories: (): CustomCategory[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },
  saveCategories: (cats: CustomCategory[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
  },

  getCategoryList: (type: 'expense' | 'income'): string[] => {
    if (typeof window === 'undefined') return [...DEFAULT_CATEGORIES[type]];
    try {
      const data = localStorage.getItem(KEYS.CATEGORY_PRESETS);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && Array.isArray(parsed[type]) && parsed[type].length > 0) {
          return parsed[type];
        }
      }
    } catch {
      // ignore
    }
    return [...DEFAULT_CATEGORIES[type]];
  },
  saveCategoryList: (type: 'expense' | 'income', list: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(KEYS.CATEGORY_PRESETS);
      const parsed = data
        ? JSON.parse(data)
        : {
            expense: [...DEFAULT_CATEGORIES.expense],
            income: [...DEFAULT_CATEGORIES.income],
          };
      parsed[type] = list;
      localStorage.setItem(KEYS.CATEGORY_PRESETS, JSON.stringify(parsed));
    } catch {
      // ignore
    }
  },
  resetCategoryList: (type: 'expense' | 'income'): string[] => {
    if (typeof window === 'undefined') return [...DEFAULT_CATEGORIES[type]];
    try {
      const data = localStorage.getItem(KEYS.CATEGORY_PRESETS);
      const parsed = data ? JSON.parse(data) : {};
      parsed[type] = [...DEFAULT_CATEGORIES[type]];
      localStorage.setItem(KEYS.CATEGORY_PRESETS, JSON.stringify(parsed));
    } catch {
      // ignore
    }
    return [...DEFAULT_CATEGORIES[type]];
  },

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
    const list: Transaction[] = data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    return list.filter((t) => !t.deletedAt);
  },
  getTrashTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    const list: Transaction[] = data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    // Keep only items deleted within last 30 days
    const validTrash = list.filter((t) => {
      if (!t.deletedAt) return false;
      const deletedTime = new Date(t.deletedAt).getTime();
      return now - deletedTime < thirtyDaysMs;
    });
    return validTrash;
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

  getAmountPresets: (type: 'expense' | 'income'): number[] => {
    if (typeof window === 'undefined') return DEFAULT_AMOUNT_PRESETS[type];
    try {
      const data = localStorage.getItem(KEYS.AMOUNT_PRESETS);
      if (!data) return DEFAULT_AMOUNT_PRESETS[type];
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed[type]) && parsed[type].length > 0) {
        return parsed[type];
      }
    } catch {
      // ignore JSON error
    }
    return DEFAULT_AMOUNT_PRESETS[type];
  },
  saveAmountPresets: (type: 'expense' | 'income', presets: number[]) => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(KEYS.AMOUNT_PRESETS);
      const parsed = data
        ? JSON.parse(data)
        : {
            expense: [...DEFAULT_AMOUNT_PRESETS.expense],
            income: [...DEFAULT_AMOUNT_PRESETS.income],
          };
      parsed[type] = presets;
      localStorage.setItem(KEYS.AMOUNT_PRESETS, JSON.stringify(parsed));
    } catch {
      // ignore
    }
  },
  resetAmountPresets: (type: 'expense' | 'income'): number[] => {
    if (typeof window === 'undefined') return DEFAULT_AMOUNT_PRESETS[type];
    try {
      const data = localStorage.getItem(KEYS.AMOUNT_PRESETS);
      const parsed = data ? JSON.parse(data) : {};
      parsed[type] = [...DEFAULT_AMOUNT_PRESETS[type]];
      localStorage.setItem(KEYS.AMOUNT_PRESETS, JSON.stringify(parsed));
    } catch {
      // ignore
    }
    return [...DEFAULT_AMOUNT_PRESETS[type]];
  },
};

export const formatRupiah = (amount: number | string | undefined | null): string => {
  const num = Number(amount);
  const safeNum = isNaN(num) ? 0 : num;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(safeNum);
};
