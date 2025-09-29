# DEPRECATED: Use New Split SEO Documents

This legacy combined instructions file has been replaced by three focused, plug‑and‑play documents:

- `ON-SITE-SEO-PLAN.md` – Content, metadata, internal linking, structured data & conversion UX.
- `OFF-SITE-SEO-PLAN.md` – Authority, digital PR, link earning, reviews, social distribution.
- `TECHNICAL-SEO-PLAN.md` – Performance, crawling, Core Web Vitals, architecture, CI, scalability.

Update workflows / references to point to those files. This file retained only as a pointer and will be removed in a future cleanup.

Minimal helper reference (current canonical system):
```ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ellieedwardsmarketing.com';
export const canonical = (p='/' ) => new URL(p, SITE_URL).toString();
export const IS_PROD = process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';
```

If you intended to run an audit, open the appropriate plan and follow its Quick Start section.

---
Historical content removed.

## QUICK START (PLUG & PLAY)
1. Copy the BUSINESS CONTEXT object (Section 0) and adjust for new brand / niche / geo.
2. Set environment vars:
  - `NEXT_PUBLIC_SITE_URL` = canonical production URL (no trailing slash)
  - `NEXT_PUBLIC_ENV` = `production` | `staging` | `development`
3. (Optional) Update `/content/services/*.md` front‑matter for keywords & descriptions (auto feeds metadata helper once unified).
4. Run audit: Paste Sections 0–3 + 6 into AI with "AUDIT NOW" prompt.
5. Apply generated patches; re-run to confirm 0 outstanding High severity issues.

### Reusable Variable Placeholders
Use these tokens in titles/descriptions to accelerate niche adaptation:
`{{PRIMARY_SERVICE}}`, `{{LOCATION_PRIMARY}}`, `{{INDUSTRY}}`, `{{BRAND}}`, `{{UNIQUE_VALUE}}`, `{{CTA}}`

### Required Structural Elements Per Page
- 1x `<h1>` top of main content.
- Brand + keyword in title; value prop + geo or benefit in description.
- Internal links: at least 2 contextual + 1 upward (e.g., to /services or /blog).
- JSON-LD type correct & matches visible copy.
- Mobile first: first 1000ms critical path minimal (avoid shipping unnecessary client bundles; prefer RSC).

# Next.js SEO AUDIT – BUSINESS-AWARE (PASTE INTO COPILOT CHAT)

> Purpose: Audit this **digital marketing website** (Next.js) using the **business context** below.  
> Output **exact issues and ready-to-paste code fixes**, page-by-page. No SEO theory.

---


