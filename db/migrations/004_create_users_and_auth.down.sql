-- Migration Rollback: 004_create_users_and_auth.down.sql
-- Description: Drops sessions and users tables

DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
