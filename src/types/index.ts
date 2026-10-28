export type TransactionType = 'expense' | 'income';

export type Category = string;

export interface CustomCategory {
  id: string;
  name: string;
  type: TransactionType;
}

export const DEFAULT_CATEGORIES: Record<TransactionType, Category[]> = {
  expense: [
    'Makanan & Minuman',
    'Transportasi',
    'Belanja',
    'Tagihan & Utilitas',
    'Hiburan',
    'Lainnya',
  ],
  income: [
    'Gaji & Usaha',
    'Lainnya',
  ],
};

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  xpEarned: number;
  deletedAt?: string | null;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  isMain?: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
}

export interface UserStats {
  name: string;
  title: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  streakDays: number;
  lastActiveDate: string;
  monthlyBudget: number;
  totalCash?: number;
  baseCash?: number;
}

export type UserRole = 'user' | 'admin';
export type UserGender = 'pria' | 'wanita' | 'other';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  gender: UserGender;
  age: number;
  createdAt?: string;
}

