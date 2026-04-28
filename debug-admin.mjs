import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting Puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Listen for console logs
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type().toUpperCase(), msg.text()));
  
  // Listen for page errors (uncaught exceptions)
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.toString()));
  
  // Listen for request failures
  page.on('requestfailed', request => {
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`);
  });

  console.log('Navigating to https://yureka.money/admin...');
  await page.goto('https://yureka.money/admin', { waitUntil: 'networkidle2' });
  
  console.log('Waiting for 5 seconds to let React crash if it will...');
  await new Promise(r => setTimeout(r, 5000));
  
  const content = await page.content();
  if (content.includes('Admin Access Required') || content.includes('Sign in with Google')) {
    console.log('STATUS: Reached Login Screen correctly.');
  } else if (content.includes('root') && !content.includes('Sign in with Google')) {
     console.log('STATUS: Page is rendering something else. Let me check the DOM text:');
     console.log((await page.evaluate(() => document.body.innerText)).substring(0, 500));
  } else {
    console.log('STATUS: Blank screen detected?');
  }

  await browser.close();
})();
