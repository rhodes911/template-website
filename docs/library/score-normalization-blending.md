# Score Normalization & Blending

Make scores comparable, then combine them.

## What it means
- Normalization: rescale scores (e.g., min‑max, z‑score) so sources are comparable.
- Blending: weighted sum or learned mix of multiple sources (e.g., TF‑IDF + embeddings).

## Why it matters
- Sparse and dense scores live on different scales.

## Where used here
- Planned: when we add embeddings and hybrid search.

## Tips
- Start with simple min‑max per source, then try weighted sums; validate on a labeled set.

See also: [Hybrid Search](./hybrid-search.md), [Cosine Similarity](./cosine-similarity.md).
