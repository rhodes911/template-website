# Testimonial Agent

Purpose
- Generate or refine concise testimonial quotes and metadata (name, role, company, rating) while keeping authenticity.

Where it applies
- Tina collection: testimonial (content/testimonials/*.md) and inline testimonial cards on pages (About, Services)

Inputs
- Mode: create | improve | variants | utilities
- Optional: brief, constraints; retrieval packs (testimonials | caseStudies | services)
- Context configs: Business Info, AI Settings, SEO Settings

Outputs
- Quote string (short), optional edits to role/company metadata; sources[]; diagnostics.

Rules & constraints
- Do not fabricate identities; if anonymised, clearly mark as such.
- Keep quotes 1–3 sentences; avoid hyperbole/clichés; follow brand voice (AI Settings `brandVoice`).
- Use locale and avoid list from SEO Settings; maintain rating policy (1–5) only if provided.

Context sources (ranked)
- Existing testimonials; related case studies; relevant services; Business Info.

When to run
- Create: need a cleaned/shortened quote from longer text.
- Improve: tighten tone and clarity.
- Variants: alternative phrasings to fit space/tone.

Used alone vs with others
- Alone: polishing quotes.
- With Services Agent: ensure alignment to highlighted benefits.
- With SEO Agent: check tone/length where surfaced on SEO pages.

Integration points
- AiAssistantField on testimonial docs and testimonial arrays within other collections.

Edge cases
- Overly long or generic quotes → condense; remove banned phrases from SEO Settings.

Success criteria
- Short, credible, brand-aligned quotes with clean metadata.

## Agent loop (step-by-step)
1) Plan
	- Determine if creating, improving, or generating variants for a quote.
	- Load tone from AI Settings `brandVoice`; load banned phrases/locale/length range from SEO Settings.
	- Packs: testimonials (always), caseStudies (optional), services (to align benefits).
2) Retrieve
	- Pull similar testimonials and any case-study snippets describing outcomes for the same service.
3) Write
	- Produce a concise, authentic quote (1–3 sentences); avoid clichés and prohibited phrases.
	- Do not invent identities; keep role/company unchanged unless asked to anonymise.
4) Critique (SEO Agent)
	- Tone/length check; apply avoid list; ensure UK spelling.
	- One fixup pass if needed.
5) Merge
	- Return final quote + sources + diagnostics; for variants, include options and a recommended pick.

## Prerequisites & deployment order
1) Content model ready
	- Tina collection `testimonial` configured; fields present in `content/testimonials/*.md`.
2) Core settings populated
	- Business Info, SEO Settings, AI Settings.
3) Retrieval ready
	- RAG index built; packs: testimonials (default), caseStudies/services (optional for context).
4) API & UI wiring
	- AiAssistantField on testimonial docs; `/api/tina/ai-generate` agentic path available.
5) Env vars
	- `OPENAI_API_KEY` and Tina credentials.

Fallbacks if missing
- Without RAG index: rely on current quotes + Business Info; keep outputs conservative.
