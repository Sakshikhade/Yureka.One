-- Migration to create the generic platform_trash table

CREATE TABLE IF NOT EXISTS public.platform_trash (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR NOT NULL, -- e.g. 'blog', 'card', 'notification', 'user', 'waitlist', 'review'
    original_id VARCHAR NOT NULL, -- The original ID of the item
    payload JSONB NOT NULL,       -- The full JSON object of the deleted row
    deleted_by VARCHAR,           -- Admin email who deleted it
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.platform_trash ENABLE ROW LEVEL SECURITY;

-- Admins can read
DROP POLICY IF EXISTS "Allow admin select platform_trash" ON public.platform_trash;
CREATE POLICY "Allow admin select platform_trash"
ON public.platform_trash FOR SELECT
TO authenticated
USING (
  auth.email() IN (
    SELECT email FROM users WHERE role IN ('admin', 'editor', 'writer')
  )
);

-- Admins can insert
DROP POLICY IF EXISTS "Allow admin insert platform_trash" ON public.platform_trash;
CREATE POLICY "Allow admin insert platform_trash"
ON public.platform_trash FOR INSERT
TO authenticated
WITH CHECK (
  auth.email() IN (
    SELECT email FROM users WHERE role IN ('admin', 'editor', 'writer')
  )
);

-- Admins can delete (permanently delete)
DROP POLICY IF EXISTS "Allow admin delete platform_trash" ON public.platform_trash;
CREATE POLICY "Allow admin delete platform_trash"
ON public.platform_trash FOR DELETE
TO authenticated
USING (
  auth.email() IN (
    SELECT email FROM users WHERE role IN ('admin', 'editor', 'writer')
  )
);
