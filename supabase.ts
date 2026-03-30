/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rvqtlvgaqlgylipsaktm.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ifEDBOCmAz3ya4QU-M3L1g_eaAJL5fD';

export const supabase = createClient(supabaseUrl, supabaseKey);
