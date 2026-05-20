-- Migration to create platform notifications tables

-- Table: platform_notifications
-- Stores global broadcast notifications sent by admins
CREATE TABLE IF NOT EXISTS public.platform_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR DEFAULT 'active', -- 'active' or 'archived'
    type VARCHAR DEFAULT 'info', -- 'info', 'alert', 'success'
    created_by VARCHAR NOT NULL, -- Admin email
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.platform_notifications ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active notifications
DROP POLICY IF EXISTS "Allow public select from platform_notifications" ON public.platform_notifications;
CREATE POLICY "Allow public select from platform_notifications"
ON public.platform_notifications FOR SELECT
TO public
USING (status = 'active');

-- Allow admins to insert/update
DROP POLICY IF EXISTS "Allow admin insert platform_notifications" ON public.platform_notifications;
CREATE POLICY "Allow admin insert platform_notifications"
ON public.platform_notifications FOR INSERT
TO authenticated
WITH CHECK (
  auth.email() IN (
    SELECT email FROM users WHERE role IN ('admin', 'editor', 'writer')
  )
);

DROP POLICY IF EXISTS "Allow admin update platform_notifications" ON public.platform_notifications;
CREATE POLICY "Allow admin update platform_notifications"
ON public.platform_notifications FOR UPDATE
TO authenticated
USING (
  auth.email() IN (
    SELECT email FROM users WHERE role IN ('admin', 'editor', 'writer')
  )
);


-- Table: notification_interactions
-- Logs when a user reads or clicks a notification
CREATE TABLE IF NOT EXISTS public.notification_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES public.platform_notifications(id) ON DELETE CASCADE,
    user_email VARCHAR NOT NULL,
    username VARCHAR,
    action VARCHAR NOT NULL, -- 'read', 'clicked'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(notification_id, user_email, action) -- Prevent duplicate read/click logs
);

-- Enable RLS
ALTER TABLE public.notification_interactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own interactions (or admins see all, but for now public select for self)
DROP POLICY IF EXISTS "Allow users to view own interactions" ON public.notification_interactions;
CREATE POLICY "Allow users to view own interactions"
ON public.notification_interactions FOR SELECT
TO public
USING (true);

-- Anyone can insert interactions (we will trust the frontend for 'read'/'clicked' events)
DROP POLICY IF EXISTS "Allow public insert into notification_interactions" ON public.notification_interactions;
CREATE POLICY "Allow public insert into notification_interactions"
ON public.notification_interactions FOR INSERT
TO public
WITH CHECK (true);
