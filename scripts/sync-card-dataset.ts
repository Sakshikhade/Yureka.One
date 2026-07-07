// One-off migration: sync `data set/*.csv` scrape data into the Supabase `cards` table.
// Streams each CSV (files contain embedded newlines inside quoted fields, so a
// line-based reader would corrupt rows), matches existing cards by normalized
// (name, bank), updates only the fields the CSV can confidently supply, and
// inserts missing cards as drafts for editorial review.
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_DIR = path.join(process.cwd(), 'data set');

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeJsonArray(raw: string | undefined): string[] {
  if (!raw || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === 'string' && x.trim() !== '');
    return [];
  } catch {
    return [];
  }
}

function arraysEqual(a: string[] | null | undefined, b: string[]): boolean {
  const aa = a || [];
  if (aa.length !== b.length) return false;
  return aa.every((v, i) => v === b[i]);
}

// Streaming RFC4180-ish CSV parser: handles quoted fields containing commas,
// newlines, and doubled "" escapes — required since these files embed
// multi-line prose inside quoted cells.
async function parseCsvRows(filePath: string, onRow: (row: string[]) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let field = '';
    let row: string[] = [];
    let inQuotes = false;
    let prevChar = '';

    stream.on('data', (chunk: string) => {
      for (let i = 0; i < chunk.length; i++) {
        const c = chunk[i];

        if (inQuotes) {
          if (c === '"') {
            if (chunk[i + 1] === '"') {
              field += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            field += c;
          }
          prevChar = c;
          continue;
        }

        if (c === '"') {
          inQuotes = true;
        } else if (c === ',') {
          row.push(field);
          field = '';
        } else if (c === '\n') {
          if (prevChar !== '\r') {
            row.push(field);
            field = '';
            onRow(row);
            row = [];
          }
        } else if (c === '\r') {
          row.push(field);
          field = '';
          onRow(row);
          row = [];
        } else {
          field += c;
        }
        prevChar = c;
      }
    });

    stream.on('end', () => {
      if (field !== '' || row.length > 0) {
        row.push(field);
        onRow(row);
      }
      resolve();
    });

    stream.on('error', reject);
  });
}

interface ExistingCard {
  id: string;
  name: string;
  bank: string;
  annual_fee: string | null;
  joining_fee: string | null;
  rewards_rate: string | null;
  welcome_benefits: string | null;
  rating: number | null;
  pros: string[] | null;
  cons: string[] | null;
  categories: string[] | null;
  slug: string | null;
}

