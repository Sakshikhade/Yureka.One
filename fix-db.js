import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://rvqtlvgaqlgylipsaktm.supabase.co', 'sb_publishable_ifEDBOCmAz3ya4QU-M3L1g_eaAJL5fD');

async function fix() {
  console.log("Checking buckets...");
  
  // Create bucket if it doesn't exist
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const hasMedia = buckets?.find(b => b.name === 'media');
    if (!hasMedia) {
      console.log("Creating 'media' bucket...");
      await supabase.storage.createBucket('media', { public: true });
    } else {
      console.log("'media' bucket already exists.");
    }
  } catch (e) {
    console.error("Bucket err:", e.message);
  }

  // We can't trivially execute raw SQL via client SDK without RPC, but we can verify insert.
  // Wait, if RLS fails, the JS client CANNOT fix RLS policies. RLS must be fixed in SQL.
}

fix();
