-- Add primary/secondary designation to user_owned_cards
ALTER TABLE public.user_owned_cards
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_secondary BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS synced_from_waitlist BOOLEAN DEFAULT false;
