-- ======================================================
-- YUREKA.MONEY: GLOBAL MASTER SYNC (v11.0 - FINAL)
-- ======================================================

-- 1. DROP CONFLICTS
DROP FUNCTION IF EXISTS public.check_user_role(text[]);

-- 2. POLICY WIPE
DO $$ 
DECLARE 
    pol record;
    target_tables text[] := ARRAY['blogs', 'cards', 'reviews', 'users', 'waitlist', 'audit_logs'];
    t text;
BEGIN 
    FOREACH t IN ARRAY target_tables LOOP
        FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = t AND schemaname = 'public' LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
        END LOOP;
    END LOOP;
END $$;

-- 3. SCHEMA ALIGNMENT (FORCE ADD COLUMNS)
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS intro_offer TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS benefit_items JSONB;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS verdict TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- 4. TABLE CREATION/VERIFICATION
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user',
  category TEXT,
  company TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  record_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. THE MASTER ACCESS FUNCTION
CREATE OR REPLACE FUNCTION public.check_user_role(target_roles text[])
RETURNS boolean AS $$
BEGIN
  IF (auth.jwt() ->> 'email') = 'toanweshbiswas@gmail.com' THEN RETURN true; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE email = (auth.jwt() ->> 'email') AND role = ANY(target_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ABSOLUTE PERMISSIONS (MASTER ACCESS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master_Access_Policy" ON public.blogs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Master_Access_Policy" ON public.cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Master_Access_Policy" ON public.waitlist FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Master_Access_Policy" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Master_Access_Policy" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- 7. GRANT UNIVERSAL PRIVILEGES
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;

-- 8. FORCE RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
