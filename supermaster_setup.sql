-- ==========================================
-- YUREKA.MONEY: THE ULTIMATE SUPERMASTER SETUP
-- ==========================================
-- Version: 5.0 (Strict Security & Consolidated)
-- This script merges all migrations into one master file with STRICT ROLE-BASED security.
-- Safe to run multiple times in your Supabase SQL Editor.

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CORE TABLES (Blogs, Cards, Waitlist, Users, Reviews, Audit Logs)

-- BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  category TEXT DEFAULT 'Credit Cards',
  image TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  read_time TEXT DEFAULT '5 min read',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- CARDS TABLE
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  issuer TEXT,
  type TEXT DEFAULT 'Rewards',
  image TEXT,
  rating DECIMAL DEFAULT 4.5,
  benefits TEXT[],
  annual_fee TEXT DEFAULT '₹0',
  joining_fee TEXT DEFAULT '₹0',
  best_for TEXT,
  category TEXT,
  color TEXT DEFAULT 'from-blue-600 to-indigo-700',
  rewards_rate TEXT,
  projected_savings TEXT,
  status TEXT DEFAULT 'published',
  elite_rating NUMERIC(3,1) DEFAULT 4.5,
  benefit_items JSONB,
  verdict TEXT,
  slug TEXT,
  categories TEXT[],
  apply_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- WAITLIST TABLE
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user',
  category TEXT,
  company TEXT,
  status TEXT DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- USERS TABLE (Public Profile)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    image TEXT NOT NULL,
    quote TEXT NOT NULL,
    rotation FLOAT DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT,
  action TEXT,
  table_name TEXT,
  record_id UUID,
  record_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. SCHEMA EVOLUTION (Ensuring all columns exist)
DO $$ 
BEGIN 
  -- Users table decoupling
  ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
    ALTER TABLE public.users ADD COLUMN full_name TEXT;
  END IF;

  -- Blogs columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='scheduled_at') THEN
    ALTER TABLE public.blogs ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Cards columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='elite_rating') THEN
    ALTER TABLE public.cards ADD COLUMN elite_rating NUMERIC(3,1) DEFAULT 4.5;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='benefit_items') THEN
    ALTER TABLE public.cards ADD COLUMN benefit_items JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='verdict') THEN
    ALTER TABLE public.cards ADD COLUMN verdict TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='slug') THEN
    ALTER TABLE public.cards ADD COLUMN slug TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='categories') THEN
    ALTER TABLE public.cards ADD COLUMN categories TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='apply_link') THEN
    ALTER TABLE public.cards ADD COLUMN apply_link TEXT;
  END IF;

  -- Reviews column cleanup
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='company_text') THEN
    ALTER TABLE public.reviews DROP COLUMN company_text;
  END IF;
END $$;

-- 3. FUNCTIONS & TRIGGERS

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- RECURSION-FREE ROLE CHECK (Email Based with Owner Bypass)
CREATE OR REPLACE FUNCTION public.check_user_role(target_role text[])
RETURNS boolean AS $$
BEGIN
  -- Permanent Super Admin (Owner) Bypass
  IF auth.email() = 'toanweshbiswas@gmail.com' THEN RETURN true; END IF;
  
  -- Return true if current auth email matches a team member with the required role
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE email = auth.email() AND role = ANY(target_role)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- AUDIT LOGGING LOGIC
CREATE OR REPLACE FUNCTION public.audit_log_action()
RETURNS trigger AS $$
DECLARE
  r_id uuid;
  r_name text;
  r_data jsonb;
BEGIN
  IF TG_OP = 'DELETE' THEN
    r_data := to_jsonb(OLD);
  ELSE
    r_data := to_jsonb(NEW);
  END IF;

  r_id := (r_data->>'id')::uuid;
  r_name := coalesce(r_data->>'name', r_data->>'title', r_data->>'email', 'Unknown');

  INSERT INTO public.audit_logs (user_email, action, table_name, record_id, record_name)
  VALUES (auth.email(), TG_OP, TG_TABLE_NAME, r_id, r_name);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- AUTH SYNC LOGIC
CREATE OR REPLACE FUNCTION public.handle_new_user_sync()
RETURNS trigger AS $$
BEGIN
  UPDATE public.users SET auth_id = NEW.id WHERE email = NEW.email AND auth_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER ASSIGNMENTS
