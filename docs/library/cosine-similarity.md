# Cosine Similarity

How close are two thoughts? Cosine measures the angle between their vectors.

## What it means
- 1.0 = identical direction (very similar)
- 0.0 = orthogonal (unrelated)
- Negative = opposite (rare in our context)

## Why it matters
It’s the ranking metric for both TF‑IDF and embeddings in this project.

## Where used here
- Retrieval scoring in `src/lib/rag.ts`
- Appears in reports as `retrieval.hits[].score`

## Example from reports
- `0.205 content/services/email-marketing.md` ranked above `0.111 .../email-marketing.md`.

## Pitfalls
- Scores are relative; a 0.2 can still be very useful if the corpus is small.
- Don’t compare scores across very different queries as absolutes.

## Tips
- Normalize or threshold when blending sources.

See also: [TF‑IDF](./tf-idf.md), [Embeddings](./embeddings.md).
