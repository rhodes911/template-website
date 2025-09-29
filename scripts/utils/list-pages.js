/* eslint-disable */
// scripts/utils/list-pages.js
// Minimal utility: list ALL relative page paths by reading sitemap.xml (and nested sitemaps).
// No crawling. No exclusions. No extras.

const http = require('http');
const https = require('https');

function fetchText(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.get(url, { headers: { 'User-Agent': 'ListPages/1.0' } }, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          resolve('');
          return;
        }
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve(data));
      });
      req.on('error', () => resolve(''));
    } catch {
      resolve('');
    }
  });
}

function normalizePathname(p) {
  if (!p) return '/';
  let out = p.trim();
  if (!out.startsWith('/')) out = '/' + out;
  if (out.length > 1) out = out.replace(/\/+$/, '');
  return out;
}

function mapUrlsToPaths(urls) {
  const paths = [];
  for (const u of urls) {
    try {
      const url = new URL(u);
      paths.push(normalizePathname(url.pathname));
    } catch {
      // skip invalid
    }
  }
  return Array.from(new Set(paths));
}

function extractLocs(xml) {
  if (!xml) return [];
  // Capture content inside <loc> ... </loc>
  const matches = xml.match(/<loc>\s*([^<]+?)\s*<\/loc>/gi) || [];
  return matches.map((m) => m.replace(/<\/?loc>/gi, '').trim());
}

function isSitemapIndex(xml) {
  return /<\s*sitemapindex\b/i.test(xml);
}

function isUrlSet(xml) {
  return /<\s*urlset\b/i.test(xml);
}

async function gatherFromSitemap(sitemapUrl, visited = new Set(), depth = 0) {
  if (!sitemapUrl || visited.has(sitemapUrl) || depth > 5) return [];
  visited.add(sitemapUrl);

  const xml = await fetchText(sitemapUrl);
  if (!xml) return [];

  // If it's an index sitemap, recurse into each child sitemap
  if (isSitemapIndex(xml)) {
    const childSitemaps = extractLocs(xml);
    let all = [];
    for (const child of childSitemaps) {
      const childUrls = await gatherFromSitemap(child, visited, depth + 1);
      all = all.concat(childUrls);
    }
    return all;
  }

  // If it's a urlset, extract page URLs
  if (isUrlSet(xml)) {
    return extractLocs(xml);
  }

  // Unknown format; attempt best-effort extraction anyway
  return extractLocs(xml);
}

/**
 * List all relative page paths using sitemap.xml (and nested sitemaps).
 * @param {object} opts
 * @param {string} [opts.sitemapUrl] - Full sitemap URL. If omitted, uses siteUrl + '/sitemap.xml'.
 * @param {string} [opts.siteUrl] - Site origin (e.g., 'https://www.example.com').
 * @returns {Promise<string[]>} Relative paths like ['/','/about','/blog/post']
 */
async function listAllPagePaths(opts = {}) {
  const { sitemapUrl, siteUrl } = opts;
  let target = sitemapUrl;
  if (!target) {
    const fromEnv = process.env.SITEMAP_URL;
    if (fromEnv) target = fromEnv;
  }
  if (!target) {
    if (!siteUrl && !process.env.SITE_URL && !process.env.BASE_URL) {
      throw new Error('Provide sitemapUrl or siteUrl (or set SITEMAP_URL/SITE_URL/BASE_URL)');
    }
    const origin = (() => {
      try { return new URL(siteUrl || process.env.SITE_URL || process.env.BASE_URL).origin; } catch { return null; }
    })();
    if (!origin) throw new Error('Invalid siteUrl/SITE_URL/BASE_URL');
    target = origin.replace(/\/+$/, '') + '/sitemap.xml';
  }

  const urls = await gatherFromSitemap(target);
  const paths = mapUrlsToPaths(urls);
  // sort for stable output
  paths.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return paths;
}

module.exports = { listAllPagePaths };
