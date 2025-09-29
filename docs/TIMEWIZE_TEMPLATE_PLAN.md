# TimeWize Template Extraction & Migration Plan

Date: 2025-09-29

## Objective
Create a lean, re‑brandable Next.js marketing site template ("TimeWize") from the existing Ellie Edwards Marketing codebase, keeping only generalized, reusable modules (core pages, content loading, SEO scaffolding, blog, services) while stripping brand‑specific, engagement‑specific, and unnecessary vertical artifacts (case studies, testimonials content blocks, excessive scripts, experimental assets) to produce a clean starter for small AI & automation businesses.

---
## 1. Current Repository Functional Areas (Audit)
| Area | Purpose | Keep? | Notes |
|------|---------|-------|-------|
| App Router pages (`src/app`) | Core routing & metadata | YES | Will prune unused routes (remove `case-studies`, experimental pages) |
| Services system (markdown + dynamic `[slug]`) | Reusable service detail pages | YES (trim) | Reduce to 2–3 example AI/Automation services with placeholder copy |
| Blog (markdown posts + categories) | Content marketing | YES | Retain; include 1 sample post + structure |
| Case Studies (markdown + listing/detail) | Social proof | NO (initial) | Provide optional module guidelines |
| FAQ page & component | Trust & pre‑sales friction removal | YES | Replace content with automation/AI placeholders |
| Contact form + API (`/api/submit`, Supabase/Resend hooks) | Lead capture | OPTIONAL | Provide in template; keep but gate credentials via env & graceful fallback |
| Supabase integration | Data persistence | OPTIONAL | Wrap behind feature flag; default: disabled/log only |
| Resend integration | Email notifications | OPTIONAL | Same pattern as above |
| RAG / embeddings (`scripts/build-embeddings*`, `public/.rag`) | AI search demo | OPTIONAL MODULE | Exclude from core template, document re‑enable steps |
| TinaCMS integration (`tina/**`, provider components) | In-browser editing | OPTIONAL MODULE | Provide toggle; core template ships without it to reduce complexity |
| SEO helper (`lib/seo.ts`, `pageSeo.ts`) | Metadata, canonical, JSON-LD | YES | Generalize brand + remove location forcing if not desired |
| Automated SEO / content QA scripts (`scripts/test-*`) | Quality pipeline | OPTIONAL | Keep a slim subset (meta + headings) or move to `extras/` |
| Theme system (`lib/theme*`, Tailwind config) | Consistent design tokens | YES | Rename tokens to neutral (no personal brand assumptions) |
| Personalization / Journey / Chatbot components | Niche features | NO (core) | Move to optional module list |
| Design experiments (`experimental-home`) | Not needed | NO | Drop |
| Images & brand assets in `public/images` | Brand-specific | TRIM | Replace with placeholder logos + one hero image |
| Content settings (`content/settings/*.json`) | Business config | YES | Replace values with TimeWize defaults & generic placeholders |
| Testimonials content | Social proof | OPTIONAL | Provide empty structure or remove |

---
## 2. Branding & Copy Elements to Neutralize
| Element | Current | Change To (TimeWize) |
|---------|---------|----------------------|
| Brand name (`business.json: brand`) | Ellie Edwards Marketing | TimeWize |
| Tagline / default title | “Expert Digital Marketing…” | “AI & Automation Solutions for Small Businesses” (placeholder) |
| Local forcing of `www.` canonical | Enforced in `seo.ts` | Keep or add toggle (ENV: `FORCE_WWW=false`) |
| Local business schema (address, person) | Ellie-specific | Replace with Mytchett generic or disable person schema |
| Footer copyright | Ellie Edwards Marketing | TimeWize © YEAR |
| Service meta patterns | `Service Name | Mytchett, Camberley` | Perhaps `Service Name | AI & Automation` |

---
## 3. Proposed Template Directory Slimming
Remove or relocate these paths (core template excludes them):
```
src/app/case-studies/
content/case-studies/
content/testimonials/
src/components/CaseStudies* / TestimonialRotator / Journey / personalization/
public/.rag/ (move to optional module doc)
scripts/build-embeddings*  (module)
scripts/search-rag.cjs      (module)
scripts/seo-pipeline-analyzer.js (optional)
scripts/generate-citation-pack* (module)
experimental-home/
```
Keep but prune:
```
content/services/  -> reduce to 3 example files (e.g. ai-automation.md, workflow-integration.md, consulting.md)
content/blog/      -> 1–2 sample posts (TimeWize voice)
content/about.md   -> placeholder founder-neutral copy or minimal about
content/faq.md     -> automation-focused sample Q&A
content/settings/  -> sanitized values
```

