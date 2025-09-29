#!/usr/bin/env node
/**
 * generate-citation-pack.js
 * Creates multi-format artifacts (JSON, CSV, Markdown) for local citation submissions
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'local');
const OUT_DIR = path.join(ROOT, 'reports', 'local-citations');

function loadJson(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function buildUtm(url, source, profile) {
  if (!url) return '';
  const medium = profile.tracking?.utmMedium || 'local_listing';
  const campaign = profile.tracking?.utmCampaign || 'local_citations';
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
}

function toMarkdownTable(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const headerRow = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map(r => `| ${headers.map(h => (r[h] ?? '')).join(' | ')} |`).join('\n');
  return [headerRow, sep, body].join('\n');
}

function main() {
  const profile = loadJson('business-profile.json') || loadJson('business-profile.sample.json');
  if (!profile) {
    console.error('No business profile JSON found. Create data/local/business-profile.json');
    process.exit(1);
  }
  const directories = loadJson('citations-directories.json') || [];
  ensureDir(OUT_DIR);

  const rows = directories.map(dir => {
    const websiteUTM = dir.supportsUTM ? buildUtm(profile.urls?.website, dir.slug, profile) : profile.urls?.website;
    return {
      directory: dir.name,
      slug: dir.slug,
      submit_url: dir.url,
      name: profile.name,
      primary_phone: profile.phones?.primary,
      address: `${profile.address?.street1 || ''} ${profile.address?.street2 || ''}`.trim(),
      city: profile.address?.city,
      region: profile.address?.region,
      postal: profile.address?.postalCode,
      country: profile.address?.country,
      website: websiteUTM,
      hours: Object.entries(profile.hours || {}).map(([d,h]) => `${d}:${h}`).join('; '),
      description: (profile.description || '').slice(0,200).replace(/\n/g,' ')+ (profile.description && profile.description.length>200 ? '…' : ''),
      services: (profile.services || []).join('; '),
      verification: dir.verification || '',
      notes: dir.notes || ''
    };
  });

  // Write JSON
  fs.writeFileSync(path.join(OUT_DIR, 'citation-pack.json'), JSON.stringify(rows, null, 2));
  // Write CSV
  fs.writeFileSync(path.join(OUT_DIR, 'citation-pack.csv'), toCsv(rows));
  // Write Markdown
  fs.writeFileSync(path.join(OUT_DIR, 'citation-pack.md'), toMarkdownTable(rows));

  console.log(`Generated ${rows.length} directory rows -> reports/local-citations/`);
}

// Execute immediately when run via `node scripts/generate-citation-pack.js`
main();
