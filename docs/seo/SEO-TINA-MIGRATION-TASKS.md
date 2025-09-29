# SEO: Make Everything Editable in Tina (Reusable Template Cleanup)

Purpose: remove all hardcoded SEO across the template and drive 100% of page/global SEO via Tina-managed content. This doc is the single source of truth for tasks to complete tomorrow.

## Success Criteria
- No hardcoded SEO strings anywhere (titles, descriptions, keywords, OG, canonicals, JSON-LD).
- All SEO values come from Tina-managed content (page frontmatter or settings JSON managed by Tina).
- Canonicals and OG images are absolute, derived from the Tina-controlled site URL.
- JSON-LD pulls from content/settings and page data (not hardcoded).
- Grep check for remaining offenders returns zero.

## High-level Plan
1) Introduce/confirm Settings in Tina for global SEO/Business.
2) Wire a settings loader and use it in layout + helpers.
3) Convert static pages to use page-level MD frontmatter SEO.
4) Align service/blog metadata to prefer embedded `seo.*` frontmatter.
5) Normalize OG/canonical and JSON-LD to settings.
6) Validate via grep and a quick live page audit.

---

## Tasks (detailed)

### 1) Settings in Tina (Global Control)
- Create/confirm a “Settings” collection in Tina for:
  - `content/settings/seo.json` (site-level defaults: siteName, default OG image, twitter, locale, JSON-LD toggles, verification, robots defaults).
  - `content/settings/business.json` (brand name, `site_url`, social links, logo, contact, address, areaServed).
- Tina schema: add fields for all required properties above (arrays for sameAs/areaServed). Ensure these files are editable in Tina Admin.
- Acceptance:
  - Both JSON files are visible and editable in Tina.
  - Required fields present and validated where sensible.

### 2) Settings Loader
- Add `src/lib/settings.ts`:
  - `getSeoSettings()` → reads `content/settings/seo.json`.
  - `getBusinessSettings()` → reads `content/settings/business.json`.
  - Types for both; safe defaults if missing.
- Acceptance:
  - Functions return parsed objects with defaults.

### 3) Canonical + SITE_URL Source of Truth
- Update `src/lib/seo.ts`:
  - In `deriveSiteUrl()`, prefer `getBusinessSettings().site_url` if set; fallback to env; fallback to hardcoded final.
  - Keep www enforcement.
- Acceptance:
  - `SITE_URL` reflects Tina-managed URL when provided.

### 4) Layout Metadata from Settings (remove hardcodes)
- File: `src/app/layout.tsx`
  - Replace static `export const metadata` values with `getSeoSettings()/getBusinessSettings()` values.
  - metadataBase, siteName, default OG image, default title/description, twitter, verification.
- Acceptance:
  - No literal SEO strings in layout; relies on settings.

### 5) JSON-LD from Settings
- File: `src/lib/seo.ts`
  - `organizationJsonLd()` and `websiteJsonLd()` use business/settings values: name, url, logo, sameAs.
  - `localBusinessJsonLd()` uses business/settings: name, description, url, logo, email, phone, address, areaServed.
- Acceptance:
  - No hardcoded org data; all from settings with safe fallbacks.

### 6) Page-level SEO for Static Pages
Create page frontmatter files under `content/pages/` and load them in each route’s `generateMetadata()`. Fields: `seo.metaTitle`, `seo.metaDescription`, `seo.keywords`, `seo.noIndex`, `seo.canonicalUrl`, `seo.openGraph.{ogTitle,ogDescription,ogImage}`, `seo.winningKeywords`, `seo.targetKeywords.primary/secondary`.
- Pages to convert:
  - Case Studies index: `src/app/case-studies/page.tsx` → load `content/pages/case-studies.md`.
  - Services index: `src/app/services/page.tsx` → load `content/pages/services.md`.
  - Contact: `src/app/contact/page.tsx` → load `content/pages/contact.md`.
  - Blog index: `src/app/blog/page.tsx` → load `content/pages/blog.md`.
  - FAQ: `src/app/faq/page.tsx` → load `content/pages/faq.md`.
  - Experimental pages: use settings defaults or add a minimal `content/pages/experimental-home.md`.
