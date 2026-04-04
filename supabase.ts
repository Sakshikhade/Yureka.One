/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rvqtlvgaqlgylipsaktm.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ifEDBOCmAz3ya4QU-M3L1g_eaAJL5fD';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Standard client for public operations (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client using service_role key — bypasses RLS
// ONLY used in AdminDashboard for storage bucket creation and file uploads
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});
