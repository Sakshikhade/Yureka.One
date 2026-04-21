import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAddCard() {
  console.log("🚀 Testing card insertion via service_role...");
  
  const testCard = {
    name: "Test Card " + Date.now(),
    bank: "HDFC",
    issuer: "HDFC",
    type: "Rewards",
    rating: 4.5,
    elite_rating: 4.5,
    category: "Shopping",
    slug: "test-card-" + Date.now(),
    status: "published",
    benefit_items: [{ heading: "Test Benefit", subheading: "Test Subheading" }],
    benefits: ["Test Benefit"]
  };

  try {
    const { data, error } = await supabase.from("cards").insert([testCard]).select();
    
    if (error) {
      console.error("❌ Insertion failed:", error);
      return;
    }

    console.log("✅ Insertion successful:", data[0].id);
    
    // Cleanup
    const { error: delError } = await supabase.from("cards").delete().eq("id", data[0].id);
    if (delError) console.error("⚠️ Cleanup failed:", delError);
    else console.log("🧹 Cleanup successful.");
    
  } catch (err) {
    console.error("💥 Unexpected error:", err);
  }
}

testAddCard();
