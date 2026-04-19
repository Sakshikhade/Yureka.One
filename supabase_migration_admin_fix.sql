-- UNIFIED ADMIN & PLATFORM REPAIR SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO FIX ALL ADMIN FAILURES

-- 1. STANDARDIZE AUDIT LOGS TABLE
DROP TABLE IF EXISTS public.logs; -- Remove the old temp table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT,
  action TEXT NOT NULL, -- e.g. 'INSERT', 'UPDATE', 'DELETE'
  table_name TEXT NOT NULL, -- e.g. 'cards', 'blogs'
  record_id TEXT,
  record_name TEXT, -- The name of the card/blog for the UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (system logs) but only admins to view
DROP POLICY IF EXISTS "Public can create logs" ON public.audit_logs;
CREATE POLICY "Public can create logs" ON public.audit_logs FOR INSERT TO authenticated, anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view logs" ON public.audit_logs;
CREATE POLICY "Admins can view logs" ON public.audit_logs FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.email = auth.jwt() ->> 'email' 
    AND users.role IN ('admin', 'editor')
  )
);

-- 2. REPAIR WAITLIST RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage waitlist" ON public.waitlist;
CREATE POLICY "Admins can manage waitlist" ON public.waitlist FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.email = auth.jwt() ->> 'email' 
    AND users.role IN ('admin', 'editor')
  )
);

-- 3. REPAIR REVIEWS RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.email = auth.jwt() ->> 'email' 
    AND users.role IN ('admin', 'editor')
  )
);

DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);

-- 4. REPAIR USERS RLS (TEAM MANAGEMENT)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile or admins all" ON public.users;
CREATE POLICY "Users can view own profile or admins all" ON public.users FOR SELECT TO authenticated
USING (
  (auth.jwt() ->> 'email' = email) OR
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.email = auth.jwt() ->> 'email' 
    AND u.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can manage users" ON public.users;
CREATE POLICY "Admins can manage users" ON public.users FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.email = auth.jwt() ->> 'email' 
    AND u.role = 'admin'
  )
);
