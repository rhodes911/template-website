# Retrieval‑Augmented Generation (RAG)

A short story: You’re about to write an About-page hero line. Instead of guessing, you first flip through your own notes (retrieval), then you write with those notes open (generation). That’s RAG.

## What it means
RAG is a two-step pattern:
1) Retrieve relevant facts/snippets from your knowledge base.
2) Generate an answer that uses those facts.

## Why it matters here
- Keeps outputs grounded in your own content (services, blogs, settings).
- Reduces hallucinations and aligns tone with your brand voice.

## Where it’s used in this repo
- Orchestrator: `src/app/api/tina/ai-generate/route.ts`
- Retrieval: `src/lib/rag.ts` (loads `public/.rag/index.json`)
- Index builder: `scripts/build-embeddings.cjs`
- Reports: `reports/ai/*` (per-run) and `reports/ai/groups/*` (aggregated)

## How it works (step-by-step)
1) The route receives a task like “About → Hero” and loads settings from `content/settings/ai.json` plus SEO/Business.
2) It crafts a retrieval query (e.g., “Fresh hero for About page. about hero”).
3) It searches the local index (TF‑IDF) and picks the top‑k hits.
4) It formats those hits into citations and injects them into the prompt.
5) It calls OpenAI with system instructions + constraints (keywords/length/avoid) + citations.
6) The model returns JSON with `heroDescription`.
7) The route writes a report with timeline, hits, and settings.

## Example (from your report)
Timeline:
- `retrieve.done` in ~1–2 ms with hits like `content/services/seo.md`.
- `openai.response` in ~0.7–3.7 s with `heroDescription`.

## Common pitfalls
- Over-generic queries produce generic hits.
- Including settings files as citations can drown out real content.

## Do / Don’t
- Do: Tune queries with persona/brand/audience.
- Do: Keep top‑k small and relevant.
- Don’t: Overload the prompt with too many citations.

## Next
Move from TF‑IDF to embeddings for better semantic matches; add reranking and deduplication.

See also: [Local Retrieval](./local-retrieval.md), [TF‑IDF](./tf-idf.md), [Embeddings](./embeddings.md), [Citations](./citations.md).
