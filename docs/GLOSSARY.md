# AI, RAG, and Agents — Super Glossary for This Project

A practical, everything-you-need reference. Each entry includes: what it means, why it matters, where it shows up in this repo, and a quick example.

Use this as the master index. Later, we can split each term into its own doc and link back here.

---

## Related library pages (deep dives)
- Core retrieval & ranking: [RAG](./library/rag.md) · [Local Retrieval](./library/local-retrieval.md) · [Search Index](./library/search-index.md) · [TF‑IDF](./library/tf-idf.md) · [Embeddings](./library/embeddings.md) · [Cosine Similarity](./library/cosine-similarity.md) · [Top‑k](./library/top-k.md) · [Citations](./library/citations.md) · [Chunking](./library/chunking.md) · [Hybrid Search](./library/hybrid-search.md) · [Reranking](./library/reranking.md) · [BM25](./library/bm25.md)
- Agents & orchestration: [Orchestrator/Agents/Tools](./library/orchestrator-agent-tools.md) · [System Instructions](./library/system-instructions.md) · [JSON Schema](./library/json-schema.md)
- Brand & SEO: [Persona & Voice](./library/persona-voice.md) · [Policies](./library/policies.md) · [settingsOverride](./library/settings-override.md)
- Observability & reliability: [Timeline & Reports](./library/timeline-reports.md) · [Reliability & Safety](./library/reliability-safety.md)
- Advanced tuning: [Tokenization/Normalization/Stopwords](./library/tokenization-normalization-stopwords.md) · [Context Window & Truncation](./library/context-window-truncation.md) · [Temperature & Top‑p](./library/temperature-top-p.md) · [Determinism & Seeds](./library/determinism-seeds.md) · [Query Expansion](./library/query-expansion.md) · [Section‑Aware Boosts](./library/section-aware-boosts.md) · [Deduplication](./library/deduplication.md) · [Score Normalization & Blending](./library/score-normalization-blending.md) · [Costs, Rate Limits & Backoff](./library/costs-rate-limits-backoff.md) · [HTML Export of Reports](./library/html-export-of-reports.md)

---

## Table of contents
- Core concepts
  - Retrieval‑Augmented Generation (RAG)
  - Local retrieval
  - Index (search index)
  - Corpus
  - Document vs chunk
  - Tokenization / normalization
  - Stopwords / stemming / lemmatization
  - Sparse vs dense vectors
  - Vector space / vectorization
  - TF‑IDF
  - BM25 (alternative to TF‑IDF)
  - Embeddings (dense vectors)
  - Cosine similarity vs dot product
  - Score / top‑k / thresholding
  - Citations (grounding/attribution)
  - Hallucination
  - Query expansion
  - Prompt stuffing / truncation
  - Context strategy (how much to inject)
  - Reranking
  - Hybrid search (sparse + dense)
- Agentic systems
  - Agent
  - Orchestrator
  - Domain profile / Section profile
  - Tools
  - Planner / Executor
  - Reflection / Self‑critique
  - Guardrails / Validators
  - QA loop (enforcement)
  - Determinism / seeds
- Prompts and models
  - System instructions (system prompt)
  - User/Assistant messages
  - JSON schema outputs / schema gate
  - Temperature / top_p
  - Context window
  - Tokens (prompt vs completion)
  - Streaming vs non‑streaming
  - Function/Tool calling
- Project specifics
  - Settings: ai.json, SEO, Business
  - Persona & voice
  - Policies (includeAlways / avoid / lengthTargets)
  - API route `/api/tina/ai-generate`
  - Agentic flag and `settingsOverride`
  - Retrieval utilities and index builder
  - Reports (per‑run and group)
  - TinaCMS integration
- Observability & performance
  - Timeline events
  - Latency & throughput
  - Cold start / build‑time vs runtime
  - Costs & rate limiting (429) / backoff
- Reliability & safety
  - Failure modes
  - Secrets & configuration
  - PII and content scope
- Roadmap terms
  - Section‑aware boosts
  - Deduplication
  - Rerankers
  - Score normalization / blending
  - HTML export of reports

---

## Core concepts

