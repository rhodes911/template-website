# Timeline & Reports

Your black box recorder: who did what, when, with what sources.

## What’s captured
- Timeline steps with ms offsets: `start`, `retrieve.done`, `openai.request`, `openai.response`.
- Retrieval query and hits (paths, titles, scores).
- Settings snapshot (brand voice, hasBusiness/hasSeo).
- Output preview.

## Where written
- Per‑run: `reports/ai/<timestamp>_*.{json,md}`
- Group: `reports/ai/groups/<timestamp>_*.{json,md}`

## Story
We used the group report to compare baseline vs overrides (voice, keywords, length) and saw consistent adherence.

## Pitfalls
- Duplicate hits for the same path—dedupe to avoid crowding citations.
- Settings files ranking high—down‑weight in retrieval.

## Tips
- Add model + token usage to each report for cost/latency insights.

See also: [Citations](./citations.md), [Policies](./policies.md).