async function main() {
  console.log('Fetching existing cards from Supabase...');
  const { data: existingCards, error: fetchError } = await supabase
    .from('cards')
    .select('id, name, bank, annual_fee, joining_fee, rewards_rate, welcome_benefits, rating, pros, cons, categories, slug');

  if (fetchError) {
    console.error('Failed to fetch existing cards:', fetchError);
    process.exit(1);
  }

  const byKey = new Map<string, ExistingCard>();
  const slugs = new Set<string>();
  for (const c of existingCards as ExistingCard[]) {
    byKey.set(`${normalize(c.name)}|${normalize(c.bank || '')}`, c);
    if (c.slug) slugs.add(c.slug);
  }
  console.log(`Loaded ${byKey.size} existing cards.\n`);

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => /master_dataset\s*\.csv$/i.test(f))
    .sort();

  const summary = {
    rowsRead: 0,
    skippedNoKey: 0,
    updated: 0,
    unchanged: 0,
    inserted: 0,
    errors: 0,
  };

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    let headers: string[] | null = null;
    let fileRows = 0;
    let fileUpdated = 0;
    let fileInserted = 0;
    let fileUnchanged = 0;
    let fileErrors = 0;

    const rows: string[][] = [];
    await parseCsvRows(filePath, (row) => {
      if (!headers) {
        headers = row.map((h) => h.trim());
        return;
      }
      if (row.length === 1 && row[0].trim() === '') return; // trailing blank line
      rows.push(row);
    });

    for (const row of rows) {
      fileRows++;
      summary.rowsRead++;

      const record: Record<string, string> = {};
      headers!.forEach((h, i) => {
        record[h] = (row[i] ?? '').trim();
      });

      const name = record.card_name;
      const bank = record.issuing_bank || record.issuing_bank_raw;
      if (!name || !bank) {
        summary.skippedNoKey++;
        continue;
      }

      const categories = safeJsonArray(record.categories);
      const pros = safeJsonArray(record.pros);
      const cons = safeJsonArray(record.cons);
      const annualFee = record.annual_fee || null;
      const joiningFee = record.joining_fee || null;
      const rewardsRate = record.reward_rate || null;
      const welcomeBenefits = record.welcome_benefits || null;
      const ratingParsed = parseFloat(record.rating);
      const rating = Number.isFinite(ratingParsed) ? ratingParsed : null;

      const key = `${normalize(name)}|${normalize(bank)}`;
      const existing = byKey.get(key);

      if (existing) {
        const updates: Record<string, unknown> = {};
        if (annualFee && annualFee !== existing.annual_fee) updates.annual_fee = annualFee;
        if (joiningFee && joiningFee !== existing.joining_fee) updates.joining_fee = joiningFee;
        if (rewardsRate && rewardsRate !== existing.rewards_rate) updates.rewards_rate = rewardsRate;
        if (welcomeBenefits && welcomeBenefits !== existing.welcome_benefits) updates.welcome_benefits = welcomeBenefits;
        if (rating !== null && rating !== existing.rating) updates.rating = rating;
        if (pros.length > 0 && !arraysEqual(existing.pros, pros)) updates.pros = pros;
        if (cons.length > 0 && !arraysEqual(existing.cons, cons)) updates.cons = cons;
        if (categories.length > 0 && !arraysEqual(existing.categories, categories)) updates.categories = categories;

        if (Object.keys(updates).length === 0) {
          fileUnchanged++;
          summary.unchanged++;
          continue;
        }

        const { error } = await supabase.from('cards').update(updates).eq('id', existing.id);
        if (error) {
          console.error(`  [update error] ${name} (${bank}):`, error.message);
          fileErrors++;
          summary.errors++;
          continue;
        }
        Object.assign(existing, updates);
        fileUpdated++;
        summary.updated++;
      } else {
        let slug = slugify(`${name}-${bank}`);
        let suffix = 2;
        while (slugs.has(slug)) {
          slug = `${slugify(`${name}-${bank}`)}-${suffix++}`;
        }

        const insertPayload = {
          name,
          bank,
          issuer: bank,
          type: categories[0] || 'Uncategorized',
          category: categories[0] || null,
          categories: categories.length > 0 ? categories : null,
          annual_fee: annualFee,
          joining_fee: joiningFee,
          rewards_rate: rewardsRate,
          welcome_benefits: welcomeBenefits,
          rating: rating ?? 0,
          elite_rating: rating ?? 0,
          pros: pros.length > 0 ? pros : null,
          cons: cons.length > 0 ? cons : null,
          slug,
          status: 'draft',
        };

        const { data: inserted, error } = await supabase.from('cards').insert([insertPayload]).select().single();
        if (error) {
          console.error(`  [insert error] ${name} (${bank}):`, error.message);
          fileErrors++;
          summary.errors++;
          continue;
        }
        slugs.add(slug);
        byKey.set(key, {
          id: inserted.id,
          name,
          bank,
          annual_fee: annualFee,
          joining_fee: joiningFee,
          rewards_rate: rewardsRate,
          welcome_benefits: welcomeBenefits,
          rating: rating ?? 0,
          pros,
          cons,
          categories,
          slug,
        });
        fileInserted++;
        summary.inserted++;
      }
    }

    console.log(
      `${file}: ${fileRows} rows -> ${fileUpdated} updated, ${fileInserted} inserted, ${fileUnchanged} unchanged, ${fileErrors} errors`
    );
  }

  console.log('\n=== Summary ===');
  console.log(`Rows read:        ${summary.rowsRead}`);
  console.log(`Skipped (no key): ${summary.skippedNoKey}`);
  console.log(`Updated:          ${summary.updated}`);
  console.log(`Unchanged:        ${summary.unchanged}`);
  console.log(`Inserted:         ${summary.inserted}`);
  console.log(`Errors:           ${summary.errors}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
