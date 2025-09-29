"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export type TestimonialItem = {
  quote: string;
  name: string;
  role?: string;
  metrics?: string[];
  slug?: string;
};

export default function TestimonialRotator({ items }: { items: TestimonialItem[] }) {
  const testimonials = items && items.length ? items : [];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (!testimonials.length) {
    return null;
  }

  return (
    <div className="relative" data-animate>
      {testimonials.map((t, i) => (
        <figure
          key={i}
          className={`transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
          aria-hidden={i !== index}
        >
          <blockquote className="text-xl md:text-2xl font-medium text-neutral-800 leading-relaxed">“{t.quote}”</blockquote>
          <figcaption className="mt-6 flex items-start gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-semibold shadow">
                {t.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{t.name}</p>
                {t.role ? <p className="text-sm text-neutral-500">{t.role}</p> : null}
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {(t.metrics || []).map((m) => (
                <li
                  key={m}
                  className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100"
                >
                  {m}
                </li>
              ))}
            </ul>
            {t.slug ? (
              <Link
                href={`/case-studies/${t.slug}`}
                aria-label={`View case study: ${t.name}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors shrink-0 ml-auto"
              >
                <span>View case study</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : null}
          </figcaption>
        </figure>
      ))}
      <div className="flex gap-2 mt-10" aria-label="Testimonial navigation">
  {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show testimonial ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${i === index ? 'bg-primary-600 scale-110' : 'bg-neutral-300 hover:bg-neutral-400'}`}
          />
        ))}
      </div>
    </div>
  );
}
