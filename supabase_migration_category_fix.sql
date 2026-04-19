-- Migration to add category column to cards table
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing cards if needed (optional, e.g. setting a default or mapping from benefit_items)
-- UPDATE public.cards SET category = 'Shopping' WHERE category IS NULL;
