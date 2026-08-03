import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://yureka.one';

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  // Indexable static marketing/content routes — keep in sync with
  // lib/seo/pageMeta.ts's staticPageMeta (excludes noindex routes like
  // /login, /waiting, /admin and pure redirects).
  const staticRoutes = [
    '',
    '/brands',
    '/blogs',
    '/privacy-policy',
    '/terms-of-service',
    '/security-protocol',
    '/community-guidelines',
    '/manifesto',
    '/jobs',
    '/yureka-ai',
    '/join-waitlist',
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  staticRoutes.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += '</urlset>';

  const outputPath = path.resolve(process.cwd(), 'public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`Sitemap generated successfully at public/sitemap.xml (${staticRoutes.length} static URLs)`);
}

generateSitemap();
