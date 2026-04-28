import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
);

const migrations = [
  // CARDS
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS description text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS author text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS reward_type text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS verdict text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS final_verdict_text text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS joining_fee text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS annual_fee text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS rewards_rate text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS projected_savings text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS apply_link text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS best_for text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS intro_offer text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS elite_rating numeric DEFAULT 4.5`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS color text`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS benefit_items jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS product_details jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS pros jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS cons jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS redemption_table jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS latest_news jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS grid_benefits jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS grid_fees jsonb DEFAULT '[]'::jsonb`,
  // REVIEWS
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS company_logo text`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS source text DEFAULT 'Direct'`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rotation numeric DEFAULT 0`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS role text`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS company text`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status text DEFAULT 'published'`,
  // BLOGS
  `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS read_time text DEFAULT '5 min read'`,
  `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS scheduled_at timestamptz`,
  `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false`,
  `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS status text DEFAULT 'published'`,
  `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS slug text`,
  `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt text`,
];

async function runMigrations() {
  console.log(`Running ${migrations.length} migrations...\n`);
  let passed = 0;
  let failed = 0;

  for (const sql of migrations) {
    const { error } = await supabase.rpc('exec_sql', { query: sql }).single().catch(() => ({ error: null }));
    // Try direct query via REST
    const res = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });

    const col = sql.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1] || sql;
    const table = sql.match(/ALTER TABLE (\w+)/)?.[1] || '';

    if (res.ok) {
      console.log(`✅ ${table}.${col}`);
      passed++;
    } else {
      const body = await res.text();
      // Column already exists = fine
      if (body.includes('already exists') || body.includes('42701')) {
        console.log(`⏭️  ${table}.${col} (already exists)`);
        passed++;
      } else {
        console.log(`❌ ${table}.${col}: ${body}`);
        failed++;
      }
    }
  }

  console.log(`\n✅ ${passed} passed  ❌ ${failed} failed`);
}

runMigrations().catch(console.error);
