# `settingsOverride`

Test in place: change brand/SEO rules per request without touching files.

## What it means
- A request body field that deep‑merges into loaded settings for that run.

## Where used
- Scenario script alters voice, keywords, and length targets dynamically.

## Story
We ran five scenarios by swapping voice, keywords, and bounds—then aggregated results in one group report.

## Pitfalls
- Don’t rely on overrides in production; commit durable changes to settings files.

## Tips
- Great for A/B tests: run multiple variants and compare in one report.

See also: [Policies](./policies.md), [Reports](./timeline-reports.md).
