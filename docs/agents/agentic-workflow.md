# Agentic Workflow — How It All Comes Together

Agentic workflow is the operating system for your AI features. It’s how goals are turned into steps, steps into tool calls, and tool outputs into reliable, on‑brand content.

This document explains what an agentic workflow is, why it matters, how it’s realized in this codebase, and the trade‑offs between sequential and parallel execution (speed, compute, cost, and quality). It’s written to be practical and directly mappable to files and flows in this repo.

---

## What “agentic” means

- Agentic systems actively decide how to use tools to accomplish a goal.
- Instead of one prompt in, one answer out, an agent:
  - Interprets the task
  - Uses tools (retrieval, validators, generators)
  - Checks constraints (voice, keywords, length)
  - Iterates until success criteria are met

In this project, the orchestrator in `src/app/api/tina/ai-generate/route.ts` coordinates the steps; retrieval happens via `src/lib/rag.ts`, and OpenAI performs generation. Reports under `reports/ai/` make each run auditable.

---

## Why agentic matters for this site

- Brand alignment: System instructions from `content/settings/ai.json` establish persona and voice. Agentic flow ensures every run uses them.
- Grounding: Retrieval pulls relevant content and settings so outputs reflect your actual services and style.
- Policy control: Include/avoid keywords and length targets (SEO) are consistently enforced.
- Observability: Timelines, hits, and settings snapshots make behavior explainable and debuggable.

The result is content that’s coherent, compliant, and traceable—at scale.

---

## The pieces and how they fit

- Orchestrator (route): Decides what to do, in what order. Applies the “profile” (About/Blog/Service) and schema (e.g., About → Hero requires `{ heroDescription: string }`).
- Tools:
  - Retrieval: loads the local index `public/.rag/index.json` and returns top‑k hits.
  - Generator: calls OpenAI with system instructions + citations + constraints.
  - Report writer: saves timeline, hits, settings, and output.
- Policies: Brand voice, persona, SEO keyword policy, and length targets.
- Observability: Per‑run and group reports (Markdown + JSON) for audit and analysis.

---

## A canonical run (sequential example)

1) Load settings (ai/seo/business) and any `settingsOverride`.
2) Build a small retrieval query and search the local index.
3) Format citations and inject them into the prompt with system instructions.
4) Call OpenAI with `response_format: json_object` and the section’s schema.
5) Validate keys/length/keywords; if needed, revise and retry (lightweight today; extensible).
6) Save a report with timeline + hits + settings + preview.

In reports you’ll see: `start → retrieve.done → openai.request → openai.response`.

---

## Sequential vs parallel agents

Two execution styles—use one or both depending on the goal.

### Sequential (pipeline)
- Steps happen one after another. Each step can refine or validate the previous.
- Typical flow: retrieve → generate → QA (readability, voice guard) → finalize.
- Pros:
  - Lower peak concurrency and cost
  - Deterministic ordering; easier to reason about
  - Each step can adapt based on prior results
- Cons:
  - Slower wall‑clock time (latency compounds)
  - If a late step fails, earlier work may be wasted

### Parallel (fan‑out/fan‑in)
- Launch multiple agents at once, then combine results.
- Examples:
  - Multiple stylistic variants in parallel; pick the best
  - Parallel QA checks (readability, keyword density, safety) run at the same time
  - Multi‑tool retrieval (sparse + dense) and blend scores
- Pros:
  - Lower time‑to‑first‑useful result (latency amortized)
  - Higher exploration breadth (variants)
- Cons:
  - Higher instantaneous compute and API usage (cost)
  - Coordination complexity (merging, deduping, ranking)
  - Rate‑limit pressure; needs backoff/pooling

### Hybrid (practical default)
- Run a short sequential pipeline, with selective parallel branches:
  - Retrieve once → generate 2–3 variants in parallel → run fast QA checks in parallel → pick the winner → finalize.
- This balances speed and quality while controlling cost.

---

## Impact on compute, speed, and cost

- Retrieval (local): ~1–3 ms per query; negligible compute. Safe to run often.
- Generation (OpenAI): dominates latency (hundreds to a few thousand ms). Each parallel variant adds another call.
- QA checks:
  - Heuristic checks (word count, keyword present) are near‑free.
  - Model‑based QA (readability rewriter) adds more calls and cost.