```json
Robots: index,follow in prod; noindex,nofollow in non-prod.
- **Headings & content**
3) WHAT TO CHECK (PER PAGE)
// app/(segment)/page.tsx
import type { MetadataRoute } from 'next';

# Next.js SEO AUDIT – BUSINESS-AWARE (PASTE INTO COPILOT CHAT)

> Purpose: Audit this **digital marketing website** (Next.js) using the **business context** below.  
> Output **exact issues and ready-to-paste code fixes**, page-by-page. No SEO theory.

---

## 0) BUSINESS CONTEXT (UPDATED FOR LIVE SITE)

```json
{
  "brand": "Ellie Edwards Marketing",
  "site_url": "https://www.ellieedwardsmarketing.com",
  "primary_ctas": [
    "Book Strategy Call",
    "Schedule Your Call",
    "Get Your Free Consultation"
  ],
  "audience": [
    "Small & medium business owners",
    "Local service-based entrepreneurs",
    "Marketing leads in Surrey / Hampshire",
    "Coaches & consultants scaling authority"
  ],
  "services": [
    "SEO",
    "PPC",
    "Content Marketing",
    "Email Marketing",
    "Lead Generation",
    "Brand Strategy",
    "Social Media",
    "Website Design",
    "Digital Campaigns"
  ],
  "locations": [
    "Camberley",
    "Surrey",
    "Hampshire",
    "Basingstoke",
    "Reading",
    "UK-wide"
  ],
  "value_props": [
    "Strategic marketing that delivers real results",
    "Integrated SEO, PPC, content & automation",
    "Local expertise – Surrey & surrounding regions",
    "No long-term contracts – performance focused",
    "Data-driven improvement & transparent reporting"
  ],
  "target_keywords": {
    "primary": [
      "digital marketing Camberley",
      "marketing consultant Surrey",
      "SEO services Surrey",
      "lead generation services",
      "content marketing agency",
      "ppc management Surrey"
    ],
    "secondary": [
      "email marketing consultant",
      "brand strategy consultant",
      "social media marketing Surrey",
      "website design marketing",
      "local business marketing services",
      "surrey marketing consultant"
    ]
  },
  "competitors": [],
  "social_profiles": {
    "linkedin": "https://www.linkedin.com/in/ellie-edwards-marketing/"
  },
  "schema_defaults": {
    "organization_name": "Ellie Edwards Marketing",
    "logo_url": "https://www.ellieedwardsmarketing.com/images/ellie-edwards-logo.png",
    "contact_phone": "+44 7711152873",
    "contact_email": "ellieedwardsmarketing@gmail.com",
    "address": {
      "streetAddress": "Mytchett",
      "addressLocality": "Camberley",
      "postalCode": "GU16 6BA",
      "addressCountry": "GB"
    }
  }
}
```

---

## 1) AUDIT RULES (NEXT.JS AWARE)

### Router detection
- App Router if `/app/` and `export const metadata` present.
- Pages Router if `/pages/`, `_app.tsx`, `_document.tsx`.

### Metadata (per page)
- Title: 50–60 chars; include a primary keyword + brand at end.
- Description: 120–160 chars; include value prop(s) from business context.
- Canonical: Exactly one canonical to the preferred URL (use site_url).
- OpenGraph & Twitter: title, description, url, type, siteName, image (1200×630).
- Robots: `index,follow` in prod; `noindex,nofollow` in non-prod.

#### What is Metadata?
Metadata is data about data. In SEO, it refers to specific elements (like title tags and meta descriptions) that inform search engines and users about a page’s content. Optimized metadata improves rankings and click-through rates.

#### Title Tag Best Practices
- The title tag is the most important on-page SEO element. It appears in search results and browser tabs.
- Each page must have a unique, concise, and relevant title tag (ideally 51–60 characters, max 60).
- Place the most important keyword(s) at the front, followed by the brand name (e.g., “Winemaking Certificate Program | UC Davis Extension”).
- Avoid keyword stuffing, boilerplate titles, and excessive special characters.
- Title tag should accurately describe the page’s content and purpose, matching the H1 and main topic.
- Google may rewrite title tags if they are too long, too short, repetitive, or not user-focused.

#### Meta Description Best Practices
- Meta descriptions summarize page content for users in search results.
- Each page should have a unique meta description (120–160 characters).
- Include value propositions and relevant keywords naturally.
- Write for users first—make it compelling and relevant to the page’s topic.

### Headings & content
Exactly one `<h1>` per page, placed at the top of the main content. H1 should reinforce the primary keyword/topic and match the title tag for optimal SEO.
Structure headings in strict H1→H2→H3 order to establish clear topical hierarchy and authority. H2 tags break content into major sections; H3 tags support H2s with subtopics.
Avoid using heading tags (H1–H6) in sitewide elements like navigation, menus, or footers. Headings should only be used for main content, not layout or UI components.
Use relevant keywords in headings, but avoid keyword stuffing. Headings should be descriptive, user-focused, and support the page’s main topic.
Bullet points, lists, and scannable formatting under headings help users and search engines quickly understand context and value.
First fold (above-the-fold) must clearly state who the page is for and the value proposition, using business context.
Internal links: 2–3 links to relevant service, case study, or blog pages. Anchor text must be descriptive and relevant to the linked page’s topic/keywords.

### Images & media
Anchor text for internal and external links should be descriptive and relevant to the linked page’s topic/keywords.
Match the reading level of your content to your audience for better engagement and SEO.

#### User-Generated Content (UGC)
UGC (e.g., comments, reviews, forum posts) can add unique perspectives, increase trust, and help scale content production.
UGC should be moderated to prevent spam, irrelevant links, and low-quality submissions. Use tools and/or AI to assist moderation.
Highlight expert opinions, verified reviews, and diverse viewpoints to improve E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
Consider UGC formats beyond text, such as images or video, to add value and authenticity (e.g., user photos in product reviews).
Ensure UGC is relevant, high-quality, and adds value to the main content. Avoid publishing UGC that is thin, repetitive, or off-topic.

#### AI-Generated Content
AI can assist with brainstorming, outlining, and competitor analysis, but avoid publishing content that is 100% AI-generated without human oversight.
Google’s Helpful Content Update (March 2024) penalizes sites with large amounts of unoriginal, AI-generated content. Human review and unique perspectives are required.
Use AI to improve efficiency, but always add your own voice, expertise, and original ideas. Do not rely solely on AI for content creation.
If using AI-generated content, ensure it is reviewed, edited, and enhanced by humans to meet quality, relevance, and originality standards.
Avoid echo-chamber effects: do not rehash the same topics/structure as other sites. Add new information, expert opinions, and unique value.
- Article/BlogPosting for blogs.
- LocalBusiness if location pages exist.

### Robots & sitemap
- App Router: `app/robots.ts` and `app/sitemap.ts`.
- Pages Router: `public/robots.txt` and next-sitemap if used.
- Sitemap lists all important routes; submitted to GSC.

### Performance (static heuristics)
- Fonts via `next/font` with `display: 'swap'`.
- Minimise client JS; prefer Server Components for static sections.
- Lazy-load below-the-fold media.

### Content Quality & Optimization
- Every page must have high-quality, relevant content focused on its topic or theme.
- Content should naturally include the page’s focus keyword and related keywords, but avoid keyword stuffing; use synonyms and topical associations.
- Content must be unique—do not copy from other sites or duplicate within your own site. If quoting, add your own perspective and link to the source.
- Organize content within logical sub-directories and sections to help users and search engines locate relevant topics (e.g., group by service, location, or category).
- Avoid thin or boilerplate content (e.g., changing only a location name across pages is not enough for uniqueness).
- Add value beyond similar pages by including new information, unique perspectives, images, video, downloadable resources, or outbound links to authoritative sources.
- Break up large blocks of text with headings, images, lists, and other resources for scannability and user-friendliness.
- Use outbound links to useful, non-spammy resources when quoting or referencing external material.
- Anchor text for internal and external links should be descriptive and relevant to the linked page’s topic/keywords.
- Match the reading level of your content to your audience for better engagement and SEO.

### Google SEO Fundamentals
- Unique title and description for every page; avoid duplicates across the site.
- Canonical URLs set for every page; only one canonical per page, always points to the preferred version.
- Avoid duplicate content: if unavoidable, use canonicalization and/or `noindex` on non-primary versions.
- No multiple pages with the same main content, headings, or metadata.
- Clear search intent match: page content and metadata should align with user intent and target keywords.
- Use structured data (JSON-LD) that matches visible content and page type.
- Internal linking strategy: link up (parent/category), across (siblings), and down (children/details); use descriptive anchor text.
- Only include languages/URLs that actually exist for internationalization; set correct hreflang and canonical.
- Avoid redirect chains; use direct redirects and proper status codes (404 for missing, 410 for permanently gone).
- Ensure robots/sitemap files do not block important pages and are correct for the environment.

---

## 2) FIX TEMPLATES (USE THESE WHEN SUGGESTING PATCHES)

Replace placeholders like `/current-path`, titles, images, etc. Use `site_url` from business context.

### App Router – Metadata
```ts
// app/(segment)/page.tsx
import type { Metadata } from 'next';
import { canonical, IS_PROD } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing',
  description: 'Done-for-you lead gen websites for SMEs. Launch fast with AI-enhanced funnels and measurable ROI.',
  alternates: { canonical: canonical('/current-path') },
  openGraph: {
    title: 'Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing',
    description: 'Done-for-you lead gen websites for SMEs with AI-enhanced funnels.',
    url: canonical('/current-path'),
    type: 'website',
    siteName: 'Ellie Edwards Marketing'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing',
    description: 'AI-enhanced funnels for SME lead gen.'
  },
  robots: IS_PROD ? 'index,follow' : 'noindex,nofollow'
};
```

### App Router – robots.ts
```ts
// app/robots.ts
import type { MetadataRoute } from 'next';
import { SITE_URL, IS_PROD } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: IS_PROD ? '/' : '', disallow: IS_PROD ? '' : '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, '')
  };
}
```

### App Router – sitemap.ts
```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { canonical } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // TODO: Map dynamic routes (services, blog, case studies)
  return [{ url: canonical('/'), lastModified: new Date() }];
}
```

### Pages Router – Head
```html
<!-- pages/_document.tsx (or specific page head) -->
<head>
  <title>Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing</title>
  <meta name="description" content="Done-for-you lead gen websites for SMEs. AI-enhanced funnels and measurable ROI." />
  <link rel="canonical" href="https://www.ellieedwardsmarketing.com/current-path" />
  <meta property="og:title" content="Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing" />
  <meta property="og:description" content="Done-for-you lead gen websites for SMEs. AI-enhanced funnels and measurable ROI." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.ellieedwardsmarketing.com/current-path" />
  <meta property="og:site_name" content="Ellie Edwards Marketing" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing" />
  <meta name="twitter:description" content="AI-enhanced funnels and measurable ROI." />
