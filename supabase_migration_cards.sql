-- Run this script in your Supabase SQL Editor to map the new Card types we added into the Postgres Schema!

ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS elite_rating NUMERIC(3,1) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS benefit_items JSONB,
ADD COLUMN IF NOT EXISTS verdict TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS categories TEXT[],
ADD COLUMN IF NOT EXISTS apply_link TEXT;
