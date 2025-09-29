# JSON Schema Outputs (Schema Gate)

Ask for exactly what you need—and only that. JSON schema keeps outputs structured and predictable.

## What it means
- You specify the keys and types the model must return.
- The route sets `response_format: json_object` to enforce JSON.

## Where used here
- About→Hero expects `{ heroDescription: string }`.

## Story
The orchestrator hands the model a mold (schema). The model must pour content into that mold. If it spills, we reject or fix.

## Example
Return:
```json
{ "heroDescription": "As your marketing consultant..." }
```

## Pitfalls
- If the schema is too loose, outputs vary.
- If too strict, you lose helpful context—add separate fields as needed.

## Tips
- Add fields for diagnostics (e.g., citationsUsed) if you want deeper traceability.

See also: [System Instructions](./system-instructions.md), [Reports](./timeline-reports.md).
