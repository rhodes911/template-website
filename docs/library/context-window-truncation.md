# Context Window & Truncation

How much the model can read at once—and what gets chopped when it’s too long.

## What it means
- Context window: max tokens the model can consider (prompt + citations + output).
- Truncation: anything beyond that limit is cut off.

## Why it matters
- Too many/long citations risk losing crucial parts of your prompt.

## Where used here
- We inject small top‑k citations to stay well within limits.

## Story
If you hand the model a stack of papers, it will skim only the first N pages. Keep your citations concise so the rules (system instructions) and the task are always visible.

## Pitfalls
- Hidden truncation = confusing behavior.

## Tips
- Keep citations short; prefer 3–5 precise hits.
- Consider token counters in reports for visibility.

See also: [Citations](./citations.md), [Top‑k](./top-k.md).
