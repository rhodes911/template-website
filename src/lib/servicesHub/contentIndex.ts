// Dynamic content index builder (reads markdown frontmatter for blog posts & case studies)
// Falls back gracefully if filesystem unavailable (e.g. client bundle) – consumer should tolerate empty list.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ContentMetaEntry {
  slug: string;               // without leading '/'
  type: 'blog' | 'case-study';
  title: string;
  relatedServices: string[];  // authoritative list (checkboxes in CMS)
  excerpt?: string;
}

let cache: { entries: ContentMetaEntry[]; mtime: number } | null = null;
const TTL_MS = 1000 * 60; // 1 minute cache on server side

function safeReadDir(dir: string): string[] {
  try { return fs.readdirSync(dir); } catch { return []; }
}

function fileMTimeSafe(dir: string): number {
  try {
    const stats = fs.statSync(dir);
    return stats.mtimeMs;
  } catch { return Date.now(); }
}

function buildIndex(): ContentMetaEntry[] {
  const contentRoot = process.cwd() + '/content';
  const blogsDir = path.join(contentRoot, 'blog');
  const csDir = path.join(contentRoot, 'case-studies');

  const blogFiles = safeReadDir(blogsDir).filter(f => f.endsWith('.md'));
  const csFiles = safeReadDir(csDir).filter(f => f.endsWith('.md'));

  const entries: ContentMetaEntry[] = [];

  // Only rely on relatedServices – keep mechanism intentionally simple
  function extractRelated(relatedServices: unknown): string[] {
    return Array.isArray(relatedServices) ? relatedServices.map(s => String(s)).filter(Boolean) : [];
  }

  blogFiles.forEach(file => {
    try {
      const slug = file.replace(/\.md$/, '');
      const fullPath = path.join(blogsDir, file);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
      const relatedServices = extractRelated(data.relatedServices);
      entries.push({
        slug: `blog/${slug}`,
        type: 'blog',
        title: data.title || slug,
        excerpt: data.excerpt || (content.split(/\n+/).find(p => p.trim().length > 40)?.slice(0,140) + '…'),
        relatedServices
      });
    } catch { /* ignore individual file errors */ }
  });

  csFiles.forEach(file => {
    try {
      const slug = file.replace(/\.md$/, '');
      const fullPath = path.join(csDir, file);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
      const relatedServices = extractRelated(data.relatedServices);
      entries.push({
        slug: `case-studies/${slug}`,
        type: 'case-study',
        title: data.title || slug,
        excerpt: data.challenge || (content.split(/\n+/).find(p => p.trim().length > 40)?.slice(0,140) + '…'),
        relatedServices
      });
    } catch { /* ignore */ }
  });

  return entries;
}

export function getContentIndex(): ContentMetaEntry[] {
  if (typeof window !== 'undefined') {
    // On client we cannot read FS; rely on (optional future) inlined serialized data.
    return cache?.entries || [];
  }
  const marker = fileMTimeSafe(process.cwd() + '/content');
  if (!cache || (Date.now() - cache.mtime > TTL_MS)) {
    cache = { entries: buildIndex(), mtime: marker };
  }
  return cache.entries;
}

// New ultra-simple selector: return first N entries explicitly linked to a given serviceId.
export function contentForService(serviceId: string, limit = 4): ContentMetaEntry[] {
  if (!serviceId) return [];
  const index = getContentIndex();
  return index.filter(e => e.relatedServices.includes(serviceId)).slice(0, limit);
}

// Expose deprecated constant (empty) to avoid breaking existing imports that expect CONTENT_INDEX
export const CONTENT_INDEX: ContentMetaEntry[] = []; // intentionally empty now that dynamic index is used