---
## 4. Minimal Feature Baseline After Extraction
Mandatory in template:
- Home (hero + value props + CTA)
- About
- Services listing + dynamic service detail
- Blog listing + post detail (categories optional, tags optional)
- Contact (form logs to console by default)
- FAQ
- Sitemap + robots
- SEO metadata + canonical + OG/Twitter + basic JSON-LD (Organization + Website only)

Optional Modules (documented but not shipped enabled):
1. Case Studies Module
2. Testimonials / Social Proof Module
3. AI RAG Search Module
4. TinaCMS Editing Module
5. Advanced SEO QA Scripts Suite
6. Lead storage (Supabase) + transactional email (Resend)
7. Chatbot / Wizard / Command Palette

---
## 5. Technical Refactors
| Task | Rationale | Approach |
|------|-----------|----------|
| Introduce feature flags | Toggle optional modules | `config/features.ts` exporting booleans sourced from env |
| Sanitize business settings loader | Remove person-specific fallback names | Provide neutral defaults & brand override via `content/settings/business.json` |
| Collapse duplicate service loaders (`services.ts` variants) | Simplify | Keep one canonical loader with types |
| Remove case study references in search API | Prevent dead references | Strip `case-studies` condition branches |
| Adjust `pageSeo.ts` default title logic | Remove “Ellie Edwards Marketing” strings | Use brand or fallback “Company” |
| Simplify navigation & footer | Remove links to removed sections | Build from a `NAV_SECTIONS` constant |
| Provide sample env file for TimeWize | Quick start | Create `.env.template` with minimal variables |
| Replace OG image | Provide neutral placeholder | Add `/og-template.png` |
| Tailwind/theme audit | Remove brand color naming if personal | Keep neutral primary palette; allow override via CSS variables |
| Remove forced `www.` (optional) | Flexibility | Add env toggle `ENFORCE_WWW=true` |

---
## 6. Migration Steps (Execution Order)
1. Branch: `template-extraction`
2. Add feature flags scaffold (`src/config/features.ts`)
3. Duplicate current repo docs: add `TIMEWIZE_TEMPLATE_PLAN.md` (this file) ✅
4. Implement brand config abstraction (update `seo.ts`, `layout.tsx` defaults)
5. Remove case studies pages + content + components; adjust search API
6. Prune testimonials & personalization components (or gate behind flags)
7. Reduce services to 3 example placeholders (rewrite frontmatter)
8. Replace blog posts with 1–2 sample AI automation posts
9. Sanitize settings JSON files (brand, address, social profiles blank placeholders)
10. Add new neutral OG image + favicon placeholders
11. Introduce sample env file: `.env.template`
12. Remove RAG + AI optional scripts from default build path (move to `modules/ai/`)
13. Slim script set: keep `test-seo-meta.js`, `test-headings.js`, remove heavy ones (or move to `qa/`)
14. Update README to “TimeWize Template – AI & Automation Marketing Site”
15. Run build & SEO tests to confirm no broken references
16. Provide `UPGRADING.md` with instructions to enable optional modules

---
## 7. Risk & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing modules breaks imports | Build failures | Grep & purge all references to removed directories before commit |
| SEO tests reference deleted routes | Test failures | Update discovery logic to skip removed patterns |
| Hard-coded brand strings missed | Branding leakage | Regex scan before final commit (`Ellie|Edwards|ellie-edwards`) |
| Over-pruning reduces template usefulness | Onboarding friction | Keep optional modules documented for quick re‑enable |

---
## 8. Post-Template Enhancements (Future)
- CLI script to instantiate a new brand (replace tokens, generate favicons)
- Pluggable service taxonomy (YAML config)
- Built-in structured data toggles per page type
- MDX support for richer posts
- Light CRM integration placeholder (webhook emitter)

---
## 9. Acceptance Criteria
- `npm run build` passes after extraction
- Visiting Home, Services, Service Detail, Blog, Blog Post, About, Contact, FAQ works
- No 404 links in navigation or footer
- Lighthouse / Next build shows no missing image or import warnings
- SEO meta test passes for all remaining routes
- grep for original brand returns only in plan & historical commit history

---
## 10. Open Questions (Assumed Defaults Until Clarified)
| Question | Assumption |
|----------|------------|
| Keep contact form functional? | Yes, but console log if no env keys |
| Include categories for blog? | Keep category system but only 1 sample category |
| Keep multi-location / local SEO emphasis? | Minimal; Mytchett reference optional |
| Retain pixel/char SEO QA script? | Yes (valuable for template quality) |

---
## 11. Next Immediate Actions
1. Create branch `template-extraction`
2. Add feature flags file & adjust layout branding logic
3. Remove case studies section & related code
4. Draft sanitized `business.json` & `seo.json` for TimeWize
5. Replace services with 3 placeholders

Once confirmed, proceed with implementation steps 1–5.

---
**Prepared for:** TimeWize Template Initiative  
**Prepared by:** Automated Assistant
