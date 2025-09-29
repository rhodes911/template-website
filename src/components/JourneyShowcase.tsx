"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { themeStyles } from '@/lib/theme';

export type JourneyItem = {
  title: string;
  subtitle?: string;
  period?: string;
  body: string;
  linkLabel?: string;
  linkHref?: string;
  image?: string;
};

type Props = {
  title?: string;
  description?: string;
  items: JourneyItem[];
};

// simple reveal
const useReveal = () => {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-journey-reveal]')) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('show');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function JourneyShowcase({ title = 'My Marketing Journey', description, items }: Props) {
  useReveal();

  if (!items || items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
    itemListElement: items.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.title,
      description: s.body,
      image: s.image,
    })),
  };

  return (
    <section className={`${themeStyles.backgrounds.section} py-16`}>
      <div className={themeStyles.layout.container}>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className={themeStyles.text.h2}>{title}</h2>
          {description && <p className={themeStyles.text.body}>{description}</p>}
        </div>

        {/* Vertical timeline: left spine + stacked cards */}
        <ol className="relative max-w-4xl mx-auto">
          {/* Spine */}
          <div aria-hidden className="absolute left-4 top-0 bottom-0 w-px bg-neutral-200" />

          {items.map((s, idx) => (
            <li key={idx} className="relative pl-12 mb-8 last:mb-0" data-journey-reveal>
              {/* Marker */}
              <span className="absolute left-3 top-5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-white border border-neutral-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
              </span>

              {/* Card */}
              <JourneyCard index={idx} item={s} />
            </li>
          ))}
        </ol>
      </div>

      <style jsx global>{`
        [data-journey-reveal]{opacity:0; transform:translateY(8px); transition:opacity .45s ease, transform .45s ease}
        [data-journey-reveal].show{opacity:1; transform:translateY(0)}
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

function JourneyCard({ index, item }: { index: number; item: JourneyItem }) {
  const [errored, setErrored] = useState(false);
  const hasImage = Boolean(item.image) && !errored;
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary-700 font-semibold mb-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm" title="Step">{index + 1}</span>
        <span>{item.period || 'Milestone'}</span>
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-1">{item.title}</h3>
      {item.subtitle && <p className="text-neutral-500 mb-3">{item.subtitle}</p>}

      {hasImage && (
        <div className="relative aspect-[16/9] w-full mb-4 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          <Image src={item.image as string} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" onError={() => setErrored(true)} />
        </div>
      )}

      {!hasImage && (item.subtitle || item.title) && (
        <div className="mb-4 rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 p-5">
          <blockquote className="text-neutral-700 italic">“{item.subtitle || item.title}”</blockquote>
        </div>
      )}

      <p className="text-neutral-700 leading-relaxed">{item.body}</p>
      {(item.linkHref && item.linkLabel) && (
        <div className="mt-4">
          <Link href={item.linkHref} className={themeStyles.buttons.ghost}>{item.linkLabel}</Link>
        </div>
      )}
    </div>
  );
}
