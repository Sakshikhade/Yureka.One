import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const fallbackReviews = [
  {
    author: "Paras",
    role: 'Tech Lead',
    company: 'Swiggy',
    company_logo: 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "I thought I knew credit cards, but Yureka found a hidden gem that saves me ₹20k/year on flights.",
    rotation: -2,
    status: 'published'
  },
  {
    author: "Deepankar",
    role: 'Founder',
    company: 'D2C Brand',
    company_logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "Finally, a platform that doesn't spam me. The AI chat felt like talking to a financial expert.",
    rotation: 1.5,
    status: 'published'
  },
  {
    author: "Riya",
    role: 'Freelance Designer',
    company: 'Self',
    company_logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Cred_club_logo.png',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "The Chrome extension is a game changer. It automatically applies the best card for every transaction.",
    rotation: -1,
    status: 'published'
  },
  {
    author: "Karan",
    role: 'Marketing VP',
    company: 'Zepto',
    company_logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Zepto_Logo.jpg/800px-Zepto_Logo.jpg', 
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "I used the Voucher Hub to stack rewards on my new laptop. 18% savings total. Insane.",
    rotation: 2,
    status: 'published'
  }
];

async function migrate() {
  console.log('🚀 Starting Review Migration...');
  
  for (const review of fallbackReviews) {
    console.log(`- Migrating ${review.author}...`);
    const { error } = await supabase.from('reviews').insert([review]);
    if (error) {
      console.error(`  ❌ Error:`, error.message);
    } else {
      console.log(`  ✅ Success`);
    }
  }
  
  console.log('🎉 Migration Complete!');
}

migrate();
