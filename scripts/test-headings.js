/* eslint-disable */
// test-headings.js
const { chromium } = require('playwright');
const { listAllPagePaths } = require('./utils/list-pages');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const INCLUDE_HIDDEN = process.env.INCLUDE_HIDDEN === '1' || process.env.INCLUDE_HIDDEN === 'true';
// Max length constraints (chars). Defaults per request: 70
const H1_MAX_CHARS = Number(process.env.H1_MAX_CHARS || process.env.HEAD_H1_MAX || 70);
const H2_MAX_CHARS = Number(process.env.H2_MAX_CHARS || process.env.HEAD_H2_MAX || 70);
let PAGES = [];
// Track sitewide duplicate H2 texts across all processed pages
const sitewideH2Texts = new Map(); // key: normalized text, value: array of { pagePath, index, text }

// Heading structure rules (global standard)
// Enforce exactly one H1 and exactly one H2 per page across the site.
// Rationale: One primary page title (H1) and one primary section title (H2),
// with subsequent structure nesting under H3+.
const RULES = {
  h1: { min: 1, max: 1 },
  h2: { min: 1, max: 1 },
};

// No page-specific overrides. The same rules apply site-wide.

// Main test function
async function testHeadings() {
  console.log(`Testing heading structure on ${BASE_URL}`);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let hasErrors = false;
  
  // Resolve pages: PAGE_PATH override, else sitemap list (prefer SITEMAP_URL, then PRODUCTION_ORIGIN, then TEST_URL)
  async function resolvePages() {
    if (process.env.PAGE_PATH) {
      // Support comma-separated list of paths
      return process.env.PAGE_PATH
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }
    const sitemapUrl = process.env.SITEMAP_URL;
    const siteUrl = sitemapUrl ? undefined : (process.env.PRODUCTION_ORIGIN || process.env.TEST_URL || process.env.BASE_URL || BASE_URL);
    try {
      const pages = await listAllPagePaths({ sitemapUrl, siteUrl });
      if (Array.isArray(pages) && pages.length) return pages;
    } catch (e) {
      console.warn('Page resolution via sitemap failed:', e.message || e);
    }
    return ['/'];
  }

  PAGES = await resolvePages();

  // Loop through each page
  for (const pagePath of PAGES) {
    console.log(`\nChecking ${pagePath}...`);
    
  try {
      // Navigate to the page
      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle' });
      
      // Get all visible, non-hidden headings
      const headings = await page.evaluate((includeHidden) => {
        function isHiddenByStyle(el) {
          const style = window.getComputedStyle(el);
          // Treat clipped/zero-size elements as hidden when not including hidden
          const rect = el.getBoundingClientRect();
          const zeroSized = rect.width === 0 || rect.height === 0;
          const clipped = (style.clip === 'rect(0px, 0px, 0px, 0px)') || style.clipPath === 'inset(50%)';
          const offscreen = style.position === 'absolute' && parseInt(style.left || '0', 10) < -9990;
          return style.display === 'none' || style.visibility === 'hidden' || zeroSized || clipped || offscreen || parseFloat(style.opacity || '1') === 0;
        }
        function isHidden(el) {
          if (!el) return false;
          if (el.getAttribute('aria-hidden') === 'true') return true;
          if (el.hasAttribute('hidden')) return true;
          if (isHiddenByStyle(el)) return true;
          return isHidden(el.parentElement);
        }
        // Include semantic headings and role-based headings
        const nodeList = document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]');
        const all = Array.from(nodeList).map(el => {
          let type = el.tagName.toLowerCase();
          if (type !== 'h1' && type !== 'h2' && type !== 'h3' && type !== 'h4' && type !== 'h5' && type !== 'h6') {
            // role="heading" with aria-level
            const level = parseInt(el.getAttribute('aria-level') || '0', 10);
            if (level >= 1 && level <= 6) type = `h${level}`;
            else return null; // ignore role=heading without valid level
          }
          const hidden = isHidden(el);
          return {
            type,
            text: (el.textContent || '').trim(),
            id: el.id || '',
            hidden,
          };
        }).filter(Boolean);
        return includeHidden ? all : all.filter(h => !h.hidden);
      }, INCLUDE_HIDDEN);
      
    // Count headings by type
      const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  headings.forEach(h => counts[h.type]++);
      
      // Show heading counts
      console.log(`Headings: h1=${counts.h1}, h2=${counts.h2}, h3=${counts.h3}, h4=${counts.h4}, h5=${counts.h5}, h6=${counts.h6}`);
      
      // List all headings
      console.log('\nHeading Structure:');
      headings.forEach(h => {
        console.log(`${h.type}: ${h.text.substring(0, 60)}${h.text.length > 60 ? '...' : ''}`);
      });
      
      // Check for issues
      const issues = [];
      
      // Ensure the first heading on the page is an H1 (aligns with Screaming Frog "H1: Non-Sequential")
      if (headings.length > 0 && headings[0].type !== 'h1') {
        issues.push(`First heading is not h1 (found ${headings[0].type}: "${headings[0].text.substring(0, 60)}${headings[0].text.length > 60 ? '...' : ''}")`);
      }

      // Check heading counts against global rules
      Object.entries(RULES).forEach(([type, rule]) => {
        const count = counts[type];
        if (count < rule.min) {
          issues.push(`Not enough ${type} elements: found ${count}, minimum ${rule.min}`);
        }
        if (count > rule.max) {
          if (type === 'h2') {
            const h2s = headings
              .map((h, i) => ({...h, i}))
              .filter(h => h.type === 'h2')
              .map(h => `#${h.i + 1}: "${h.text.substring(0, 60)}${h.text.length > 60 ? '...' : ''}"`)
              .join(', ');
            issues.push(`Too many ${type} elements: found ${count}, maximum ${rule.max}. H2s: ${h2s}`);
          } else {
            issues.push(`Too many ${type} elements: found ${count}, maximum ${rule.max}`);
          }
        }
      });
      
      // Check for skipped heading levels
      const headingLevels = headings.map(h => parseInt(h.type.substring(1)));
      for (let i = 1; i < headingLevels.length; i++) {
        const current = headingLevels[i];
        const previous = headingLevels[i - 1];
        
        if (current > previous + 1) {
          issues.push(`Heading level jumped from h${previous} to h${current} ("${headings[i].text.substring(0, 30)}${headings[i].text.length > 30 ? '...' : ''}")`);
        }
      }
      
      // Check for consecutive h2 elements (multiple h2s without h3-h6 between them)
      const h2Positions = [];
      headings.forEach((heading, index) => {
        if (heading.type === 'h2') {
          h2Positions.push(index);
        }
      });
      
      for (let i = 0; i < h2Positions.length - 1; i++) {
        const current = h2Positions[i];
        const next = h2Positions[i + 1];
        
        // Check if there are no lower level headings between these h2s
        let hasLowerHeadings = false;
        for (let j = current + 1; j < next; j++) {
          const level = parseInt(headings[j].type.substring(1));
          if (level > 2) {
            hasLowerHeadings = true;
            break;
          }
        }
        
        if (!hasLowerHeadings) {
          issues.push(`Multiple h2 elements in the same section: "${headings[current].text.substring(0, 30)}${headings[current].text.length > 30 ? '...' : ''}" and "${headings[next].text.substring(0, 30)}${headings[next].text.length > 30 ? '...' : ''}"`);
        }
      }
      
      // Report issues
      // Additional checks: duplicate H2 texts (normalized), duplicate H2 slugs, and duplicate heading IDs
      const normalize = (t) => (t || '')
        .toLowerCase()
        // remove zero-width and punctuation (keep letters, numbers, spaces, hyphens)
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const slugify = (t) => normalize(t).replace(/\s+/g, '-');

      // Duplicate H2 text detection (anywhere on the page, not just consecutive)
      const h2Map = new Map();
      headings.forEach((h, idx) => {
        if (h.type === 'h2') {
          const key = normalize(h.text);
          if (!h2Map.has(key)) h2Map.set(key, []);
          h2Map.get(key).push(idx);
        }
      });
      for (const [key, idxs] of h2Map.entries()) {
        if (key && idxs.length > 1) {
          const labels = idxs.map(i => `#${i + 1}: "${headings[i].text.substring(0, 60)}${headings[i].text.length > 60 ? '...' : ''}"`).join(', ');
          issues.push(`Duplicate h2 text detected (${idxs.length} occurrences): ${labels}`);
        }
      }

      // Duplicate H2 slug detection (ignores punctuation/case differences)
      const h2SlugMap = new Map();
      headings.forEach((h, idx) => {
        if (h.type === 'h2') {
          const skey = slugify(h.text);
          if (!h2SlugMap.has(skey)) h2SlugMap.set(skey, []);
          h2SlugMap.get(skey).push(idx);
        }
      });
      for (const [skey, idxs] of h2SlugMap.entries()) {
        if (skey && idxs.length > 1) {
          const labels = idxs.map(i => `#${i + 1}: \"${headings[i].text.substring(0, 60)}${headings[i].text.length > 60 ? '...' : ''}\"`).join(', ');
          issues.push(`Duplicate h2 slug detected (${skey}) in ${idxs.length} headings: ${labels}`);
        }
      }

      // H1/H2 max-length checks
      const firstH1 = headings.find(h => h.type === 'h1');
      if (firstH1 && typeof firstH1.text === 'string' && firstH1.text.length > H1_MAX_CHARS) {
        issues.push(`H1 is too long (${firstH1.text.length} > ${H1_MAX_CHARS} chars): "${firstH1.text.substring(0, 90)}${firstH1.text.length > 90 ? '...' : ''}"`);
      }
      const h2sAll = headings
        .map((h, i) => ({ ...h, i }))
        .filter(h => h.type === 'h2');
      for (const h2 of h2sAll) {
        if (typeof h2.text === 'string' && h2.text.length > H2_MAX_CHARS) {
          issues.push(`H2 #${h2.i + 1} is too long (${h2.text.length} > ${H2_MAX_CHARS} chars): "${h2.text.substring(0, 90)}${h2.text.length > 90 ? '...' : ''}"`);
        }
      }

      // Duplicate heading IDs across all heading levels (ignoring empty ids)
      const idMap = new Map();
      headings.forEach((h, idx) => {
        if (h.id) {
          if (!idMap.has(h.id)) idMap.set(h.id, []);
          idMap.get(h.id).push(idx);
        }
      });
      for (const [id, idxs] of idMap.entries()) {
        if (idxs.length > 1) {
          const labels = idxs.map(i => `#${i + 1} (${headings[i].type}): "${headings[i].text.substring(0, 60)}${headings[i].text.length > 60 ? '...' : ''}"`).join(', ');
          issues.push(`Duplicate heading id "${id}" used ${idxs.length} times: ${labels}`);
        }
      }

      // Accumulate sitewide H2 texts for cross-page duplicate detection
      headings.forEach((h, idx) => {
        if (h.type === 'h2') {
          const key = normalize(h.text);
          if (!key) return;
          if (!sitewideH2Texts.has(key)) sitewideH2Texts.set(key, []);
          sitewideH2Texts.get(key).push({ pagePath, index: idx, text: h.text });
        }
      });

      // Report issues
      if (issues.length > 0) {
        console.log('\nIssues:');
        issues.forEach(issue => console.log(`❌ ${issue}`));
        hasErrors = true;
      } else {
        console.log('\n✅ No heading structure issues found');
      }
      
    } catch (error) {
      console.error(`Error checking ${pagePath}: ${error.message}`);
      hasErrors = true;
    }
  }
  
  await browser.close();
  
  // After processing all pages, detect sitewide duplicate H2 texts
  const sitewideIssues = [];
  for (const [key, occurrences] of sitewideH2Texts.entries()) {
    if (occurrences.length > 1) {
      const sampleText = occurrences[0].text;
      const where = occurrences
        .map(o => `${o.pagePath} (h2 #${o.index + 1})`)
        .join(', ');
      sitewideIssues.push(`Sitewide duplicate h2 text "${sampleText}" found on ${occurrences.length} pages: ${where}`);
    }
  }

  if (sitewideIssues.length > 0) {
    console.log('\nSitewide H2 duplicate issues:');
    sitewideIssues.forEach(i => console.log(`❌ ${i}`));
    hasErrors = true;
  }

  // Final result
  if (hasErrors) {
    console.log('\n❌ Heading structure test FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Heading structure test PASSED');
    process.exit(0);
  }
}

// Run the test
testHeadings().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});