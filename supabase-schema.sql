-- Supabase Schema for Shusmo Website
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Enable Google OAuth in Supabase Dashboard
-- ============================================
-- Go to: Authentication -> Providers -> Google
-- Enable it and add your Google OAuth credentials
-- Redirect URL: https://your-project-id.supabase.co/auth/v1/callback

-- ============================================
-- 2. Update Games Table Schema
-- ============================================

-- Add new columns if they don't exist
ALTER TABLE games ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS games_slug_key ON games(slug);

-- ============================================
-- 3. Create Admin Access Table
-- ============================================

-- Table to store authorized admin emails
CREATE TABLE IF NOT EXISTS admin_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_access
ALTER TABLE admin_access ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own access status
CREATE POLICY "Authenticated users can check access"
  ON admin_access
  FOR SELECT
  TO authenticated
  USING (auth.email() = email);

-- Only allow service role to insert/update (manage via dashboard or SQL)
CREATE POLICY "Service role can manage admin access"
  ON admin_access
  FOR ALL
  TO service_role
  USING (true);

-- ============================================
-- 4. Create Function to Check Admin Access
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_access
    WHERE email = auth.email()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. Update Games Table RLS Policies
-- ============================================

-- Enable RLS on games table
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON games;
DROP POLICY IF EXISTS "Allow authenticated read access" ON games;
DROP POLICY IF EXISTS "Allow admin insert" ON games;
DROP POLICY IF EXISTS "Allow admin update" ON games;
DROP POLICY IF EXISTS "Allow admin delete" ON games;

-- Public can read games
CREATE POLICY "Allow public read access"
  ON games
  FOR SELECT
  TO public
  USING (true);

-- Only admins can insert games
CREATE POLICY "Allow admin insert"
  ON games
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can update games
CREATE POLICY "Allow admin update"
  ON games
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete games
CREATE POLICY "Allow admin delete"
  ON games
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- 6. Add Your Admin Email
-- ============================================

-- Replace with your actual admin email
-- INSERT INTO admin_access (email) VALUES ('your-email@example.com');

-- ============================================
-- 7. Configure Google OAuth Redirect URLs
-- ============================================

-- In Supabase Dashboard:
-- Authentication -> URL Configuration
-- Add your site URL to "Site URL": https://your-domain.com
-- Add to "Redirect URLs": https://your-domain.com/admin

-- For local development:
-- Site URL: http://localhost:5173
-- Redirect URLs: http://localhost:5173/admin

-- ============================================
-- 8. Storage Setup (Optional - for image uploads)
-- ============================================

-- Create a bucket for game images
-- Run this in Supabase Dashboard -> Storage -> New Bucket
-- Bucket name: game-images
-- Public: true

-- Storage RLS Policies (optional, if using Supabase Storage)
-- CREATE POLICY "Public Access"
--   ON storage.objects FOR SELECT
--   TO public
--   USING (bucket_id = 'game-images');

-- CREATE POLICY "Admin Upload Access"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     bucket_id = 'game-images' AND
--     is_admin()
--   );
