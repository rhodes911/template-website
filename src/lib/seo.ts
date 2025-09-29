// Central SEO helper (canonical URLs, environment flags, JSON-LD builders)
// Now reads from content/settings where possible, with env fallbacks.
import { getBusinessSettings } from './settings'

// Derive the canonical site URL and FORCE the www. version to prevent mixed indexing
// even if an environment variable is accidentally set to non‑www.
function deriveSiteUrl() {
  const biz = getBusinessSettings()
  const fallback = 'https://www.ellieedwardsmarketing.com';
  let raw = (biz.site_url || process.env.NEXT_PUBLIC_SITE_URL || fallback).trim();
  // Remove any trailing slashes
  raw = raw.replace(/\/+$/, '');
  try {
    const u = new URL(raw);
    // If hostname lacks a www. prefix and is a bare domain (no additional subdomain segments), add it.
    // e.g. ellieedwardsmarketing.com -> www.ellieedwardsmarketing.com
    if (!/^www\./i.test(u.hostname) && u.hostname.split('.').length <= 3) {
      u.hostname = 'www.' + u.hostname.replace(/^www\./i, '');
    }
    return u.origin; // origin ensures protocol + host only
  } catch {
    return fallback;
  }
}

export const SITE_URL = deriveSiteUrl();
export const IS_PROD = process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';

// Build an absolute canonical URL.
// Accepts:
//  - Root/relative path: "/contact" -> https://www.example.com/contact
//  - Relative without leading slash: "contact" -> https://www.example.com/contact
//  - Already absolute URL (http/https): returned unchanged.
export const canonical = (path: string = '/'): string => {
  if (!path) path = '/';
  // If already absolute (begins with http/https) return as‑is.
  if (/^https?:\/\//i.test(path)) return path;
  // Ensure leading slash for relative segments (avoid double slashes later)
  if (!path.startsWith('/')) path = `/${path}`;
  return new URL(path, SITE_URL).toString();
};

export function organizationJsonLd() {
  const biz = getBusinessSettings()
  const orgName = biz.schemaDefaults?.organization_name || biz.brand || 'Ellie Edwards Marketing'
  const logo = biz.schemaDefaults?.logo_url || `${SITE_URL}/android-chrome-512x512.png`
  const sameAs: string[] = []
  if (biz.socialProfiles) {
    Object.values(biz.socialProfiles).forEach(url => {
      if (url) sameAs.push(url)
    })
  }
  if (!sameAs.length) sameAs.push('https://www.linkedin.com/in/ellie-edwards-marketing/')
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: orgName,
    url: SITE_URL,
    // Prefer square transparent (or solid) 512px logo for Google favicon/logo surfaces
    logo,
    sameAs
  };
}

export function websiteJsonLd() {
  const biz = getBusinessSettings()
  const siteName = biz.brand || biz.schemaDefaults?.organization_name || 'Ellie Edwards Marketing'
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: SITE_URL
  };
}

export function localBusinessJsonLd() {
  const biz = getBusinessSettings()
  const name = biz.brand || biz.schemaDefaults?.organization_name || 'Ellie Edwards Marketing'
  const email = biz.schemaDefaults?.contact_email || 'ellieedwardsmarketing@gmail.com'
  const logo = biz.schemaDefaults?.logo_url || `${SITE_URL}/android-chrome-512x512.png`
  const address = biz.schemaDefaults?.address || { streetAddress: 'Mytchett', addressLocality: 'Camberley', addressRegion: 'Surrey', postalCode: 'GU16 6BA', addressCountry: 'GB' }
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description: 'Expert digital marketing services for entrepreneurs and small businesses',
    url: SITE_URL,
    logo,
    email,
    address: { '@type': 'PostalAddress', ...address },
    areaServed: ['Camberley','Surrey','Hampshire','Basingstoke','Reading','Thames Valley','Mytchett','Farnborough','Aldershot'],
    priceRange: '$$',
    serviceType: 'Digital Marketing Services'
  };
}

// Build a Person JSON-LD object for the About page. Minimal, accurate facts only.
export function personJsonLd(opts?: {
  name?: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  sameAs?: string[];
  worksForName?: string;
}) {
  const name = opts?.name || 'Ellie Edwards';
  const url = opts?.url || `${SITE_URL}/about`;
  const image = opts?.image || `${SITE_URL}/android-chrome-512x512.png`;
  const jobTitle = opts?.jobTitle || 'Marketing Consultant';
  const worksForName = opts?.worksForName || 'Ellie Edwards Marketing';
  const sameAs = opts?.sameAs || ['https://www.linkedin.com/in/ellie-edwards-marketing/'];
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    image,
    jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: worksForName,
      url: SITE_URL,
    },
    sameAs,
  };
}
