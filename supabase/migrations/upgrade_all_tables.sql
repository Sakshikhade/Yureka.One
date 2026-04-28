-- COMPLETE SCHEMA UPGRADE FOR ALL ADMIN TABLES
-- Run this in Supabase SQL Editor → New Query → Run
-- It is safe to run multiple times (uses IF NOT EXISTS)

-- ============================================================
-- 1. CARDS TABLE — Add all columns used by the new card layout
-- ============================================================
ALTER TABLE cards
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS author text,
  ADD COLUMN IF NOT EXISTS reward_type text,
  ADD COLUMN IF NOT EXISTS verdict text,
  ADD COLUMN IF NOT EXISTS final_verdict_text text,
  ADD COLUMN IF NOT EXISTS joining_fee text,
  ADD COLUMN IF NOT EXISTS annual_fee text,
  ADD COLUMN IF NOT EXISTS rewards_rate text,
  ADD COLUMN IF NOT EXISTS projected_savings text,
  ADD COLUMN IF NOT EXISTS apply_link text,
  ADD COLUMN IF NOT EXISTS best_for text,
  ADD COLUMN IF NOT EXISTS intro_offer text,
  ADD COLUMN IF NOT EXISTS elite_rating numeric DEFAULT 4.5,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS benefit_items jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS product_details jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pros jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cons jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS redemption_table jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS latest_news jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS grid_benefits jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS grid_fees jsonb DEFAULT '[]'::jsonb;

-- ============================================================
-- 2. REVIEWS TABLE — Add all columns used by the review form
-- ============================================================
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS company_logo text,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'Direct',
  ADD COLUMN IF NOT EXISTS rotation numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';

-- ============================================================
-- 3. Force schema cache reload (Supabase REST API caches schema)
-- This is the key step that fixes "column not found in schema cache"
-- ============================================================
NOTIFY pgrst, 'reload schema';
