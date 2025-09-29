# AI Tools Blueprint — Ellie Edwards Template (Next.js 14 + TinaCMS + Agentic RAG)

This version aligns the tool ideas to the current codebase so they can be shipped as reusable add‑ons for any customer site built from this template.

## Stack snapshot (from repo)
- Next.js 14 App Router, Tailwind, TypeScript
- TinaCMS v2 with custom field `AiSuggestHeroDescription` and admin routed via `/admin`
- Content as Markdown/JSON under `content/` (services, blog, case studies, testimonials, settings)
- AI route: `POST /api/tina/ai-generate` (OpenAI Chat Completions, JSON outputs)
- Local search route: `GET /api/search` builds an index from Markdown
- Data: Prisma + SQLite (`Lead`, `Subscriber`) and Supabase client available for extension
- Deployment: Vercel; build script runs Tina → Next

Shared brand inputs (reused everywhere)
- Product/idea summary; audience; pains/objectives; outcomes; objections; tone; primary goal
- Centralized in `content/settings/ai.json` (system instructions, brand voice, model, siteUrl)

---

## Agentic RAG fit for this template
- Knowledge sources: files in `content/**` (+ optional URLs/docs later)
- Indexing: embed and chunk Markdown at build-time into a lightweight store (JSON by default; optional Supabase pgvector)
- Retrieval tool: given a query/topic, return top‑k chunks with source paths for grounding and citations
- Agent loop: plan → retrieve → draft → self‑check (tone/schema) → return JSON copy blocks; never hallucinate beyond retrieved or provided context
- Safe by default: show citations; constrain output fields to Tina schemas (already used in `ai-generate`)

Minimum infra to ship now
- Script: `scripts/build-embeddings.js` to create `public/.rag/index.json` from `content/**`
- Server helpers: `src/lib/rag.ts` (embed, search cosine, slice, cite)
- Config: use `OPENAI_API_KEY`, `OPENAI_MODEL` (or model in `ai.json`); optional `SUPABASE_URL`/`SUPABASE_ANON_KEY` for pgvector

---

## Phase 1 — Small/Medium add‑ons (RAG‑grounded)

1) Tina Content‑Aware Suggestions 2.0
- One‑liner: Upgrade current AI suggester to retrieve related site content and return grounded suggestions with citations.
- Fits: Extends `tina/fields/AiSuggestHeroDescription.tsx` and generalizes to an `AiAssistantField` usable across collections.
- Outputs: Field‑specific JSON (e.g., heroDescription, FAQs, bullets) + `sources` array.
- MVP:
  - Add retrieval in `POST /api/tina/ai-generate` (inject top‑k chunks from `content/**` by collection/topic)
  - UI: preview + “Apply” with citation tooltip; safe overwrite notice (already present)
  - Local dev uses the real route with debug/report toggles
- Next: per‑field presets (tone/length), multi‑variant, bulk update with review queue.

  Spec (refined)
  - Modes
    - Create: draft when the field/page is empty, using Business Info + chosen context packs.
    - Improve: keep meaning, tighten clarity; respect length/keywords; show diff.
    - Variants(5) + Favourite: generate 5 options with a selected “favourite” and 1‑line rationale.
  - Utilities: Condense, Expand, Tone‑shift (same engine, different constraints).
  - FAQ Builder: generate 8–12 grounded Q/A and optional FAQPage JSON‑LD for pages that support FAQs.
  - Context sources (ranked, opt‑in)
    - Always: Business Info (`content/settings/business.json`) and AI settings (`content/settings/ai.json`).
    - Retrieval packs: related Services, Case Studies, Testimonials, Blog, SEO keywords.
    - On‑demand: Topic (when empty), Additional Brief, Paste‑in context (not persisted).
  - API contract (extend existing route)
    - Input: `{ collection, fieldName, docPath?, mode: 'create'|'improve'|'variants', variants?: number, topic?, brief?, constraints?: { maxChars?, tone?, length?, include?: string[], avoid?: string[] }, packs?: { services?: boolean, caseStudies?: boolean, testimonials?: boolean, blog?: boolean, seo?: boolean }, agentic?: true }`
    - Output: `{ value: string, variants?: { value: string, rationale?: string }[], favoriteIndex?: number, sources: { path: string, title?: string, snippet?: string }[], diagnostics?: { groundingScore: number, readingLevel?: number } }`
  - Agent loop
    - Plan → Retrieve (top‑k with citations) → Write (schema‑valid) → Critique (tone/constraints/grounding) → Merge (final or variants+favourite).
  - Specialist agents (shared engine, per content type)
    - Services agent: benefits, features, process, FAQs, CTA. Context: Business Info + related services and case studies + testimonials.
    - Case Study agent: challenge → solution → outcomes (no fabricated brands/metrics). Context: Business Info + case studies + services.
    - Testimonial agent: concise quote + role/company + rating; polish tone, no fiction. Context: Business Info + testimonials.
    - Blog agent: SEO title/excerpt/reading time/body outline; respects keywords and voice. Context: Business Info + blog + SEO keywords.
    - SEO agent (cross‑cutting): meta title/description, keywords, FAQ/Org JSON‑LD. Context: Business Info + selected page data.
    - Invocation: same API route (`/api/tina/ai-generate`); `collection` and optional `fieldName` select the agent profile; toggled packs refine retrieval.
  - Retrieval policy
    - Chunk Markdown at ~800 chars with ~120 overlap; include front‑matter in text.
    - Rank by cosine with boosts for same collection/serviceId/tag matches.
    - If low confidence, lean on Business Info + user brief; never fabricate.
  - UI/UX (Tina field)
    - Tabs: Create | Improve | 5 Variants; Toggles: Services/CaseStudies/Testimonials/Blog/SEO.
    - Inputs: Topic, Additional brief, Constraints (length/tone/keywords).
    - Actions: Generate/Regenerate/Apply/Copy; citations as compact footnotes with hover preview.
    - Safety: overwrite warning; Improve shows diff preview.
  - Defaults
    - Temperature: 0.6 (create/variants), 0.4 (improve). Variants default: 5.
    - Length presets: short 140–220, medium 220–380, long 380–600 chars. Reading level target: 7–9.
  - Edge cases & guardrails
    - If Business Info missing → prompt to fill; allow brief‑only fallback.
    - Empty page → rely on Topic + Business Info; skip retrieval if no relevant content.
    - Enforce Tina schema keys only; UK English (or brandVoice region); no fabricated brands/metrics.
  - Implementation delta
    - Extend `/api/tina/ai-generate` to accept the new fields; add `agentic:true` path.
    - Add `src/lib/rag.ts` and embeddings index; wire sources into response.
  - Promote a reusable `AiAssistantField` with the UI above; tests should hit the real route or use fixtures.
  - Add a small server util to emit FAQPage JSON‑LD from `faqs[]`; expose copy‑to‑clipboard in admin.

