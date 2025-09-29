# Embeddings (Dense Vectors)

From words to meaning: embeddings turn text into numeric vectors that capture semantic relationships.

## What it means
A model encodes text into a fixed‑length vector (e.g., 1536‑dim); similar meanings produce nearby vectors.

## Why it matters
- Finds relevant content even when keywords differ.
- Greatly improves recall vs pure TF‑IDF.

## Where it fits here (roadmap)
- Use OpenAI embeddings to build a dense index alongside TF‑IDF.
- Search both, blend results (hybrid search).

## How it would work
1) Build: compute embeddings for each document/chunk.
2) Query: compute an embedding for the user’s query.
3) Rank: cosine similarity over dense vectors.

## Example
Query “client acquisition” still finds content about “lead generation” even if the exact phrase doesn’t appear.

## Pitfalls
- Cost to compute/store; must handle model/version consistency.
- Beware stale embeddings after content changes (rebuild needed).

See also: [Hybrid Search](./hybrid-search.md), [Cosine Similarity](./cosine-similarity.md).
