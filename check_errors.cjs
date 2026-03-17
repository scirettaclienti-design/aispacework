const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));

  console.log('Navigating to http://localhost:5173...');
  try {
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  } catch (e) {
      console.log('Navigation error:', e);
  }
  
  await browser.close();
})();
