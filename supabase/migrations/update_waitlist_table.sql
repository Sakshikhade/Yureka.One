-- Migration to enhance waitlist table
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS mobile_number text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS credit_cards_count integer DEFAULT 0;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS credit_cards_details jsonb DEFAULT '[]'::jsonb;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS most_used_for text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS monthly_spend text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS personal_referral_code text UNIQUE;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS source_channel text;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS rank integer;

-- Update existing rank logic if needed
-- We will handle rank incrementing in the service layer for simplicity, 
-- but we could also use a trigger.
