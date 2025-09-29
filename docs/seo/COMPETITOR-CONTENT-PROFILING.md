# Competitor Content Profiling – Implementation Guide

A deep-dive on how we analyze top competitor pages for each keyword/cluster to understand what content types win, which sections they include, and where our gaps are. This extends the Keyword Research Agentic Workflow with concrete competitor analysis steps and artifacts.

---

## Objectives

- For a given keyword or cluster, fetch top 5–10 SERP results.
- Classify each result by content type (Service, Blog/Guide, Comparison, Location, Category, Landing).
- Extract structure (H1/H2/H3), detect key sections (Pricing/Packages, FAQ, Testimonials, Case Studies), and capture schema (FAQPage, HowTo, Product, Service, LocalBusiness).
- Derive consensus sections/topics and identify gaps vs your current page.
- Feed findings into briefs and opportunity scoring.

---

## Inputs → Outputs

Inputs:
- keyword (or clusterId + representative term)
- locale (e.g., en-GB)

Outputs (per keyword/cluster, under `reports/ai/keywords/<runId>/`):
- `competitors/raw/serp.<keyword>.json` – SERP features and top results
- `competitors/pages/<hash>.json` – per-URL parsed page profile
- `competitors/profiles.<keyword>.json` – consolidated profiles array
- `competitors/consensus.<keyword>.json` – consensus sections and entities
- `gaps.<keyword>.json` – gaps vs our target page (if provided)

---

## Pipeline

1) SERP fetch
- API: `POST /api/keywords/serp` → { features, results: [{ url, title, h1?, h2s[], hasFAQ }] }
- Cache to `competitors/raw/serp.<keyword>.json`

2) Page fetch & parse
- For each SERP URL:
  - Fetch HTML (Playwright for JS-render where needed; obey robots.txt; rate-limit).
  - Extract:
    - meta: title, description, canonical, og
    - headings: H1, H2[], H3[]
    - sections: detect via heading text + CSS selectors (pricing|packages|faq|testimonials|case studies|portfolio|services|locations)
    - schema JSON-LD types: FAQPage, HowTo, Product, Service, Organization, BreadcrumbList, LocalBusiness
    - media: image count, video presence
    - word count, readability (Flesch-Kincaid), est. content depth
    - internal links (top anchors), external links
    - entities (NER): companies, places, services, price mentions (£, ranges)
  - Heuristics for content type:
    - Blog/Guide: Article schema, /blog/ path, author/date signals
    - Service: Service/Product schema, breadcrumbs include Services, CTAs like “Get a quote”
    - Comparison: headings include vs/compare/best; list tables
    - Location: city/region in H1/title; LocalBusiness schema; address/map
    - Category: grid/listing; many internal links to child pages
    - Landing: thin nav, heavy CTAs, minimal long-form sections
  - Save per-URL profile to `competitors/pages/<hash>.json` with the fields below.

3) Consensus & coverage
- Aggregate profiles to compute:
  - contentType distribution
  - section inclusion rates (e.g., Pricing present in 7/10 pages)
  - common H2/H3 n-grams and entities
  - typical word count range and media density
  - schema prevalence (FAQPage, HowTo)
- Output `competitors/profiles.<keyword>.json` and `competitors/consensus.<keyword>.json`.

4) Gap analysis (optional vs your page)
- If a `your_url` is provided or mapped from cluster → target page:
  - Parse your page with the same extractor.
  - Identify missing sections/entities/FAQ compared to consensus.
  - Output `gaps.<keyword>.json` and a short `gaps.<keyword>.md` summary.

---

## Data Contracts

