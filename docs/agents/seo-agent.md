# SEO Agent (Cross-cutting)

Purpose
- Enforce locale/length/keyword policies and generate meta fields and FAQPage JSON-LD; apply brand voice guidance primarily from AI Settings.

Where it applies
- Cross-collection: service, caseStudy, blogPost, testimonial, about

Inputs
- Mode: critique | meta | faq-jsonld
- Context configs: SEO Settings (content/settings/seo.json), AI Settings, Business Info

Outputs
- Critique feedback and a corrected value; meta title/description/canonical as applicable; JSON-LD block for FAQs.

Rules & constraints
- Apply brand voice from AI Settings `brandVoice`; enforce region/locale and readingLevel roughly.
- Enforce lengthTargets and excerpt char windows; respect keywordPolicy include/avoid/density.
- No fabrications; only operate on text provided by other agents or current docs.

When to run
- After a draft from Services/CaseStudy/Blog/Testimonial/About agents (critique stage).
- On-demand to generate/update meta fields.
- When FAQs are present and JSON-LD is requested.

Used alone vs with others
- Mostly with other agents as a critique layer; can run alone for meta or FAQ JSON-LD.

Integration points
- Same API route; invoked via mode flags or automatically in agentic flow.

Success criteria
- Outputs meet SEO constraints without losing meaning; JSON-LD validates; meta fits character limits.

## Agent loop (step-by-step)
1) Plan
	- Determine task: critique, meta generation, or faq-jsonld.
	- Load tone from AI Settings `brandVoice`; load policies from SEO Settings (locale, keywordPolicy, lengthTargets, jsonLd toggles).
2) Retrieve
	- Not required for critique; may fetch current doc fields or FAQ list.
3) Write
	- For critique: return corrected copy adhering to tone/length/keywords.
	- For meta: propose meta title/description within char windows; optional canonical.
	- For faq-jsonld: emit a JSON-LD block from existing `faqs[]`.
4) Validate
	- Check lengths/keywords/spelling (UK); ensure JSON-LD structure is valid.
5) Merge
	- Return corrected value/meta/jsonld + diagnostics; no variants unless requested.

## Prerequisites & deployment order
1) Core settings populated
	- SEO Settings complete (locale, keyword policy, length targets, jsonLd toggles). AI Settings `brandVoice` set.
2) Retrieval
	- Not required for critique/meta, but current doc content must be available to read.
3) API & UI wiring
	- Critique and meta modes callable from AiAssistantField or as an automatic step after writer agents.
4) Env vars
	- `OPENAI_API_KEY` present.
