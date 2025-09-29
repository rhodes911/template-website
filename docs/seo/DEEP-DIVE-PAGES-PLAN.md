# Deep Dive: Sitewide SEO + UX Modernization Plan (Align with New Homepage)

This document is a thorough, page-by-page plan to bring every public page up to the same standard as the new sleek, clean, modern, interactive, and animated homepage—while improving SEO, structured data, internal linking, and performance.

Scope covers all App Router routes under `src/app`, plus content models in `content/**` and shared libs in `src/lib/**`.

---

## 1) Executive Summary

- Goal: Make every page consistent with the homepage’s visual style, interaction polish, performance budget, and SEO completeness.
- Focus areas:
  - Metadata completeness and correctness (title, description, canonical, OG, Twitter)
  - Structured Data (JSON-LD) for each page type: LocalBusiness, Service, Article, CaseStudy (use CreativeWork), FAQPage, ContactPage, BreadcrumbList
  - Content quality and hierarchy (H1/H2 order, intro, CTAs, media alts)
  - Internal linking strategy (services ↔ blog ↔ case studies; always-on conversion paths)
  - UX/UI alignment with homepage (hero patterns, micro-interactions, CTA blocks, section rhythm)
  - Performance consistency (LCP image strategy, font loading, animation budgets)

Deliverables split into: Baseline standards, Page-type playbooks, and a Route-by-route checklist.

---

## 2) Inventory of Routes (Public)

- `/` Home (done; reference design system and patterns)
- `/about`
- `/services` (index)
- `/services/[slug]` (service detail from `content/services/*.md`)
- `/case-studies` (index)
- `/case-studies/[slug]` (detail; code-driven data)
- `/blog` (index)
- `/blog/category/[category]`
- `/blog/[slug]` (post detail from `content/blog/*.md`)
- `/faq`
- `/contact`

System pages: `/robots.txt`, `/sitemap.xml` implemented; keep in scope for QA only.

Internal/experimental: `/experimental-home` (keep for demos only; noindex optional).

---

## 3) Baseline Standards (Apply to All Pages)

- Metadata
  - Title: 50–60 chars; primary keyword + brand. Description: 140–160 chars; value-forward.
  - `alternates.canonical` must use `canonical('/path')` from `src/lib/seo`.
  - OG/Twitter: Provide title/description; ensure image set for shareable pages.
  - Robots: default index, follow; configurable per-page via content/frontmatter.
- Headings & Content
  - Single H1 per page; H2s for sections; no jumps in hierarchy.
  - First paragraph introduces value; include primary keyword naturally.
  - Include at least one relevant internal link (services/post/case study) per section or after major block.
- Media & Images
  - All images require descriptive `alt`. Prefer `next/image` with width/height.
  - Use AVIF/WebP where possible; large hero images ≤ 100 KB (goal), supporting ≤ 60 KB.
- UX Consistency
  - Align section spacing, typography, CTA styles with homepage.
  - Add subtle entrance animations (reduced-motion aware) and interactive details.
  - Include the Floating “Marketing Assistant” CTA globally (already in `layout.tsx`).
- Performance
  - LCP: hero image `priority` only where needed (one per page). Defer non-critical.
  - Avoid layout shifts (stable dimensions). Keep animation main-thread light.
- Analytics & Conversion
  - Ensure trackable CTAs (contact, wizard open) are present above the fold and at logical endpoints.

---

## 4) Structured Data (JSON-LD) Strategy

- Global
  - LocalBusiness: Already on home via `localBusinessJsonLd`. Reuse on Contact.
  - BreadcrumbList: Add on hierarchical pages (blog posts, service detail, case studies, category).
- Page Types
  - Service Detail: `Service` + `FAQPage` (if FAQs present) + `BreadcrumbList`.
  - Blog Post: `Article` (`BlogPosting`) + `BreadcrumbList`.
  - Case Study: `CreativeWork` (or `Article`) + `BreadcrumbList`.
  - FAQ: `FAQPage`.
  - Contact: `ContactPage` + `LocalBusiness`.

Recommendation: extend `src/lib/seo.ts` with helpers: `serviceJsonLd(service)`, `articleJsonLd(post)`, `caseStudyJsonLd(item)`, `faqJsonLd(faqs)`, `breadcrumbJsonLd(items)`, `contactPageJsonLd()`. Inject via a small component rendered in each page (script type `application/ld+json`).

---

## 5) Page-Type Playbooks

