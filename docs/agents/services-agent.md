# Services Agent

Purpose
- Generate or improve service-page copy blocks (hero description, what you get, features, process, results, FAQs, CTA) that are on-brand, grounded, and schema-valid.

Where it applies
- Tina collection: service (content/services/*.md)
- Fields: heroDescription, whatYouGet[], features[], process[], results[], faqs[], ctaTitle, ctaDescription, emailSubject, emailBody, body (Markdown)

Inputs
- Mode: create | improve | variants | utilities (condense/expand/tone-shift)
- Optional: topic, brief, constraints (length, tone, include/avoid keywords)
- Packs: retrieval toggles (services | caseStudies | testimonials | blog | seo)
- Context configs: Business Info (content/settings/business.json), AI Settings (content/settings/ai.json), SEO Settings (content/settings/seo.json)

Outputs
- Field-specific JSON values only; no extra keys.
- Sources: list of cited content items with optional snippets.
- Diagnostics: grounding score; optional reading level.

Rules & constraints
- Follow brand voice from AI Settings `brandVoice` (primary tone source); UK English conventions by default.
- No hallucinations; facts must come from Business Info, the current doc, or retrieved sources.
- Do not fabricate brand names, numbers, or outcomes; generic but realistic phrasing is acceptable.
- Respect length targets from SEO Settings (for hero/body). Keep bullets concise.
- Constrain to valid service schema keys; never output unknown fields.
- Keyword policy: include-always and preferred terms where natural; avoid banned phrases; keep density under maxDensityPercent.

Context sources (ranked)
- Current service doc (if exists)
- Business Info; AI Settings
- Retrieved chunks: related services, relevant case studies (same industry or tags), testimonials that reference this service, relevant blog posts, SEO keywords

When to run
- Create: service draft is empty or missing a field.
- Improve: field exists and needs clarity or alignment.
- Variants: ideation for alternatives to test.
- Utilities: tightening or tone shifts without changing meaning.

Used alone vs with others
- Alone: drafting heroDescription, bullets, CTA.
- With SEO Agent: critique pass for tone/keywords/length and meta alignment.
- FAQ mode (within this agent): generates grounded `faqs[]`; SEO Agent emits FAQPage JSON‑LD when requested.
- With Case Study Agent: pull consistent problem→solution language for cross-linking.

Integration points
- Invoked via AiAssistantField in Tina on service documents.
- API contract uses collection:"service" with optional fieldName and mode.
- Returns value + sources + diagnostics; UI shows preview, citations, and Apply.

Edge cases
- Sparse context: rely on Business Info, topic, and brief; avoid invented details.
- Conflicting info: prefer the current doc; otherwise Business Info; cite sources.
- Over-length outputs: trim to target ranges; keep meaning.

Success criteria
- Clear, benefit-focused copy aligned to Business Info.
- Grounded with citations; passes SEO checks (length, keywords, tone).
- Valid JSON mapping to service fields with minimal edits required.

Future extensions
- Per-industry presets; reusable micro-copies for CTAs; automatic internal-link hints.

## Agent loop (step-by-step)
1) Plan
	- Determine target field(s) based on `fieldName` and `mode` (create/improve/variants/utilities).
	- Load constraints: tone from AI Settings `brandVoice`; locale/keyword policy/lengthTargets.service from SEO Settings.
	- Decide retrieval packs (default: services + caseStudies + testimonials; optional blog + seo when toggled).
	- Formulate retrieval queries using serviceId/title/topic plus synonyms from Business Info services list.
2) Retrieve
	- Pull top‑k chunks from content index with boosts for:
	  - Same collection/path: `content/services/**` matching this service.
	  - Case studies that mention this service or share tags/industry.
	  - Testimonials referencing this service or outcomes relevant to it.
	  - Blog posts matching keywords/tags (if enabled).
	- If confidence is weak, fall back to Business Info + user brief (still cite what was used).
3) Write
	- Produce only the requested fields, matching Tina schema keys, grounded in retrieved context.
	- Style: UK English, plain and confident; bullets concise; avoid fabrications.
	- FAQ mode: output 8–12 Q/A pairs relevant to the service scope, grounded in sources.
4) Critique (SEO Agent)
	- Check tone/locale; enforce length targets (hero/body; FAQ answers concise).
	- Apply keywordPolicy: include preferred where natural; avoid banned phrases; keep density under cap.
	- Guard hallucinations: flag/remove claims not present in Business Info/current doc/retrieved sources.
	- One fixup pass if issues are detected.
5) Merge
	- For single draft: return corrected value + sources + diagnostics.
	- For variants: return N options with a recommended favourite and 1‑line rationale.
	- Optionally ask SEO Agent to emit FAQPage JSON‑LD from `faqs[]`.

## Prerequisites & deployment order
1) Content model ready
	- Tina collection `service` configured (already in `tina/config.ts`).
	- Target fields exist in Markdown frontmatter for `content/services/*.md`.
2) Core settings populated
	- `content/settings/business.json` (Business Info) — brand, services list, value props, CTAs.
	- `content/settings/seo.json` (SEO Settings) — locale, keyword policy, length targets.
	- `content/settings/ai.json` (AI Settings) — system instructions, brand voice (tone), optional model.
3) Retrieval ready (for agentic mode)
	- Embeddings index built into `public/.rag/index.json` from `content/**`.
	- Default packs available: services (default on), caseStudies (on), testimonials (on); optional blog, seo keywords.
4) API & UI wiring
	- `/api/tina/ai-generate` supports `agentic:true` and retrieval injection.
	- AiAssistantField present on service docs with mode/packs toggles.
5) Env vars
	- `OPENAI_API_KEY` set; optional `OPENAI_MODEL`.
	- Tina Cloud: `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`.
	- `NEXT_PUBLIC_SITE_URL` for prompt context.

Fallbacks if missing
- Without RAG index: falls back to Business Info + current doc + brief; diagnostics mark low grounding.
- Without SEO Settings: uses conservative defaults; skips strict length enforcement.
- Without Business Info: prompt to fill it; only brief‑based drafting allowed.