DO $$
BEGIN
  -- Updated At Triggers
  DROP TRIGGER IF EXISTS update_blogs_updated_at ON public.blogs;
  CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

  DROP TRIGGER IF EXISTS update_cards_updated_at ON public.cards;
  CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

  DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
  CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

  -- Audit Triggers
  DROP TRIGGER IF EXISTS trig_audit_blogs ON public.blogs;
  CREATE TRIGGER trig_audit_blogs AFTER INSERT OR UPDATE OR DELETE ON public.blogs FOR EACH ROW EXECUTE FUNCTION audit_log_action();
  
  DROP TRIGGER IF EXISTS trig_audit_cards ON public.cards;
  CREATE TRIGGER trig_audit_cards AFTER INSERT OR UPDATE OR DELETE ON public.cards FOR EACH ROW EXECUTE FUNCTION audit_log_action();
END $$;

-- 4. SECURITY (ENABLE RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES (Strict Role-Based)
DO $$ 
BEGIN
    -- DROP OLD POLICIES
    DROP POLICY IF EXISTS "Public Read Blogs" ON blogs;
    DROP POLICY IF EXISTS "Allow public read access" ON blogs;
    DROP POLICY IF EXISTS "Allow anonymous insert" ON blogs;
    DROP POLICY IF EXISTS "Allow anonymous update" ON blogs;
    DROP POLICY IF EXISTS "Allow anonymous delete" ON blogs;
    DROP POLICY IF EXISTS "Admin Full Access Blogs" ON blogs;

    DROP POLICY IF EXISTS "Public Read Cards" ON cards;
    DROP POLICY IF EXISTS "Admin Full Access Cards" ON cards;

    DROP POLICY IF EXISTS "Public Insert Waitlist" ON waitlist;
    DROP POLICY IF EXISTS "Admin Full Access Waitlist" ON waitlist;

    DROP POLICY IF EXISTS "Admin Full Access Users" ON users;
    DROP POLICY IF EXISTS "Self Read Users" ON users;

    DROP POLICY IF EXISTS "Admin Full Access Logs" ON audit_logs;

    DROP POLICY IF EXISTS "Allow public read-only access to published reviews" ON reviews;
    DROP POLICY IF EXISTS "Allow full access to authenticated admins" ON reviews;

    -- APPLY STRICT POLICIES
    
    -- BLOGS
    CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (true);
    CREATE POLICY "Admin Full Access Blogs" ON public.blogs FOR ALL USING (public.check_user_role(ARRAY['admin', 'editor', 'writer']));

    -- CARDS
    CREATE POLICY "Public Read Cards" ON public.cards FOR SELECT USING (true);
    CREATE POLICY "Admin Full Access Cards" ON public.cards FOR ALL USING (public.check_user_role(ARRAY['admin', 'editor']));

    -- WAITLIST
    CREATE POLICY "Public Insert Waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);
    CREATE POLICY "Admin Full Access Waitlist" ON public.waitlist FOR ALL USING (public.check_user_role(ARRAY['admin']));

    -- REVIEWS
    CREATE POLICY "Allow public read-only access to published reviews" ON public.reviews FOR SELECT USING (status = 'published');
    CREATE POLICY "Allow full access to authenticated admins" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');

    -- USERS
    CREATE POLICY "Admin Full Access Users" ON public.users FOR ALL USING (public.check_user_role(ARRAY['admin']));
    CREATE POLICY "Self Read Users" ON public.users FOR SELECT USING (auth.email() = email);

    -- AUDIT LOGS
    CREATE POLICY "Admin Full Access Logs" ON public.audit_logs FOR SELECT USING (public.check_user_role(ARRAY['admin']));

END $$;

-- 6. STORAGE SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Media public read" ON storage.objects;
    DROP POLICY IF EXISTS "Media admin upload" ON storage.objects;
    DROP POLICY IF EXISTS "Media admin update" ON storage.objects;
    DROP POLICY IF EXISTS "Media admin delete" ON storage.objects;
    
    DROP POLICY IF EXISTS "Media anon upload" ON storage.objects;
    DROP POLICY IF EXISTS "Media anon update" ON storage.objects;
    DROP POLICY IF EXISTS "Media anon delete" ON storage.objects;

    CREATE POLICY "Media public read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
    
    CREATE POLICY "Media admin upload" ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'media' AND (public.check_user_role(ARRAY['admin', 'editor'])));
    
    CREATE POLICY "Media admin update" ON storage.objects FOR UPDATE 
    USING (bucket_id = 'media' AND (public.check_user_role(ARRAY['admin', 'editor'])));
    
    CREATE POLICY "Media admin delete" ON storage.objects FOR DELETE 
    USING (bucket_id = 'media' AND (public.check_user_role(ARRAY['admin', 'editor'])));
END $$;

-- 7. REAL-TIME PUBLICATIONS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'blogs') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE blogs;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'cards') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE cards;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'audit_logs') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
  END IF;
END $$;

-- 8. SCHEMA RELOAD
NOTIFY pgrst, 'reload schema';
