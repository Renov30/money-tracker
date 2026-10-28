-- Rollback: 001_create_schema.down.sql
-- Description: Drops tables and indices created in 001_create_schema.sql

DROP INDEX IF EXISTS idx_goals_category;
DROP INDEX IF EXISTS idx_custom_categories_type;
DROP INDEX IF EXISTS idx_transactions_category;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_date;

DROP TABLE IF EXISTS daily_quests CASCADE;
DROP TABLE IF EXISTS custom_categories CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS schema_migrations CASCADE;
