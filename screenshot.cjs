const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
      if (msg.type() === 'error') {
          console.log('BROWSER_ERROR_LOG:', msg.text());
      }
  });
  
  page.on('pageerror', err => {
      console.log('UNCAUGHT_ERROR:', err.message);
  });

  console.log('Navigating to http://localhost:5173...');
  try {
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
  } catch (e) {
      console.log('Navigation error:', e);
  }
  
  await browser.close();
})();