### Retrieval‑Augmented Generation (RAG)
- What: Two‑step flow—(1) retrieve relevant context from your own content, (2) generate text grounded in that context.
- Why: Reduces hallucination and keeps content on‑brand and on‑topic.
- Where here: Retrieval is local over `content/**` and `content/settings/**`; generation uses OpenAI to produce fields like `heroDescription`.
- Example:
  - Report timeline: `retrieve.done` → `openai.request` → `openai.response`.
  - Files: `src/lib/rag.ts` (retrieval), `src/app/api/tina/ai-generate/route.ts` (RAG orchestration), `public/.rag/index.json` (index).

### Local retrieval
- What: Searching inside your repo—no external search engine.
- Why: Privacy, speed, predictable results.
- Where here: Reads `public/.rag/index.json` at runtime.
- Example: Report shows `retrieval.q` and `retrieval.hits` with file paths like `content/services/seo.md`.

### Corpus
- What: The collection of documents you search over.
- Where here: Markdown under `content/**` and settings under `content/settings/**`.

### Document vs chunk
- Document: A file (e.g., `content/blog/marketing-strategy-small-business-guide.md`).
- Chunk: A slice of a document used for indexing. Multiple chunks may map to the same path.
- Why: Chunking improves recall for long docs. Duplicate paths in hits often indicate different chunks.

### Tokenization / normalization
- What: Breaking text into tokens and standardizing (lowercasing, stripping punctuation).
- Why: Consistent vectors; better matching.
- Where here: Applied during index build.

### Stopwords / stemming / lemmatization
- Stopwords: Common words (the, a, of) often down‑weighted or removed.
- Stemming/Lemmatization: Reduce words to roots (markets → market).
- Where here: Basic normalization; stemming may be minimal depending on the builder.

### Sparse vs dense vectors
- Sparse: Mostly zeros (e.g., TF‑IDF across a vocabulary). Good for keyword matching.
- Dense: Short continuous vectors (e.g., 1536‑dim embeddings) capturing semantics.
- Where here: Current index is sparse (TF‑IDF). Dense is a planned upgrade.

### Vector space / vectorization
- What: Numerical representation of text to enable mathematical similarity.
- Where here: Queries and docs become vectors; we score them to rank relevance.

### TF‑IDF (Term Frequency × Inverse Document Frequency)
- What: Weighs words important to a document but rare globally.
- Why: Classic and effective for keyword relevance.
- Where here: Used in `public/.rag/index.json` and matching in `src/lib/rag.ts`.
- Example: Query “about hero” becomes a TF‑IDF vector; we compute similarity to candidate docs.

### BM25 (alternative to TF‑IDF)
- What: A stronger sparse formula than plain TF‑IDF.
- Why: Better ranking in many cases.
- Where here: Not yet implemented; a potential improvement.

### Embeddings (dense vectors)
- What: Model‑generated vectors that encode meaning (semantics).
- Why: Better synonym/semantic matching; fewer missed matches.
- Where here: Planned (OpenAI embeddings) with cosine similarity.

### Cosine similarity vs dot product
- Cosine: Measures angle; independent of vector length. Standard for both TF‑IDF and embeddings.
- Dot product: Magnitude‑sensitive; can be used with normalized vectors.
- Where here: Cosine is used. Shown as `retrieval.hits[].score`.

### Score / top‑k / thresholding
- Score: Similarity value for ranking (e.g., 0.21).
- Top‑k: Keep top N results. Thresholding: discard scores below a cutoff.
- Where here: `src/lib/rag.ts` returns top hits injected into prompts.

### Citations (grounding/attribution)
- What: Retrieved sources added to prompts so the model writes grounded text.
- Why: Traceability and reduced hallucination.
- Where here: `formatCitations()` in `src/lib/rag.ts`.

### Hallucination
- What: Model invents facts. RAG reduces this by supplying sources.
- Where here: About hero lines align with your topics; fewer fabrications.

### Query expansion
- What: Enrich query with synonyms/context to improve recall.
- Where here: Future: enrich “about hero” with brand, persona, locale.

### Prompt stuffing / truncation
- Stuffing: Too many citations/context.
- Truncation: Model drops tail tokens when over limit.
- Where here: Keep citations concise.

