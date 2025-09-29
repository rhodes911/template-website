# Top‑k

Pick the best few: top‑k means “keep the top N results.”

## What it means
After scoring candidates, we keep only the top k by score to inject as citations.

## Why it matters
- Keeps prompts short and focused.
- Reduces cost and truncation risk.

## Where used here
- Retrieval returns a small handful of best hits (k ≈ 3–5).

## Example
Your reports show 2–4 hits per scenario, each with path/title/score.

## Pitfalls
- If k is too small, you might miss critical context.
- If k is too large, you bloat the prompt.

## Tips
Start small (3) and increase only if the model seems under‑informed.

See also: [Citations](./citations.md), [Context Strategy](./context-strategy.md).
