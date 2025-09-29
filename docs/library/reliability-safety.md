# Reliability & Safety Playbook

Prepare for the rainy days.

## Failure modes
- Missing `ai.json`, network timeouts, schema mismatches, provider errors.

## Mitigations
- Strict checks (no fallback for `ai.json`), timeouts with retries, schema validation, circuit breakers on repeated failures.

## Observability
- Timeline with durations; capture request IDs; save failing payloads for repro.

## Data boundaries
- Keep retrieval to repo; avoid pulling unknown external data.

## Where used here
- The route already enforces `ai.json`. Add retries/tokens/IDs to strengthen.

See also: [Timeline & Reports](./timeline-reports.md), [System Instructions](./system-instructions.md).
