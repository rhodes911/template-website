# Citations (Grounding & Attribution)

Write with the sources on the desk. Citations are the retrieved snippets + metadata that the model sees while writing.

## What it means
We feed the model short excerpts and their source paths/titles so it can ground the output.

## Why it matters
- Reduces hallucination.
- Improves traceability (you can see exactly what influenced the output).

## Where used here
- `formatCitations()` in `src/lib/rag.ts`
- Reports display the `retrieval.hits` list.

## How it looks in prompts
- A short “Sources” section appended to the user message, with titles + paths.

## Example
Hit list: `content/services/seo.md — SEO`, `content/blog/...marketing-strategy... — How to Create a Marketing Strategy...`

## Pitfalls
- Too many citations = prompt bloat.
- Including settings files can skew tone—prefer content pages.

## Tips
- Deduplicate by path; cap snippet length; prefer section‑relevant sources.

See also: [Top‑k](./top-k.md), [Chunking](./chunking.md).
