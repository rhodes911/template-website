# Testimonial Polisher Agent

Purpose: Clean and standardize testimonials without inventing details.

## Inputs
- collection: "testimonial"
- context: raw quote, role/company if available

## Outputs
- testimonial JSON: name, role, company, image?, rating, featured?, body (short, natural quote)

## Workflow
1) Plan: keep author voice and intent
2) Draft: lightly edit grammar and clarity; no additions
3) Enforce: schema; tone; banned phrases
4) Report

## Diagram
```mermaid
flowchart LR
  A[Plan] --> B[Draft]
  B --> C[Validate]
  C --> D[Report]
```

## Invoke
- POST `/api/tina/ai-generate` with { collection: "testimonial", agentic: false, context }.
