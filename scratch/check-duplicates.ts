import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDuplicates() {
  console.log("🔍 Checking for duplicate cards in database...");
  
  const { data: cards, error } = await supabase.from("cards").select("id, name, bank, slug");
  
  if (error) {
    console.error("❌ Fetch failed:", error);
    return;
  }

  console.log(`📊 Total cards found: ${cards.length}`);
  
  const seenSlugs = new Map();
  const duplicates: any[] = [];

  cards.forEach(card => {
    if (seenSlugs.has(card.slug)) {
      duplicates.push({
        slug: card.slug,
        ids: [seenSlugs.get(card.slug), card.id]
      });
    } else {
      seenSlugs.set(card.slug, card.id);
    }
  });

  if (duplicates.length > 0) {
    console.warn("⚠️ FOUND DUPLICATES BY SLUG:", duplicates);
  } else {
    console.log("✅ No duplicate slugs found.");
  }

  // Check by name/bank
  const seenItems = new Map();
  const itemDuplicates: any[] = [];
  cards.forEach(card => {
    const key = `${card.name}-${card.bank}`;
    if (seenItems.has(key)) {
        itemDuplicates.push({
            key,
            ids: [seenItems.get(key), card.id]
        });
    } else {
        seenItems.set(key, card.id);
    }
  });

  if (itemDuplicates.length > 0) {
    console.warn("⚠️ FOUND DUPLICATES BY NAME/BANK:", itemDuplicates);
  } else {
    console.log("✅ No duplicate name/bank combinations found.");
  }
}

checkDuplicates();
