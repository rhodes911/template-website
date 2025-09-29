# Page Keyword Playbook — SEO Service (/services/seo)

This playbook anchors the agentic keyword workflow to a single page: `content/services/seo.md`.
It explains what each step does, why it’s valuable, and how we’ll execute it (now and next).

## 1) Define the page’s job (Why)
- What it is: Core service page for SEO.
- Why it matters: This page must rank for transactional/commercial terms ("seo services", "local seo", etc.) for Surrey/Camberley/Mytchett, and capture qualified leads.
- Success: Growth in impressions/clicks for target queries, improved avg position, qualified enquiries.

## 2) Seed set (Now)
- Value: Grounds discovery in what this page actually offers.
- How: Seeds and local modifiers derived from the page frontmatter and copy.
- Artifact: `data/keywords/services/seo.seeds.json` (seeds, prefix/suffix modifiers, locale cues)

## 3) Expand → Normalize → Dedupe (Now)
- Value: Create realistic long-tail variants, clean them for analysis.
- How now: Use the Streamlit Workbench (seolab) baseline pipeline (prefix/suffix combos; lowercasing/punctuation strip; dedupe).
- Outcome: Expanded list + cleaned list; reduces noise before clustering.

## 4) Cluster by similarity (Now)
- Value: Groups similar intent/phrases so we don’t create redundant pages.
- How now: Jaccard token similarity with tunable threshold (0.5 recommended to start).
- Outcome: Cluster IDs and sizes; helps select a primary target keyword per cluster.

## 5) Initial intent detection (Now)
- Value: Determines page type and content shape (transactional vs informational).
- How now: Lightweight rules: informational (how/what/guide), commercial (best/top/vs), transactional (buy/price/near me), navigational (.com/login).
- Outcome: Intent label per keyword; we expect a majority of commercial/transactional for a service page.

## 6) Baseline scoring (Now)
- Value: Quick prioritization before we have real data.
- How now: Favor long-tail and modifier matches; penalize over-large clusters; sort by score.
- Outcome: `keywords_scored.csv` with rankable candidates.

## 7) Pull real signals (Next)
- Value: Decide based on facts: actual demand and current performance.
- How next:
  - GSC API: Queries by page and site; impressions, clicks, CTR, position → feeds demand and striking-distance picks.
  - GA4 API: Organic landing pages/sessions → validates traffic and outcomes.
  - Trends: Interest over time for head/cluster reps → seasonality and momentum.
- Outcome: Enriched keyword rows with volume-ish signals, trend deltas, page mappings.

## 8) Competitor SERP profiling (Next)
- Value: Confirms intent and outlines coverage you must match/beat.
- How next: Use a SERP API to fetch top results; fetch HTML of top competitors; extract H2/H3 and schema; derive consensus topics and gaps.
- Outcome: `serp.json`, `competitors/*.json` with headings/sections; cluster-level content blueprint.

## 9) Map to this page (Now → Next)
- Value: Turn clusters into an actionable plan for this exact page.
- How:
  - Now: Heuristic mapping — select a representative keyword per cluster that matches transactional/commercial intent and local modifier.
  - Next: Re-rank with GSC/GA4/Trends; align to SERP blueprint; finalize target set.
- Outcome: `reports/ai/keywords/seo/mapping.json` (target set and supporting variants per section).

## 10) Create/update brief (Next)
- Value: Give the editor a clear, data-backed outline that’s on strategy.
- How: Generate a brief with target keywords, meta suggestions, H2/H3 outline, FAQs (from consensus), internal links.
- Outcome: `docs/seo/briefs/seo-service-brief.md` (or an AI draft in `content/ai-drafts/service-clusters/`).

## Try it now (Baseline)
1. Open the Streamlit app (SEO Lab) → Keyword Research Workbench.
2. Paste seeds from `data/keywords/services/seo.seeds.json` and modifiers.
3. Run. Download `keywords_scored.csv`.
4. Review clusters, pick tentative targets for /services/seo.

## Notes
- Provenance: Keep all raw pulls and derived artifacts per run folder.
- Locality: Always include locality modifiers for this page (Surrey/Camberley/Mytchett).
- Guardrails: Ensure meta and headings comply with our SEO rules before publish.
