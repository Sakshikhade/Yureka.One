-- ============================================================
-- FIX: Blog Table Row Level Security
-- Run this entire script in your Supabase SQL Editor
-- ============================================================

-- Step 1: Enable RLS on the blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any old conflicting policies
DROP POLICY IF EXISTS "Allow public read access" ON public.blogs;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.blogs;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.blogs;
DROP POLICY IF EXISTS "Allow anonymous delete" ON public.blogs;
DROP POLICY IF EXISTS "Admins can do everything" ON public.blogs;
DROP POLICY IF EXISTS "Public can read published blogs" ON public.blogs;

-- Step 3: Create clean, permissive policies for all operations
-- (The Admin Dashboard uses the anon key, so we need anon-level write access)
CREATE POLICY "Allow public read access"
ON public.blogs FOR SELECT
USING (true);

CREATE POLICY "Allow anonymous insert"
ON public.blogs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous update"
ON public.blogs FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete"
ON public.blogs FOR DELETE
USING (true);

-- ============================================================
-- FIX: Supabase Storage / Media Bucket
-- ============================================================

-- Step 4: Create the 'media' storage bucket for image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 5: Set storage policies to allow public read + anon upload
DROP POLICY IF EXISTS "Media public read" ON storage.objects;
DROP POLICY IF EXISTS "Media anon upload" ON storage.objects;
DROP POLICY IF EXISTS "Media anon update" ON storage.objects;
DROP POLICY IF EXISTS "Media anon delete" ON storage.objects;

CREATE POLICY "Media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Media anon upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Media anon update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media');

CREATE POLICY "Media anon delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'media');
