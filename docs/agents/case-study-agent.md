# Case Study Agent

Purpose
- Produce grounded case study sections (challenge, solution, results, body MD) that align with brand voice without fabricating specifics.

Where it applies
- Tina collection: caseStudy (content/case-studies/*.md)
- Fields: challenge, solution, image (alt text guidance), date/readTime labels, results{}, body (Markdown)

Inputs
- Mode: create | improve | variants | utilities
- Optional: topic, brief, constraints; retrieval packs (caseStudies | services | testimonials | blog | seo)
- Context configs: Business Info, AI Settings, SEO Settings

Outputs
- Schema-valid JSON only; realistic but non-fabricated outcomes; sources[]; diagnostics.

Rules & constraints
- Never invent real client names or numeric results unless provided.
- Prefer anonymised outcomes ("increased qualified leads") with qualitative phrasing.
- Follow brand voice from AI Settings `brandVoice`; use locale/length from SEO Settings.
- Keep structure: challenge → approach → solution → outcomes; cite supporting content.

Context sources (ranked)
- Current case study doc; related services; relevant testimonials; related blog posts; Business Info.

When to run
- Create: new case study draft from outline or topic.
- Improve: polish existing sections for clarity and alignment.
- Variants: alternate intros/outcomes framing.

Used alone vs with others
- Alone: drafting challenge/solution/body.
- With Services Agent: ensure language consistency with service benefits.
- With SEO Agent: title/description and keyword alignment.

Integration points
- AiAssistantField within caseStudy docs; same API route with collection:"caseStudy".

Edge cases
- Sensitive claims: default to generic outcomes; add “contextual” qualifiers.
- Missing data: prompt for topic/brief; avoid making up figures.

Success criteria
- Clear narrative, grounded, zero fabrications, citations attached.

Future extensions
- Metrics templating when validated numbers are provided; image-selection hints.

## Agent loop (step-by-step)
1) Plan
	- Identify which sections to generate (challenge/solution/results/body) based on mode and fieldName.
	- Load tone from AI Settings `brandVoice`; load locale/length (caseStudy.body) and keyword policy from SEO Settings.
	- Choose packs: caseStudies (always), services (to align approach), testimonials (optional), blog (optional).
2) Retrieve
	- Prioritize existing case studies with similar industry/tags; pull related service pages and any testimonials.
	- Prefer chunks that mention problems, approach, and outcomes relevant to the topic.
	- If sparse, rely on Business Info to frame context; do not invent specifics.
3) Write
	- Draft sections in the order challenge → approach → solution → outcomes.
	- Use anonymised, qualitative outcomes unless validated numbers/brands are present.
	- Conform to Tina schema; body in Markdown with clear headings.
4) Critique (SEO Agent)
	- Tone/locale check; length window; keywordPolicy guard (avoid banned phrases; keep density below cap).
	- Grounding guard: remove claims not supported by retrieved sources/current doc/Business Info.
	- One fixup pass.
5) Merge
	- Return section values + sources + diagnostics; for variants, include alternates and a suggested favourite.

## Prerequisites & deployment order
1) Content model ready
	- Tina collection `caseStudy` configured; fields present in `content/case-studies/*.md`.
2) Core settings populated
	- Business Info, SEO Settings, AI Settings as above.
3) Retrieval ready
	- RAG index built from `content/**`; packs: caseStudies (default), services (default), testimonials (optional), blog (optional).
4) API & UI wiring
	- `/api/tina/ai-generate` supports `agentic:true`; AiAssistantField enabled in caseStudy docs.
5) Env vars
	- `OPENAI_API_KEY` and Tina credentials.

Fallbacks if missing
- Without RAG index: rely on Business Info + existing doc; avoid specifics.
- Without Business Info: request topic/brief; keep outcomes qualitative.
