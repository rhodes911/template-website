# AI feature ideas for Ellie Edwards Marketing

This document lists broad, creative, and practical use cases to introduce AI into the site. Each idea includes a short description and implementation notes aligned with this codebase (Next.js App Router, TinaCMS content, Supabase leads, Resend email, SEO/Performance focus).

## Goals
- Increase lead quality and conversions
- Improve content velocity and consistency
- Enhance credibility via smarter case study/testimonial surfacing
- Reduce operational busywork (triage, drafting, QA)

## On-site UX and conversion
- AI Concierge (context-aware chat)
  - A small, privacy-friendly assistant that knows services, case studies, blog posts and can answer FAQs, suggest next steps, book a call, or recommend a service.
  - Impl: Conversational component (`src/components/`) calling an API route `/api/assistant` that retrieves context from MD content and returns grounded answers. Use streaming for fast UX.

- Guided Service Matcher (adaptive quiz)
  - A short, dynamic questionnaire that adapts based on answers and outputs a recommended package, relevant case studies, and a clear CTA.
  - Impl: Client component + API route that scores answers with an LLM prompt and returns: service slug, rationale, links.

- Smart Case Study Recommender
  - Surface the most relevant case studies in the homepage "Client Signals" and on service pages based on the user path (industry, need, location hints).
  - Impl: Simple heuristic first (path + service tag) -> optional LLM reranker referencing case study metadata in `content/case-studies/*`.

- Personalized CTAs (multi-armed bandit)
  - Try several CTA variants (copy/benefit emphasis/tone) and automatically prioritize winners.
  - Impl: Lightweight server-side bandit with cookie ID; optional LLM to generate variants from seeded copy.

- UX Micro-copy Assistant
  - Improve clarity of microcopy (tooltips, empty states, buttons) while preserving brand voice.
  - Impl: Authoring-only - TinaCMS "Improve copy" button that proposes 2-3 alternatives.

## Lead capture and follow-up
- Lead Triage & Qualification
  - Auto-classify incoming leads (budget fit, urgency, service need) and flag high-priority ones.
  - Impl: Webhook or `/api/leads` step that extracts entities and returns a score + tags stored in Supabase.

- First-Response Drafts (Resend)
  - Generate a personalized first reply with next steps, suggested resources, and a Calendly link.
  - Impl: Server function triggered after lead creation; store draft in Supabase for review, not auto-send.

- Meeting Notes Prep
  - Summarize the lead journey and relevant case studies before the call.
  - Impl: Compile session data + selected case studies and produce a one-pager summary.

## Content and SEO
- TinaCMS AI Helpers
  - Outline & brief generator: propose H2/H3, key points, internal links.
  - SEO meta assistant: title/description suggestions with length checks.
  - Schema/JSON-LD helper: propose FAQ, Article, or CaseStudy schema from content.
  - Internal link suggestions: find relevant services/case studies/blogs and insert links.
  - Impl: Tina field actions calling `/api/content-assist` with safe prompts; enforce "assist, never auto-publish."

- Case Study Drafting
  - From a structured form (client, challenge, approach, results), generate a first draft case study respecting the site template.
  - Impl: Form -> LLM -> markdown saved to `content/case-studies/slug.md` via a protected API.

- Content Repurposing
  - Turn long posts into: LinkedIn threads, email newsletter blurbs, social captions, and a short landing-page variant.
  - Impl: Server route that returns several format-specific variants with tone options.

- Keyword Clustering & Content Gaps
  - Paste a seed keyword list; get clustered topics, search intent, suggested pillars, and interlinking plan.
  - Impl: Offline tool or protected route; export CSV + markdown brief.

- Automated OG & Social Snippets
  - Suggest 1-2 punchy OG titles/captions per post.
  - Impl: Editor button populates suggestions; human approves.

## Analytics and optimization
- Anomaly Watcher (traffic, conversions, CWV)
  - Detect significant drops/spikes and propose probable causes + next actions.
  - Impl: Scheduled server job reading GA4 + Pagespeed reports -> summary email/Slack.

- Experiment Ideation Copilot
  - Given a page and its metrics, propose low-risk A/B tests (headline/CTA layout) with expected impact.
  - Impl: API that ingests current DOM or content and outputs prioritized test ideas.

- Copy Tone Evaluator
  - Check tone against brand guidelines; flag jargon and propose simpler alternatives.
  - Impl: Editor-time tool only; no runtime dependency.

## Email marketing
- Subject Line & Preview Text Generator
  - Provide 5 variants aligned to target persona, with predicted open-rate heuristics.
  - Impl: Editor tool in Tina; save variants for quick testing.

- Lifecycle Personalization
  - Generate tailored nurture sequences per service vertical (e.g., SEO vs PPC prospects) with case study inserts.
  - Impl: Library of prompts + templates; exported into your ESP/Resend.

## Developer/operations helpers
- Content QA Bot
  - Check for broken links, missing alt text, inconsistent capitalization, and reading difficulty. Suggest fixes.
  - Impl: Script or API that walks rendered pages; outputs a checklist.

- Structured Data Validator
  - Validate JSON-LD for services, blog, case studies; propose corrections.
  - Impl: LLM critiques your generated schema with references to Google guidelines.

- PR Description/Release Notes Drafts
  - Summarize diffs and write a crisp PR description with risk/rollout notes.
  - Impl: Local CLI or GitHub Action with opt-in.

## Where to wire these in this repo
- API routes: `src/app/api/*` for assistant, content-assist, lead triage.
- Client components: extend `InteractiveExperimentClient` with an optional concierge; add a small button to the FloatingDock.
- TinaCMS: add "AI Assist" actions to service/blog/case-study collections in `tina/config.ts`.
- Supabase: add columns for lead_score, tags, and triage_notes.
- Resend: prepare email templates; store drafts first.

## Safety, privacy, and cost controls
- Never send PII unless essential; redact emails/phones in prompts.
- Ground answers only on your content; decline if not sure.
- Add guardrails for tone, compliance, and brand voice.
- Cache embeddings and results; add rate limiting.
- Prefer server-side calls; avoid exposing keys client-side.

## Phased rollout
- Phase 1 (1-2 weeks)
  - TinaCMS SEO meta assistant, internal link suggestions
  - Case study recommender (heuristic), subject line generator
  - Lead triage scoring + tags in Supabase

- Phase 2 (2-4 weeks)
  - Guided Service Matcher, Content repurposing toolkit
  - Anomaly watcher + weekly summary email
  - Concierge chat (read-only, grounded on content)

- Phase 3 (4-8 weeks)
  - Multi-armed bandit for CTAs, experiment ideation assistant
  - Case study drafting flow with editorial review
  - Meeting notes prep and lifecycle personalization

## Tech notes
- Models/providers: prioritize secure, enterprise options (e.g., Azure OpenAI). Keep providers swappable.
- Vector store: start simple (local JSON or pgvector on Supabase) before adding infra.
- Streaming responses for chat; SSR for SEO tools; edge only if needed.
- Observability: log prompt/response metadata (no PII), track costs and errors.
