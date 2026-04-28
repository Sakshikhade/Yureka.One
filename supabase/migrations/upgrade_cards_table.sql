-- SQL Script to upgrade the "cards" table to support the new Detailed Review layout
-- Run this in your Supabase SQL Editor

ALTER TABLE cards
  ADD COLUMN IF NOT EXISTS reward_type text,
  ADD COLUMN IF NOT EXISTS welcome_benefits text,
  ADD COLUMN IF NOT EXISTS product_details jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pros jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cons jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS detailed_features text,
  ADD COLUMN IF NOT EXISTS cashback_details text,
  ADD COLUMN IF NOT EXISTS redemption_table jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS exclusions text,
  ADD COLUMN IF NOT EXISTS eligibility_criteria jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS comparison_cards text,
  ADD COLUMN IF NOT EXISTS latest_news jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS final_review_image text,
  ADD COLUMN IF NOT EXISTS final_verdict_text text,
  ADD COLUMN IF NOT EXISTS grid_benefits jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS grid_fees jsonb DEFAULT '[]'::jsonb;
