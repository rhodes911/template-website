# Agent System Overview

This folder documents the full agentic system used by the Ellie Edwards site template.

- What is an agent? A specialized, task-focused program that uses tools (retrieval, validators) and an LLM to produce reliable outputs.
- Orchestrator: Plans the job, calls agents in order, checks results, writes reports.
- Tools: RAG search, JSON schema validator, SEO/readability checks, internal linker, safety filters, reporter.

## How to read this
Each agent has its own Markdown file:
- Inputs and outputs (exact shapes)
- Step-by-step workflow (bulleted and visual diagram)
- Error modes and guardrails
- Example invocation with our `/api/tina/ai-generate` route

Start with `orchestrator.md`, then explore individual agents.

Helpful jump‑offs
- Story mode + debugging: see `orchestrator.md` (Testing & debugging) for end‑to‑end visibility and examples.
- Domain profiles (About/Blog/Service): also in `orchestrator.md` under “Domain profiles.”
