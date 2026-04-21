
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
  const tables = ['cards', 'blogs', 'reviews', 'users'];
  for (const table of tables) {
    console.log(`--- ${table} ---`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
       console.error(`Error fetching ${table}:`, error.message);
    } else if (data && data.length > 0) {
       console.log(`Columns for ${table}:`, Object.keys(data[0]));
    } else {
       console.log(`No data in ${table} to check columns.`);
    }
  }
}

checkSchema();
