import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tjxmsllzksrbskqktyls.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '...'; // Need to grep these
