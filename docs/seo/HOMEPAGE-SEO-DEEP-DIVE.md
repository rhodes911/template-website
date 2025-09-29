# Homepage SEO Deep Dive and Playbook

This document breaks down what’s working on the homepage, why it likely performs well, and how to replicate the structure for other pages. It also shows where to capture "Winning Keywords" inside TinaCMS so we can reinforce what Google already likes without stuffing.

## What’s Working On The Homepage

Inputs reviewed: `content/home.md`, `src/app/page.tsx`, `src/lib/seo.ts`, Tina schema `tina/config.ts`, and global `content/settings/seo.json`.

Key strengths:
- Clear topical focus: “Digital Marketing in Camberley, Surrey” in H1 + meta. Reinforces local intent and service type.
- Region coverage in meta description: Camberley, Surrey, Hampshire, Basingstoke, Reading — matches service area and supports long-tail.
- Section internal links: Core Building Blocks link to services (SEO, content marketing, PPC, etc.), strengthening topical clusters and crawl paths.
- JSON-LD: LocalBusiness data boosts eligibility for local surfaces and clarifies service context.
- Canonical handling and www enforcement: Reduces duplication risk.
- Performance/UX: Command palette and scroll progress are light UI toggles; rendering keeps H1/H2 in SSR HTML, helping crawlability.

Observed on-page keyword alignment:
- Primary theme: digital marketing (services + consulting) with local modifiers (Camberley, Surrey; Hampshire, Basingstoke, Reading).
- Supporting entities: SEO, PPC, content marketing, lead generation.

## Page Structure Pattern To Copy

Use this checklist when building any primary page (home, services, about, case studies, key blog posts).

1) URL + Canonical
- One canonical URL per page. Use the `seo.canonicalUrl` field if non-standard.
- Keep slugs short, human, and descriptive.

2) Title (Meta Title)
- 50–60 chars, lead with the core topic + location where relevant.
- Natural brand inclusion: "| Ellie Edwards" at the end.
- Example: "SEO Services in Camberley, Surrey | Ellie Edwards".

3) Meta Description
- 150–160 chars. Benefit-led, mention service + region when useful. No keyword stuffing.

4) H1 + Above-the-fold Messaging
- H1 should mirror search intent (service + location). Keep a concise supporting subtitle.
- Add a short hero description that mentions service stack/approach (evidence of relevance).

5) Internal Links and Clusters
- Link to the most relevant service pages with descriptive anchors.
- From services back to a hub (Services index) and laterally between related topics (e.g., SEO <> Content).

6) Content Sections
- Brief intro paragraph explaining who it’s for and outcomes.
- Feature/benefit blocks that map to search sub-intents (audits, on-page SEO, local SEO, etc.).
- Add light FAQs if they answer real questions; consider FAQ JSON-LD when present.

7) Media + OG
- Provide OG title/description close to meta title/description.
- Use a clean 1200x630 image; ensure absolute URL where possible.

8) JSON-LD
- LocalBusiness for local pages; Service for service details; Article for blog.
- Keep it accurate; avoid fabricated ratings or reviews.

9) Technical
- Enforce www canonical (already done).
- Avoid index on thin/wip pages via `seo.noIndex`.
- Keep CLS low; ensure H1 renders server-side (already done).

## TinaCMS: Track “Winning Keywords”

We’ve added a field to capture high-performing queries from Google Search Console.
- Location:
  - Home: `content/home.md > seo.winningKeywords`
  - About: `content/about.md > seo.winningKeywords`
  - Services: each service MD > `seo.winningKeywords`
  - Blog posts: `seo.winningKeywords`
- Guidance:
  - Add 3–10 queries that show high impressions/CTR or recent position lift.
  - Use them to guide headings and body copy updates naturally. Don’t stuff.
  - Review monthly. Remove terms that fade; add emerging variants.

Example (Home):
```yaml
seo:
  winningKeywords:
    - digital marketing camberley
    - marketing consultant surrey
    - small business marketing camberley
```

## Replicable Templates

For a Service Page
- H1: "<Service> in <Primary Location>"
- Subtitle: outcome-oriented (e.g., "Lift qualified leads and reduce waste").
- Hero description: 30–60 words; include 1–2 primary terms naturally.
- Sections: What you get, features, process, expected results, FAQs, CTA.
- SEO:
  - metaTitle: "<Service> in <Location> | Ellie Edwards"
  - metaDescription: benefit + proof point + location (150–160 chars)
  - targetKeywords.primary: 2–4 exact phrases
  - targetKeywords.secondary: 3–6 related phrases
  - winningKeywords: fill from Search Console as they emerge

For the About Page
- H1: person + role + region (if relevant).
- Hero description: short proof of expertise and audience served.
- Differentiators and mission.
- SEO fields as above + winningKeywords.

For a Blog Post
- Title answers a real query; match searcher vocabulary.
- Excerpt as meta description.
- Subheadings map to related intents/people-also-ask.
- Internal links to services and related posts.
- Add winningKeywords after the post accrues data in GSC.

## How To Use Search Console Data

- Queries with rising impressions and CTR are prime candidates for headings, FAQs, or small copy additions.
- If a query is close to page scope but missing, add a small section or sentence to cover it.
- Avoid diluting the page with off-topic queries—spin up a new supporting page instead.

## Quick QA Checklist per Page

- Title length within 50–60 chars and readable
- Meta description clear, 150–160 chars
- One H1; logical heading hierarchy
- Canonical set or default is correct
- Internal links to relevant hubs/services
- OG tags present; image resolves
- JSON-LD present where appropriate and valid
- Page loads fast and is mobile-friendly
- winningKeywords populated and reflected naturally in copy

## Next Steps

- Populate winningKeywords on the homepage with real queries from GSC.
- Repeat for the top 3 service pages and About.
- Review monthly and iterate headings/sections based on performance.