### Context strategy (how much to inject)
- What: Choosing number/size of citations.
- Where here: small top‑k to keep prompts lean and focused.

### Reranking
- What: Second pass to reorder hits (possibly with a model).
- Why: Improve precision.
- Where here: Planned.

### Hybrid search (sparse + dense)
- What: Combine TF‑IDF/BM25 with embeddings and blend scores.
- Why: Best of both worlds.
- Where here: Planned.

---

## Agentic systems

### Agent
- What: A process that uses tools (retrieval, generation) to satisfy a goal.
- Where here: The API route functions as an agent per request.

### Orchestrator
- What: Coordinates steps/tools and applies profiles.
- Where here: `src/app/api/tina/ai-generate/route.ts`; profiles described in `docs/agents/`.

### Domain profile / Section profile
- Domain profile: About/Blog/Service task patterns.
- Section profile: Specific field schema (e.g., About→Hero schema).
- Where here: Prompts select schema/constraints by `collection` + `section`.

### Tools
- What: Capabilities the agent can call.
- Where here: Retrieval (`src/lib/rag.ts`), OpenAI generation, report writer.

### Planner / Executor
- What: Plan steps then execute.
- Where here: Lightweight; conditionals around agentic and schema selection.

### Reflection / Self‑critique
- What: Review and improve output.
- Where here: Documented in `docs/agents/` (readability/voice guards) with limited runtime enforcement today.

### Guardrails / Validators
- What: Rules outputs must obey.
- Where here: JSON schema (require `heroDescription`), SEO policies (include/avoid/length).

### QA loop (enforcement)
- What: Retry or adjust until checks pass.
- Where here: Planned; reports capture data to support it.

### Determinism / seeds
- What: Reduce randomness via temperature and seeds.
- Where here: Temperature kept conservative; seed control depends on provider support.

---

## Prompts and models

### System instructions (system prompt)
- What: Highest priority guidance (rules, brand, persona, locale).
- Where here: `content/settings/ai.json` (mandatory; no fallback).

### User/Assistant messages
- What: Task description and model replies.
- Where here: Built by the route with citations and constraints.

### JSON schema outputs / schema gate
- What: Ask for strict JSON with specific keys.
- Where here: About→Hero requires `{ heroDescription: string }`; uses `response_format: json_object`.

### Temperature / top_p
- What: Controls randomness. Lower temperature = more consistent.
- Where here: Set in OpenAI call (defaults conservative).

### Context window
- What: Max tokens the model can consider (prompt + citations + output).
- Where here: Keep citations brief to avoid truncation.

### Tokens (prompt vs completion)
- What: Billing and limits; prompt tokens in, completion tokens out.
- Where here: Not logged yet; add to reports if needed.

### Streaming vs non‑streaming
- Streaming: Partial tokens as they’re generated.
- Non‑streaming: Wait for full JSON. We use non‑streaming for schema safety.

### Function/Tool calling
- What: Models can emit tool calls for code to execute.
- Where here: Not used; orchestration is code‑driven.

---

## Project specifics

### Settings: ai.json, SEO, Business
- `content/settings/ai.json`: system instructions, brand voice, persona, locale.
- `content/settings/seo.json` (optional): keyword policies, length targets.
- `content/settings/business.json` (optional): business facts.
- Missing `ai.json` → hard error by design.

### Persona & voice
- What: First‑person singular (“I”) vs plural (“we”), tone, style.
- Where here: Define in `ai.json` to avoid persona drift.
- Example: Reports showed both “we” and “I specialise…”. Pick one and enforce.

### Policies (includeAlways / avoid / lengthTargets)
- What: SEO/brand constraints for wording and length.
- Where here: In SEO settings or overrides; enforced via prompts.
- Example: includeAlways “small business marketing”, “lead generation”; avoid “synergy”.

### API route `/api/tina/ai-generate`
- What: Main generation endpoint.
- Where here: `src/app/api/tina/ai-generate/route.ts`.
- Behavior: Loads settings, retrieves, calls OpenAI, returns JSON, writes reports.