---

## Experiment — SEO Settings Explainer Blog Series (Agentic RAG pilot)

Goal
- Prove the end-to-end agentic RAG workflow by publishing a focused blog series that explains how our site’s SEO and AI settings work and why they matter for small businesses.
- Use only local, truthful sources (settings + existing content) to minimize hallucinations and keep outputs on-brand.

Hypothesis
- Teaching content about “how we set up SEO + brand voice” will: (1) rank for long-tail queries, (2) convert better by building trust, and (3) create reusable prompts/patterns for future grounded content.

Primary sources (ranked)
- content/settings/seo.json (keyword policy, length targets, locale/region)
- content/settings/ai.json (systemInstructions, brandVoice, model)
- content/settings/business.json (audience, positioning, services overview)
- content/services/** (to anchor internal links and examples)
- content/blog/** and content/case-studies/** (for related references)

Agent profile: Blog (SEO Settings Series)
- Input contract (to our existing `POST /api/tina/ai-generate` route):
  - collection: "blogPost"
  - agentic: true
  - topic: Post title (from the outline below)
  - brief: Series-specific brief (template below)
  - keywords: pull from seo.json includeAlways/includePreferred + post-specific terms
  - mustInclude: internal links to at least 2 services and 1 related post, where relevant
  - context: pass current settings objects and any page-specific notes
- Retrieval policy
  - Always include seo.json, ai.json, business.json in the query context
  - Boost matches for services and prior blogs that overlap with the topic (e.g., “keyword policy”, “reading level”)
  - Top-k=4 citations, truncate snippets to ~800–1,000 chars total
- Output contract: match `blogPost` schema (already defined in the route), with body in Markdown, UK English, and explicit citations [1], [2]… only when quoting facts.

Series outline (12–13 posts)
1) Why your SEO settings matter on small business sites (the “single source of truth” approach)
2) System Instructions in ai.json: how brand voice shapes every page
3) Keyword policy 1 — includeAlways vs includePreferred vs avoid (and when to use each)
4) Keyword policy 2 — choosing realistic phrases for your niche (and measuring success)
5) Length targets and reading level: clear, scannable copy that converts
6) Meta basics: titles, descriptions, canonicals, and noIndex flags that won’t bite you later
7) Internal linking done right: services, case studies, and pillar pages
8) Local/region signals: UK English, locale, and how that affects tone & SEO
9) FAQs and structured data: turning common questions into SEO assets
10) Content ops: briefs, variants, and review workflows using Tina + our AI route
11) Measuring impact: GSC + GA signals to watch for this series
12) Playbook: from settings → draft → critique → publish (our exact steps)
13) Optional case study: what changed after 4–6 weeks (traffic, rankings, conversions)

Brief template (use per post)
- Audience: ambitious UK small businesses evaluating marketing support
- Purpose: explain X setting plainly, show why it matters, and how we apply it on this site
- Must include: 2 internal links to relevant services, 1 link to a related blog/case study if available
- Tone: friendly, confident, practical; avoid jargon; no fabricated stats
- Constraints: respect seo.json length targets; keep reading level Years 7–9; UK English

QA pass (lightweight)
- Validate presence of includeAlways keywords at least once (naturally)
- Confirm body length within min–max if provided; excerpt length where applicable
- Check that at least 2 internal links to services exist, and that URLs are valid
- Reject fabricated brand names or metrics; prefer generic examples

Workflow
- For each post in the outline:
  1) Create a short brief using the template above
  2) Call `/api/tina/ai-generate?debug=1&report=1` with collection=blogPost, agentic=true, topic, brief, keywords
  3) Review citations in the report (reports/ai) and the Markdown draft
  4) Minor edit for style; ensure internal links point to existing slugs
  5) Save as `content/blog/<slug>.md` (front matter via Tina or file)
  6) Publish and request indexing; monitor in GSC

Acceptance criteria
- Schema-valid JSON output; Markdown body only (no HTML)
- Citations refer only to our repository content/settings and content pages
- Reading level ~7–9; UK English; avoids banned phrases from seo.json
- At least 2 internal service links + 1 related content link when relevant
- Reports saved per run; zero OpenAI parse errors across the series

Risks & mitigations
- Hallucination of facts → Mitigate by grounding on settings and existing posts; reject unverifiable claims
- Off-voice tone → Keep ai.json brandVoice strict; add QA check for tone phrases
- Thin content → Use length targets + headings; add examples from services/case studies

Measurement
- Baseline: current impressions/clicks for “seo settings” and related long-tail queries
- Success: +X% impressions and clicks after 4–6 weeks; time-on-page > site median; internal link CTR to services pages

---

## Implementation notes (fits current repo)

RAG indexing
- Chunk size ~700–1000 chars with 100–150 overlap; include front‑matter fields in the text
- Store: `public/.rag/index.json` with { id, path, title, text, embedding }
- Optional: Supabase pgvector for >10k chunks; mirror the same schema

Server utilities
- `src/lib/rag.ts`
  - `embed(text): number[]` (OpenAI embeddings)
  - `search(query, k): { path, title, text, score }[]`
  - `cite(paths[]): string` (compact source list for UI)

Agent loop
- Tools: `retrieve`, `write_json_to_schema`, `tone_check`, `guard_hallucinations`
- Orchestrate inside `POST /api/tina/ai-generate` behind a flag `agentic:true` to keep backwards‑compat

TinaCMS wiring
- Reuse `content/settings/ai.json` to feed system, brandVoice, model (already read by `ai-generate`)
- Promote `AiAssistantField` for collections: service, caseStudy, blogPost, about
- Keep “Apply” preview flow and overwrite warning (existing UX)

Telemetry & success
- Log prompts (hashed), retrieval doc IDs, and acceptance events (applied in Tina) to a flat file or DB
- KPIs per add‑on: time‑to‑first‑draft, accept rate, AI answer CTR, quiz completion → lead

Security & privacy
- Never fetch live site; retrieval restricted to local `content/**` unless explicit URLs are added
- Redact emails/phones in training logs; respect `noIndex` in front‑matter by excluding from RAG

---

## Quick deliverable checklists

Tina Suggestions 2.0
- [ ] Build embeddings index script; add to `build:vercel` if desired
- [ ] Implement `src/lib/rag.ts`; update `ai-generate` to accept `agentic` and inject top‑k
- [ ] Add citations UI in Tina preview
- [ ] Generate `faqs[]` via `ai-generate` with retrieval (FAQ Builder mode)
- [ ] Utility to emit FAQPage JSON‑LD; copy‑button in admin

Website Copilot
- [ ] Admin tool to generate a full `service` draft using RAG
- [ ] Save as new MD file or draft entry; allow per‑section regenerate

AI Answers on Search
- [ ] New route `POST /api/search/answer` using the same index
- [ ] Frontend chip to show/hide the AI answer with citations

Lead‑Gen Quiz
- [ ] `/api/quiz` minimal flow; write to `Lead`; email via `resend`
- [ ] Thank‑you routing logic; optional Supabase sync

---

Implementation priorities (phased)
- Phase 1: Tina Suggestions 2.0 (incl. FAQ Builder); Website Copilot; AI Answers; Quiz Funnel
- Phase 2: Engagement Hub; Content Packs; Conversion Ideas; Persona Builder
- Phase 3: Journeys and Competitor Pulse (optional)
---

Implementation priorities (focused)
- Phase 1: Tina Suggestions 2.0 (incl. FAQ Builder)

Signals to reuse across tools
- Brand inputs from `ai.json`; site content; quiz outcomes; chat transcripts; simple analytics outputs already in repo (PageSpeed scripts)

Shipping model
- Each add‑on is a tiny admin tool or API route with minimal UI; copy‑first outputs, citations, and safe apply

—
Updated August 28, 2025.