PageProfile (per URL):
```json
{
  "url": "https://competitor.com/services/seo-camberley",
  "title": "SEO Services in Camberley | Competitor",
  "h1": "SEO Services Camberley",
  "h2s": ["Local SEO Packages", "Pricing", "Our Process", "FAQs"],
  "sections": { "pricing": true, "faq": true, "testimonials": false, "caseStudies": true },
  "schema": ["FAQPage", "BreadcrumbList", "Service"],
  "contentType": "Service",
  "wordCount": 1250,
  "readability": { "fleschKincaid": 60.2 },
  "media": { "images": 8, "video": false },
  "entities": ["Camberley", "SEO", "pricing", "packages"],
  "hasPricing": true,
  "ctas": ["Get a Quote", "Book a Call"]
}
```

Consensus:
```json
{
  "keyword": "seo services camberley",
  "contentTypes": { "Service": 0.7, "Blog": 0.2, "Location": 0.1 },
  "sections": { "pricing": 0.6, "faq": 0.8, "caseStudies": 0.4, "testimonials": 0.3 },
  "commonH2": ["SEO Packages", "How Our SEO Works", "FAQs"],
  "entities": ["Camberley", "local SEO", "packages", "pricing"],
  "wordCount": { "p25": 900, "p50": 1200, "p75": 1500 },
  "schema": { "FAQPage": 0.6, "HowTo": 0.1 }
}
```

Gaps vs your page:
```json
{
  "missingSections": ["pricing", "faq"],
  "missingEntities": ["Camberley", "packages"],
  "wordCountDelta": 450,
  "recommendations": [
    "Add Pricing/Packages section with local modifiers",
    "Add FAQ with 3–5 high-intent questions",
    "Increase content depth to ~1200 words"
  ]
}
```

---

## API & Scripts

API Endpoints (server-only):
- `POST /api/keywords/serp` → SERP results + features (cache)
- `POST /api/keywords/competitors/profile` → { keyword, locale, your_url? } → profiles + consensus + gaps

CLI Scripts:
- `scripts/keywords/competitors.ts` – orchestrates SERP fetch → page profiling → consensus → gaps; writes artifacts under `reports/ai/keywords/<runId>/`.

Types:
- `src/lib/keywords/contracts.ts` – add `PageProfile`, `Consensus`, `Gaps` interfaces.

---

## Heuristics & Signals

- Content type: URL patterns (/blog/, /services/), schema types, presence of CTAs, breadcrumbs.
- Sections: match H2/H3 tokens against a dictionary (pricing, packages, faq, testimonials, case studies, locations, process, benefits, industries).
- Entities: simple NER (JS libraries) + regex for prices and locations; optional LLM for disambiguation.
- Readability: Flesch-Kincaid from plain text; strip nav/boilerplate.
- Consensus: threshold ≥ 0.5 to treat a section as standard for the keyword; ≥ 0.7 = strong consensus.

---

## Guardrails, Robots, Caching

- Respect robots.txt and crawl-delay; set UA; cap concurrency.
- Cache HTML and parsed results per URL; re-use across runs within TTL.
- Redact PII and avoid storing unnecessary cookies/session data.

---

## Integration with Briefs & Scoring

- Briefs: auto-include consensus sections and FAQs; set word count target from p50–p75.
- Scoring: reward clusters where consensus includes sections we currently lack (bigger opportunity); penalize when dominant brands saturate SERP.
- Mapping: choose page type based on majority contentType and SERP intent.

---

## Pseudocode

```ts
const serp = await fetchSerp({ keyword, locale });
const urls = serp.results.slice(0, 10).map(r => r.url);
const profiles = [];
for (const url of urls) {
  const html = await fetchHtml(url);
  const profile = await parseProfile(html, url);
  profiles.push(profile);
}
const consensus = aggregateConsensus(profiles);
let gaps = undefined;
if (yourUrl) {
  const yours = await parseProfile(await fetchHtml(yourUrl), yourUrl);
  gaps = diff(consensus, yours);
}
emit({ profiles, consensus, gaps });
```

---

## Next Steps

- Implement `scripts/keywords/competitors.ts` and `POST /api/keywords/competitors/profile`.
- Hook competitor consensus into mapping and briefs generation.
- Add a small HTML report in `reports/ai/keywords/<runId>/competitors.html` with a heatmap of sections.
