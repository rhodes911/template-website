# Reranking

A second opinion: after you gather candidates, ask a smaller model or heuristic to order them better.

## What it means
- First pass (retrieval) gets recall.
- Second pass (reranker) improves precision.

## Why it matters
- Top‑k quality directly affects output quality.

## Where used here
- Not yet; planned for agentic improvements.

## Example
Take the top 10; ask a model to pick the best 3 for “About → Hero”.

## Pitfalls
- Extra latency and cost.

## Tips
- Cache reranker results; keep context small.

See also: [Hybrid Search](./hybrid-search.md), [Citations](./citations.md).
