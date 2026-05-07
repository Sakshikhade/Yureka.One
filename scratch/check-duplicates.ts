import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  const { data, error } = await supabase
    .from('waitlist')
    .select('email')
    .then(res => {
      const counts = {};
      res.data.forEach(item => {
        counts[item.email] = (counts[item.email] || 0) + 1;
      });
      const dups = Object.entries(counts).filter(([email, count]) => count > 1);
      console.log("Duplicates:", dups);
    });
}

checkDuplicates();
