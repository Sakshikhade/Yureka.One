import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
});
const page = await context.newPage();

const requests = [];
page.on('response', async (res) => {
  try {
    const headers = res.headers();
    const len = headers['content-length'] ? parseInt(headers['content-length'], 10) : 0;
    requests.push({ url: res.url(), type: res.request().resourceType(), size: len, status: res.status() });
  } catch {}
});

const start = Date.now();
await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(6000); // past splash
// simulate user scroll through the page
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(700);
}
const elapsed = Date.now() - start;

const total = requests.reduce((a, r) => a + r.size, 0);
const byType = {};
for (const r of requests) {
  byType[r.type] = (byType[r.type] || 0) + r.size;
}
const sorted = [...requests].sort((a, b) => b.size - a.size).slice(0, 20);

console.log('elapsed ms:', elapsed);
console.log('total requests:', requests.length);
console.log('total bytes:', total, `(${(total / 1024 / 1024).toFixed(2)} MB)`);
console.log('by type (bytes):', byType);
console.log('top 20 heaviest:');
for (const r of sorted) {
  console.log(`  ${(r.size / 1024).toFixed(0)}KB  [${r.type}]  ${r.url.replace('http://localhost:3000', '')}`);
}

await browser.close();
