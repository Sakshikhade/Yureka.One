import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://rvqtlvgaqlgylipsaktm.supabase.co', 'sb_publishable_ifEDBOCmAz3ya4QU-M3L1g_eaAJL5fD');

async function test() {
  console.log("Testing insert into blogs...");
  const timestamp = new Date().toISOString();
  try {
    const { data, error } = await supabase.from('blogs').insert([{
      title: 'Test Blog',
      slug: 'test-blog-' + Date.now(),
      excerpt: 'Test excerpt',
      content: 'This is a test blog.',
      author: 'Test Author',
      category: 'Finance',
      image: 'https://picsum.photos/seed/blog/800/600',
      read_time: '1 min read',
      featured: false,
      status: 'published',
      scheduled_at: null
    }]).select();
    
    console.log("Result:", { data, error });
  } catch(e) {
    console.error("Caught error:", e);
  }
}

test();
