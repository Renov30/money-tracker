-- Rollback: 002_add_soft_delete.down.sql
-- Description: Reverts soft delete changes

DROP INDEX IF EXISTS idx_transactions_deleted_at;
ALTER TABLE transactions DROP COLUMN IF EXISTS deleted_at;
