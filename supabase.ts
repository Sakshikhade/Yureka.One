/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Standard client for public operations (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client using service_role key — bypasses RLS
// ONLY used in AdminDashboard for storage bucket creation and file uploads
// If the service role key is missing (e.g. in production config), it falls back to the anon client
// to prevent the application from crashing.
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { 
        autoRefreshToken: false, 
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  : supabase; // Safe fallback to prevent crashes
