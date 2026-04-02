const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:4320';
const OUT_DIR = '/home/whites/.openclaw/workspace/tools/openclaw-data-board/docs/assets';

const sections = [
  { name: 'overview', url: `${BASE}/?section=overview` },
  { name: 'usage-cost', url: `${BASE}/?section=usage-cost` },
  { name: 'team', url: `${BASE}/?section=team` },
  { name: 'collaboration', url: `${BASE}/?section=collaboration` },
  { name: 'memory', url: `${BASE}/?section=memory` },
  { name: 'docs', url: `${BASE}/?section=docs` },
  { name: 'projects-tasks', url: `${BASE}/?section=projects-tasks` },
  { name: 'settings', url: `${BASE}/?section=settings` },
  { name: 'replay-audit', url: `${BASE}/?section=replay-audit` },
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/whites/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  for (const s of sections) {
    console.log(`Capturing ${s.name}...`);
    try {
      await page.goto(s.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      const path = `${OUT_DIR}/${s.name}.png`;
      await page.screenshot({ path, fullPage: false });
      console.log(`  -> ${path}`);
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
    }
  }

  await browser.close();
  console.log('Done!');
})();
