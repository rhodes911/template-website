# Config Files Index (for AI Content Agents)

This document lists all editable config files that power the agent loop and Tina Suggestions 2.0, what each controls, and their critical fields. Use this as your deployment checklist for new clients.

## 1) SEO Settings — `content/settings/seo.json`
Purpose
- Global tone, locale, keyword policy, and length targets that the SEO Agent and writer agents must follow.
Key fields
- region, locale, readingLevel, fleschTarget
- keywordPolicy: includeAlways[], includePreferred[], avoid[], maxDensityPercent
- lengthTargets: per collection (about/service/blogPost/caseStudy/testimonial)
- blogPost.excerptChars: min/max
- jsonLd toggles: organization, person, service, article, breadcrumb, faq, review, localBusiness
Notes
- Required for critique stage to enforce locale/length/keywords; without it, agents apply conservative defaults.
- Tone guidance primarily comes from AI Settings `brandVoice` (brand-level). SEO may provide an optional override only if needed.

## 2) Business Info — `content/settings/business.json`
Purpose
- Brand grounding: name, services, value props, locations, CTAs, keywords, competitors, social, schema defaults.
Key fields
- brand, site_url, primaryCTAs[], audience[], services[], locations[], valueProps[]
- targetKeywords.primary[], targetKeywords.secondary[]
- competitors[], socialProfiles, schemaDefaults (Org/contact/address)
Notes
- Required to avoid hallucinations; used in Plan/Retrieve as core grounding context.
- May include editorial notes on voice, but the source of truth for tone is AI Settings `brandVoice`.

## 3) AI Settings — `content/settings/ai.json`
Purpose
- System instructions and model hints used across agents; optional siteUrl for context.
Key fields
- systemInstructions, brandVoice (primary tone source), model, siteUrl
Notes
- If OPENAI_MODEL is not set, model may be read here; systemInstructions feed the system prompt.

## 4) Tina Schema — `tina/config.ts`
Purpose
- Declares collections and fields; enables `seoSettings` collection and others in Tina admin.
Key parts
- settings (ai.json), seoSettings (seo.json), business (business.json)
- Collections: service, caseStudy, testimonial, about, blogPost
Notes
- Must be in place for AiAssistantField to appear on documents.

## 5) RAG Retrieval Packs
Purpose
- Toggleable context sources used by the Plan/Retrieve phases.
Defined by
- Content folders and the embeddings index at `public/.rag/index.json`
Default packs
- services (on), caseStudies (on), testimonials (on); optional blog, seo keywords
Notes
- Index is built from content/** at deploy; required for agentic retrieval.

## 6) Environment Variables (Vercel)
Purpose
- Secrets and URLs required for runtime.
Keys
- OPENAI_API_KEY (required), OPENAI_MODEL (optional)
- NEXT_PUBLIC_TINA_CLIENT_ID, TINA_TOKEN
- NEXT_PUBLIC_SITE_URL
Notes
- Set per-environment (Preview/Production) in Vercel settings.

## 7) Optional: Supabase Vector Store
Purpose
- Scale RAG beyond JSON index; support updates without redeploy.
Keys
- SUPABASE_URL, SUPABASE_ANON_KEY; table/embedding config as per rag.ts
Notes
- Not required initially; JSON index is enough for small-medium sites.

---

Deployment order (recommended)
1) Tina Schema: ensure seoSettings, business, ai collections are visible in /admin.
2) Business Info: fill brand, services, CTAs, value props.
3) SEO Settings: finalize tone/locale/keyword policy and length targets.
4) AI Settings: set system instructions and brand voice.
5) Build RAG index: generate public/.rag/index.json from content/**.
6) Verify env vars on Vercel.
7) Enable AiAssistantField on target collections; test create/improve and FAQ mode.
