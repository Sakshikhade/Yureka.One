-- Add image_url to platform_notifications
ALTER TABLE public.platform_notifications
ADD COLUMN image_url TEXT;
