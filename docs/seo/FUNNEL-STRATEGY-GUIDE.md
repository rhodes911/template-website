# Full-Funnel Content Strategy (TOFU / MOFU / BOFU) for Ellie Edwards Marketing

This guide explains what the funnel stages mean, practical best practices, and concrete ideas for how to apply them across this project’s pages. Keep it pragmatic; use the structures we already have and evolve iteratively.

## Funnel basics

- TOFU (Top of Funnel) – Awareness
  - Goal: attract the right visitors by answering questions and educating.
  - Formats: how‑to articles, checklists, comparisons, trends, glossaries.
  - Success: qualified traffic growth, time on page, scroll depth, email sign‑ups.

- MOFU (Middle of Funnel) – Consideration
  - Goal: help prospects evaluate approaches and shortlist you.
  - Formats: service explainers, solution guides, frameworks, calculators, webinars, pillar pages with internal links.
  - Success: service page views, downloads, booked discovery calls, demo requests.

- BOFU (Bottom of Funnel) – Decision
  - Goal: remove risk and prompt action.
  - Formats: case studies, testimonials, pricing guidance, detailed FAQs, guarantee language, implementation plans.
  - Success: contact form submissions, booked calls, closed‑won influenced by page.

## Good practices to follow

- One primary purpose per page: write for a stage; link to the next step.
- Build clusters: TOFU posts → MOFU service hubs → BOFU case studies/CTAs.
- Keep copy human; map to real language in Search Console (use `seo.winningKeywords`).
- Use clear CTAs appropriate to the stage (soft at TOFU, strong at BOFU).
- Add trust near CTAs: logos, quotes, metrics, relevant case study tiles.
- Measure micro‑conversions: scroll 50%, CTA clicks, downloads, email sign‑ups.
- Refresh winners quarterly: update posts that earn impressions but lag CTR.

## How this applies to our site

Existing building blocks we’ll lean on:
- Home (`/`): High‑level positioning, internal links to services (MOFU) and trust (BOFU). Add/maintain `seo.winningKeywords` for local+service queries.
- Services (`/services/*`): MOFU explainer + outcomes. Include clear CTAs and relevant case studies.
- Blog (`/blog/*`): TOFU education. Link forward to service pages and relevant case studies.
- Case Studies (`/case-studies/*`): BOFU proof; link back to the service used; end with a strong CTA.
- Testimonials (`/testimonials` content): BOFU proof fragments embedded across pages.

### Stage-to-page map and linking model

- TOFU examples (blog)
  - “Marketing Strategy for Small Businesses in Surrey: A Practical Guide” → link to `/services/marketing-strategy` (or closest) and related services (`/services/seo`, `/services/content-marketing`).
  - “Local SEO Basics for Camberley SMEs” → link to `/services/seo` and a relevant case study.

- MOFU examples (services)
  - `/services/seo`: Explain approach, what’s included, expected results; interlink to content marketing and PPC. Include 1–2 relevant case studies and 2–3 FAQs.
  - `/services/content-marketing`: Add an editorial planning checklist download (lead magnet). Link to blog category pages or key posts.

- BOFU examples (proof and CTAs)
  - Case studies: Surface metrics (before/after), 3–5 steps of what you did; link to service and Contact.
  - Pricing/engagement overview (if added later): scope ranges, timelines, what impacts price.

## Content patterns per stage

- TOFU
  - Intro that empathises with the problem; define terms quickly; show a simple framework.
  - Use subheads that mirror search queries; add a lightweight CTA: “Explore SEO Services” or “Get the checklist”.
  - Internal links to 1–2 relevant service pages and 1 case study.

- MOFU
  - Define the problem → outline your approach → what’s included → results → FAQs → CTA.
  - Add a proof block: testimonial + stat + client snippet.
  - Offer a lead magnet relevant to the service (template, checklist, calculator).

- BOFU
  - Lead with outcomes and obstacles removed (risk reversals, process clarity).
  - Add tangible numbers; include implementation details to build confidence.
  - End with a prominent “Book Strategy Call” and fallback email/phone.

## Keywords and TinaCMS usage

- Use `seo.targetKeywords.primary/secondary` on each page to guide writing.
- Populate `seo.winningKeywords` with actual Search Console queries that perform well.
- Reflect those queries naturally in headings or a short paragraph; avoid repetition.

Example snippet for a service page frontmatter:
```yaml
seo:
  metaTitle: "SEO Services in Camberley, Surrey | Ellie Edwards"
  metaDescription: "Lift qualified leads with technical SEO, content, and local optimisation for SMEs in Surrey."
  targetKeywords:
    primary: ["seo services camberley", "seo consultant surrey"]
    secondary: ["local seo camberley", "small business seo surrey"]
  winningKeywords:
    - seo consultant surrey
    - local seo camberley
```

## On-page modules to reuse

- Hero: outcome‑oriented H1 (service + location where relevant).
- “What you’ll get” list (benefit‑led), then “Features” (capabilities).
- Process steps (numbers and durations).
- Results strip (metrics) + testimonial.
- FAQs answering Search Console “people also ask” style queries.
- Case study rail (BOFU) near CTAs.

## Ideas to test

- Lead magnets
  - Editorial calendar template (Content Marketing)
  - Local SEO checklist (SEO)
  - UTM builder sheet (PPC)
- Calculators/mini‑tools
  - “Content velocity to rank” rough estimator
  - “ROAS breakeven” calculator for PPC
- A/B tests
  - CTA text and placement on services pages
  - Add a trust strip above the fold vs. below
  - Replace long FAQs with short Q&A + link to a detailed post

## Analytics quick wins

- Track events: `cta_click` (label: page + button), `lead_magnet_download`, `contact_submit`.
- Measure scroll depth (25/50/75) on TOFU to spot weak sections.
- Use UTM on social/email shares for TOFU pieces to track channel quality.
- In Search Console, label pages by stage and review queries monthly; move rising TOFU queries into MOFU pages when they imply buying intent.

## Governance and cadence

- Monthly: update `seo.winningKeywords` for top pages; refresh titles/meta for CTR.
- Quarterly: add/retire 1–2 TOFU posts per service; backfill internal links.
- Bi‑annually: full audit of services and case studies (results still current? add new proof?).

## Stage KPIs (directional)

- TOFU: organic sessions, % new users, scroll depth, email sign‑ups, CTR on internal links to services.
- MOFU: service page sessions, CTA click‑through to contact, lead magnet downloads, time on page.
- BOFU: booked calls, contact form submissions, influenced opportunities/closed‑won.

## Optional next steps (small, high‑leverage)

- Add a `funnelStage` field (TOFU/MOFU/BOFU) to the Tina collections for blog, services, and case studies to aid reporting.
- Create a lightweight monthly ritual: export GSC queries → update `winningKeywords` → update 1–2 headings/FAQs across key pages.
- Introduce one lead magnet per top service page; wire events for downloads.
