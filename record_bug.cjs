const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
      recordVideo: {
          dir: 'videos/'
      }
  });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));

  console.log('Navigating to http://localhost:5173...');
  try {
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); 

      console.log('Scrolling down to trigger Station 2 (Architetture Solide)...');
      // Scroll down by 1500px to trigger the second station
      await page.evaluate(() => window.scrollBy(0, 1500));
      
      // Wait for the scramble and 3D peel animation to finish (duration is 1.5s)
      await page.waitForTimeout(3000); 
      
      console.log('Taking snapshot of DOM...');
      const elementHtml = await page.evaluate(() => {
          const el = document.querySelector('h3'); // Targeting the ARCHITETTURE SOLIDE tag
          if(el) {
             const rect = el.getBoundingClientRect();
             return {
                 outerHTML: el.outerHTML,
                 bounds: rect,
                 computedStyles: {
                     opacity: window.getComputedStyle(el).opacity,
                     display: window.getComputedStyle(el).display,
                     visibility: window.getComputedStyle(el).visibility,
                     filter: window.getComputedStyle(el).filter,
                     transform: window.getComputedStyle(el).transform,
                     backgroundClip: window.getComputedStyle(el).webkitBackgroundClip || window.getComputedStyle(el).backgroundClip,
                     color: window.getComputedStyle(el).color
                 }
             };
          }
          return "Element not found";
      });
      
      fs.writeFileSync('dom_snapshot.json', JSON.stringify(elementHtml, null, 2));
      console.log('Snapshot saved to dom_snapshot.json');
      
  } catch (e) {
      console.log('Error:', e);
  }
  
  await context.close();
  await browser.close();
})();
