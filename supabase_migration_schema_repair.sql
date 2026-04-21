-- ======================================================
-- YUREKA.MONEY: SCHEMA REPAIR (v12.3)
-- ======================================================

-- CARDS TABLE: ADD MISSING COLUMNS
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS issuer TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Rewards';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS rating DECIMAL DEFAULT 4.5;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS elite_rating DECIMAL DEFAULT 4.5;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS benefit_items JSONB DEFAULT '[]';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS verdict TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS apply_link TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS annual_fee TEXT DEFAULT '₹0';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS joining_fee TEXT DEFAULT '₹0';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS intro_offer TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS best_for TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'from-blue-600 to-indigo-700';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS rewards_rate TEXT DEFAULT '5%';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS projected_savings TEXT DEFAULT '₹12,000/yr';
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Ensure slug is unique
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cards_slug_key') THEN
        ALTER TABLE public.cards ADD CONSTRAINT cards_slug_key UNIQUE (slug);
    END IF;
END $$;

-- REVIEWS TABLE: ADD STATUS
ALTER TABLE IF EXISTS public.reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Refresh schema
NOTIFY pgrst, 'reload schema';
