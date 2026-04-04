import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://rvqtlvgaqlgylipsaktm.supabase.co', 'sb_publishable_ifEDBOCmAz3ya4QU-M3L1g_eaAJL5fD');

async function verify() {
  // Check bucket
  console.log("=== Checking Storage ===");
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log("Buckets:", buckets?.map(b => b.name));
  
  // Test Blog Read
  console.log("\n=== Testing Blog Read ===");
  const { data: readData, error: readErr } = await supabase.from('blogs').select('id,title').limit(3);
  console.log("Read:", readData, readErr);
}

verify();
