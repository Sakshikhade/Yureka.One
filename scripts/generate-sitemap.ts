import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { categoryMeta } from '../lib/seo/pageMeta';

// Load environment variables from .env file
dotenv.config();

// Note: These should match your production env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const BASE_URL = 'https://yureka.money';

async function generateSitemap() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase credentials for sitemap generation.');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. Fetch Cards
  const { data: cards } = await supabase.from('cards').select('slug, updated_at');

  // 2. Fetch Blogs
  const { data: blogs } = await supabase.from('blogs').select('slug, created_at, updated_at');

  const today = new Date().toISOString().split('T')[0];

  // Indexable static marketing/content routes — keep in sync with
  // lib/seo/pageMeta.ts's staticPageMeta (excludes noindex routes like
  // /login, /waiting, /admin and pure redirects).
  const staticRoutes = [
    '',
    '/cards',
    '/brands',
    '/blogs',
    '/by-everyone-for-everyone',
    '/contribute',
    '/privacy-policy',
    '/terms-of-service',
    '/security-protocol',
    '/community-guidelines',
    '/free-tools',
    '/manifesto',
    '/jobs',
    '/yureka-ai',
    '/rewards-calculator',
    '/categories',
    '/compare',
    '/join-waitlist',
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add Static Routes
  staticRoutes.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add Category Pages (static — no DB dependency)
  Object.keys(categoryMeta).forEach(slug => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/categories/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add Cards
  cards?.forEach(card => {
    if (!card.slug) return;
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/cards/${card.slug}</loc>\n`;
    xml += `    <lastmod>${new Date(card.updated_at || Date.now()).toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add Blogs — lastmod prefers updated_at (falls back to created_at) so
  // edited posts correctly signal freshness to crawlers.
  blogs?.forEach(blog => {
    if (!blog.slug) return;
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blogs/${blog.slug}</loc>\n`;
    xml += `    <lastmod>${new Date(blog.updated_at || blog.created_at || Date.now()).toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += '</urlset>';

  const outputPath = path.resolve(process.cwd(), 'public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`Sitemap generated successfully at public/sitemap.xml (${staticRoutes.length} static + ${Object.keys(categoryMeta).length} category + ${cards?.length ?? 0} card + ${blogs?.length ?? 0} blog URLs)`);
}

generateSitemap();
