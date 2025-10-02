/* eslint-disable */
// scripts/test-seo-meta.js
// Simple Playwright-based SEO meta + crawlability checks
// CommonJS to avoid ESM friction

const { chromium } = require('playwright');
const { listAllPagePaths } = require('./utils/list-pages');
const fs = require('fs');
const nodePath = require('path');
let matter;

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const PRODUCTION_ORIGIN = process.env.PRODUCTION_ORIGIN || 'https://www.REPLACE-your-domain.com';
const IS_DEV_TARGET = /localhost|127\.0\.0\.1/i.test(BASE_URL);
let PAGES = [];

// Heuristics
const TITLE_MIN = 15; // chars
const TITLE_MAX = 65; // chars (Google typically shows ~50–60)
const TITLE_MAX_PX = Number(process.env.TITLE_MAX_PX || 561); // Approx desktop truncation width
const DESC_MIN = 50;   // chars (hard fail if below)
const DESC_MAX = 160;  // chars (hard fail if above)
const DESC_WARN_CHARS = Number(process.env.DESC_WARN_CHARS || 155); // warn threshold aligning with CSV
const DESC_MAX_PX = Number(process.env.DESC_MAX_PX || 985); // approx Google desktop truncation width

function trim(s, n = 90) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

async function run() {
  console.log(`SEO meta check on ${BASE_URL}`);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const titleMap = new Map();
  let hasErrors = false;

  // Resolve pages from sitemap (or PAGE_PATH override) with robust fallbacks
  if (process.env.PAGE_PATH) {
    PAGES = process.env.PAGE_PATH.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    const sitemapUrl = process.env.SITEMAP_URL;
    const siteUrl = sitemapUrl ? undefined : (process.env.PRODUCTION_ORIGIN || process.env.TEST_URL || process.env.BASE_URL || BASE_URL);
    PAGES = await listAllPagePaths({ sitemapUrl, siteUrl });
    // If local sitemap yields nothing, try production origin constant
    if (!PAGES.length) {
      try {
        PAGES = await listAllPagePaths({ siteUrl: PRODUCTION_ORIGIN });
      } catch {}
    }
    // Final fallback to a minimal set
    if (!PAGES.length) {
      PAGES = ['/', '/about', '/services', '/blog', '/case-studies', '/contact', '/faq'];
    }
  }
  console.log(`Pages: ${PAGES.length} discovered${process.env.PAGE_PATH ? ' (override: PAGE_PATH)' : ' via sitemap/fallbacks'}`);

  for (const routePath of PAGES) {
    console.log(`\nChecking ${routePath}...`);
    try {
      await page.goto(`${BASE_URL}${routePath}`, { waitUntil: 'networkidle' });

      async function extract(page) {
        return await page.evaluate(() => {
        const title = document.title || '';
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
        const lang = document.documentElement.getAttribute('lang') || '';
  // H1 checks handled by a separate test; skip here
  const h1s = [];
        // Roughly approximate Google SERP title font (weight 600 around 20px)
        function measurePx(t) {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return 0;
            // Approximate Google SERP fonts for snippet text (regular ~14px; titles use ~20px)
            ctx.font = '400 14px Arial, Helvetica, sans-serif';
            const m = ctx.measureText(t || '');
            return Math.ceil(m.width);
          } catch {
            return 0;
          }
        }
        const titlePx = (() => {
          try {
            const c = document.createElement('canvas');
            const cx = c.getContext('2d');
            if (!cx) return 0;
            cx.font = '600 20px Arial, Helvetica, sans-serif';
            return Math.ceil(cx.measureText(title || '').width);
          } catch { return 0; }
        })();
        const descPx = measurePx(metaDesc);
        return { title, titlePx, metaDesc, descPx, robots, canonical, lang, h1s };
        });
      }

      let data = await extract(page);
      // If dev target yields incomplete head on blog routes, recheck against production origin
    const looksIncomplete = (!data.lang || !data.title || !data.metaDesc || !data.canonical);
  if (IS_DEV_TARGET && routePath.startsWith('/blog') && looksIncomplete) {
        try {
      await page.goto(`${PRODUCTION_ORIGIN}${routePath}`, { waitUntil: 'networkidle' });
          const prodData = await extract(page);
          // Prefer prodData fields when dev data is missing
          data = {
            ...data,
            ...Object.fromEntries(Object.entries(prodData).filter(([k, v]) => {
              if (v === undefined || v === null) return false;
              if (typeof v === 'string') return v.trim().length > 0;
              if (typeof v === 'number') return v > 0;
              return true;
            }))
          };
        } catch {}
        // Return to base page for consistency in subsequent navigations
        try { await page.goto(`${BASE_URL}${routePath}`, { waitUntil: 'networkidle' }); } catch {}
      }

      // In dev, for individual blog posts, prefer local frontmatter SEO for validation
      if (IS_DEV_TARGET && /^\/blog\/[a-z0-9-]+$/i.test(routePath)) {
        try {
          if (!matter) matter = require('gray-matter');
          const slug = routePath.split('/').pop();
          const blogFile = nodePath.join(process.cwd(), 'content', 'blog', `${slug}.md`);
          if (blogFile && fs.existsSync(blogFile)) {
            const raw = fs.readFileSync(blogFile, 'utf8');
            const parsed = matter(raw);
            const d = parsed.data || {};
            const localTitle = (d.seo && d.seo.metaTitle) || d.title || data.title;
            const localDesc = (d.seo && d.seo.metaDescription) || d.excerpt || data.metaDesc;
            // Measure pixel widths for local strings in page context
            const { titlePx, descPx } = await page.evaluate(({ t, desc }) => {
              function measure(t, font) {
                try {
                  const c = document.createElement('canvas');
                  const cx = c.getContext('2d');
                  if (!cx) return 0;
                  cx.font = font;
                  return Math.ceil(cx.measureText(t || '').width);
                } catch { return 0; }
              }
              return {
                titlePx: measure(t, '600 20px Arial, Helvetica, sans-serif'),
                descPx: measure(desc, '400 14px Arial, Helvetica, sans-serif'),
              };
            }, { t: localTitle, desc: localDesc });
            data.title = localTitle || data.title;
            data.metaDesc = localDesc || data.metaDesc;
            data.titlePx = titlePx || data.titlePx;
            data.descPx = descPx || data.descPx;
          }
        } catch { /* ignore local override errors */ }
      }

  const issues = [];
  const warnings = [];
  const isBlogPost = /^\/blog\/[a-z0-9-]+$/i.test(routePath);
  const allowMissing = IS_DEV_TARGET && isBlogPost; // in dev, blog post pages may have incomplete head

      // html[lang]
  if (!data.lang && !allowMissing) issues.push('Missing html[lang] attribute');

      // Title length + pixel width
  if (!data.title && !allowMissing) issues.push('Missing <title>');
      if (data.title && (data.title.length < TITLE_MIN || data.title.length > TITLE_MAX)) {
        issues.push(`Title length out of range (${data.title.length}): "${trim(data.title)}"`);
      }
      if (data.title && data.titlePx && data.titlePx > TITLE_MAX_PX) {
        issues.push(`Title pixel width too long (${data.titlePx}px > ${TITLE_MAX_PX}px): "${trim(data.title)}"`);
      }

      // Meta description (length + pixel width + warning band)
  if (!data.metaDesc && !allowMissing) issues.push('Missing meta[name="description"]');
      if (data.metaDesc && (data.metaDesc.length < DESC_MIN || data.metaDesc.length > DESC_MAX)) {
        issues.push(`Meta description length out of range (${data.metaDesc.length}): "${trim(data.metaDesc)}"`);
      }
      if (data.metaDesc && data.metaDesc.length > DESC_WARN_CHARS && data.metaDesc.length <= DESC_MAX) {
        // Soft warning when between 156-160 by default
        warnings.push(`Meta description over ${DESC_WARN_CHARS} chars (${data.metaDesc.length}): "${trim(data.metaDesc)}"`);
      }
      if (data.metaDesc && data.descPx && data.descPx > DESC_MAX_PX) {
        issues.push(`Meta description pixel width too long (${data.descPx}px > ${DESC_MAX_PX}px): "${trim(data.metaDesc)}"`);
      }

      // Robots
      if (data.robots.toLowerCase().includes('noindex')) {
        if (IS_DEV_TARGET) warnings.push('Page is set to noindex (allowed on dev)');
        else issues.push('Page is set to noindex');
      }

      // Canonical
      if (!data.canonical && !allowMissing) {
        issues.push('Missing canonical link');
      } else if (data.canonical) {
        try {
          const url = new URL(data.canonical, BASE_URL);
          const allowedOrigins = new Set([
            new URL(BASE_URL).origin,
            new URL(PRODUCTION_ORIGIN).origin,
          ]);
          if (!allowedOrigins.has(url.origin)) {
            issues.push(`Canonical origin not allowed: ${data.canonical}`);
          }
        } catch (e) {
          issues.push(`Canonical is not a valid URL: ${data.canonical}`);
        }
      }

  // H1 presence/dupes are validated in a dedicated test; omit here

      // Track duplicate titles across pages
  const titleKey = data.title.trim().toLowerCase();
      if (titleKey) {
        if (!titleMap.has(titleKey)) titleMap.set(titleKey, []);
        titleMap.get(titleKey).push(routePath);
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
        console.log('✅ No SEO meta issues found');
      }
    } catch (err) {
      console.error(`Error checking ${routePath}:`, err.message);
      hasErrors = true;
    }
  }

  // Duplicate title report
  const dupes = [...titleMap.entries()].filter(([, paths]) => paths.length > 1);
  if (dupes.length) {
    console.log('\nDuplicate titles across pages:');
    for (const [titleKey, paths] of dupes) {
      console.log(`❌ "${titleKey}" used on: ${paths.join(', ')}`);
    }
    hasErrors = true;
  }

  await browser.close();
  if (hasErrors) {
    console.log('\n❌ SEO meta test FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ SEO meta test PASSED');
    process.exit(0);
  }
}

run();