# Case Study Writer Agent

Purpose: Create authentic case studies with believable outcomes and no fabrications.

## Inputs
- collection: "caseStudy"
- topic/outline: challenge, solution, outcomes
- packs (services, testimonials)

## Outputs
- caseStudy JSON: title, client, industry, challenge, solution, date/readTime, results?, body (Markdown)

## Workflow
1) Plan: align structure with challenge → solution → outcomes
2) Retrieve: related services/testimonials; avoid brand invention
3) Draft: narrative body with realistic but generic results
4) Enforce: schema; no fabricated names/metrics; tone guard
5) Links: to relevant service(s)
6) Report

## Diagram
```mermaid
flowchart LR
  A[Plan] --> B[Retrieve]
  B --> C[Draft]
  C --> D[Validate]
  D --> E[Guardrails]
  E --> F[Links]
  F --> G[Report]
```

## Invoke
- POST `/api/tina/ai-generate` with { collection: "caseStudy", agentic: true, topic, brief }.
