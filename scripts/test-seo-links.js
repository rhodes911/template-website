/* eslint-disable */
// scripts/test-seo-links.js
// Check internal link health and external security attributes
// CommonJS Playwright + Node fetch

const { chromium } = require('playwright');
const { listAllPagePaths } = require('./utils/list-pages');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ORIGIN = new URL(BASE_URL).origin;
let PAGES = [];
const STRICT_PAGE_SCOPE = String(process.env.STRICT_PAGE_SCOPE || '').toLowerCase() === '1' || String(process.env.STRICT_PAGE_SCOPE || '').toLowerCase() === 'true';
// Paths that may intentionally not exist yet; bad status becomes a warning
const IGNORE_PATTERNS = [
  /\/blog\/tag\/.+$/,
];

function isInternalHref(href) {
  if (!href) return false;
  if (href.startsWith('#')) return false;
  try {
    if (href.startsWith('/')) return true;
    const u = new URL(href, ORIGIN);
    return u.origin === ORIGIN;
  } catch {
    return false;
  }
}

function toAbsolute(href) {
  return new URL(href, ORIGIN).href;
}

async function checkUrl(url) {
  try {
    // Prefer HEAD to be light; fallback to GET if HEAD not allowed
    let res = await fetch(url, { method: 'HEAD' });
    if (res.status === 405) res = await fetch(url, { method: 'GET' });
    return res.status;
  } catch (e) {
    return 0; // network error
  }
}

async function run() {
  console.log(`SEO links check on ${BASE_URL}`);
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

      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]')).map(a => ({
          href: a.getAttribute('href') || '',
          target: a.getAttribute('target') || '',
          rel: (a.getAttribute('rel') || '').toLowerCase(),
          text: (a.textContent || '').trim().slice(0, 80)
        }));
      });

      const issues = [];
      const warnings = [];

      // External rel security
      for (const l of links) {
        const isExternal = !isInternalHref(l.href) && !l.href.startsWith('#') && !l.href.startsWith('mailto:') && !l.href.startsWith('tel:');
        if (isExternal && l.target === '_blank') {
          if (!l.rel.includes('noopener') || !l.rel.includes('noreferrer')) {
            warnings.push(`External link missing rel security: ${l.href}`);
          }
        }
      }

      // Internal link health
      // In strict page scope, do NOT crawl other pages; only validate on-page attributes.
      if (!STRICT_PAGE_SCOPE) {
        const internal = Array.from(new Set(links
          .filter(l => isInternalHref(l.href))
          .map(l => toAbsolute(l.href))));

        for (const url of internal) {
          const status = await checkUrl(url);
          if (!(status >= 200 && status < 400)) {
            const ignore = IGNORE_PATTERNS.some((re) => re.test(new URL(url).pathname));
            if (ignore) {
              warnings.push(`Bad status ${status} (ignored pattern) for ${url}`);
            } else {
              issues.push(`Broken/Bad status ${status} for ${url}`);
            }
          }
        }
      } else {
        // Provide a light summary to explain behavior in logs when strict mode is enabled.
        const internalCount = links.filter(l => isInternalHref(l.href)).length;
        console.log(`Info: STRICT_PAGE_SCOPE is enabled; skipping network checks for ${internalCount} internal link(s).`);
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
        console.log('✅ No link issues found');
      }
    } catch (err) {
      console.error(`Error checking ${path}:`, err.message);
      hasErrors = true;
    }
  }

  await browser.close();
  if (hasErrors) {
    console.log('\n❌ SEO links test FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ SEO links test PASSED');
    process.exit(0);
  }
}

run();
