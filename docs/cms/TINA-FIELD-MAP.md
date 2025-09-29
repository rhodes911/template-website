# Tina Field Map and SEO Controls

This guide explains what each editable field in TinaCMS does and how it maps to the site’s UI/SEO. Share this with clients.

Last updated: 2025-09-05

## Global settings (content/settings)

- Business Info (business.json)
  - brand: Used as the site name across metadata/OG.
  - site_url: Canonical site URL used to build absolute canonicals/OG images.
  - socialProfiles.*: Populates Organization JSON-LD sameAs.
  - schemaDefaults.*: Logo, email, address used by Organization/LocalBusiness JSON-LD.

- SEO Settings (seo.json)
  - keywordPolicy.*: Editing guidance for content; not auto-inserted.
  - lengthTargets.*: Reference targets; not enforced programmatically.
  - jsonLd.* toggles:
    - organization: Controls Organization JSON-LD in layout.
    - website: Controls WebSite JSON-LD in layout.
    - localBusiness: Controls LocalBusiness JSON-LD on Home.
    - person: Controls Person JSON-LD on About.
    - Others (service/article/breadcrumb/faq/review): Reserved for future use.

## Static Page SEO (content/{services,blog,case-studies,contact,faq}.md)

- seo.metaTitle: <title> in the head and social previews.
- seo.metaDescription: Meta description for search snippets (CTR influence).
- seo.canonicalUrl: Preferred URL for canonical.
- seo.keywords: Internal alignment only.
- seo.openGraph.*: Controls social card title/description/image.

## Home (content/home.md)

- heroTitle: H1 on homepage hero.
- heroSubtitle: Supporting line under the H1 (visually prominent, not H2).
- heroDescription: Short intro paragraph under the hero.
- heroCtas.*: Primary/secondary CTA labels and links.
- coreBlocks.*: Cards that map to the interactive blocks on the homepage.
- howWeHelp.*: Section title, intro, and CTA for services.
- clientSignals.testimonialCaseStudies: Picks case-study snippets for the homepage rotator.
- pageCta.*: Bottom-of-page call to action.
- toggles.enableCommandPalette / enableScrollProgress: Enables UX flourishes on the homepage.
- seo.*: Page-level SEO (see Static Page SEO).

## About (content/about.md)

- heroTitle: H1 on the About page.
- heroSubtitle: Supporting strapline under the H1.
- heroDescription: Short paragraph near the top.
- profileImage: Used in the About hero and Person JSON-LD (when enabled).
- rating / totalClients: Stats displayed on the page.
- story* fields: Content for approach/differentiators/mission sections.
- seo.*: Page-level SEO (see Static Page SEO), plus Person JSON-LD toggle in settings.

## Services (content/services/*.md)

- title: H1 on service page.
- subtitle: Supporting strapline under the H1.
- description: Used as meta description fallback and UI body intro.
- icon: Lucide icon name used in UI.
- pricingPlans / features / faq / body: Page content sections.
- seo.*: Per-service metadata. OG image supports absolute or relative path; normalized to absolute.

## Blog (content/blog/*.md)

- title, excerpt, featuredImage, alt, author, publishDate: Page content.
- seo.*: Per-post metadata; OG image normalized to absolute.

## Case Studies (content/case-studies/*.md)

- title, client, challenge, solution, results, testimonial.*: Page content and homepage snippets.
- image: Used in OG/Twitter; normalized to absolute.
- seo (optional future): Not required; metadata derived from content. Canonical and OG are set by code.

## Notes on SEO behavior

- Canonicals are always absolute using site_url.
- All OG/Twitter images are normalized to absolute.
- JSON-LD injection is controlled by SEO Settings → JSON-LD toggles.

## FAQ: Which fields map to H1/H2?

- H1 typically maps to heroTitle (Home, About, Services). Category pages and blog posts derive H1 from title.
- heroSubtitle is visually prominent but not H2 by default (semantic headings inside sections provide H2/H3).

If you change this convention later, update the field map here for clients.
