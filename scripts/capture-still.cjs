// Renders the live hero scene and saves it as the fallback still.
// Usage: npm run dev (in another terminal), then: npm run capture:still
const { chromium } = require('playwright');
const path = require('path');

const URL = process.env.URL || 'http://localhost:5173/';
const out = (name) => path.join(__dirname, '..', 'public', name);

(async () => {
  const browser = await chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  for (const scale of [1, 2]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: scale });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('canvas');
    await page.addStyleTag({ content: '.site-header { display: none !important; }' });
    await page.waitForTimeout(3000);
    const file = out(`hero-still-${864 * scale}.jpg`);
    await page.locator('.hero__visual').screenshot({ path: file, type: 'jpeg', quality: 82 });
    console.log('saved', file);
    await ctx.close();
  }
  await browser.close();
})();