### Agentic flag and `settingsOverride`
- `agentic` (default true) controls retrieval pipeline.
- `settingsOverride` lets tests tweak brand/SEO per request.

### Retrieval utilities and index builder
- Runtime: `src/lib/rag.ts` (search + citations).
- Build‑time: `scripts/build-embeddings.cjs` → `public/.rag/index.json`.

### Reports (per‑run and group)
- Per‑run: `reports/ai/<timestamp>_<profile>.{json,md}` with `timeline`, `retrieval`, `settings`, `result`.
- Group: `reports/ai/groups/<timestamp>_about_hero_scenarios.{json,md}` with baseline and comparisons.

### TinaCMS integration
- Buttons in the CMS call the API to auto‑suggest fields.
- About hero is wired to `/api/tina/ai-generate` with `agentic=true` and optional debug/report.

---

## Observability & performance

### Timeline events
- What: Key steps with millisecond offsets for each run.
- Where here: `start`, `retrieve.done`, `openai.request`, `openai.response`.

### Latency & throughput
- Retrieval: ~0–2 ms (local); OpenAI dominates total time.
- Throughput: Limited by model latency and rate limits.

### Cold start / build‑time vs runtime
- Build‑time: Create index once.
- Runtime: Use index many times per request.

### Costs & rate limiting (429) / backoff
- Cost: Token‑based; depends on prompt size and output length.
- Rate limits: Handle 429 with short exponential backoff.

---

## Reliability & safety

### Failure modes
- Missing settings (`ai.json`), network timeouts, schema mismatch.
- Handling: Strict error if `ai.json` missing; log/report other errors.

### Secrets & configuration
- `OPENAI_API_KEY` required, `OPENAI_MODEL` optional.
- Never commit secrets.

### PII and content scope
- Retrieval confined to your repo; no external data unless added.

---

## Roadmap terms

### Section‑aware boosts
- Prefer content for the requested section (e.g., About) when ranking.

### Deduplication
- Collapse multiple hits from the same file/chunk to avoid duplicate citations.

### Rerankers
- Small model or heuristic reorder of candidates to improve precision.

### Score normalization / blending
- Normalize across sources; blend sparse and dense scores in hybrid search.

### HTML export of reports
- Convert Markdown reports to HTML for sharing/annotation.

---

## Worked examples from your recent reports

- Retrieval query and hits
  - Example: `retrieval.q = "Keep it punchy. about hero"`
  - Hits: `content/services/email-marketing.md (0.205)`, `content/settings/ai.json (0.178)`

- Policy overrides in action
  - includeAlways: Output contains “small business marketing” and “lead generation”.
  - avoid: Output omits banned phrases (“game-changer”, “synergy”).
  - lengthTargets: Output word count falls within `minWords`/`maxWords`.

- Persona drift
  - Observation: Some outputs use “we”, others “I specialise…”.
  - Fix: Set persona in `ai.json` (e.g., firstPersonSingular) and enforce in prompts.

- Settings appearing as sources
  - Observation: `content/settings/ai.json` ranks highly in hits.
  - Decision: Down‑weight or exclude settings from retrieval citations; keep as guidance.

---

## Quick reference: File map

- API route (orchestrator): `src/app/api/tina/ai-generate/route.ts`
- Retrieval utils: `src/lib/rag.ts`
- Index file: `public/.rag/index.json`
- Index builder: `scripts/build-embeddings.cjs`
- Scenario runner: `scripts/test-about-hero-scenarios.js`
- Reports (per‑run): `reports/ai/*.json` and `*.md`
- Reports (group): `reports/ai/groups/*.json` and `*.md`
- Settings: `content/settings/ai.json`, `content/settings/seo.json`, `content/settings/business.json`
- Content: `content/**` (blog, services, case studies, testimonials, about, etc.)

---

## How to use this glossary

- Browse to learn concepts quickly.
- Search for a term and jump to “Where here” to see exactly where it applies in the repo.
- For deeper dives, we’ll split each term into `docs/library/<term>.md` and link back here.

---

## Next step (optional)

- I can scaffold `docs/library/` with per‑term files and add backlinks from this glossary. Let me know and I’ll generate the initial set (with stubs) and wire cross‑links.
