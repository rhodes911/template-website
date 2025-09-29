# Keyword Research – Agentic Workflow (Simple, API-first)

TL;DR: A clear 10-step loop that states what we do, which APIs/tools we use, and what we produce at each step.

---

## 1) Define Scope
- We do: pick domain/locale, focus area (services/blog), optional seed terms.
- We use: config JSON (repo), business priorities (locations/services).
- Produces: scope.json

## 2) Collect Data (APIs)
- We do: pull real performance and market signals.
- We use:
  - Google Search Console API → queries, impressions, positions (by URL/site)
  - Google Analytics 4 API → organic sessions/conversions by page
  - Google Trends API → interest over time/region for terms
  - SERP fetch (Playwright or SERP API) → top 5–10 results + features
  - Suggest APIs (Google/Bing/YouTube) → expansion hints
- Produces: data/gsc.json, data/ga4.json, data/trends.json, data/serp/<keyword>.json, data/suggest.json

## 3) Crawl Site (Light)
- We do: fetch titles, H1–H3, slugs, internal links for target sections.
- We use: server-side fetch + cheerio; obey robots.txt.
- Produces: context.site.json

## 4) Generate Seeds
- We do: extract head terms from site titles/H1s/nav, competitor headings, and VoC.
- We use: GSC queries (top terms), competitor H2s from SERP pages, testimonials/case studies.
- Produces: seeds.json (50–300 high-signal seeds)

## 5) Expand Terms
- We do: get variants and long-tails per seed.
- We use: Suggest APIs, SERP People Also Ask/related, embeddings over competitor headings + our content.
- Produces: expansions.json

## 6) Normalize & De-duplicate
- We do: canonicalize and merge near-dups.
- We use: token/lemma cleanup, Levenshtein + cosine thresholds.
- Produces: keywords.clean.json

## 7) Cluster, Intent, and Competitors
- We do: group terms, infer intent, and profile competitor content.
- We use:
  - Embeddings + kNN/HDBSCAN for clusters
  - SERP features + cues for intent (info/txn/local/nav)
  - Competitor profiling: fetch top pages, parse H1/H2/H3, detect sections (Pricing, FAQ, Case Studies), schema.org types, content-type (Service/Blog/Location)
- Produces: clusters.json, intent.json, competitors/profiles.json, competitors/consensus.json, gaps.json (vs our page)

## 8) Score Opportunity
- We do: prioritize keywords/clusters by potential impact.
- We use:
  - Volume proxy: GSC impressions (optionally Trends)
  - Difficulty: SERP brand dominance heuristic
  - Current rank: GSC positions
  - Business fit: GA4 conversions and service relevance
- Produces: scored.json/csv (with rationale)

## 9) Map to Content
- We do: choose page type, avoid cannibalization, plan internal links.
- We use: Intent + competitor consensus (which content types win), existing rankings by URL.
- Produces: mappings.md (cluster → page type → target page/new)

## 10) Briefs & Delivery
- We do: create concise briefs with required sections.
- We use: competitor consensus (sections, word count), entities, FAQs; guardrails (SEO length/rules) for titles/metas.
- Produces: briefs/<clusterId>.md, plan.md; optional drafts for Tina “Apply”.

---

Where artifacts live
- reports/ai/keywords/<runId>/ → all JSON/CSV/MD outputs
- content/ai-drafts/ → optional drafted snippets

Env (server-only)
- GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY, GSC_SITE_URL
- GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY
- SERP (Playwright) and/or SERP_API_KEY; Trends as configured

Run order
1) Define → 2) Collect APIs → 3) Crawl → 4) Seeds → 5) Expand → 6) Clean → 7) Cluster/Intent/Competitors → 8) Score → 9) Map → 10) Briefs/Deliver

Notes
- Always respect robots.txt and rate limits; cache SERP and page fetches.
- Guardrails from SEO-GUARDRAILS.md apply when generating titles/metas/sections in briefs.