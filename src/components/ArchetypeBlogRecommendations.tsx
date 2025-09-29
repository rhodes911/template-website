"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { serviceArchetypes } from '@/config/serviceArchetypes';
import { ArrowRight, BookOpen } from 'lucide-react';
import { themeStyles } from '@/lib/theme';

interface ContentMetaEntry { slug: string; type: string; title: string; relatedServices: string[]; excerpt?: string }

interface Props {
  selectedArchetypes: string[];
}

export function ArchetypeBlogRecommendations({ selectedArchetypes }: Props) {
  const [entries, setEntries] = useState<ContentMetaEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Build set of unique serviceIds represented by current archetype selections
  const targetServiceIds = useMemo(() => {
    const set = new Set<string>();
    selectedArchetypes.forEach(id => {
      const arch = serviceArchetypes.find(a => a.id === id);
      arch?.serviceIds.forEach(s => set.add(s));
    });
    return Array.from(set);
  }, [selectedArchetypes]);

  useEffect(() => {
    if (selectedArchetypes.length === 0) return;
    let cancelled = false;
    setLoading(true); setError(null);
    fetch('/api/content-index')
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const all: ContentMetaEntry[] = Array.isArray(data?.entries) ? data.entries : [];
        // Score by overlap with target serviceIds; prefer higher overlap, then blogs before case studies for breadth
        const scored = all.map(e => {
          const overlap = e.relatedServices.filter(rs => targetServiceIds.includes(rs));
          const typeBias = e.type === 'blog' ? 0.1 : 0; // light bias to mix blogs first
            return { e, score: overlap.length + typeBias };
        }).filter(x => x.score > 0);
        scored.sort((a,b) => b.score - a.score);
        const dedup: ContentMetaEntry[] = [];
        const seen = new Set<string>();
        for (const { e } of scored) {
          if (!seen.has(e.slug)) { dedup.push(e); seen.add(e.slug); }
          if (dedup.length >= 12) break;
        }
        setEntries(dedup);
      })
      .catch(() => !cancelled && setError('Could not load recommendations.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [selectedArchetypes, targetServiceIds]);

  if (selectedArchetypes.length === 0) return null;

  const headingArch = serviceArchetypes.find(a => a.id === selectedArchetypes[0]);

  return (
    <div className="mt-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50/70 via-white to-white shadow-sm">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-4">
            <div>
              <h3 className="text-sm font-bold tracking-wide text-primary-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> For You: Recommended Reading
              </h3>
              {headingArch && (
                <p className="text-sm text-neutral-600 mt-1 max-w-xl">
                  Based on <span className="font-semibold text-primary-700">“{headingArch.question}”</span>{selectedArchetypes.length > 1 && ' and other selected needs'}, here are helpful articles.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Link href={`/blog`} className={`${themeStyles.buttons.secondary} text-xs py-2 px-3`}>View All Articles</Link>
              <Link href={`/contact?source=recommendations&focus=${encodeURIComponent(headingArch?.id || 'marketing')}`} className={`${themeStyles.buttons.primary} text-xs py-2 px-3 flex items-center gap-1`}>Free Consultation <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
          {loading && <p className="text-xs text-neutral-500">Loading…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {!loading && entries.length === 0 && !error && (
            <p className="text-xs text-neutral-500">No related articles yet. More coming soon.</p>
          )}
          {!loading && entries.length > 0 && (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {entries.slice(0,6).map(item => (
                <li key={item.slug} className="group relative rounded-lg border border-neutral-200 bg-white p-4 hover:border-primary-400 hover:shadow-sm transition-all">
                  <Link href={`/${item.slug}`} className="absolute inset-0" aria-label={item.title}></Link>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700 pr-2 leading-snug line-clamp-2">{item.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary-600 bg-primary-50 rounded px-1.5 py-0.5">{item.type === 'case-study' ? 'Case Study' : 'Blog'}</span>
                  </div>
                  {item.excerpt && <p className="mt-2 text-xs text-neutral-600 line-clamp-3">{item.excerpt}</p>}
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-primary-600">Read <ArrowRight className="w-3 h-3" /></span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
