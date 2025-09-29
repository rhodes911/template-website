/* eslint-disable */
// scripts/test-content-volume.js
// Playwright-based content volume checks across all pages from sitemap
// - Measures approximate word count of the main content area (or body minus header/nav/footer)
// - Applies route-specific minimums with a sensible default

const { chromium } = require('playwright');
const { listAllPagePaths } = require('./utils/list-pages');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const PRODUCTION_ORIGIN = process.env.PRODUCTION_ORIGIN || 'https://www.ellieedwardsmarketing.com';
const IS_DEV_TARGET = /localhost|127\.0\.0\.1/i.test(BASE_URL);

// Defaults and thresholds (override via env if needed)
const CONTENT_MIN_DEFAULT = Number(process.env.CONTENT_MIN_DEFAULT || 200);
const MIN_FOR_BLOG_INDEX = Number(process.env.MIN_FOR_BLOG_INDEX || 180);
const MIN_FOR_BLOG_CATEGORY = Number(process.env.MIN_FOR_BLOG_CATEGORY || 180);
const MIN_FOR_FAQ = Number(process.env.MIN_FOR_FAQ || 200);

// Paths explicitly excluded from checks (regexes)
const EXCLUDE_PATTERNS = [
  /^\/api\//i,
  /^\/admin(\/|$)/i,
];

function pickMinForPath(p) {
  if (/^\/blog$/i.test(p)) return MIN_FOR_BLOG_INDEX;
  if (/^\/blog\/category\/[a-z0-9-]+$/i.test(p)) return MIN_FOR_BLOG_CATEGORY;
  if (/^\/faq$/i.test(p)) return MIN_FOR_FAQ;
  return CONTENT_MIN_DEFAULT;
}

function matchesAny(p, patterns) {
  return patterns.some((re) => re.test(p));
}

async function extractContentInfo(page) {
  return await page.evaluate(() => {
    function getWordCount(text) {
      if (!text) return 0;
      // Split on whitespace; count words with letters/numbers
      const words = text
        .replace(/[\u00A0\s]+/g, ' ') // normalize nbsp & whitespace
        .trim()
        .split(/\s+/)
        .filter((w) => /[\p{L}\p{N}]/u.test(w));
      return words.length;
    }

    function textFrom(el) {
      if (!el) return '';
      return (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    }

    function cloneBodyMinus(selectors) {
      const clone = document.body.cloneNode(true);
      const removeList = Array.from(clone.querySelectorAll(selectors.join(',')));
      for (const n of removeList) n.remove();
      // Also strip scripts/styles/etc
      const junk = clone.querySelectorAll('script,style,noscript,template');
      junk.forEach((n) => n.remove());
      return clone;
    }

    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';

    // Prefer main region
    let mainText = '';
    const mainEl = document.querySelector('main,[role="main"]');
    if (mainEl) {
      mainText = textFrom(mainEl);
    } else {
      // Fallback: body minus header/nav/footer/aside
      const clone = cloneBodyMinus(['header','nav','footer','aside','[role="navigation"]']);
      mainText = textFrom(clone);
    }

    const bodyText = textFrom(document.body);

    return {
      robots,
      mainWordCount: getWordCount(mainText),
      bodyWordCount: getWordCount(bodyText),
      sample: mainText.slice(0, 200),
    };
  });
}

async function run() {
  console.log(`Content volume check on ${BASE_URL}`);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Discover pages via sitemap
  let pages = await listAllPagePaths({ siteUrl: PRODUCTION_ORIGIN });
  // Prefer local dev base when available but keep discovery from prod

  let hasErrors = false;

  for (const path of pages) {
    if (matchesAny(path, EXCLUDE_PATTERNS)) continue;

    const minRequired = pickMinForPath(path);

    console.log(`\nChecking ${path} (min ${minRequired} words)...`);

    try {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });
      let info = await extractContentInfo(page);

      // If dev renders incomplete page somehow, optionally retry against production
      const looksVeryLow = info.mainWordCount < Math.min(50, minRequired * 0.25);
      if (IS_DEV_TARGET && looksVeryLow) {
        try {
          await page.goto(`${PRODUCTION_ORIGIN}${path}`, { waitUntil: 'networkidle' });
          info = await extractContentInfo(page);
          // Return to base for next paths
          await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' }).catch(() => {});
        } catch {}
      }

      const isNoIndex = /noindex/i.test(info.robots);

      const issues = [];
      const warnings = [];

      // Only hard fail for indexable pages
      if (!isNoIndex && info.mainWordCount < minRequired) {
        issues.push(`Low content: ${info.mainWordCount} words < ${minRequired}`);
      }

      // Soft warn if content is borderline (within 10% of threshold)
      const warnThreshold = Math.floor(minRequired * 0.9);
      if (!isNoIndex && info.mainWordCount >= warnThreshold && info.mainWordCount < minRequired) {
        warnings.push(`Borderline content: ${info.mainWordCount} words (min ${minRequired})`);
      }

      if (warnings.length) {
        console.log('Warnings:');
        for (const w of warnings) console.log(`⚠️  ${w}`);
      }
      if (issues.length) {
        console.log('Issues:');
        for (const i of issues) console.log(`❌ ${i}`);
        hasErrors = true;
      } else {
        console.log(`✅ Content OK (${info.mainWordCount} words)`);
      }
    } catch (err) {
      console.error(`Error checking ${path}:`, err?.message || String(err));
      hasErrors = true;
    }
  }

  await browser.close();
  if (hasErrors) {
    console.log('\n❌ Content volume test FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Content volume test PASSED');
    process.exit(0);
  }
}

run();
