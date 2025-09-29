# Hybrid Search (Sparse + Dense)

Best of both worlds: exact keywords (sparse) plus semantic meaning (dense).

## What it means
- Run TF‑IDF/BM25 and embeddings searches.
- Blend or rerank their results.

## Why it matters
- Catches exact matches and near‑synonyms.
- Stabilizes relevance.

## Where used here
- Planned roadmap: add embeddings alongside TF‑IDF and combine.

## Example
Query “client acquisition” still finds “lead generation” pages via embeddings while TF‑IDF surfaces exact mentions.

## Pitfalls
- Score scales differ; normalize before blending.

## Tips
- Weighted sum or learnable blend; test per section.

See also: [TF‑IDF](./tf-idf.md), [Embeddings](./embeddings.md), [Reranking](./reranking.md).
