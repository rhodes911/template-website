/* eslint-disable */
// scripts/test-seo-images.js
// Validate image alt text quality and decorative exceptions
// CommonJS Playwright script

const { chromium } = require('playwright');
const { listAllPagePaths } = require('./utils/list-pages');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
let PAGES = [];

function trim(s, n = 90) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function isMeaninglessAlt(alt) {
  if (!alt) return true;
  const a = alt.trim().toLowerCase();
  if (!a) return true;
  // Heuristic: avoid generic or file-ish alts
  return [
    'image', 'photo', 'picture', 'graphic', 'icon', 'logo'
  ].includes(a) || /^(img|image)[-_]?\d+$/.test(a) || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(a);
}

async function run() {
  console.log(`SEO images check on ${BASE_URL}`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let hasErrors = false;

  // Resolve pages from sitemap (or PAGE_PATH override)
  if (process.env.PAGE_PATH) {
    PAGES = [process.env.PAGE_PATH];
  } else {
    const sitemapUrl = process.env.SITEMAP_URL;
    const siteUrl = sitemapUrl ? undefined : (process.env.PRODUCTION_ORIGIN || process.env.TEST_URL || process.env.BASE_URL || BASE_URL);
    PAGES = await listAllPagePaths({ sitemapUrl, siteUrl });
  }
  console.log(`Pages: ${PAGES.length} discovered via sitemap${process.env.PAGE_PATH ? ' (override: PAGE_PATH)' : ''}`);

  for (const path of PAGES) {
    console.log(`\nChecking ${path}...`);
    try {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });

      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(el => ({
          src: el.getAttribute('src') || '',
          alt: el.getAttribute('alt'),
          role: el.getAttribute('role') || '',
          ariaHidden: el.getAttribute('aria-hidden') || '',
          width: el.getAttribute('width') || '',
          height: el.getAttribute('height') || '',
        }));
      });

      const issues = [];
      const warnings = [];

      for (const img of images) {
        const decorative = img.role === 'presentation' || img.ariaHidden === 'true';
        const hasAlt = img.alt !== null; // null == missing attr
        const emptyAlt = (img.alt || '') === '';

        if (!decorative) {
          if (!hasAlt) {
            issues.push(`Missing alt on: ${trim(img.src)}`);
          } else if (emptyAlt) {
            issues.push(`Empty alt on non-decorative image: ${trim(img.src)}`);
          } else if (isMeaninglessAlt(img.alt)) {
            warnings.push(`Low-quality alt: "${trim(img.alt, 60)}" for ${trim(img.src)}`);
          }
        } else {
          // Decorative images: encourage explicit empty alt
          if (!hasAlt || !emptyAlt) {
            warnings.push(`Decorative image should use empty alt (alt=""): ${trim(img.src)}`);
          }
        }
      }

      if (!images.length) warnings.push('No <img> elements found');

      if (warnings.length) {
        console.log('Warnings:');
        for (const w of warnings) console.log(`⚠️  ${w}`);
      }
      if (issues.length) {
        console.log('Issues:');
        for (const i of issues) console.log(`❌ ${i}`);
        hasErrors = true;
      } else {
        console.log('✅ No image alt issues found');
      }
    } catch (err) {
      console.error(`Error checking ${path}:`, err.message);
      hasErrors = true;
    }
  }

  await browser.close();
  if (hasErrors) {
    console.log('\n❌ SEO images test FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ SEO images test PASSED');
    process.exit(0);
  }
}

run();
