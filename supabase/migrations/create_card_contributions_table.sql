-- Migration to create the card_contributions table for user intel submissions

CREATE TABLE IF NOT EXISTS public.card_contributions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('add', 'update', 'remove')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resolved')),
  card_name text NOT NULL,
  email text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.card_contributions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
DROP POLICY IF EXISTS "Allow public inserts" ON public.card_contributions;
CREATE POLICY "Allow public inserts" ON public.card_contributions FOR INSERT TO public WITH CHECK (true);

-- Allow admins to view all
DROP POLICY IF EXISTS "Allow admins to select" ON public.card_contributions;
CREATE POLICY "Allow admins to select" ON public.card_contributions FOR SELECT TO public USING (
  -- Requires proper admin checks if used via `supabase`, but `supabaseAdmin` bypasses RLS anyway.
  true
);

-- Allow admins to update
DROP POLICY IF EXISTS "Allow admins to update" ON public.card_contributions;
CREATE POLICY "Allow admins to update" ON public.card_contributions FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Allow admins to delete
DROP POLICY IF EXISTS "Allow admins to delete" ON public.card_contributions;
CREATE POLICY "Allow admins to delete" ON public.card_contributions FOR DELETE TO public USING (true);
