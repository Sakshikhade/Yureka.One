import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Intercept console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  console.log("Navigating...");
  await page.goto('http://localhost:5173/cards/sbi-card-krisflyer-sbi-card', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  console.log("HTML Length:", content.length);
  
  if (content.length < 1000) {
      console.log("DOM:", content);
  } else {
      console.log("Body snippet:", await page.evaluate(() => document.body.innerHTML.substring(0, 500)));
  }
  
  await browser.close();
})();
