'use client';

import React, { useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { themeStyles } from '@/lib/theme';

interface NavigationClientProps {
  logo: React.ReactNode;
}

export default function NavigationClient({ logo }: NavigationClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [runningSeo, setRunningSeo] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [seoResponse, setSeoResponse] = useState<null | {
    message: string;
    page: string;
    results: { name: string; code: number; log: string }[];
  }>(null);
  const [copyState, setCopyState] = useState<Record<string, { all?: boolean; structure?: boolean }>>({});

  // Helpers: copy to clipboard and extract only the Heading Structure block for headings test
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.error('Clipboard copy failed', e);
      return false;
    }
  };

  const extractHeadingStructure = (log: string) => {
    if (!log) return null;
    const lines = log.split(/\r?\n/);
    const out: string[] = [];
    let inSection = false;
    for (const line of lines) {
      if (!inSection) {
        if (line.trim() === 'Heading Structure:') {
          inSection = true;
          out.push(line);
        }
        continue;
      } else {
        const t = line.trim();
        if (!t || t.startsWith('Issues:') || t.startsWith('✅') || t.startsWith('❌')) break;
        out.push(line);
      }
    }
    return out.length ? out.join('\n') : null;
  };

  const services = [
    { name: 'Brand Strategy', href: '/services/brand-strategy' },
    { name: 'Lead Generation', href: '/services/lead-generation' },
    { name: 'Content Marketing', href: '/services/content-marketing' },
    { name: 'SEO', href: '/services/seo' },
    { name: 'PPC / Paid Ads', href: '/services/ppc' },
    { name: 'Email Marketing', href: '/services/email-marketing' },
    { name: 'Digital Campaigns', href: '/services/digital-campaigns' },
    { name: 'Website Design', href: '/services/website-design' },
    { name: 'Social Media', href: '/services/social-media' },
  ];

  const [servicesOpen, setServicesOpen] = useState(false);
  // Add a small close delay so the menu doesn't vanish instantly when moving the mouse
  const closeTimerRef = useRef<number | null>(null);
  const openServices = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => setServicesOpen(false), 200);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-neutral-200/50">
      <div className={themeStyles.layout.container}>
        <div className="flex justify-between items-center py-4 sm:py-5">
          {logo}
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Services dropdown (clickable parent) */}
            <div
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
              onFocus={openServices}
              onBlur={scheduleCloseServices}
            >
              <Link href="/services" className={`${themeStyles.navigation.link} inline-flex items-center gap-1`}
                onClick={() => setServicesOpen(o => !o)}>
                <span>Services</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </Link>
              {servicesOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white border border-neutral-200 shadow-lg rounded-xl p-3 grid grid-cols-1 gap-1 z-40">
                  {services.map(s => (
                    <Link key={s.href} href={s.href} className="px-3 py-2 rounded-md text-sm text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors">
                      {s.name}
                    </Link>
                  ))}
                  <div className="pt-2 mt-1 border-t border-neutral-200">
                    <Link href="/services" className="block px-3 py-2 rounded-md text-xs font-medium text-primary-600 hover:bg-primary-50">
                      View All Services →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/about" className={themeStyles.navigation.link}>About</Link>
            <Link href="/blog" className={themeStyles.navigation.link}>Blog</Link>
            <Link href="/case-studies" className={themeStyles.navigation.link}>Case Studies</Link>
            <Link href="/faq" className={themeStyles.navigation.link}>FAQ</Link>
            <Link href="/contact" className={themeStyles.navigation.link}>Contact</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors border border-neutral-200"
              aria-label="Search site"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Search</span>
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
  {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <nav className="flex flex-col space-y-4">
              <details className="px-2">
                <summary className={`${themeStyles.navigation.link} px-2 py-2 list-none cursor-pointer select-none flex items-center justify-between`}>
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </summary>
                <div className="mt-2 ml-2 flex flex-col gap-1">
                  {services.map(s => (
                    <Link key={s.href} href={s.href} className="text-sm px-3 py-2 rounded-md hover:bg-neutral-100"
                      onClick={() => setMobileMenuOpen(false)}>{s.name}</Link>
                  ))}
                  <Link href="/services" className="text-xs font-medium text-primary-600 px-3 py-2 hover:bg-primary-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}>View All →</Link>
                </div>
              </details>
              <Link href="/about" className={`${themeStyles.navigation.link} px-4 py-2`} onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/blog" className={`${themeStyles.navigation.link} px-4 py-2`} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/case-studies" className={`${themeStyles.navigation.link} px-4 py-2`} onClick={() => setMobileMenuOpen(false)}>Case Studies</Link>
              <Link href="/faq" className={`${themeStyles.navigation.link} px-4 py-2`} onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              <Link href="/contact" className={`${themeStyles.navigation.link} px-4 py-2`} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <button
                type="button"
                onClick={() => { window.dispatchEvent(new Event('open-command-palette')); setMobileMenuOpen(false); }}
                className="mx-4 mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors border border-neutral-200"
                aria-label="Search site"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span>Search</span>
              </button>
            </nav>
          </div>
        )}
      </div>
      {process.env.NODE_ENV !== 'production' && (
        <div className="fixed top-[84px] right-4 z-[60]">
          <button
            type="button"
            disabled={runningSeo}
            onClick={async () => {
              try {
                setRunningSeo(true);
                const currentPath = window.location.pathname || '/';
                const res = await fetch(`/api/dev/run-seo?path=${encodeURIComponent(currentPath)}`, { method: 'POST' });
                const json = await res.json();
                setSeoResponse(json);
                setSeoModalOpen(true);
              } catch (e) {
                console.error(e);
                alert('Failed to run SEO tests');
              } finally {
                setRunningSeo(false);
              }
            }}
            className={`px-3 py-2 rounded-full text-sm font-semibold shadow-lg border ${runningSeo ? 'bg-neutral-300 text-neutral-600' : 'bg-primary-600 text-white hover:bg-primary-700'} transition-colors`}
            title="Run SEO checks for this page"
          >
            {runningSeo ? 'Running SEO…' : 'Run SEO for this page'}
          </button>
        </div>
      )}

      {/* Dev-only SEO Results Modal */}
      {process.env.NODE_ENV !== 'production' && seoModalOpen && seoResponse && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSeoModalOpen(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" className="relative mt-24 w-[min(900px,92vw)] max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200/70">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">SEO check results</h3>
                <p className="text-xs text-neutral-500">Page: <code className="font-mono text-[11px] px-1.5 py-0.5 bg-neutral-100 rounded">{seoResponse.page}</code></p>
              </div>
              <button
                onClick={() => setSeoModalOpen(false)}
                className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4 overflow-y-auto max-h-[calc(80vh-56px)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Summary:</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">{seoResponse.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={runningSeo}
                    onClick={async () => {
                      try {
                        setRunningSeo(true);
                        const currentPath = window.location.pathname || '/';
                        const res = await fetch(`/api/dev/run-seo?path=${encodeURIComponent(currentPath)}`, { method: 'POST' });
                        const json = await res.json();
                        setSeoResponse(json);
                      } catch (e) {
                        console.error(e);
                        alert('Failed to run SEO tests');
                      } finally {
                        setRunningSeo(false);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium border ${runningSeo ? 'bg-neutral-200 text-neutral-600' : 'bg-primary-600 text-white hover:bg-primary-700'} transition-colors`}
                  >
                    {runningSeo ? 'Running…' : 'Run again'}
                  </button>
                </div>
              </div>

              <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 overflow-hidden">
                {seoResponse.results.map((r) => (
                  <li key={r.name} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-900 capitalize">{r.name}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${r.code === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {r.code === 0 ? 'PASS' : 'ISSUES'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await copyText(r.log);
                            if (ok) {
                              setCopyState((s) => ({ ...s, [r.name]: { ...(s[r.name] || {}), all: true } }));
                              setTimeout(() => setCopyState((s) => ({ ...s, [r.name]: { ...(s[r.name] || {}), all: false } })), 1200);
                            }
                          }}
                          className="text-[11px] px-2 py-1 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                          title="Copy full logs"
                        >
                          {copyState[r.name]?.all ? 'Copied!' : 'Copy logs'}
                        </button>
                        {r.name === 'headings' && (
                          <button
                            type="button"
                            onClick={async () => {
                              const block = extractHeadingStructure(r.log) || r.log;
                              const ok = await copyText(block);
                              if (ok) {
                                setCopyState((s) => ({ ...s, [r.name]: { ...(s[r.name] || {}), structure: true } }));
                                setTimeout(() => setCopyState((s) => ({ ...s, [r.name]: { ...(s[r.name] || {}), structure: false } })), 1200);
                              }
                            }}
                            className="text-[11px] px-2 py-1 rounded border border-primary-300 text-primary-700 hover:bg-primary-50"
                            title="Copy only heading structure"
                          >
                            {copyState[r.name]?.structure ? 'Copied!' : 'Copy heading structure'}
                          </button>
                        )}
                      </div>
                    </div>
                    <details className="mt-3 group">
                      <summary className="text-xs text-neutral-600 cursor-pointer select-none inline-flex items-center gap-1">
                        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                        Show logs
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed bg-neutral-50 border border-neutral-200 rounded-md p-3 max-h-64 overflow-auto text-neutral-800">
{r.log}
                      </pre>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