### 5.1 About (`/about`)
- Current: Has Metadata; uses markdown content via `getAboutData`.
- Upgrades
  - Add hero pattern matching homepage (subtle background, micro-anim).
  - Add trust signals: badges/logos, “As featured in”, core values, and a focused CTA (contact + wizard).
  - Internal links to top services and recent case studies.
  - Structured data: `Organization` or `Person` (if framed as consultant) + `BreadcrumbList`.

### 5.2 Services Index (`/services`)
- Current: Has Metadata; lists services from `getServicesForPage()`.
- Upgrades
  - Introduce featured cards with hover micro-interactions (consistent with homepage “Core Building Blocks”).
  - Add a short guide section: “How we work” with icons and steps.
  - Insert a smart CTA block (“Get a plan”) + open the wizard.
  - Structured data: `ItemList` of services + `BreadcrumbList`.

### 5.3 Service Detail (`/services/[slug]`)
- Current: Metadata via `generateServiceMetadata`; content via markdown.
- Upgrades
  - Add hero with dynamic icon and short promise statement.
  - Ensure H1 from service title; consistent section layout (features, process, results, FAQs).
  - “Related services” already present; add “Related case studies” and “Related blog posts”.
  - Add sticky in-page nav for long content (TOC) with scrollspy; reduced motion aware.
  - Structured data: `Service` (name, description, areaServed, offers if present), `FAQPage` (if FAQs), `BreadcrumbList`.
  - Content frontmatter: ensure `keywords`, `socialShare` image 1200×630, `lastModified`.

### 5.4 Case Studies Index (`/case-studies`)
- Upgrades
  - Grid with category/industry filters; animated cards.
  - Add concise intro explaining selection and results expectations.
  - Internal links to services relevant to showcased outcomes.
  - Structured data: `CollectionPage` + `BreadcrumbList`.

### 5.5 Case Study Detail (`/case-studies/[slug]`)
- Current: Good metadata generation; ensure OG image presence.
- Upgrades
  - Consistent hero (client, industry, result headline), metrics highlights, challenge → approach → results narrative.
  - Pull-quotes/testimonial blocks; CTA to related service.
  - “Next/Previous” navigation and “More like this”.
  - Structured data: `CreativeWork` or `Article` (with `author`, `datePublished`, `about`, `mentions`), `BreadcrumbList`.

### 5.6 Blog Index (`/blog`) & Category (`/blog/category/[category]`)
- Upgrades
  - Add filters, tags cloud, and featured posts strip.
  - Category pages should have a descriptive intro and curated internal links to services.
  - Structured data: `CollectionPage` + `BreadcrumbList`.

### 5.7 Blog Post (`/blog/[slug]`)
- Current: Strong metadata, OG/Twitter support; related posts available.
- Upgrades
  - At top: author info, reading time, updated date; at end: CTA to relevant service and email capture.
  - Inline “key takeaway” callouts and image captions with alt.
  - TOC for long posts; code-friendly styles if needed.
  - Structured data: `BlogPosting` + `BreadcrumbList`.

### 5.8 FAQ (`/faq`)
- Upgrades
  - Expand/collapse accordion with animated transitions.
  - Structured data: `FAQPage` from the questions.
  - Link each answer to relevant service or content.

### 5.9 Contact (`/contact`)
- Upgrades
  - Keep form; show alternative contact methods; surface expected response time.
  - Include LocalBusiness JSON-LD and `ContactPage` JSON-LD.
  - Prominent CTA to wizard; retains standard submit path.

---

## 6) Cross-Linking and Navigation Enhancements

- Add “Related” sections everywhere:
  - Service → related services, 1–2 case studies, 2–3 blog posts.
  - Blog → related services and posts.
  - Case Study → linked target services and blog posts that explain the tactics used.
- Breadcrumbs UI + JSON-LD for blog, service detail, case study detail.
- Footer quick links reorganized by intent (Explore services, Learn, Proof).

---

## 7) Implementation Tasks (Backlog by Area)

### 7.1 SEO Utilities (`src/lib/seo.ts`)
- [ ] Add helpers for JSON-LD:
  - [ ] `serviceJsonLd(service)`
  - [ ] `articleJsonLd(post)`
  - [ ] `caseStudyJsonLd(item)`
  - [ ] `faqJsonLd(faqs)`
  - [ ] `breadcrumbJsonLd(items)`
  - [ ] `contactPageJsonLd()`
- [ ] Small `JsonLd` component to inject script safely.

### 7.2 Structured Data Wiring
- [ ] `services/[slug]/page.tsx`: inject Service + FAQ + Breadcrumbs JSON-LD.
- [ ] `case-studies/[slug]/page.tsx`: inject CreativeWork + Breadcrumbs JSON-LD.
- [ ] `blog/[slug]/page.tsx`: inject BlogPosting + Breadcrumbs JSON-LD.
- [ ] `faq/page.tsx`: inject FAQPage JSON-LD.
- [ ] `contact/page.tsx`: inject ContactPage + LocalBusiness JSON-LD.

