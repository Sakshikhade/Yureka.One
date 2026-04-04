-- Refinement: Remove company_text and consolidate into company
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='company_text') THEN
        ALTER TABLE public.reviews DROP COLUMN company_text;
    END IF;
END $$;

-- Verify RLS (should be fine but re-applying to be sure)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Re-apply policies if they were somehow disrupted
DROP POLICY IF EXISTS "Allow public read-only access to published reviews" ON public.reviews;
CREATE POLICY "Allow public read-only access to published reviews" 
ON public.reviews FOR SELECT 
USING (status = 'published');

DROP POLICY IF EXISTS "Allow full access to authenticated admins" ON public.reviews;
CREATE POLICY "Allow full access to authenticated admins" 
ON public.reviews FOR ALL 
USING (auth.role() = 'authenticated');
