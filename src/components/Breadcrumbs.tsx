"use client";
import React from 'react';
import Link from 'next/link';
// NOTE: Avoid importing server-only seo helpers here (they pull in fs via settings.ts)
// to keep this component fully client-compatible.

function resolveSiteUrl(): string {
  const env = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '').trim();
  if (env) return env.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit for current page
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: string;
  hideOnHome?: boolean;
}

// Reusable breadcrumb component with JSON-LD injection
export function Breadcrumbs({ items, className = '', separator = '/', hideOnHome = true }: BreadcrumbsProps) {
  if (!items || items.length < 2) return null;
  if (hideOnHome && items.length === 1 && items[0].href === '/') return null;

  interface ListItemSchema {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }

  const siteUrl = resolveSiteUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map<ListItemSchema>((item, index) => {
      const absolute = item.href ? (item.href.startsWith('http') ? item.href : (siteUrl ? siteUrl + (item.href.startsWith('/') ? item.href : '/' + item.href) : undefined)) : undefined;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(absolute ? { item: absolute } : {}),
      };
    }),
  };

  return (
    <nav aria-label="Breadcrumb" className={`w-full ${className}`}> 
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ol className="flex items-center gap-2 text-sm text-neutral-600">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <li>
              {item.href && i !== items.length - 1 ? (
                <Link href={item.href} className="hover:text-primary-600 transition-colors">{item.label}</Link>
              ) : (
                <span className="text-neutral-900 font-medium" aria-current="page">{item.label}</span>
              )}
            </li>
            {i < items.length - 1 && <li className="select-none" aria-hidden="true">{separator}</li>}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
