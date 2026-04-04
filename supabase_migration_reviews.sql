-- Migration to create the reviews table for testimonials
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    company_text TEXT,
    image TEXT NOT NULL,
    quote TEXT NOT NULL,
    rotation FLOAT DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read-only access to published reviews" 
ON public.reviews FOR SELECT 
USING (status = 'published');

-- Admin full access (assuming team members have their emails in a 'users' table or similar logic)
-- For simplicity, since the admin check is handle in the service layer, we allow all for authenticated if they are admin.
-- But given the current setup, we'll allow all operations for authenticated users (admins)
CREATE POLICY "Allow full access to authenticated admins" 
ON public.reviews FOR ALL 
USING (auth.role() = 'authenticated');

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();
