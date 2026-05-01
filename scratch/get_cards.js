import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('cards')
    .select('name, slug, image');
  
  if (error) {
    console.error(error);
    return;
  }
  
  const keywords = ['Atlas', 'Emeralde', 'Regalia', 'Magnus', 'Neu', 'Amazon', 'Swiggy', 'Airtel'];
  const matches = data.filter(c => keywords.some(k => c.name.toLowerCase().includes(k.toLowerCase())));
  
  console.log(JSON.stringify(matches, null, 2));
}

run();
