# Blog Agent

Purpose
- Draft or improve SEO-friendly blog posts: title, excerpt, reading time, body outline and content, social share text.

Where it applies
- Tina collection: blogPost (content/blog/*.md)

Inputs
- Mode: create | improve | variants | utilities
- Optional: topic, brief, keywords, constraints; retrieval packs (blog | services | caseStudies | seo)
- Context configs: Business Info, AI Settings, SEO Settings

Outputs
- JSON keys for blog schema; excerpt within SEO Settings char window; body MD; sources[]; diagnostics.

Rules & constraints
- Tone from AI Settings `brandVoice`; SEO Settings enforce excerpt char window, keyword include/avoid, locale, and body length targets.
- Use clear structure with H2/H3; internal link suggestions (non-binding).
- Avoid fabricated stats; cite when referencing site content.

Context sources (ranked)
- Business Info; related blog posts; services pages for cross-linking; case studies.

When to run
- Create: topic/brief provided; page empty.
- Improve: polish and align to SEO settings.
- Variants: generate alternate titles/excerpts/outlines.

Used alone vs with others
- Alone: drafts/improvements.
- With SEO Agent: meta title/description generation; final tone/keyword critique.

Integration points
- AiAssistantField on blogPost docs; same `/api/tina/ai-generate` route.

Edge cases
- Over-optimization risk → keep density below max; vary phrasing.

Success criteria
- Readable, grounded, SEO-compliant posts with citations.

## Agent loop (step-by-step)

1) Plan
	- Confirm fields to produce (title, excerpt, body, etc.) and mode (create/improve/variants).
	- Load tone from AI Settings `brandVoice`; load SEO Settings: excerpt char window, body length targets, keyword policy, locale.
	- Packs: blog (always), services (for cross-linking), caseStudies (optional), seo keywords.
2) Retrieve
	- Pull top‑k blog chunks on the topic; include relevant service/case-study snippets for internal links.
3) Write
	- Output schema‑valid fields; excerpt within char window; body MD with H2/H3; suggest internal links in-text (non-binding).
	- Avoid fabricated stats; ground statements in retrieved/site context.
4) Critique (SEO Agent)
	- Enforce tone/length/keyword policy; trim/adjust as needed in a single fixup pass.
	- Guard hallucinations by removing unsupported claims.
5) Merge
	- Return final copy + sources + diagnostics; for variants, include options and favourite rationale (for titles/excerpts).

## Prerequisites & deployment order
1) Content model ready
	- Tina collection `blogPost` configured; fields present in `content/blog/*.md`.
2) Core settings populated
	- Business Info, SEO Settings (excerpt/body targets, keywords), AI Settings.
3) Retrieval ready
	- RAG index built; packs: blog (default), services (default), caseStudies (optional), seo keywords.
4) API & UI wiring
	- AiAssistantField on blog posts; `/api/tina/ai-generate` agentic path available.
5) Env vars
	- `OPENAI_API_KEY` and Tina credentials.

Fallbacks if missing
- Without RAG index: rely on Business Info + brief; signal low grounding in diagnostics.