</head>
```

### JSON-LD – Organization (sitewide/home)
```html
<script type="application/ld+json" suppressHydrationWarning>
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ellie Edwards Marketing",
  "url": "https://www.ellieedwardsmarketing.com",
  "logo": "https://www.ellieedwardsmarketing.com/images/ellie-edwards-logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/example",
    "https://x.com/example"
  ],
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+44 0000 000000",
    "contactType": "customer service",
    "areaServed": "GB"
  }]
}
</script>
```

### JSON-LD – WebSite (home)
```html
<script type="application/ld+json" suppressHydrationWarning>
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ellie Edwards Marketing",
  "url": "https://www.ellieedwardsmarketing.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

### JSON-LD – Service (service pages)
```html
<script type="application/ld+json" suppressHydrationWarning>
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Lead Generation Websites",
  "provider": { "@type": "Organization", "name": "Ellie Edwards Marketing", "url": "https://www.ellieedwardsmarketing.com" },
  "areaServed": ["GB", "Hampshire", "Surrey", "Berkshire"],
  "description": "Done-for-you lead generation websites with AI-enhanced funnels and measurable ROI.",
  "url": "https://www.ellieedwardsmarketing.com/services/lead-generation"
}
</script>
```

### JSON-LD – Article (blog pages)
```html
<script type="application/ld+json" suppressHydrationWarning>
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Build a Lead Gen Website That Converts",
  "description": "A practical guide for SMEs to build a fast, conversion-focused lead gen site.",
  "datePublished": "2025-01-01",
  "author": { "@type": "Person", "name": "Ellie Edwards" },
  "mainEntityOfPage": "https://www.ellieedwardsmarketing.com/blog/lead-gen-website-guide",
  "image": ["https://www.ellieedwardsmarketing.com/images/ellie-edwards-logo.png"]
}
</script>
```

