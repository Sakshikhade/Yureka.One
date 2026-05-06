-- Add external_link column to blogs table
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS external_link TEXT;

-- Update existing rows to have NULL (default behavior, but explicit for clarity)
-- UPDATE public.blogs SET external_link = NULL WHERE external_link IS NULL;
