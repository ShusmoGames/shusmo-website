-- Supabase Schema Migration for Published Field
-- Run this in your Supabase SQL Editor to add the published column

-- Add published column to games table
ALTER TABLE games ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;

-- Set existing games to published
UPDATE games SET published = true WHERE published IS NULL;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS games_published_idx ON games(published);