---

## 3) WHAT TO CHECK (PER PAGE)

- Title (50–60), Description (120–160), Canonical set
- OpenGraph & Twitter complete (+ image if available)
- One H1; H2/H3 hierarchy valid
- 2–3 internal links to services/case studies/blogs (use business services list)
- Images use next/image, meaningful alt, width/height
- JSON-LD appropriate and valid (Organization/Home/Service/Article)
- Robots/sitemap correct for environment
- Performance heuristics (fonts, client JS, lazy-load, LCP)
- CTAs visible and consistent with primary_ctas

---

## 4) OUTPUT FORMAT (MANDATORY)

### 1) Summary

- Total pages checked
- Counts: missing title/description/canonical/OG/Twitter/JSON-LD
- Counts: multiple H1 / no H1 / bad heading order / missing image alts
- Robots/sitemap issues
- Top performance risks

### 2) Issue Table

| File/Route | Issue | Why it’s a problem | Exact Fix (code block) | Severity (High/Med/Low) |

### 3) Top 10 Fixes (Impact-Ordered)

app/services/lead-generation-websites/page.tsx: Add metadata + Service JSON-LD — high impact (core service)

…

### 4) Ready-to-Paste Patches

Provide minimal, correct snippets per file (App vs Pages Router aware).

---

