# Blog Writer Agent

Purpose: Write grounded, SEO-conscious blog posts that match our schema and brand voice.

## Inputs
- collection: "blogPost"
- topic, brief, keywords
- packs (services, blog, seo)
- context (settings ai.json/seo.json/business.json + doc fields)

## Outputs
- blogPost JSON: { title, slug, excerpt, featuredImage?, alt?, author, categories[], tags[], keywords[], publishDate, lastModified, featured, readingTime, seo?, socialShare?, body }
- sources[] with citations
- diagnostics: { readingLevel, keywordScore, groundingScore }

## Workflow
1) Plan: outline sections based on topic and brief
2) Retrieve: RAG top‑k with boosts; assemble citations
3) Draft: generate JSON with body in Markdown
4) Enforce: schema validation; UK English; keyword inclusion; length targets
5) Readability pass: adjust to Years 7–9; maintain structure
6) Internal links: insert ≥2 services and ≥1 related post (validated slugs)
7) SEO meta: generate metaTitle/metaDescription; check lengths
8) Finalize: compute readingTime; fill tags/keywords
9) Report: save timeline, hits, scores

## Diagram
```mermaid
flowchart LR
  A[Plan] --> B[Retrieve]
  B --> C[Draft]
  C --> D[Validate Schema]
  D --> E[SEO & Readability Checks]
  E --> F[Internal Linking]
  F --> G[SEO Meta]
  G --> H[Finalize + Report]
```

## Errors & Guardrails
- No relevant hits → fallback to settings + brief; mark lower groundingScore
- Schema mismatch → re-prompt once with explicit diff
- Banned phrases or missing includeAlways → auto-fix pass

## Invoke
- POST `/api/tina/ai-generate` with { collection: "blogPost", agentic: true, topic, brief, keywords }.
