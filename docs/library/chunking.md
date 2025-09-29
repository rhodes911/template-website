# Chunking (Size, Overlap, Windowing)

Cut the book into pages before you index it. Chunking splits long docs into smaller, searchable units.

## What it means
- Size: how many characters/tokens per chunk.
- Overlap: repeated tail/head between neighbors for continuity.
- Windowing: sliding through the doc with size/overlap.

## Why it matters
- Improves recall: small, focused chunks match more specific queries.
- Keeps citation snippets short and relevant.

## Where used here
- If the indexer splits docs, multiple hits with the same path may be distinct chunks.

## Example
Two hits from `content/blog/...guide.md` with slightly different scores are likely different chunks of the same file.

## Pitfalls
- Too small: context fragmentation.
- Too large: generic matches.

## Tips
- Start ~500–1000 tokens, 10–20% overlap; adapt per content type.

See also: [Citations](./citations.md), [Search Index](./search-index.md).
