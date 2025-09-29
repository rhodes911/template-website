import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';

type IndexItem = {
  title: string;
  description: string;
  content: string;
  url: string;
  type: 'blog' | 'services' | 'case-studies' | 'about' | 'testimonials' | 'page';
};

let INDEX: IndexItem[] | null = null;

function toTitle(str: string) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function stripMd(md: string) {
  return md
    .replace(/`{1,3}[^`]*`{1,3}/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s?/gm, '')
    .replace(/[*_~>#`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildUrl(rel: string) {
  const noExt = rel.replace(/\.md$/, '');
  return '/' + noExt.replace(/\\/g, '/');
}

function detectType(rel: string): IndexItem['type'] {
  if (rel.startsWith('blog/')) return 'blog';
  if (rel.startsWith('services/')) return 'services';
  if (rel.startsWith('case-studies/')) return 'case-studies';
  if (rel.startsWith('testimonials/')) return 'testimonials';
  if (rel === 'about.md' || rel.startsWith('about')) return 'about';
  return 'page';
}

function shouldExclude(rel: string): boolean {
  // Exclude draft folders and settings
  if (rel.startsWith('ai-drafts/')) return true;
  if (rel.startsWith('settings/')) return true;
  return false;
}

function walk(dir: string, base = dir, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, acc);
    else if (e.isFile() && e.name.endsWith('.md')) acc.push(path.relative(base, p));
  }
  return acc;
}

function buildIndex(): IndexItem[] {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];
  const files = walk(contentDir);
  const items: IndexItem[] = [];
  for (const rel of files) {
    // Skip excluded directories
    if (shouldExclude(rel)) continue;
    
    const abs = path.join(contentDir, rel);
    try {
      const raw = fs.readFileSync(abs, 'utf8');
      const parsed = matter(raw);
      const title = (parsed.data.title as string) || toTitle(path.basename(rel, '.md'));
      const description = (parsed.data.description as string) || stripMd(parsed.content).slice(0, 180);
      const content = stripMd(parsed.content);
      const url = buildUrl(rel);
      const type = detectType(rel);
      items.push({ title, description, content, url, type });
    } catch {
      // ignore file issues
    }
  }
  return items;
}

function ensureIndex() {
  if (!INDEX) INDEX = buildIndex();
}

function score(q: string, item: IndexItem) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const body = item.content.toLowerCase();
  let s = 0;
  for (const t of terms) {
    if (title.includes(t)) s += 5;
    if (desc.includes(t)) s += 2;
    if (body.includes(t)) s += 1;
  }
  if (item.type === 'services') s += 1.5;
  if (item.type === 'case-studies') s += 1;
  return s;
}

function snippet(q: string, item: IndexItem) {
  const idx = item.content.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return item.description;
  const start = Math.max(0, idx - 60);
  const end = Math.min(item.content.length, idx + 120);
  let s = item.content.slice(start, end);
  if (start > 0) s = '…' + s;
  if (end < item.content.length) s = s + '…';
  return s;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const limit = parseInt(searchParams.get('limit') || '8', 10);
  if (!q || q.length < 2) return NextResponse.json({ results: [] }, { status: 200 });
  ensureIndex();
  const ranked = (INDEX || [])
    .map((it) => ({ item: it, s: score(q, it) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ item }) => ({
      title: item.title,
      url: item.url,
      type: item.type,
      snippet: snippet(q, item),
    }));
  return NextResponse.json({ results: ranked });
}
