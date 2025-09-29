# Service Page Writer Agent

Purpose: Produce crisp, benefit-led service pages with structured sections.

## Inputs
- collection: "service"
- topic or serviceId, brief, packs (services, caseStudies, testimonials)
- context (settings + related service fields)

## Outputs
- service JSON: heroTitle, heroSubtitle, heroDescription, whatYouGet[], features[], process[], results[], faqs[], ctaTitle, ctaDescription, emailSubject, emailBody, body

## Workflow
1) Plan structure: benefits → features → process → proof → CTA
2) Retrieve: services + case studies + testimonials top‑k
3) Draft: concise bullets; no fluff; clear outcomes
4) Enforce: schema + keyword policy; UK English; avoid banned phrases
5) Readability pass; length targets by section
6) Internal links to adjacent services and relevant case studies
7) SEO meta block
8) Report

## Diagram
```mermaid
flowchart LR
  A[Plan] --> B[Retrieve]
  B --> C[Draft]
  C --> D[Validate]
  D --> E[SEO/Readability]
  E --> F[Links]
  F --> G[SEO Meta]
  G --> H[Report]
```

## Invoke
- POST `/api/tina/ai-generate` with { collection: "service", agentic: true, topic, brief }.
