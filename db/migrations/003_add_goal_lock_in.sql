-- Migration: 003_add_goal_lock_in.sql
-- Description: Adds is_main boolean to goals table for the lock-in main goal feature

ALTER TABLE goals ADD COLUMN IF NOT EXISTS is_main BOOLEAN DEFAULT FALSE;

-- Ensure at most one goal is locked in as main goal (or index for fast lookup)
CREATE INDEX IF NOT EXISTS idx_goals_is_main ON goals(is_main);

-- Set the first goal as the default main goal if none are locked in
UPDATE goals 
SET is_main = TRUE 
WHERE id = (
    SELECT id FROM goals ORDER BY created_at ASC LIMIT 1
) AND NOT EXISTS (
    SELECT 1 FROM goals WHERE is_main = TRUE
);
