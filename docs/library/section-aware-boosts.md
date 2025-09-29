# Section‑Aware Boosts

Favor sources that match the task’s section.

## What it means
- Add a boost to documents whose metadata or path indicates relevance to the current section (e.g., About vs Services).

## Why it matters
- Keeps About→Hero grounded in About‑ish material, not generic service pages.

## Where used here
- Roadmap: add path/metadata rules (e.g., boost `content/about.md`, de‑emphasize generic posts).

## Tips
- Implement as post‑score multiplier or pre‑filter.

See also: [Query Expansion](./query-expansion.md), [Citations](./citations.md).
