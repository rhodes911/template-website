# Search Index

The card catalog for your content—built once, searched often.

## What it means
A precomputed structure (here: JSON) that stores token weights so searches are fast.

## Where it lives
- File: `public/.rag/index.json`
- Built by: `scripts/build-embeddings.cjs`

## How it’s built
- Tokenize each document (or chunk), compute TF (term frequency) and IDF (rarity across corpus), store sparse vectors.

## How it’s used
- At runtime, transform a query into the same vector space.
- Score each doc with cosine similarity, return top‑k.

## Example from reports
- Scores around 0.07–0.21 indicate relative similarity, used to rank citations.

## Pitfalls
- Duplicate paths can appear if multiple chunks from the same doc are returned—dedupe in display.
- If IDF isn’t tuned, very common words can still leak through.

## Upgrades
- Switch to BM25 for improved sparse ranking.
- Add embeddings for a hybrid index.

See also: [TF‑IDF](./tf-idf.md), [Embeddings](./embeddings.md), [Hybrid Search](./hybrid-search.md).
