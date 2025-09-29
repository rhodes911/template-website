"use client";
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { themeStyles, getThemeClasses } from '@/lib/theme';
import type { HomeData } from '@/app/home.types';
import { MessageSquare, Search as SearchIcon, FileText, ArrowRight as ArrowRightIcon, Zap, CheckCircle } from 'lucide-react';
import type { TestimonialItem } from '@/components/TestimonialRotator';
import ReactMarkdown from 'react-markdown';

// Local UI mapping to central theme tokens (single edit point for colors/styles on this page)
const ui = {
  pageBg: themeStyles.backgrounds.page,
  heroBg: getThemeClasses.hero(),
  sectionBg: themeStyles.backgrounds.section,
  interactiveBg: themeStyles.backgrounds.interactive,
  ctaBg: themeStyles.backgrounds.ctaDark,
  primaryBtn: themeStyles.buttons.primary,
  secondaryBtn: themeStyles.buttons.secondary,
  ghostBtn: themeStyles.buttons.ghost,
  container: themeStyles.layout.container,
  h2: themeStyles.text.h2,
  accentText: themeStyles.text.accent,
  link: themeStyles.text.link,
};

// Utility: intersection reveal with will-change + reduced motion
const useRevealOnScroll = () => {
  useEffect(() => {
  const els = Array.from(document.querySelectorAll('[data-animate]:not([data-animate-core])')) as HTMLElement[];

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      els.forEach(el => el.classList.add('animate-enter'));
      return;
    }

    // Prime GPU hint before animating
    els.forEach(el => (el.style.willChange = 'opacity, transform'));

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.classList.add('animate-enter');
            el.style.willChange = 'auto';
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );
  els.forEach(el => io.observe(el));
    // Observe dynamically added nodes (e.g., when filtering swaps content)
    const mo = new MutationObserver(mutations => {
      for (const m of mutations) {
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          const candidates: HTMLElement[] = [];
          if ((node as HTMLElement).matches?.('[data-animate]:not([data-animate-core])')) candidates.push(node as HTMLElement);
          const found = Array.from((node as HTMLElement).querySelectorAll?.('[data-animate]:not([data-animate-core])') ?? []) as HTMLElement[];
          candidates.push(...found);
          candidates.forEach(el => {
            if (!prefersReduced) el.style.willChange = 'opacity, transform';
            io.observe(el);
          });
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
};

// Scroll progress bar
const ScrollProgressBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? window.scrollY / max : 0;
        if (ref.current) ref.current.style.transform = `scaleX(${pct})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden className="fixed top-0 left-0 h-1 w-full bg-neutral-200/40 z-[60]">
      <div
        ref={ref}
        className="h-full origin-left bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 transition-transform duration-150"
        style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
      />
    </div>
  );
};

// Command palette (Ctrl+K / Cmd+K)
type SearchResult = { title: string; url: string; type: string; snippet: string };

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
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
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);
  useEffect(() => {
    if (open) setOpen(false);
  }, [pathname, open]);
  // Allow opening from elsewhere (e.g., header search button)
  useEffect(() => {
    const openHandler: EventListener = () => setOpen(true);
    window.addEventListener('open-command-palette', openHandler);
    return () => window.removeEventListener('open-command-palette', openHandler);
  }, []);
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
          headers: { 'accept': 'application/json' }
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
    return () => { cancelled = true; clearTimeout(t); };
  }, [query, open]);

  const filtered = links.filter(l => l.label.toLowerCase().includes(query.toLowerCase()));
  return open ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[70] flex items-start justify-center pt-32 px-4 backdrop-blur-sm bg-neutral-900/40"
      onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}
      onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
      onTouchStart={e => { if (e.target === e.currentTarget) setOpen(false); }}
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
            onChange={e => setQuery(e.target.value)}
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
                  <Link href={r.url} onClick={() => setOpen(false)} className="block px-5 py-3 text-sm hover:bg-primary-600/20 focus:bg-primary-600/30 outline-none transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-neutral-100">{r.title}</div>
                        <div className="mt-1 text-[12px] text-neutral-300 line-clamp-2">{r.snippet}</div>
                      </div>
                      <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wide bg-neutral-700/60 text-neutral-300 border border-neutral-600/60">{r.type}</span>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-5 py-6 text-sm text-neutral-400">No results for &quot;{query}&quot;</li>
            )
          ) : (
            filtered.length ? (
              filtered.map(item => (
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
            )
          )}
        </ul>
      </div>
    </div>
  ) : null;
};

// Core Building Blocks – upgraded: filters, autoplay tour, keyboard nav, and details drawer
const CoreBuildingBlocks = ({ itemsOverride }: { itemsOverride?: Array<{ title: string; description: string; icon?: string; category: 'Foundation'|'Attract'|'Trust'|'Convert'; benefits?: string[]; links?: { label: string; href: string }[] }> }) => {
  type Category = 'All' | 'Foundation' | 'Attract' | 'Trust' | 'Convert';
  type Step = {
    title: string;
    desc: string;
    icon: React.ReactNode;
    category: Exclude<Category, 'All'>;
    benefits: string[];
    links: { label: string; href: string }[];
  };

  const iconFromName = (name?: string) => {
    const cls = 'w-5 h-5';
    switch ((name || '').trim()) {
      case 'MessageSquare': return (<MessageSquare className={cls} />);
      case 'Search': return (<SearchIcon className={cls} />);
      case 'FileText': return (<FileText className={cls} />);
      case 'ArrowRight': return (<ArrowRightIcon className={cls} />);
      case 'Zap': return (<Zap className={cls} />);
      case 'CheckCircle': return (<CheckCircle className={cls} />);
      default: return (<ArrowRightIcon className={cls} />);
    }
  };

  const steps: Step[] = React.useMemo(() => ([
    {
      title: 'Stand‑Out Message',
      desc: 'A clear story so people instantly understand what makes you different.',
      icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>),
      category: 'Foundation',
      benefits: ['Positioning clarity', 'Value proposition fit', 'Tone-of-voice system'],
      links: [
        { label: 'Brand Strategy', href: '/services/brand-strategy' },
      ],
    },
    {
      title: 'Better Search Visibility',
      desc: 'Robust technical setup + organised content so you appear for the right searches.',
      icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>),
      category: 'Attract',
      benefits: ['Technical audits', 'On‑page optimisation', 'Local SEO basics'],
      links: [
        { label: 'SEO Services', href: '/services/seo' },
      ],
    },
    {
      title: 'Content That Builds Trust',
      desc: 'Helpful articles and guides planned around real questions customers ask.',
      icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M20 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v13"/></svg>),
      category: 'Trust',
      benefits: ['Editorial planning', 'Pillar/topic clusters', 'Repurposing system'],
      links: [
        { label: 'Content Marketing', href: '/services/content-marketing' },
      ],
    },
    {
      title: 'Clear Lead Path',
      desc: 'Straightforward steps that move a first visit toward a booked call.',
      icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16"/><path d="m14 6 6 6-6 6"/></svg>),
      category: 'Convert',
      benefits: ['Offer strategy', 'Funnels & forms', 'Follow‑up automation'],
      links: [
        { label: 'Lead Generation', href: '/services/lead-generation' },
        { label: 'Email Marketing', href: '/services/email-marketing' },
      ],
    },
    {
      title: 'Efficient PPC',
      desc: 'Tighter targeting and creative testing to reduce waste and lift ROAS.',
      icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11h18"/><path d="M7 7h10M9 15h6"/></svg>),
      category: 'Attract',
      benefits: ['Keyword/ad strategy', 'Creative testing', 'ROAS tracking'],
      links: [
        { label: 'PPC Management', href: '/services/ppc' },
      ],
    },
    {
      title: 'Improve Conversions',
      desc: 'Test copy, offers and layout to turn more visits into genuine enquiries.',
      icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 13l3 3 7-7"/></svg>),
      category: 'Convert',
      benefits: ['UX testing', 'Landing pages', 'Confidence signals'],
      links: [
        { label: 'Website Design', href: '/services/website-design' },
        { label: 'Digital Campaigns', href: '/services/digital-campaigns' },
      ],
    },
  ]), []);

  const mappedFromCms: Step[] | null = React.useMemo(() => {
    if (!itemsOverride || !itemsOverride.length) return null;
    return itemsOverride.map(it => ({
      title: it.title,
      desc: it.description,
      icon: iconFromName(it.icon),
      category: it.category,
      benefits: it.benefits || [],
      links: it.links || [],
    }));
  }, [itemsOverride]);

  const stepsSrc: Step[] = mappedFromCms ?? steps;

  const [filter, setFilter] = React.useState<Category>('All');
  const [active, setActive] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [lastNonAllFilter, setLastNonAllFilter] = React.useState<Exclude<Category, 'All'> | null>(null);
  const [mobileDetailsOpen, setMobileDetailsOpen] = React.useState(false);
  const cardRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);
  const pauseOriginRef = React.useRef<'manual' | 'auto' | null>(null);
  const didMountRef = React.useRef(false);
  const wrapperRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const introPlayedRef = React.useRef(false);
  const suppressForceRevealRef = React.useRef(false);
  const INTRO_STAGGER_MS = 240;    // initial section reveal pace
  const TOUR_STAGGER_MS = 350;     // tour intro reveal pace
  const TOUR_STEP_MS = 7000;       // autoplay step duration
  const filters: Category[] = ['All', 'Foundation', 'Attract', 'Trust', 'Convert'];
  const staggerTimersRef = React.useRef<number[]>([]);

  const visible = React.useMemo(() => (
    filter === 'All' ? stepsSrc : stepsSrc.filter(s => s.category === filter)
  ), [filter, stepsSrc]);
  const isAll = filter === 'All';

  // (removed unused showStaggerForCurrentVisible)

  

  // Autoplay tour respecting reduced motion
  React.useEffect(() => {
    if (!playing) return;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setActive(i => (i + 1) % visible.length);
    }, TOUR_STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, visible.length]);

  // Clear any stagger timers on pause or filter change
  React.useEffect(() => {
    if (!playing) {
      staggerTimersRef.current.forEach(t => clearTimeout(t));
      staggerTimersRef.current = [];
    }
  }, [playing, filter]);

  // Reset active when filter changes
  React.useEffect(() => { setActive(0); }, [filter]);

  // Observe section visibility; pause tour when offscreen
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      const visible = e.isIntersecting && e.intersectionRatio >= 0.35;
      setInView(visible);
    }, { threshold: [0, 0.2, 0.35, 0.6, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-pause tour when the section leaves view
  React.useEffect(() => {
    if (!inView && playing) {
  pauseOriginRef.current = 'auto';
  setPlaying(false);
    }
  }, [inView, playing]);

  // When tour is paused (by any means), restore last non-All filter if appropriate
  React.useEffect(() => {
    if (!playing && pauseOriginRef.current === 'manual' && lastNonAllFilter && filter === 'All') {
      setFilter(lastNonAllFilter);
    }
    if (!playing) pauseOriginRef.current = null;
  }, [playing, filter, lastNonAllFilter]);

  // Defensive: ensure visible cards are immediately shown after filter switches
  React.useEffect(() => {
    // Skip on first mount to allow initial stagger animation
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    // Skip when we're about to run a tour-specific stagger
    if (suppressForceRevealRef.current) {
      suppressForceRevealRef.current = false;
      return;
    }
    // Run after paint
    const id = requestAnimationFrame(() => {
      const root = gridRef.current;
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll('[data-animate], [data-animate-core]')) as HTMLElement[];
      nodes.forEach(n => n.classList.add('animate-enter'));
    });
    return () => cancelAnimationFrame(id);
  }, [filter, visible.length]);

  // First-time serpentine intro: 1→2→3→4→5→6 with a calm stagger
  React.useEffect(() => {
    if (!inView || introPlayedRef.current === true || !isAll) return;
    const STAGGER = INTRO_STAGGER_MS; // ms per tile
    const timers: number[] = [];
  visible.forEach((s) => {
      const el = wrapperRefs.current[s.title];
      if (el) el.classList.remove('animate-enter');
    });
  visible.forEach((s, idx) => {
      const t = window.setTimeout(() => {
        const el = wrapperRefs.current[s.title];
        if (el) el.classList.add('animate-enter');
      }, idx * STAGGER);
      timers.push(t);
    });
    // after last, mark played
    const final = window.setTimeout(() => { introPlayedRef.current = true; }, visible.length * STAGGER + 50);
    timers.push(final);
    return () => { timers.forEach(clearTimeout); };
  }, [inView, isAll, visible]);

  // Keyboard navigation
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(i => (i + 1) % visible.length); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(i => (i - 1 + visible.length) % visible.length); }
  };

  // Open mobile details sheet for a given card
  const openMobileDetails = (idx: number) => {
    setActive(idx);
    pauseOriginRef.current = 'auto';
    if (playing) setPlaying(false);
    setMobileDetailsOpen(true);
  };

  // Keep the active card in view during tour playback
  React.useEffect(() => {
    if (!playing) return; // don't auto-scroll on initial load or manual browsing
    if (!inView) return;  // avoid fighting user when they've scrolled away
    const key = visible[active]?.title;
    const el = key ? cardRefs.current[key] : null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pad = 100; // some breathing room
    const outOfView = rect.top < pad || rect.bottom > window.innerHeight - pad;
    if (outOfView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [active, visible, playing, inView]);

  return (
  <section className="relative" aria-label="Core Building Blocks" ref={sectionRef}>
      {/* Decorative dotted bg */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(2,6,23,0.06)_1px,transparent_1px)] [background-size:14px_14px] rounded-[28px]" />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="Core filters">
        {filters.map(f => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => {
              if (playing && f !== 'All') {
                // During tour, keep All enforced
                setFilter('All');
                return;
              }
              setFilter(f);
              if (f !== 'All') setLastNonAllFilter(f);
            }}
            disabled={playing && f !== 'All'}
            title={playing && f !== 'All' ? 'Pause tour to filter' : undefined}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white border-primary-600'
                : (playing && f !== 'All')
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
    <button
          type="button"
          onClick={() => setPlaying(p => {
            const next = !p;
            if (next) {
              // starting tour: remember current non-All filter
              if (!isAll) setLastNonAllFilter(filter as Exclude<Category, 'All'>);
              // Always run tour on All, ignoring current filter
              suppressForceRevealRef.current = true;
              if (!isAll) setFilter('All');
              // After grid renders (or immediately if already All), run a tour-specific hide->stagger reveal
              window.setTimeout(() => {
                // hide all first
                stepsSrc.forEach(s => {
                  const el = wrapperRefs.current[s.title];
                  if (el) el.classList.remove('animate-enter');
                });
                // reveal in order
                stepsSrc.forEach((s, idx) => {
                  window.setTimeout(() => {
                    const el = wrapperRefs.current[s.title];
                    if (el) el.classList.add('animate-enter');
                  }, idx * TOUR_STAGGER_MS);
                });
                // select first card
                setActive(0);
              }, 60);
            } else {
              // pausing tour: restore last non-All if available
              pauseOriginRef.current = 'manual';
              if (lastNonAllFilter) setFilter(lastNonAllFilter);
            }
            return next;
          })}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${playing ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
          aria-pressed={playing}
        >
          {playing ? (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
              Pause tour
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 5v14l11-7z"/></svg>
              Play tour
            </>
          )}
        </button>
        <span className="ml-auto text-xs text-neutral-500 hidden sm:inline">Use ← → to navigate</span>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        tabIndex={0}
        onKeyDown={onKeyDown}
        ref={gridRef}
      >
        {visible.map((s, visibleIndex) => {
          // map visible index to original index for placement calc
          const i = stepsSrc.findIndex(st => st.title === s.title);
          const inTopRow = i < 3;
          const hasRightTop = inTopRow && (i % 3) !== 2; // 0,1
          const hasLeftBottom = !inTopRow && i !== stepsSrc.length - 1; // 3,4
          const isWrapDown = i === 2; // 3 -> 4 connector
          const hasMobileDown = i < stepsSrc.length - 1;
          // Only use special placement mapping in the full "All" view;
          // for filtered views, allow normal grid flow to avoid gaps/misalignment.
          const placement = isAll
            ? (i < 3
                ? 'md:row-start-1'
                : i === 3
                  ? 'md:row-start-2 md:col-start-3'
                  : i === 4
                    ? 'md:row-start-2 md:col-start-2'
                    : 'md:row-start-2 md:col-start-1')
            : '';
          const selected = visibleIndex === active;
          const delay = 120 + visibleIndex * 140;

          return (
            <div
              key={s.title}
              className={`relative ${placement}`}
              data-animate-core
              data-index={i}
              ref={el => { wrapperRefs.current[s.title] = el; }}
              style={{ transitionDelay: `${delay}ms` }}
            >
              <div
                role="button"
                tabIndex={0}
                onMouseEnter={() => setActive(visibleIndex)}
                onFocus={() => setActive(visibleIndex)}
                onClick={() => setActive(visibleIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(visibleIndex);
                  }
                }}
                aria-pressed={selected}
                ref={el => { cardRefs.current[s.title] = el; }}
                className={`group w-full text-left relative rounded-3xl p-[1px] bg-gradient-to-br from-primary-400/40 via-primary-500/40 to-primary-600/40 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.25)] hover:shadow-[0_14px_40px_-10px_rgba(2,6,23,0.35)] transition-all ${selected ? 'ring-2 ring-primary-500 -translate-y-0.5' : 'hover:-translate-y-0.5'}`}
              >
                <div className="rounded-[22px] bg-white/90 backdrop-blur-sm p-6 border border-neutral-200/70 h-full relative">
                  {/* Number badge (md+) */}
                  <span className="hidden md:flex absolute top-4 right-4 items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-semibold">
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-3 pr-10">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${selected ? 'bg-primary-600 text-white ring-2 ring-primary-300' : 'bg-primary-50 text-primary-600 ring-1 ring-primary-200'}`}>
                      {s.icon}
                    </span>
                    <h3 className="text-lg font-semibold text-neutral-900">{s.title}</h3>
                    <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">{s.category}</span>
                  </div>
                  <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
                  {/* Mobile-only details trigger */}
                  <div className="mt-4 md:hidden">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openMobileDetails(visibleIndex); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors"
                      aria-label={`View details for ${s.title}`}
                    >
                      <span>Details</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Connectors (md+) – keep the original look */}
              {isAll && hasRightTop && (
                <>
                  <div className="hidden md:block absolute top-1/2 -right-7 w-14 h-[2px] bg-gradient-to-r from-primary-400 to-primary-600" aria-hidden />
                  <svg className="hidden md:block absolute top-1/2 -right-7 -translate-y-1/2 w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
              {isAll && hasLeftBottom && (
                <>
                  <div className="hidden md:block absolute top-1/2 -left-7 w-14 h-[2px] bg-gradient-to-l from-primary-400 to-primary-600" aria-hidden />
                  <svg className="hidden md:block absolute top-1/2 -left-7 -translate-y-1/2 w-4 h-4 text-primary-600 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
              {isAll && isWrapDown && (
                <>
                  <div className="hidden md:block absolute -bottom-8 right-1/2 translate-x-1/2 md:right-6 md:translate-x-0 w-[2px] h-16 bg-gradient-to-b from-primary-400 to-primary-600" aria-hidden />
                  <svg className="hidden md:block absolute -bottom-8 right-1/2 translate-x-1/2 md:right-6 md:translate-x-0 translate-y-1 w-4 h-4 text-primary-600 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}

              {/* Mobile arrow between stacked items */}
              {isAll && hasMobileDown && (
                <div className="md:hidden flex justify-center mt-4" aria-hidden>
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0-4-4m4 4 4-4" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

  {/* Force cards visibility handled via effect above */}

      {/* Details drawer (desktop/tablet) */}
      {visible.length > 0 && (
        <div
          className="hidden md:block mt-8 rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm"
          data-animate
          onMouseEnter={() => { pauseOriginRef.current = 'auto'; if (playing) setPlaying(false); }}
          onFocus={() => { pauseOriginRef.current = 'auto'; if (playing) setPlaying(false); }}
          onPointerDown={() => { pauseOriginRef.current = 'auto'; if (playing) setPlaying(false); }}
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-[240px]">
              <div className="text-xs uppercase tracking-wide text-neutral-500">Details</div>
              <div className="mt-1 text-lg font-semibold text-neutral-900">{visible[active]?.title}</div>
              <p className="mt-2 text-sm text-neutral-600 max-w-prose">{visible[active]?.desc}</p>
            </div>
            <ul className="flex-1 grid sm:grid-cols-2 gap-2 min-w-[260px]">
              {visible[active]?.benefits.map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500" />{b}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 flex-wrap">
              {visible[active]?.links.map(link => (
                <Link key={link.href} href={link.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors">
                  <span>{link.label}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>
          {/* Progress bar matching active index */}
          <div className="mt-6 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all" style={{ width: `${((active + 1) / visible.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Mobile bottom sheet for details */}
      {mobileDetailsOpen && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="mobile-details-title">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="Close details"
            onClick={() => setMobileDetailsOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute left-0 right-0 bottom-0 rounded-t-2xl bg-white shadow-2xl border-t border-neutral-200 p-5 max-h-[80vh] overflow-auto animate-[slideUp_220ms_ease-out]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div id="mobile-details-title" className="text-xs uppercase tracking-wide text-neutral-500">Details</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">{visible[active]?.title}</div>
              </div>
              <button
                type="button"
                onClick={() => setMobileDetailsOpen(false)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                aria-label="Close"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-600">{visible[active]?.desc}</p>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {visible[active]?.benefits.map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500" />{b}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {visible[active]?.links.map(link => (
                <Link key={link.href} href={link.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors">
                  <span>{link.label}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Testimonial Rotator (accepts items; falls back to defaults)
const TestimonialRotator: React.FC<{ items?: TestimonialItem[] }> = ({ items }) => {
  const testimonials: TestimonialItem[] = items && items.length ? items : [
    {
      quote:
        "Ellie helped us professionalise our marketing. We went from inconsistent footfall to a waiting list on weekends. The strategy didn't just increase sales – it reconnected us with our local community.",
      name: 'Maria Rossi',
      role: 'Owner, Bella Vista Restaurant',
      metrics: ['+150% revenue', '+300% online orders', '+500% social reach'],
      slug: 'bella-vista-restaurant',
    },
    {
      quote:
        "The marketing strategy didn't just grow our sales – it built a community around our mission. Customers have become advocates for sustainable living.",
      name: 'Tom Green',
      role: 'Founder, EcoHome Solutions',
      metrics: ['+500% revenue', '+300% new customers', '+150% conversion rate'],
      slug: 'ecohome-solutions',
    },
    {
      quote:
        'Ellie helped me discover and articulate my unique value. The positioning & content approach turned me from just another coach into a recognised expert.',
      name: 'Sarah Mitchell',
      role: 'Life Coach, Sarah Mitchell Coaching',
      metrics: ['+400% revenue', '+1200% email list', '+250% qualified leads'],
      slug: 'sarah-mitchell-coaching',
    },
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, [testimonials.length]);
  return (
    <div className="relative" data-animate>
      {testimonials.map((t, i) => (
        <figure
          key={i}
          className={`transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
          }`}
          aria-hidden={i !== index}
        >
          <blockquote className="text-xl md:text-2xl font-medium text-neutral-800 leading-relaxed">“{t.quote}”</blockquote>
          <figcaption className="mt-6 flex items-start gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-semibold shadow">
                {t.name
                  .split(' ')
                  .map(w => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{t.name}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {(t.metrics ?? []).map(m => (
                <li
                  key={m}
                  className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100"
                >
                  {m}
                </li>
              ))}
            </ul>
            <Link
              href={`/case-studies/${t.slug}`}
              aria-label={`View case study: ${t.name}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors shrink-0 ml-auto"
            >
              <span>View case study</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </figcaption>
        </figure>
      ))}
      <div className="flex gap-2 mt-10" aria-label="Testimonial navigation">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show testimonial ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? 'bg-primary-600 scale-110' : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Interactive services (expand on hover/focus)
interface ServiceCardData {
  title: string;
  desc: string;
  benefits: string[];
  href: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InteractiveServices = () => {
  const services: ServiceCardData[] = [
    {
      title: 'SEO Services',
      desc: 'Improve search visibility & increase qualified traffic.',
      benefits: ['Technical Audits', 'On-Page Optimisation', 'Content Structure', 'Local Visibility'],
      href: '/services/seo'
    },
    {
      title: 'PPC Management',
      desc: 'High-converting paid search & social campaigns.',
      benefits: ['Keyword Strategy', 'Ad Copy Testing', 'Landing Pages', 'ROAS Tracking'],
      href: '/services/ppc'
    },
    {
      title: 'Social Media Marketing',
      desc: 'Strategic content & engagement that builds brand.',
      benefits: ['Content Calendars', 'Community Growth', 'Creative Assets', 'Performance Insight'],
      href: '/services/social-media'
    },
    {
      title: 'Content Marketing',
      desc: 'Authority-building articles & conversion assets.',
      benefits: ['Editorial Planning', 'Blog Writing', 'Pillar Pages', 'Repurposing'],
      href: '/services/content-marketing'
    },
    {
      title: 'Email Marketing',
      desc: 'Lifecycle nurture & retention-focused campaigns.',
      benefits: ['Welcome Flows', 'Automation', 'List Segmentation', 'Performance Reports'],
      href: '/services/email-marketing'
    },
    {
      title: 'Lead Generation',
      desc: 'Consistent pipeline via offers & conversion paths.',
      benefits: ['Offer Strategy', 'Funnels', 'Form Optimisation', 'Follow-Up'],
      href: '/services/lead-generation'
    },
    {
      title: 'Brand Strategy',
      desc: 'Positioning & messaging that resonates.',
      benefits: ['Value Proposition', 'Messaging Framework', 'Audience Insights', 'Tone of Voice'],
      href: '/services/brand-strategy'
    },
    {
      title: 'Digital Campaigns',
      desc: 'Multi-channel execution aligned to growth targets.',
      benefits: ['Campaign Planning', 'Channel Mix', 'Offer Sequencing', 'KPI Dashboards'],
      href: '/services/digital-campaigns'
    },
    {
      title: 'Website Design',
      desc: 'Performance-first site experiences for conversion.',
      benefits: ['UX Planning', 'Responsive Design', 'Speed Optimisation', 'Conversion Blocks'],
      href: '/services/website-design'
    }
  ];
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6" data-animate>
      {services.map((s, i) => {
        const open = active === i;
        return (
          <Link
            key={s.title}
            href={s.href}
            className={`group relative block rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 shadow-sm hover:shadow-xl transition-all overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${open ? 'ring-2 ring-primary-500' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onBlur={() => setActive(null)}
            aria-label={s.title}
          >
            <div className="p-6 pr-14">
              <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <span>{s.title}</span>
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-colors ${
                    open
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white'
                  }`}
                >
                  {i + 1}
                </span>
              </h3>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{s.desc}</p>
              <ul
                className={`mt-4 space-y-2 text-sm transition-all ${
                  open ? 'opacity-100 max-h-64' : 'opacity-0 max-h-0 overflow-hidden'
                } duration-500`}
              >
                {s.benefits.map(b => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 inline-flex items-center gap-2 text-primary-600 font-medium text-sm">
                View Service
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                open
                  ? 'bg-primary-600 text-white'
                  : 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white'
              }`}
              aria-hidden
            >
              <svg
                className={`w-5 h-5 transition-transform ${open ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

// Three-pillar services layout inspired by integrated-search grouping
const ServicePillars = () => {
  const pillars = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 6v3a5 5 0 0 0 10 0V6" />
        </svg>
      ),
      title: 'Attract Demand',
      desc: 'Find more of the right people through search and paid discovery.',
      links: [
        { label: 'SEO', href: '/services/seo' },
        { label: 'PPC', href: '/services/ppc' },
        { label: 'Social Ads', href: '/services/social-media' }
      ]
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 4l6 16 6-16M4 14h16" />
        </svg>
      ),
      title: 'Turn Interest Into Leads',
      desc: 'Make next steps obvious and useful so curiosity becomes contact.',
      links: [
        { label: 'Lead Generation', href: '/services/lead-generation' },
        { label: 'Email Marketing', href: '/services/email-marketing' },
        { label: 'Content Strategy', href: '/services/content-marketing' }
      ]
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h7" />
        </svg>
      ),
      title: 'Design For Conversion',
      desc: 'Fast, clear, confidence‑building experiences that perform.',
      links: [
        { label: 'Website Design', href: '/services/website-design' },
        { label: 'Digital Campaigns', href: '/services/digital-campaigns' },
        { label: 'Brand Strategy', href: '/services/brand-strategy' }
      ]
    }
  ];
  return (
    <div className="pillars-grid grid md:grid-cols-3 gap-6" data-animate>
      {pillars.map(p => (
        <div
          key={p.title}
          className="pillar-card relative p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden will-change-transform [transform:translateZ(0)] hover:scale-[1.015]"
        >
          <div className="pointer-events-none absolute inset-0 opacity-[.06] bg-gradient-to-tr from-primary-400/30 to-transparent" aria-hidden />
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600" aria-hidden />
          <div className="flex items-center gap-2 text-primary-600">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 border border-primary-100">
              {p.icon}
            </span>
            <h3 className="text-lg font-semibold text-neutral-900">{p.title}</h3>
          </div>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{p.desc}</p>
          <div className="mt-5 flex flex-col gap-2">
            {p.links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors"
              >
                <span>{link.label}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Floating Dock
const FloatingDock = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      className={`fixed bottom-6 right-24 z-50 transition-all ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Keep right side free for future chatbot */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:bg-neutral-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Parallax background field
const ParallaxField = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    let raf = 0;
    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    const tick = () => {
      // Ease towards the target for smoother, fewer updates
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      if (ref.current) ref.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      const dx = Math.abs(targetX - curX);
      const dy = Math.abs(targetY - curY);
      if (dx > 0.2 || dy > 0.2) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const handler = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      targetX = (e.clientX / w - 0.5) * 12;
      targetY = (e.clientY / h - 0.5) * 12;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', handler as (e: MouseEvent) => void, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler as (e: MouseEvent) => void);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-28 w-72 h-72 bg-primary-600/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
    </div>
  );
};

type HomeProps = Partial<HomeData> & { testimonialItems?: TestimonialItem[] };
export default function InteractiveExperimentClient(props: HomeProps = {}) {
  useRevealOnScroll();
  const toggles = props.toggles || { enableCommandPalette: true, enableScrollProgress: true };
  return (
  <div className={`min-h-screen ${ui.pageBg} text-neutral-900`}>
  {toggles.enableCommandPalette !== false && <CommandPalette />}
  {toggles.enableScrollProgress !== false && <ScrollProgressBar />}
      <FloatingDock />
  <header className={`${ui.heroBg} pt-28 pb-24 md:pt-32 md:pb-32`}>
        <ParallaxField />
  <div className={`relative ${ui.container}`}>
          {/* Removed live concept pill per request */}
          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              {props.heroTitle || 'Digital Marketing in Camberley, Surrey'}
            </span>
            <span className="block mt-2 text-neutral-900">{props.heroSubtitle || 'Creating Measurable Growth'}</span>
          </h1>
          <p
            className="max-w-2xl mt-6 text-lg sm:text-xl text-neutral-600 leading-relaxed"
            data-animate
          >
            {props.heroDescription || 'Based in Camberley, Surrey we deliver professional digital marketing strategies for businesses across Hampshire, Surrey, Basingstoke and Reading. From smart campaigns and search optimisation to social media, content and brand development – your local growth partner.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-4" data-animate>
            <Link href={props.heroCtas?.primaryHref || '/contact'} className={`${ui.primaryBtn} relative overflow-hidden group`}>
              <span className="relative flex items-center gap-2">{props.heroCtas?.primaryLabel || 'Book Strategy Call'}
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link href={props.heroCtas?.secondaryHref || '/services'} className={ui.secondaryBtn}>
              <span className="flex items-center gap-2">{props.heroCtas?.secondaryLabel || 'Explore Services'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </header>
  <section className="py-20 relative bg-gradient-to-b from-white to-primary-50/40">
        <div className="absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-transparent to-white/80 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Keep the primary section H2 always visible to satisfy heading tests */}
          <div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              {props.coreBlocks?.title || 'Core Building Blocks'}
            </h2>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" aria-hidden />
          </div>
          {props.coreBlocks?.intro ? (
            <div className="max-w-3xl text-neutral-700 text-lg mt-4 mb-10" data-animate>
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <Link href={href || '#'} className="text-primary-600 font-semibold hover:underline">{children}</Link>
                  ),
                  p: ({ children }) => (<p className="m-0">{children}</p>),
                }}
              >
                {props.coreBlocks.intro}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="max-w-3xl text-neutral-700 text-lg mt-4 mb-10" data-animate>
              The essentials that compound results: technical
              {' '}<Link href="/services/seo" className="text-primary-600 font-semibold hover:underline">SEO</Link>, clear
              {' '}<Link href="/services/content-marketing" className="text-primary-600 font-semibold hover:underline">content marketing</Link>,
              {' '}conversion‑friendly journeys and efficient
              {' '}<Link href="/services/ppc" className="text-primary-600 font-semibold hover:underline">PPC</Link>.
              {' '}Built for local businesses in Camberley, Surrey & Hampshire and continuously optimised
              {' '}for speed, visibility and
              {' '}<Link href="/services/lead-generation" className="text-primary-600 font-semibold hover:underline">lead generation</Link>.
            </p>
          )}
          <CoreBuildingBlocks itemsOverride={props.coreBlocks?.items} />
        </div>
      </section>
  <section className={`py-24 relative overflow-hidden ${ui.sectionBg}`} aria-labelledby="how-we-help-heading">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="md:flex md:items-end md:justify-between gap-10 mb-14" data-animate>
            <div>
              <h3 id="how-we-help-heading" className="text-3xl sm:text-4xl font-bold mb-4">{props.howWeHelp?.title || (<><span>How We Help You </span><span className="text-primary-600">Grow</span></>)}</h3>
              {props.howWeHelp?.intro ? (
                <p className="text-neutral-600 max-w-xl">{props.howWeHelp.intro}</p>
              ) : (
                <p className="text-neutral-600 max-w-xl">A modular stack of acquisition & retention disciplines engineered for compounding performance.</p>
              )}
            </div>
            <Link
              href={props.howWeHelp?.ctaHref || '/services'}
              className="inline-flex items-center gap-2 text-primary-600 font-medium mt-6 md:mt-0 hover:underline"
            >
              {(props.howWeHelp?.ctaLabel || 'Full Services Overview')}{' '}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <ServicePillars />
        </div>
      </section>
  <section className="py-24 relative bg-white" aria-labelledby="client-signals-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h4 id="client-signals-heading" className="text-3xl sm:text-4xl font-bold mb-10" data-animate>
            {props.clientSignals?.title || 'Client Signals'}
          </h4>
          {/* Homepage now uses standardized case-study powered rotator; items provided via server */}
          <TestimonialRotator items={props.testimonialItems || []} />
        </div>
      </section>
  <section className={`py-28 relative overflow-hidden ${ui.ctaBg}`} aria-labelledby="home-cta-heading">
        <div className="absolute inset-0 pointer-events-none" />
        <div
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-animate
        >
          <h5 id="home-cta-heading" className="text-4xl font-extrabold mb-6">{props.pageCta?.title || 'Ready To Build Compounding Growth?'}</h5>
          <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto mb-10">{props.pageCta?.description || 'Request a no-pressure strategy call. We’ll map quick wins, structural gaps & next-step acceleration paths tailored to your objectives.'}</p>
          <Link
            href={props.pageCta?.buttonHref || '/contact'}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 font-semibold shadow-lg hover:shadow-primary-600/40 transition-shadow"
          >
            {props.pageCta?.buttonLabel || 'Book Strategy Call'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
  <style suppressHydrationWarning>{`
  .animate-enter { opacity: 1 !important; transform: translateY(0) scale(1) !important; will-change: auto !important; }
  [data-animate] { opacity: 0; transform: translateY(22px) scale(.985); transition: transform 1.1s cubic-bezier(.16,.8,.29,1), opacity 1.1s cubic-bezier(.16,.8,.29,1); will-change: opacity, transform; }
  .animate-scale-in { animation: scaleIn .35s cubic-bezier(.16,.8,.29,1); }
  @keyframes scaleIn { from { opacity:0; transform:scale(.96) translateY(4px);} to {opacity:1; transform:scale(1) translateY(0);} }

  /* Core Building Blocks intro control */
  [data-animate-core] { opacity: 0; transform: translateY(22px) scale(.985); transition: transform 1.1s cubic-bezier(.16,.8,.29,1), opacity 1.1s cubic-bezier(.16,.8,.29,1); will-change: opacity, transform; }
  [data-animate-core].animate-enter { opacity: 1 !important; transform: translateY(0) scale(1) !important; }

  /* Pillars grow-in stagger with increasing amplitude left to right */
  .pillars-grid .pillar-card { opacity: 0; will-change: opacity, transform; }
  .pillars-grid.animate-enter .pillar-card:nth-child(1) { animation: pillarGrowL 1.1s cubic-bezier(.16,.8,.29,1) forwards; animation-delay: .16s; transform-origin: left center; }
  .pillars-grid.animate-enter .pillar-card:nth-child(2) { animation: pillarGrowM 1.1s cubic-bezier(.16,.8,.29,1) forwards; animation-delay: .36s; transform-origin: center; }
  .pillars-grid.animate-enter .pillar-card:nth-child(3) { animation: pillarGrowR 1.1s cubic-bezier(.16,.8,.29,1) forwards; animation-delay: .56s; transform-origin: right center; }
  @keyframes pillarGrowL { 0% { opacity:0; transform: translateY(18px) scale(.90);} 60% { opacity:1; transform: translateY(0) scale(1.02);} 100% { opacity:1; transform: translateY(0) scale(1);} }
  @keyframes pillarGrowM { 0% { opacity:0; transform: translateY(18px) scale(.92);} 60% { opacity:1; transform: translateY(0) scale(1.04);} 100% { opacity:1; transform: translateY(0) scale(1);} }
  @keyframes pillarGrowR { 0% { opacity:0; transform: translateY(18px) scale(.94);} 60% { opacity:1; transform: translateY(0) scale(1.06);} 100% { opacity:1; transform: translateY(0) scale(1);} }

  @keyframes gradientX { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .animate-gradient-x { background-size: 250% 250%; animation: gradientX 10s ease infinite; }

  @media (prefers-reduced-motion: reduce) {
    [data-animate] { transition-duration: 1ms !important; transform: none !important; }
    .pillars-grid .pillar-card { opacity: 1 !important; transform: none !important; animation: none !important; }
  }
  `}</style>
    </div>
  );
}
