# Orchestrator, Agents, and Tools

The cast and the crew: the orchestrator directs, agents act, tools do the heavy lifting.

## Orchestrator
- Coordinates steps, selects profiles, ensures JSON schema outputs.
- Here: `src/app/api/tina/ai-generate/route.ts`.

## Agents
- Pipelines specialized by domain (About/Blog/Service). Documented in `docs/agents/`.

## Tools
- Retrieval (`src/lib/rag.ts`), OpenAI generation, report writer, (future) readability/voice guards.

## Story: About → Hero
1) Orchestrator loads settings and picks the About→Hero schema.
2) Agent retrieves sources and formats citations.
3) Tool (OpenAI) writes `heroDescription` to JSON.
4) Orchestrator validates and writes the report.

## Pitfalls
- Over‑branching logic reduces maintainability—prefer profiles + shared orchestrator.

## Next
- Add QA tools (readability, internal linking), then loop until pass.

See also: [System Instructions](./system-instructions.md), [JSON Schema](./json-schema.md).
