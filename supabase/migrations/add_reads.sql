-- Run in Supabase SQL Editor if posts table already exists without reads columns

ALTER TABLE posts ADD COLUMN IF NOT EXISTS reads INTEGER NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reads_per_day INTEGER NOT NULL DEFAULT 12;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reads_started_at TIMESTAMPTZ;

UPDATE posts
SET reads_started_at = COALESCE(published_at, created_at)
WHERE reads_started_at IS NULL;
