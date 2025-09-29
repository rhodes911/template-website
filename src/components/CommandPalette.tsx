"use client";
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type SearchResult = { title: string; url: string; type: string; snippet: string };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Basic nav links as fallback when no query typed
  const links = [
    { label: 'Services', href: '/services' },
    { label: 'SEO Services', href: '/services/seo' },
    { label: 'PPC', href: '/services/ppc' },
    { label: 'Content Marketing', href: '/services/content-marketing' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const openHandler: EventListener = () => setOpen(true);
    window.addEventListener('open-command-palette', openHandler);
    return () => window.removeEventListener('open-command-palette', openHandler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  // Close palette when route changes
  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Query API when typing
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`, {
          headers: { accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (!cancelled) setResults(Array.isArray(data.results) ? data.results : []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, open]);

  const filtered = links.filter((l) => l.label.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[70] flex items-start justify-center pt-32 px-4 backdrop-blur-sm bg-neutral-900/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-700/40 bg-neutral-900 text-neutral-100 animate-scale-in relative">
        <div className="flex items-center gap-3 px-4 py-3 pr-14 border-b border-neutral-700/40 bg-neutral-800/60">
          <svg
            className="w-5 h-5 text-primary-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            placeholder="Search blog, services, case studies…"
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm placeholder-neutral-400"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-700/70">ESC</kbd>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute top-2.5 right-2.5 text-[10px] px-1.5 py-0.5 rounded bg-neutral-700/70 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            X
          </button>
        </div>
        <ul className="max-h-72 overflow-auto divide-y divide-neutral-800/60">
          {query.trim().length >= 2 ? (
            loading ? (
              <li className="px-5 py-6 text-sm text-neutral-400">Searching…</li>
            ) : results.length ? (
      results.map((r) => (
                <li key={r.url}>
                  <Link
                    href={r.url}
        onClick={() => setOpen(false)}
                    className="block px-5 py-3 text-sm hover:bg-primary-600/20 focus:bg-primary-600/30 outline-none transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-neutral-100">{r.title}</div>
                        <div className="mt-1 text-[12px] text-neutral-300 line-clamp-2">{r.snippet}</div>
                      </div>
                      <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wide bg-neutral-700/60 text-neutral-300 border border-neutral-600/60">
                        {r.type}
                      </span>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-5 py-6 text-sm text-neutral-400">No results for &quot;{query}&quot;</li>
            )
          ) : filtered.length ? (
    filtered.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
      onClick={() => setOpen(false)}
                  className="block px-5 py-3 text-sm hover:bg-primary-600/20 focus:bg-primary-600/30 outline-none transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))
          ) : (
            <li className="px-5 py-6 text-sm text-neutral-400">No matches. Try typing a search.</li>
          )}
        </ul>
      </div>
      <style>{`.animate-scale-in { animation: scaleIn .35s cubic-bezier(.16,.8,.29,1); }@keyframes scaleIn { from { opacity:0; transform:scale(.96) translateY(4px);} to {opacity:1; transform:scale(1) translateY(0);} }`}</style>
    </div>
  );
}