## 5) HELPER (EXPECT THIS FILE IF PRESENT)

```ts
// lib/seo.ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ellieedwardsmarketing.com';
export const canonical = (path = '/') => new URL(path, SITE_URL).toString();
export const IS_PROD =
  process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';
```

---

## 6) EXECUTION INSTRUCTIONS (FOR THE AI)

- Read BUSINESS CONTEXT and apply it to all decisions (titles, descriptions, JSON-LD fields, internal links, CTAs).
- Detect router type; use the correct fix templates.
- For each page, propose a minimal code fix that fully resolves the issue.
- Prefer brand-aligned phrasing using value_props and target_keywords.
- Do not remove existing metadata; merge safely.
- Keep all code blocks ready to paste.
  <link rel="canonical" href="https://example.com/current-path" />
  <meta property="og:title" content="Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing" />
  <meta property="og:description" content="Done-for-you lead gen websites for SMEs. AI-enhanced funnels and measurable ROI." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://example.com/current-path" />
  <meta property="og:site_name" content="Ellie Edwards Marketing" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing" />
  <meta name="twitter:description" content="AI-enhanced funnels and measurable ROI." />
</head>
```

### JSON-LD – Organization (sitewide/home)
```html
<script type="application/ld+json" suppressHydrationWarning>
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ellie Edwards Marketing",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/example",
    "https://x.com/example"
  ],
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+44 0000 000000",
    "contactType": "customer service",
    "areaServed": "GB"
  }]
}
</script>
```

### JSON-LD – WebSite (home)
```html
<script type="application/ld+json" suppressHydrationWarning>
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ellie Edwards Marketing",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```
Images use next/image, meaningful alt, width/height

JSON-LD appropriate and valid (Organization/Home/Service/Article)

Robots/sitemap correct for environment

Performance heuristics (fonts, client JS, lazy-load, LCP)

CTAs visible and consistent with primary_ctas

4) OUTPUT FORMAT (MANDATORY)
1) Summary

Total pages checked

Counts: missing title/description/canonical/OG/Twitter/JSON-LD

Counts: multiple H1 / no H1 / bad heading order / missing image alts

Robots/sitemap issues

Top performance risks

2) Issue Table
| File/Route | Issue | Why it’s a problem | Exact Fix (code block) | Severity (High/Med/Low) |

3) Top 10 Fixes (Impact-Ordered)

app/services/lead-generation-websites/page.tsx: Add metadata + Service JSON-LD — high impact (core service)

…

4) Ready-to-Paste Patches

Provide minimal, correct snippets per file (App vs Pages Router aware).

5) HELPER (EXPECT THIS FILE IF PRESENT)
ts
Copy
Edit
// lib/seo.ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
export const canonical = (path = '/') => new URL(path, SITE_URL).toString();
export const IS_PROD =
  process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';
6) EXECUTION INSTRUCTIONS (FOR THE AI)
Read BUSINESS CONTEXT and apply it to all decisions (titles, descriptions, JSON-LD fields, internal links, CTAs).

Detect router type; use the correct fix templates.

For each page, propose a minimal code fix that fully resolves the issue.

Prefer brand-aligned phrasing using value_props and target_keywords.

Do not remove existing metadata; merge safely.

Keep all code blocks ready to paste.