- Concurrency:
  - Parallel agents multiply peak requests to the provider; consider rate limits and backoff.
  - Use a small concurrency pool (e.g., 2–4) to keep throughput high without throttling.

Rules of thumb:
- Need fastest single result? Parallelize a couple of variants; stop early when a winner passes QA.
- Need strict quality? Do sequential QA loops; cache retrieval across attempts.
- On a budget? Keep variants low (≤2), favor heuristic QA, and reuse context.

---

## Patterns you can use here

- Variant fan‑out: Generate N alternatives with different tones/lengths simultaneously; pick the best based on policy scores.
- Parallel QA: Run keyword/avoid/length/readability checks at the same time; aggregate pass/fail.
- Hybrid retrieval: TF‑IDF + embeddings in parallel; normalize and blend scores; dedupe by path.
- Map‑reduce editing: Break a long section into chunks, process in parallel, then stitch and harmonize.

All of these can be added to the existing orchestrator without changing Tina or the API contract.

---

## Practical considerations (engineering)

- Concurrency control:
  - Node.js: use `Promise.allSettled` with a semaphore to cap concurrent OpenAI calls.
  - Backoff strategy: exponential + jitter when 429s occur.
- Caching:
  - Cache retrieval results for a given query/settings; share across variants and QA.
- Determinism:
  - Keep temperature low for consistency; if provider supports `seed`, set it during tests.
- Observability:
  - Tag each parallel branch with an ID; include per‑branch timings and outcomes in the report.
- Failure handling:
  - If a branch fails, continue with remaining; degrade gracefully to best available result.

---

## Example: About → Hero with hybrid execution

Baseline (current): sequential retrieve → generate → report.

Upgrade (hybrid):
1) Retrieve once; prepare citations.
2) Fan‑out 2 variants in parallel:
   - Variant A: friendly/practical tone; standard length
   - Variant B: direct/plain‑spoken tone; tighter length
3) Parallel QA checks: keyword policy, avoid list, length bounds, simple readability score.
4) Choose the variant with highest composite score; if tie, prefer faster completion or persona match.
5) Save the winning output with QA diagnostics in the report.

Expected effect:
- Latency: +0–20% vs single‑variant (two calls in parallel, finish when both return)
- Quality: usually higher; less risk of a single “flat” output
- Cost: ~2× model calls for the generation step; QA mostly heuristic

---

## When to choose sequential, parallel, or hybrid

- Sequential pipeline
  - When each step depends on the previous (e.g., retrieve → write → edit)
  - When strong determinism and minimal cost matter
- Parallel fan‑out
  - When you need a quick, good result and can afford 2–3 simultaneous attempts
  - When exploration (tone/angle) increases success odds
- Hybrid
  - Default for UX responsiveness with improved quality
  - Combine small parallelism with light QA for best latency/quality trade‑off

---

## Roadmap in this repo

- Add an orchestrator “mode” with optional:
  - `variants`: number and styles to fan‑out
  - `qa`: list of QA checks (heuristic and model‑based)
  - `packs`: retrieval strategy (sparse/dense/hybrid)
- Implement deduped citations, section‑aware boosts, and optional embeddings
- Record per‑branch metrics in reports; add a “winner rationale” section
- Provide Tina toggles for Variants and QA; link to the last report

---

## Pitfalls and how to avoid them

- Prompt bloat: too many citations or variants can hurt latency. Keep k small and snippets tight.
- Settings as sources: down‑weight or exclude `content/settings/*.json` from citations; keep them as guidance.
- Persona drift: lock persona in `ai.json` and assert it in prompts.
- Rate limits: pool concurrency and implement backoff; log 429 counts in reports.
- Inconsistent QA: define clear pass/fail thresholds and enforce in one place (orchestrator).

---

## TL;DR

Agentic workflow turns a fragile, one‑shot prompt into a robust, observable pipeline. Use sequential steps for control, parallel fan‑out for speed and exploration, and hybrid patterns to get both. Keep retrieval fast and local, generation focused and schema‑bound, and QA as light or heavy as your use case demands. The result is faster delivery, higher quality, and a clear story of how each output came to be.