- Acceptance:
  - All these routes have zero inline SEO strings; pull from page MD or settings.

### 7) About Page FAQ JSON-LD from Frontmatter
- Add `faqs: [{ question: string; answer: string }]` to `content/about.md` frontmatter.
- Update `src/app/about/page.tsx`:
  - Build FAQPage JSON-LD from `aboutData.faqs` instead of hardcoded script. Only render when data exists.
- Acceptance:
  - No hardcoded questions; all sourced from frontmatter.

### 8) Services Metadata Alignment
- File: `src/lib/metadata.ts > generateServiceMetadata()`:
  - Prefer `service.seo.*` (metaTitle, metaDescription, keywords, openGraph) when present.
  - Fallback to current title/description/keywords if `seo.*` absent.
  - Use `absUrl()` for OG images.
- Ensure `content/services/*.md` supports nested `seo` fields in Tina schema.
- Acceptance:
  - Service pages’ metadata controlled fully from Tina MD.

### 9) Blog Posts Metadata
- Verify blog `[slug]` page `generateMetadata()` (and loader) pulls full `seo.*` from post frontmatter.
- Add support for `targetKeywords` and `winningKeywords` in post schema if missing.
- Acceptance:
  - Blog posts’ SEO fully Tina-managed.

### 10) Absolute OG Image Helper
- Add `absUrl(pathOrUrl)` helper.
- Apply across Home/About/Services/Blog generateMetadata to ensure OG images are absolute.
- Acceptance:
  - All OG images resolve as absolute URLs.

### 11) Robots per Environment (Optional)
- Centralize robots logic to use settings `noIndexDefault` and page-level `seo.noIndex` + env flag `NEXT_PUBLIC_ALLOW_INDEX`.
- Acceptance:
  - Consistent robots output; toggled globally via Tina + env.

### 12) Tina Schema Updates
- Update `tina/config.ts` to expose all new fields:
  - Settings collection for `settings/seo.json` and `settings/business.json`.
  - Pages collection `content/pages/*.md` with nested `seo` group matching Home/About.
  - Services collection `seo` group.
  - Blog collection add `targetKeywords` and `winningKeywords` if absent.
- Acceptance:
  - All fields editable in Tina; consistent UI.

### 13) Migration + Seeding
- Create minimal `content/pages/*.md` with starter `seo` for the static pages above.
- Seed `settings/seo.json` and `business.json` with current live values so behavior matches existing site.
- Acceptance:
  - Site behaves the same but now editable in Tina.

### 14) Validation & QA
- Grep checks:
  - `generateMetadata|export const metadata` → confirm no literal strings remain (except tests/examples).
  - `og-image.png` usage → ensure passed through `absUrl` or page/frontmatter.
  - Organization details not hardcoded.
- Manual checks:
  - View source for Home/About/Case Studies/Services/Blog/Contact/FAQ.
  - JSON-LD validates (Rich Results test), OG preview correct.

---

## Milestones

- Milestone A (Foundations)
  - Tasks 1–5 complete. Layout + helpers + settings wired. JSON-LD from settings.
- Milestone B (Page SEO)
  - Tasks 6–8 complete. All static pages + services pull from Tina.
- Milestone C (Blog + Polishing)
  - Tasks 9–10 complete. Absolute OG everywhere.
- Milestone D (Final QA)
  - Tasks 11–14 complete. Grep clean; docs updated.

## Rollback/Notes
- Keep env fallbacks in `deriveSiteUrl()` to avoid build breaks if settings are missing in a fresh clone.
- For template reuse, document minimal required settings fields and defaults in README.

## Owner + Timebox
- Owner: Rhodes / Ellie
- Target: 1–2 focused sessions (A+B day 1, C+D day 2)
