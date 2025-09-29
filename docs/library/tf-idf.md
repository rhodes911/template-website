# TF‑IDF

A librarian’s trick: give weight to words that matter in a document and are rare in the library.

## What it means
- TF (Term Frequency): how often a term appears in a document.
- IDF (Inverse Document Frequency): how rare that term is across all documents.
- TF × IDF gives each term’s weight for that doc.

## Why it matters
Simple, fast, and strong for keyword matching.

## Where used here
- Index: `public/.rag/index.json`
- Builder: `scripts/build-embeddings.cjs`
- Search: `src/lib/rag.ts`

## How it flows
1) Build: compute sparse vectors of TF‑IDF weights for all docs.
2) Query: compute a TF‑IDF vector for the user’s query.
3) Rank: use cosine similarity to find nearest docs.

## Example
Query “about hero” → weights for {about, hero} → matches service/about‑like docs.

## Pitfalls
- Synonyms aren’t understood (purely lexical).
- Short queries can be brittle.

## When to upgrade
- Add embeddings to capture meaning (semantics), then blend with TF‑IDF.

See also: [Cosine Similarity](./cosine-similarity.md), [Embeddings](./embeddings.md).
