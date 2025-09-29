# System Instructions (System Prompt)

The house rules: highest‑priority guidance that shapes every output.

## What it means
- Provide non‑negotiables: brand voice, persona, locale, constraints.

## Where used here
- `content/settings/ai.json` (required; no fallback). The route fails if missing.

## Story
Before any generation, the orchestrator loads `ai.json` and sets the tone and persona. Every output must respect this.

## Example
- Voice: “Friendly, confident, practical.”
- Persona: first‑person singular ("I") or plural ("we").

## Pitfalls
- Missing or vague rules cause tone drift across runs.

## Tips
- Be explicit about persona, audience, and taboo phrases.

See also: [Policies](./policies.md), [Persona & Voice](./persona-voice.md).
