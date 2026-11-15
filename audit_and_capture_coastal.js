const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SITE_DIR = path.resolve('C:/Users/dasan/.gemini/antigravity/scratch/coastal-makers');
const SCREENSHOT_DIR = path.join(SITE_DIR, 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// Simple HTTP static server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(SITE_DIR, reqPath);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.json': 'application/json'
  };
  
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

async function runAudit() {
  await new Promise(resolve => server.listen(8100, resolve));
  console.log('Static server listening on port 8100');

  const browser = await chromium.launch({ 
    channel: 'chrome',
    headless: true 
  });

  // 1. Mobile Audits (360x800, 375x667, 390x844)
  const mobileConfigs = [
    { name: 'Android Baseline', width: 360, height: 800 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12/13/14', width: 390, height: 844 }
  ];

  for (const cfg of mobileConfigs) {
    const page = await browser.newPage({
      viewport: { width: cfg.width, height: cfg.height },
      deviceScaleFactor: 2
    });
    await page.goto('http://127.0.0.1:8100/index.html', { waitUntil: 'networkidle' });

    // Check horizontal overflow
    const overflowCheck = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body.scrollWidth;
      return {
        clientWidth: docW,
        scrollWidth: scrollW,
        bodyScrollWidth: bodyScrollW,
        hasOverflow: scrollW > docW || bodyScrollW > docW
      };
    });

    console.log(`[Mobile Audit - ${cfg.name} (${cfg.width}x${cfg.height})]:`, overflowCheck);
    if (overflowCheck.hasOverflow) {
      console.error(`FAILED: Horizontal overflow detected on ${cfg.name}!`);
    } else {
      console.log(`PASSED: Zero overflow on ${cfg.name}.`);
    }

    // Check fold containment for all 4 stats
    if (cfg.height >= 800) {
      const statsInFold = await page.evaluate((maxHeight) => {
        const stats = document.querySelectorAll('.hero-stat-card');
        const results = [];
        stats.forEach((el, idx) => {
          const rect = el.getBoundingClientRect();
          results.push({
            index: idx,
            top: rect.top,
            bottom: rect.bottom,
            visibleAboveFold: rect.bottom <= maxHeight
          });
        });
        return results;
      }, cfg.height);
      console.log(`Telemetry fold check (${cfg.name}):`, statsInFold);
    }

    await page.close();
  }

  // 2. Desktop Screenshots (1280x800)
  const dPage = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1
  });
  await dPage.goto('http://127.0.0.1:8100/index.html', { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(1000);

  // Hero desktop screenshot
  await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, '01_hero_desktop.png'), fullPage: false });
  console.log('Captured 01_hero_desktop.png');

  // Creations section
  const creationsEl = await dPage.$('#creations');
  if (creationsEl) {
    await creationsEl.scrollIntoViewIfNeeded();
    await dPage.waitForTimeout(500);
    await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, '02_creations_desktop.png'), fullPage: false });
    console.log('Captured 02_creations_desktop.png');
  }

  // Estimator section
  const estimatorEl = await dPage.$('#estimator');
  if (estimatorEl) {
    await estimatorEl.scrollIntoViewIfNeeded();
    await dPage.waitForTimeout(500);
    await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, '03_estimator_desktop.png'), fullPage: false });
    console.log('Captured 03_estimator_desktop.png');
  }

  // Contact section
  const contactEl = await dPage.$('#contact');
  if (contactEl) {
    await contactEl.scrollIntoViewIfNeeded();
    await dPage.waitForTimeout(500);
    await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, '04_contact_desktop.png'), fullPage: false });
    console.log('Captured 04_contact_desktop.png');
  }

  await dPage.close();
  await browser.close();
  server.close();
  console.log('Audit & screenshots complete!');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
