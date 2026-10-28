-- Migration: 002_add_soft_delete.sql
-- Description: Adds deleted_at column to transactions for soft delete and 30-day trash retention

ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_deleted_at ON transactions(deleted_at);
