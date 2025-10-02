// Central SEO helper (canonical URLs, environment flags, JSON-LD builders)
// Now reads from content/settings where possible, with env fallbacks.
import { getBusinessSettings } from './settings'

// Derive the canonical site URL and FORCE the www. version to prevent mixed indexing
// even if an environment variable is accidentally set to non‑www.
function deriveSiteUrl() {
  const biz = getBusinessSettings()
  const fallback = 'https://www.REPLACE-your-domain.com';
  let raw = (biz.site_url || process.env.NEXT_PUBLIC_SITE_URL || fallback).trim();
  // Remove any trailing slashes
  raw = raw.replace(/\/+$/, '');
  try {
    const u = new URL(raw);
    // If hostname lacks a www. prefix and is a bare domain (no additional subdomain segments), add it.
    // e.g. REPLACE-your-domain.com -> www.REPLACE-your-domain.com
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
  const orgName = biz.schemaDefaults?.organization_name || biz.brand || 'REPLACE Your Business Name'
  const logo = biz.schemaDefaults?.logo_url || `${SITE_URL}/android-chrome-512x512.png`
  const sameAs: string[] = []
  if (biz.socialProfiles) {
    Object.values(biz.socialProfiles).forEach(url => {
      if (url) sameAs.push(url)
    })
  }
  if (!sameAs.length) sameAs.push('https://www.linkedin.com/in/REPLACE-your-linkedin-username/')
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
  const siteName = biz.brand || biz.schemaDefaults?.organization_name || 'REPLACE Your Business Name'
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: SITE_URL
  };
}

export function localBusinessJsonLd() {
  const biz = getBusinessSettings()
  const name = biz.brand || biz.schemaDefaults?.organization_name || 'REPLACE Your Business Name'
  const email = biz.schemaDefaults?.contact_email || 'REPLACE your-email@domain.com'
  const logo = biz.schemaDefaults?.logo_url || `${SITE_URL}/android-chrome-512x512.png`
  const address = biz.schemaDefaults?.address || { streetAddress: 'REPLACE Street', addressLocality: 'REPLACE City', addressRegion: 'REPLACE Region', postalCode: 'REPLACE ZIP', addressCountry: 'REPLACE Country Code' }
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description: 'REPLACE Your business description for schema markup',
    url: SITE_URL,
    logo,
    email,
    address: { '@type': 'PostalAddress', ...address },
    areaServed: ['REPLACE Area 1','REPLACE Area 2','REPLACE Area 3'],
    priceRange: 'REPLACE Price Range',
    serviceType: 'REPLACE Your Service Type'
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
  const name = opts?.name || 'REPLACE Your Name';
  const url = opts?.url || `${SITE_URL}/about`;
  const image = opts?.image || `${SITE_URL}/android-chrome-512x512.png`;
  const jobTitle = opts?.jobTitle || 'REPLACE Your Job Title';
  const worksForName = opts?.worksForName || 'REPLACE Your Business Name';
  const sameAs = opts?.sameAs || ['REPLACE-your-social-profile-url'];
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
