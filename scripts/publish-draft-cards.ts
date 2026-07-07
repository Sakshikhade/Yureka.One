// Bulk-publish cards inserted as drafts by sync-card-dataset.ts.
// Strips any stray URLs the scrape left embedded in free-text fields before
// publishing, since scraped source/redirect links must not reach production.
// User-approved: publish all cards currently in draft status (verified to be
// exactly the 1207 cards this session's CSV sync inserted; there were zero
// pre-existing drafts before that sync ran).
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
);

const URL_RE = /https?:\/\/\S+|www\.\S+/gi;

function stripUrls(s: string): string {
  return s.replace(URL_RE, '').replace(/\s{2,}/g, ' ').trim();
}

interface DraftCard {
  id: string;
  name: string;
  welcome_benefits: string | null;
  rewards_rate: string | null;
  annual_fee: string | null;
  joining_fee: string | null;
  pros: string[] | null;
  cons: string[] | null;
  categories: string[] | null;
}

async function fetchAllDrafts(): Promise<DraftCard[]> {
  const pageSize = 1000;
  let all: DraftCard[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('cards')
      .select('id, name, welcome_benefits, rewards_rate, annual_fee, joining_fee, pros, cons, categories')
      .eq('status', 'draft')
      .range(from, from + pageSize - 1);
    if (error) throw error;
    all = all.concat(data as DraftCard[]);
    if (data.length < pageSize) break;
  }
  return all;
}

async function main() {
  const drafts = await fetchAllDrafts();
  console.log(`Found ${drafts.length} draft cards.`);

  let linksStripped = 0;
  for (const c of drafts) {
    const updates: Record<string, unknown> = {};

    if (c.welcome_benefits && URL_RE.test(c.welcome_benefits)) {
      updates.welcome_benefits = stripUrls(c.welcome_benefits);
    }
    if (c.rewards_rate && URL_RE.test(c.rewards_rate)) {
      updates.rewards_rate = stripUrls(c.rewards_rate);
    }
    if (c.annual_fee && URL_RE.test(c.annual_fee)) {
      updates.annual_fee = stripUrls(c.annual_fee);
    }
    if (c.joining_fee && URL_RE.test(c.joining_fee)) {
      updates.joining_fee = stripUrls(c.joining_fee);
    }
    for (const field of ['pros', 'cons', 'categories'] as const) {
      const arr = c[field];
      if (Array.isArray(arr) && arr.some((x) => URL_RE.test(x))) {
        updates[field] = arr.map((x) => stripUrls(x)).filter((x) => x.length > 0);
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.from('cards').update(updates).eq('id', c.id);
      if (error) {
        console.error(`  [strip error] ${c.name}:`, error.message);
        continue;
      }
      linksStripped++;
      console.log(`  Stripped link(s) from: ${c.name}`);
    }
  }

  console.log(`\nLinks stripped from ${linksStripped} card(s). Publishing all drafts...`);

  const ids = drafts.map((d) => d.id);
  let publishedCount = 0;
  const chunkSize = 500;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('cards')
      .update({ status: 'published' })
      .in('id', chunk)
      .select('id');
    if (error) {
      console.error('Publish failed for chunk:', error);
      process.exit(1);
    }
    publishedCount += data?.length ?? 0;
  }

  console.log(`Published ${publishedCount} cards.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
