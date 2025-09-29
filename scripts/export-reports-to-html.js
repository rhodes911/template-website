#!/usr/bin/env node
/* eslint-disable */
// Convert Markdown reports to HTML for easy sharing.
const fs = require('fs');
const path = require('path');

function findMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) stack.push(p);
      else if (name.toLowerCase().endsWith('.md')) out.push(p);
    }
  }
  return out;
}

function basicMarkdownToHtml(md) {
  // Minimal converter: preserve code blocks, headings, lists, and paragraphs.
  // For richer output, swap with a proper MD renderer (e.g., marked) later.
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const lines = md.split(/\r?\n/);
  const html = [];
  let inCode = false;
  for (let line of lines) {
    if (line.startsWith('```')) {
      inCode = !inCode;
      html.push(inCode ? '<pre><code>' : '</code></pre>');
      continue;
    }
    if (inCode) { html.push(esc(line)); continue; }
    if (/^#\s+/.test(line)) html.push(`<h1>${esc(line.replace(/^#\s+/, ''))}</h1>`);
    else if (/^##\s+/.test(line)) html.push(`<h2>${esc(line.replace(/^##\s+/, ''))}</h2>`);
    else if (/^###\s+/.test(line)) html.push(`<h3>${esc(line.replace(/^###\s+/, ''))}</h3>`);
    else if (/^-\s+/.test(line)) html.push(`<li>${esc(line.replace(/^-\s+/, ''))}</li>`);
    else if (line.trim() === '') html.push('');
    else if (line.startsWith('> ')) html.push(`<blockquote>${esc(line.slice(2))}</blockquote>`);
    else html.push(`<p>${esc(line)}</p>`);
  }
  const listHtml = html.join('\n').replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>\n${m}\n</ul>`);
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Report</title><style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6;padding:24px;max-width:980px;margin:0 auto}pre{background:#0f172a;color:#e2e8f0;padding:12px;border-radius:6px;overflow:auto}code{font-family:ui-monospace,Consolas,monospace}ul{margin:0 0 1rem 1.5rem}blockquote{border-left:3px solid #ddd;padding-left:12px;color:#444}</style></head><body>${listHtml}</body></html>`;
}

function main() {
  const root = process.cwd();
  const srcDirs = [path.join(root, 'reports', 'ai'), path.join(root, 'reports', 'ai', 'groups')];
  const outDir = path.join(root, 'reports', 'html');
  fs.mkdirSync(outDir, { recursive: true });
  const files = srcDirs.flatMap(findMdFiles);
  let converted = 0;
  for (const f of files) {
    try {
      const md = fs.readFileSync(f, 'utf8');
      const html = basicMarkdownToHtml(md);
      const rel = path.relative(root, f);
      const out = path.join(outDir, rel.replace(/\\/g,'/').replace(/\/.+\//g,'').replace(/\.md$/i, '.html'));
      fs.writeFileSync(out, html, 'utf8');
      converted++;
    } catch (e) {
      console.error('Failed:', f, e.message);
    }
  }
  console.log(`Converted ${converted} Markdown report(s) to HTML in ${outDir}`);
}

if (require.main === module) main();
