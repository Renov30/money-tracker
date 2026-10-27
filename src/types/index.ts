export type TransactionType = 'expense' | 'income';

export type Category =
  | 'Makanan & Minuman'
  | 'Transportasi'
  | 'Belanja'
  | 'Tagihan & Utilitas'
  | 'Hiburan'
  | 'Gaji & Usaha'
  | 'Lainnya';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  xpEarned: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
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
}

