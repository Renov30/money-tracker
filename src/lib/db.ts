import { Pool } from 'pg';
import { Transaction, Goal, UserStats, CustomCategory } from '@/types';
import {
  INITIAL_USER_STATS,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
} from './storage';

// Initialize PostgreSQL pool
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/money_tracker',
  max: 10,
  idleTimeoutMillis: 30000,
});

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;

  try {
    const client = await pool.connect();
    try {
      // 1. Transactions Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          amount BIGINT NOT NULL,
          type VARCHAR(20) NOT NULL,
          category VARCHAR(100) NOT NULL,
          date VARCHAR(50) NOT NULL,
          xp_earned INT DEFAULT 25,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Goals Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS goals (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          target_amount BIGINT NOT NULL,
          current_amount BIGINT DEFAULT 0,
          category VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. User Stats Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_stats (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          title VARCHAR(100) NOT NULL,
          level INT DEFAULT 12,
          current_xp INT DEFAULT 750,
          xp_to_next_level INT DEFAULT 1000,
          streak_days INT DEFAULT 12,
          last_active_date VARCHAR(50) NOT NULL,
          monthly_budget BIGINT DEFAULT 7000000,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 4. Custom Categories Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS custom_categories (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          type VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 5. Daily Quests Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS daily_quests (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          xp_reward INT DEFAULT 25,
          completed BOOLEAN DEFAULT FALSE,
          claimed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Soft delete column and index
      await client.query(`
        ALTER TABLE transactions 
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE NULL;
      `);
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_transactions_deleted_at ON transactions(deleted_at);
      `);

      // Auto-purge trash items older than 30 days
      await client.query(`
        DELETE FROM transactions 
        WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '30 days';
      `);

      // Check if stats seeded
      const statsRes = await client.query('SELECT * FROM user_stats WHERE id = $1', ['current_user']);
      if (statsRes.rowCount === 0) {
        await client.query(
          `INSERT INTO user_stats (id, name, title, level, current_xp, xp_to_next_level, streak_days, last_active_date, monthly_budget)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            'current_user',
            INITIAL_USER_STATS.name,
            INITIAL_USER_STATS.title,
            INITIAL_USER_STATS.level,
            INITIAL_USER_STATS.currentXp,
            INITIAL_USER_STATS.xpToNextLevel,
            INITIAL_USER_STATS.streakDays,
            INITIAL_USER_STATS.lastActiveDate,
            INITIAL_USER_STATS.monthlyBudget,
          ]
        );
      }

      // Check if transactions seeded
      const txRes = await client.query('SELECT COUNT(*) FROM transactions');
      if (parseInt(txRes.rows[0].count, 10) === 0) {
        for (const tx of INITIAL_TRANSACTIONS) {
          await client.query(
            `INSERT INTO transactions (id, title, amount, type, category, date, xp_earned)
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
            [tx.id, tx.title, tx.amount, tx.type, tx.category, tx.date, tx.xpEarned]
          );
        }
      }

      // Check if goals seeded
      const goalsRes = await client.query('SELECT COUNT(*) FROM goals');
      if (parseInt(goalsRes.rows[0].count, 10) === 0) {
        for (const goal of INITIAL_GOALS) {
          await client.query(
            `INSERT INTO goals (id, title, target_amount, current_amount, category)
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
            [goal.id, goal.title, goal.targetAmount, goal.currentAmount, goal.category]
          );
        }
      }

      isInitialized = true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.warn('PostgreSQL database connection warning (fallback mode active):', error);
  }
}

// Data access operations
export const db = {
  // TRANSACTIONS (Active Only)
  async getTransactions(): Promise<Transaction[]> {
    await initDb();
    try {
      const res = await pool.query(
        'SELECT id, title, amount::bigint, type, category, date, xp_earned as "xpEarned", deleted_at as "deletedAt" FROM transactions WHERE deleted_at IS NULL ORDER BY created_at DESC'
      );
      return res.rows.map(r => ({
        ...r,
        amount: Number(r.amount),
        xpEarned: Number(r.xpEarned),
        deletedAt: r.deletedAt ? new Date(r.deletedAt).toISOString() : null,
      }));
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  // TRASH TRANSACTIONS (Soft Deleted, auto purges > 30 days)
  async getTrashTransactions(): Promise<Transaction[]> {
    await initDb();
    try {
      // 30-day auto retention purge
      await pool.query(
        "DELETE FROM transactions WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '30 days'"
      );

      const res = await pool.query(
        'SELECT id, title, amount::bigint, type, category, date, xp_earned as "xpEarned", deleted_at as "deletedAt" FROM transactions WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC'
      );
      return res.rows.map(r => ({
        ...r,
        amount: Number(r.amount),
        xpEarned: Number(r.xpEarned),
        deletedAt: r.deletedAt ? new Date(r.deletedAt).toISOString() : null,
      }));
    } catch (e) {
      console.error('Error getting trash transactions:', e);
      return [];
    }
  },

  async addTransaction(tx: Omit<Transaction, 'id' | 'xpEarned'> & { id: string; xpEarned: number }): Promise<Transaction> {
    await initDb();
    try {
      await pool.query(
        `INSERT INTO transactions (id, title, amount, type, category, date, xp_earned)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [tx.id, tx.title, tx.amount, tx.type, tx.category, tx.date, tx.xpEarned]
      );
      return tx;
    } catch (e) {
      console.error('Error adding transaction to DB:', e);
      return tx;
    }
  },

  // Soft delete: sets deleted_at to NOW()
  async deleteTransaction(id: string): Promise<boolean> {
    await initDb();
    try {
      await pool.query('UPDATE transactions SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
      return true;
    } catch {
      return false;
    }
  },

  // Restore transaction from trash
  async restoreTransaction(id: string): Promise<boolean> {
    await initDb();
    try {
      await pool.query('UPDATE transactions SET deleted_at = NULL WHERE id = $1', [id]);
      return true;
    } catch {
      return false;
    }
  },

  // Permanent delete
  async permanentDeleteTransaction(id: string): Promise<boolean> {
    await initDb();
    try {
      await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
      return true;
    } catch {
      return false;
    }
  },

  // Empty trash
  async emptyTrash(): Promise<boolean> {
    await initDb();
    try {
      await pool.query('DELETE FROM transactions WHERE deleted_at IS NOT NULL');
      return true;
    } catch {
      return false;
    }
  },

  async updateTransaction(tx: Transaction): Promise<Transaction> {
    await initDb();
    try {
      await pool.query(
        `UPDATE transactions 
         SET title = $1, amount = $2, type = $3, category = $4, date = $5
         WHERE id = $6`,
        [tx.title, tx.amount, tx.type, tx.category, tx.date, tx.id]
      );
      return tx;
    } catch (e) {
      console.error('Error updating transaction in DB:', e);
      return tx;
    }
  },

  // GOALS
  async getGoals(): Promise<Goal[]> {
    await initDb();
    try {
      const res = await pool.query(
        'SELECT id, title, target_amount as "targetAmount", current_amount as "currentAmount", category FROM goals ORDER BY created_at ASC'
      );
      return res.rows.map(r => ({
        ...r,
        targetAmount: Number(r.targetAmount),
        currentAmount: Number(r.currentAmount),
      }));
    } catch {
      return INITIAL_GOALS;
    }
  },

  async addGoal(goal: Goal): Promise<Goal> {
    await initDb();
    try {
      await pool.query(
        `INSERT INTO goals (id, title, target_amount, current_amount, category)
         VALUES ($1, $2, $3, $4, $5)`,
        [goal.id, goal.title, goal.targetAmount, goal.currentAmount, goal.category]
      );
      return goal;
    } catch {
      return goal;
    }
  },

  async topUpGoal(id: string, amount: number): Promise<boolean> {
    await initDb();
    try {
      await pool.query(
        `UPDATE goals 
         SET current_amount = LEAST(target_amount, current_amount + $1) 
         WHERE id = $2`,
        [amount, id]
      );
      return true;
    } catch {
      return false;
    }
  },

  // USER STATS
  async getStats(): Promise<UserStats> {
    await initDb();
    try {
      const res = await pool.query(
        `SELECT name, title, level, current_xp as "currentXp", xp_to_next_level as "xpToNextLevel", 
                streak_days as "streakDays", last_active_date as "lastActiveDate", monthly_budget as "monthlyBudget"
         FROM user_stats WHERE id = 'current_user'`
      );
      if (res.rowCount && res.rowCount > 0) {
        const r = res.rows[0];
        return {
          ...r,
          level: Number(r.level),
          currentXp: Number(r.currentXp),
          xpToNextLevel: Number(r.xpToNextLevel),
          streakDays: Number(r.streakDays),
          monthlyBudget: Number(r.monthlyBudget),
        };
      }
      return INITIAL_USER_STATS;
    } catch {
      return INITIAL_USER_STATS;
    }
  },

  async updateStats(stats: UserStats): Promise<UserStats> {
    await initDb();
    try {
      await pool.query(
        `UPDATE user_stats 
         SET name = $1, title = $2, level = $3, current_xp = $4, xp_to_next_level = $5, 
             streak_days = $6, last_active_date = $7, monthly_budget = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = 'current_user'`,
        [
          stats.name,
          stats.title,
          stats.level,
          stats.currentXp,
          stats.xpToNextLevel,
          stats.streakDays,
          stats.lastActiveDate,
          stats.monthlyBudget,
        ]
      );
      return stats;
    } catch {
      return stats;
    }
  },

  // CATEGORIES
  async getCategories(): Promise<CustomCategory[]> {
    await initDb();
    try {
      const res = await pool.query(
        'SELECT id, name, type FROM custom_categories ORDER BY created_at ASC'
      );
      return res.rows;
    } catch {
      return [];
    }
  },

  async addCategory(cat: CustomCategory): Promise<CustomCategory> {
    await initDb();
    try {
      await pool.query(
        'INSERT INTO custom_categories (id, name, type) VALUES ($1, $2, $3)',
        [cat.id, cat.name, cat.type]
      );
      return cat;
    } catch (e) {
      console.error('Error adding category:', e);
      return cat;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    await initDb();
    try {
      await pool.query('DELETE FROM custom_categories WHERE id = $1', [id]);
      return true;
    } catch {
      return false;
    }
  },

  async updateCategory(id: string, name: string): Promise<CustomCategory | null> {
    await initDb();
    try {
      const oldRes = await pool.query('SELECT * FROM custom_categories WHERE id = $1', [id]);
      if (oldRes.rowCount === 0) return null;
      const oldCat = oldRes.rows[0];

      await pool.query('UPDATE custom_categories SET name = $1 WHERE id = $2', [name, id]);
      await pool.query('UPDATE transactions SET category = $1 WHERE category = $2', [name, oldCat.name]);

      return { id, name, type: oldCat.type };
    } catch (e) {
      console.error('Error updating category:', e);
      return null;
    }
  },
};

