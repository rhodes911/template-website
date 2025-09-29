# Determinism & Seeds

Make runs repeatable.

## What it means
- Determinism: same input → same output.
- Seed: a value to initialize randomness for repeatability.

## Why it matters
- Easier debugging and A/B testing.

## Where used here
- Provider support varies; we primarily control determinism via low temperature and strict schemas.

## Story
When comparing scenarios, you want changes to reflect only the overrides (tone/keywords), not random drift.

## Tips
- Keep temperature low; if provider supports a seed, set it during tests.

See also: [Temperature & Top‑p](./temperature-top-p.md), [Timeline & Reports](./timeline-reports.md).
