# Local Retrieval

Think of a private library: instead of Googling, you search your own shelves. That’s local retrieval.

## What it means
All searching happens inside your app, over your repo files. No external search service.

## Why it matters
- Privacy: nothing leaves your environment during retrieval.
- Speed: sub‑millisecond scans thanks to a prebuilt index.

## Where it’s used
- Index file: `public/.rag/index.json`
- Retrieval code: `src/lib/rag.ts`
- Built by: `scripts/build-embeddings.cjs`

## How it works
1) Build step tokenizes `content/**` and `content/settings/**` and computes TF‑IDF weights.
2) At runtime, your query becomes a vector and is compared to all doc vectors using cosine similarity.
3) Top‑k hits are returned with scores and paths.

## Example
Reports show `retrieval.q` like “Keep it punchy. about hero” and hits such as `content/services/email-marketing.md`.

## Pitfalls
- If your query is vague, results are generic.
- Settings files can rank high; consider down‑weighting them.

## Tips
- Include section (“About”), persona (“I” vs “we”), audience (SMEs), locale (UK) in the query.

See also: [Search Index](./search-index.md), [TF‑IDF](./tf-idf.md), [Cosine Similarity](./cosine-similarity.md).
