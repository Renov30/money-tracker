-- Migration: 001_create_schema.sql
-- Description: Creates initial schema tables, constraints, and indices for Money Tracker

-- 1. Create Migration Tracking Table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Stats Table
CREATE TABLE IF NOT EXISTS user_stats (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    level INT DEFAULT 12 CHECK (level >= 1),
    current_xp INT DEFAULT 750 CHECK (current_xp >= 0),
    xp_to_next_level INT DEFAULT 1000 CHECK (xp_to_next_level > 0),
    streak_days INT DEFAULT 12 CHECK (streak_days >= 0),
    last_active_date VARCHAR(50) NOT NULL,
    monthly_budget BIGINT DEFAULT 7000000 CHECK (monthly_budget >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(100) NOT NULL,
    date VARCHAR(50) NOT NULL,
    xp_earned INT DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    target_amount BIGINT NOT NULL CHECK (target_amount > 0),
    current_amount BIGINT DEFAULT 0 CHECK (current_amount >= 0),
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Custom Categories Table
CREATE TABLE IF NOT EXISTS custom_categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Daily Quests Table
CREATE TABLE IF NOT EXISTS daily_quests (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    xp_reward INT DEFAULT 25 CHECK (xp_reward > 0),
    completed BOOLEAN DEFAULT FALSE,
    claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for Optimized Performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_custom_categories_type ON custom_categories(type);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
