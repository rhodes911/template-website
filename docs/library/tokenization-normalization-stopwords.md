# Tokenization, Normalization, and Stopwords

Cut text into pieces, clean them up, and ignore the filler.

## What it means
- Tokenization: split text into tokens (words/subwords).
- Normalization: lowercase, strip punctuation, unify whitespace.
- Stopwords: common words (the, a, of) we down‑weight or drop.

## Why it matters
- Stable, comparable vectors for search.
- Less noise = better rankings.

## Where used here
- Applied during index build (`scripts/build-embeddings.cjs`).

## Story
Before we build the index, we tidy the text. “The LEAD‑GENERATION!” becomes tokens like ["lead", "generation"]. That makes TF‑IDF fair and consistent.

## Pitfalls
- Over‑aggressive stopword removal can delete meaning (e.g., "to be or not to be").
- Stemming/lemmatization mismatches can surprise ("marketing" vs "market").

## Tips
- Keep a simple, predictable pipeline; test with a few sample docs.

See also: [TF‑IDF](./tf-idf.md), [Search Index](./search-index.md).