### 7.3 Metadata & Canonicals
- [ ] Verify `generateMetadata` for: about, case studies index, blog index, blog category, FAQ, contact. Ensure `alternates.canonical` present and correct.
- [ ] Ensure OG/Twitter images present where shareable.

### 7.4 Page Layout & Components
- [ ] Extract homepage section patterns into reusable components (hero, icon grid, testimonial strip, CTA band) in `src/components/`.
- [ ] Apply to about, services index, case studies index, blog index.
- [ ] Add Breadcrumbs UI component with schema hook.
- [ ] Add TOC component for long content pages (service/blog).

### 7.5 Content & Frontmatter
- Services (`content/services/*.md`)
  - [ ] Ensure: `title`, `description`, `keywords[]`, `socialShare.image`, `lastModified`, `faqs[]` where relevant.
  - [ ] Add internal links in body to other services and case studies.
- Blog (`content/blog/*.md`)
  - [ ] Ensure: `seo.metaTitle`, `seo.metaDescription`, `seo.canonicalUrl?`, `keywords[]`, `socialShare`, `publishDate`, `lastModified`, `author`.
  - [ ] Alt text for all images configured in markdown.
- Case Studies (data or md)
  - [ ] Provide: client, industry, challenge, approach, results, metrics, tags, hero image, dates.

### 7.6 Performance Polishing
- [ ] Audit LCP element per page; ensure optimized image and `priority` usage.
- [ ] Check CLS sources (fonts, images) and set explicit sizes.
- [ ] Reduce heavy animations or run only on view; respect `prefers-reduced-motion`.

---

## 8) Route-by-Route Checklist (Trackable)

- `/about`
  - [ ] Metadata complete + canonical
  - [ ] Hero and CTA updates
  - [ ] Internal links to services/case studies
  - [ ] Breadcrumbs JSON-LD

- `/services`
  - [ ] Enhanced cards + micro-interactions
  - [ ] ItemList JSON-LD
  - [ ] CTA band + wizard open

- `/services/[slug]`
  - [ ] Hero + H1 alignment
  - [ ] Related services/posts/case studies
  - [ ] Service + FAQPage + Breadcrumb JSON-LD

- `/case-studies`
  - [ ] Filters + animated cards
  - [ ] CollectionPage JSON-LD

- `/case-studies/[slug]`
  - [ ] Narrative structure + metrics highlights
  - [ ] CreativeWork + Breadcrumb JSON-LD

- `/blog`
  - [ ] Featured + filters
  - [ ] CollectionPage JSON-LD

- `/blog/category/[category]`
  - [ ] Descriptive intro + links to services
  - [ ] Breadcrumb JSON-LD

- `/blog/[slug]`
  - [ ] Author/top meta + CTA endcap
  - [ ] BlogPosting + Breadcrumb JSON-LD

- `/faq`
  - [ ] Accordion + FAQPage JSON-LD

- `/contact`
  - [ ] ContactPage + LocalBusiness JSON-LD
  - [ ] Prominent wizard CTA

---

## 9) Optional Enhancements

- Add sitewide `Sitelinks Search Box` JSON-LD to home.
- Add `SpeakableSpecification` for selected blog posts.
- Add `HowTo` schema for procedural blog content.
- Consider `WebSite` Organization schema if not present.

---

## 10) Acceptance Criteria

- Each route has complete metadata (title, description, canonical, OG, Twitter).
- Each page type includes appropriate JSON-LD and validates in Rich Results Test.
- Visual rhythm and interactions match homepage patterns.
- All images have alt text; LCP/CLS within targets.
- Internal linking present and logical per page.
- CTAs are present and functional; wizard can be opened from key points.

---

## 11) Next Steps (Execution Order)

1) Implement JSON-LD helpers in `src/lib/seo.ts` + small `JsonLd` component.
2) Wire structured data into service, blog, case study, FAQ, contact pages.
3) Extract homepage components and apply to about/services/case-studies/blog indexes.
4) Update content frontmatter fields; add missing OG images.
5) Add Breadcrumbs UI + schema across hierarchical pages.
6) Performance pass (LCP/CLS) and reduced-motion auditing.
7) Final QA: Screaming Frog crawl, Rich Results validation, PageSpeed checks.

---

Notes
- This plan aligns with the existing `docs/seo/SEO-REQUIREMENTS.md` and `docs/seo/TECHNICAL-SEO-PLAN.md` but focuses on concrete page-level execution and UX parity with the homepage.
