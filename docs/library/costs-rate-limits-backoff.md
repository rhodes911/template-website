# Costs, Rate Limits, and Backoff

APIs aren’t free—budget tokens and handle limits gracefully.

## Costs
- Token‑based billing: prompt + completion tokens.
- Track model, prompt size, and output length.

## Rate limits
- Providers return 429 when you exceed limits.

## Backoff
- Retry with short exponential delays; jitter to avoid thundering herds.

## Where used here
- We can add model/tokens to reports and a retry wrapper around OpenAI calls.

## Tips
- Batch non‑urgent runs; keep prompts lean; reuse citations.

See also: [Timeline & Reports](./timeline-reports.md), [Context Window](./context-window-truncation.md).
