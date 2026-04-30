import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', 'sbi-card-krisflyer-sbi-card')
    .single();

  if (error) {
    console.error("Error fetching:", error);
    return;
  }
  
  console.log("Card found:", data.name);
  console.log("grid_benefits:", JSON.stringify(data.grid_benefits, null, 2));
  console.log("benefit_items:", JSON.stringify(data.benefit_items, null, 2));
  console.log("grid_fees:", JSON.stringify(data.grid_fees, null, 2));
  console.log("pros:", JSON.stringify(data.pros, null, 2));
  console.log("cons:", JSON.stringify(data.cons, null, 2));
  console.log("product_details:", JSON.stringify(data.product_details, null, 2));
  console.log("detailed_features:", JSON.stringify(data.detailed_features, null, 2));
}

run();
