-- ======================================================
-- YUREKA.MONEY: THE COMPLETE SYNC REPAIR (v11.0 - FINAL)
-- ======================================================

-- 1. DROP CONFLICTS
DROP FUNCTION IF EXISTS public.check_user_role(text[]);

-- 2. UNIVERSAL POLICY WIPE
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

-- 3. CARDS SCHEMA COMPLETION
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS intro_offer TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS projected_savings TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS benefit_items JSONB;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS verdict TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS elite_rating DECIMAL;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS apply_link TEXT;
ALTER TABLE IF EXISTS public.cards ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- 4. REVIEWS SCHEMA COMPLETION
ALTER TABLE IF EXISTS public.reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- 5. STANDARDIZE AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  record_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. MASTER AUTH HELPER
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

-- 7. ENABLE RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 8. THE MASTER PERMISSION (Allows everything to admins)
CREATE POLICY "Admin_Full_Control" ON public.blogs FOR ALL USING (public.check_user_role(ARRAY['admin', 'editor']));
CREATE POLICY "Admin_Full_Control" ON public.cards FOR ALL USING (public.check_user_role(ARRAY['admin', 'editor']));
CREATE POLICY "Admin_Full_Control" ON public.users FOR ALL USING (public.check_user_role(ARRAY['admin']));
CREATE POLICY "Admin_Full_Control" ON public.waitlist FOR ALL USING (public.check_user_role(ARRAY['admin', 'editor']));
CREATE POLICY "Admin_Full_Control" ON public.reviews FOR ALL USING (public.check_user_role(ARRAY['admin', 'editor']));
CREATE POLICY "Admin_Full_Control" ON public.audit_logs FOR ALL USING (public.check_user_role(ARRAY['admin']));

-- PUBLIC ACCESS (For viewing content)
CREATE POLICY "Public_View_Blogs" ON public.blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Public_View_Cards" ON public.cards FOR SELECT USING (status = 'published');
CREATE POLICY "Public_View_Reviews" ON public.reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Public_Join_Waitlist" ON public.waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 9. GRANT PRIVILEGES
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;

-- 10. FORCE SCHEMA RELOAD
NOTIFY pgrst, 'reload schema';
