# SEO System Overview (Tina-driven)

Last updated: 2025-09-05

This single document describes the site’s current SEO setup, how configuration flows from Tina, what’s standardized, and what’s left to do. It replaces all prior SEO docs.

## Current architecture

- Framework: Next.js App Router (TypeScript)
- CMS: TinaCMS using Markdown/JSON content under `content/`
- Global settings: `content/settings/business.json` and `content/settings/seo.json` loaded via `src/lib/settings.ts`
- Helpers: `src/lib/seo.ts` (SITE_URL, canonical, JSON-LD), `src/lib/pageSeo.ts` (per-page SEO), `src/lib/metadata.ts` (service metadata)
- Pages: All primary routes use Tina-controlled frontmatter for SEO where applicable.

## Sources of truth

- Global/site-wide
  - Business profile: brand name, logo, contact info, socials, address (`content/settings/business.json`)
  - SEO defaults: site URL, default images, robots preference (`content/settings/seo.json`)
- Page-level (index/static sections)
  - `content/services.md`, `content/blog.md`, `content/case-studies.md`, `content/contact.md`, `content/faq.md` provide `seo` frontmatter consumed by their respective pages via `getPageSeo` and `buildMetadataFromSeo`.
- Home and About
  - `content/home.md` and `content/about.md` contain `seo` blocks used in their `generateMetadata` functions (with normalization to absolute OG/canonical).
- Entity-level (dynamic)
  - Services in `content/services/*.md` can define `seo` which is read by `generateServiceMetadata` in `src/lib/metadata.ts`.
  - Blog posts in `content/blog/*.md` provide per-post seo and social share data; OG image normalization enforced.
  - Case studies in `content/case-studies/*.md` provide per-item metadata; OG image absolute normalization is pending (see TODO).

## What’s standardized and consistent now

- SITE_URL is loaded from Tina settings first, env fallback second. Used to build absolute canonicals and OG images.
- Root layout metadata reads from settings; Organization/Website JSON-LD generated from business settings.
- Absolute URLs enforced for canonical and OG on:
  - Layout/global
  - Home, About
  - Blog post detail (`src/app/blog/[slug]/page.tsx`)
  - Static index pages (services, blog, case-studies, contact, faq) via `buildMetadataFromSeo`
  - Services dynamic detail via `generateServiceMetadata`
- Robots:
  - Production allows crawl except admin/api/_next/.well-known/private
  - Experimental route removed; redirect in place to `/`
- Tina schema:
  - Includes a collection to edit static page SEO for the above index pages.

## JSON-LD currently emitted

- Organization + Website (global) from settings
- LocalBusiness (on Home) using business settings
- Person/Author (on About)

These are built in `src/lib/seo.ts` and injected where appropriate (Home/About and layout).

## Guardrails

- Canonical builder central: `canonical(pathOrUrl)` ensures absolute URLs
- Meta images normalized to absolute where code touches OG
- Tests (tsx-based scripts) verify:
  - Settings and JSON-LD sanity (`scripts/test-seo-settings.ts`)
  - Static page SEO generation and canonical/OG presence (`scripts/test-page-seo.ts`)
  - Service metadata correctness (`scripts/test-service-metadata.ts`)

## What was removed

- Legacy experimental route `/experimental-home` removed; 301 redirect to `/`; robots entry cleaned.
- Multiple overlapping SEO docs consolidated into this single source.

## Open items (TODO)

1) Case studies detail OG image normalization
   - Ensure `src/app/case-studies/[slug]/page.tsx` prefixes relative OG images with SITE_URL.
   - Add a tiny test to validate absolute OG on a sample case study.

2) Optional: Move experimental-home interactive client
   - Currently referenced from `src/app/experimental-home/InteractiveExperimentClient.tsx` by the Home page.
   - Consider relocating to `src/components/home/InteractiveExperimentClient.tsx` and updating imports for clarity.

3) Optional: Settings toggles for JSON-LD
   - Add booleans in `seo.json` or `business.json` to enable/disable Organization/Website/LocalBusiness/Person schemas.
   - Wire `src/lib/seo.ts` to respect toggles.

4) Optional: Frontmatter SEO for case study detail
   - Expand Tina schema (if needed) to allow richer `seo` on each case study and use it in metadata generation.

## How to edit SEO going forward

- Global branding/urls: Edit `content/settings/business.json` and `content/settings/seo.json` in Tina.
- Static page SEO (services/blog/case-studies/contact/faq): Open the “Static Page SEO” entries in Tina and edit their `seo` fields.
- Home/About: Edit frontmatter in `content/home.md` and `content/about.md`.
- Services/Blog/Case studies: Edit each item’s frontmatter `seo`.

## Success criteria checklist

- Single source of truth: Tina content/settings control all SEO; no hardcoded page metadata remains (except intentional noindex cases)
- URLs: All canonicals and OG image URLs are absolute
- Consistent JSON-LD reflecting business settings
- Tests pass for settings, static pages, and services

Status: All criteria met except the case studies OG normalization (see TODO #1).
