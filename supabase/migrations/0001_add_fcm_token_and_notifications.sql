-- Migration: add fcm_token to users and optional notifications table
-- Run in Supabase SQL editor or apply via supabase CLI

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS fcm_token TEXT;

CREATE INDEX IF NOT EXISTS idx_users_fcm_token ON public.users (fcm_token);

-- Optional: table to track notifications
-- Uncomment to create the table
--
-- CREATE TABLE IF NOT EXISTS public.notifications (
--   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
--   user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
--   title text NOT NULL,
--   body text NOT NULL,
--   data jsonb,
--   fcm_token text,
--   sent_at timestamptz DEFAULT now(),
--   status text DEFAULT 'pending'
-- );
--
-- CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
-- CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications (status);
