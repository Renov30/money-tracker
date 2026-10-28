-- Migration Rollback: 003_add_goal_lock_in.down.sql
-- Description: Reverts is_main column on goals table

DROP INDEX IF EXISTS idx_goals_is_main;
ALTER TABLE goals DROP COLUMN IF EXISTS is_main;
