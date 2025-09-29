# About Agent

Purpose
- Create or refine About page content (heroDescription, body subsections, testimonials block) aligned to personal brand.

Where it applies
- Tina collection: about (content/about.md)
- Fields: heroDescription; body (or body subsections as configured); testimonials array

Inputs
- Mode: create | improve | variants | utilities
- Optional: brief, constraints; retrieval packs (testimonials | blog | services)
- Context configs: Business Info (name, mission, values), AI Settings, SEO Settings

Outputs
- JSON fields for About; grounded heroDescription; body MD; sources[]; diagnostics.

Rules & constraints
- Follow brand voice from AI Settings `brandVoice`; UK English by default; concise hero; body length per SEO targets; no fabrications.
- Avoid over-claiming; emphasize credibility and helpfulness.

Context sources (ranked)
- Business Info; About page current content; testimonials referencing the person; relevant blogs.

When to run
- Create: page empty or a specific section is requested (hero/body subsections).
- Improve: tighten and align tone.
- Variants: alternate heros or intros.

Used alone vs with others
- Alone: hero and body.
- With Testimonial Agent: polishing embedded quotes.
- With SEO Agent: tone/length/keywords check.

Integration points
- AiAssistantField in About; same API route.

Success criteria
- Warm, credible, accurate content with grounded statements and clean structure.

## Agent loop (step-by-step)

1) Plan
	- Choose section(s): heroDescription, body or body subsections, testimonials block.
	- Load tone from AI Settings `brandVoice`; load lengthTargets.about and locale from SEO Settings; gather Business Info (mission, values, credentials if present).
	- Packs: testimonials (for quotes), blog (for voice examples), services (optional for positioning).
2) Retrieve
	- Pull supporting snippets from About, testimonials, and relevant blogs.
3) Write
	- Hero: concise, clear value in UK English; avoid grandiose claims.
	- Body: well-structured Markdown; bring in mission/values credibly; cite where relevant.
4) Critique (SEO Agent)
	- Enforce tone and length windows; apply avoid phrases; one fixup pass.
5) Merge
	- Return final fields + sources + diagnostics; for variants, include options and a recommended hero.

## Prerequisites & deployment order
1) Content model ready
	- Tina collection `about` configured; fields present in `content/about.md`.
2) Core settings populated
	- Business Info complete (mission/values/credentials if available); SEO Settings; AI Settings.
3) Retrieval ready
	- RAG index built; packs: testimonials (default), blog (optional), services (optional).
4) API & UI wiring
	- AiAssistantField on About; `/api/tina/ai-generate` agentic path available.
5) Env vars
	- `OPENAI_API_KEY` and Tina credentials.

Fallbacks if missing
- Without RAG index: use Business Info + current About; keep claims conservative.
