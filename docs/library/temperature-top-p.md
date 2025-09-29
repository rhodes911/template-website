# Temperature and Top‑p

Dials for creativity and focus.

## Temperature
- Higher = more diverse, creative.
- Lower = more deterministic, on‑brief.

## Top‑p (nucleus sampling)
- Consider only the smallest set of tokens whose cumulative probability ≥ p.

## Why it matters
- Controls style variability across runs.

## Where used here
- Set in the OpenAI request; we keep conservative defaults for consistency.

## Story
Think of temperature as your copywriter’s risk appetite, and top‑p as how narrow their shortlist is._

## Tips
- For SEO fields, keep temperature low (0.2–0.4).

See also: [Determinism & Seeds](./determinism-seeds.md), [JSON Schema](./json-schema.md).
