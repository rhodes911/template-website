# Service Advisor, Service Page Redesign & Content-Led Funnel Implementation Plan

Date: 2025-09-07
Status: Planning (Phase 0)
Owner: Marketing + Engineering Collaboration

## 1. Objectives

Create an integrated, journey-first education → evaluation → conversion funnel that:
1. Guides users from ambiguous needs ("We need more leads / clarity") to precise recommended starting services.
2. Redesigns individual service pages into high-converting, modular, intent-aligned narratives (from brochure → guided solution brief).
3. Surfaces relevant educational content (blogs, guides, assets) contextual to user goal and funnel stage.
4. Captures progressive micro-conversions (diagnostic, lead magnet, roadmap request) before high-friction consultation.
5. Increases service detail page CTR, qualified inquiry volume, assisted pipeline and reduces unqualified form submissions.
6. Establishes metadata & architecture enabling a future conversational "Service Advisor" (deterministic → semantic → hybrid AI) without refactors.
7. Ensures SEO readiness (structured data, semantic structure, internal path scaffolding) once pages are production-ready.

## 2. Current System Deep Dive (Baseline)

### 2.1 Service Content Source
- Location: `content/services/*.md` (Markdown w/ frontmatter). Example: `brand-strategy.md`.
- Existing frontmatter keys consumed by loader (`src/lib/server/services.ts`):
  - Identity: `serviceId`, `title`, `subtitle`, `description`, `keywords`, `icon`, `order`.
  - Hero: `heroTitle`, `heroSubtitle`, `heroDescription`.
  - Offer Composition: `whatYouGet[]`, `features[{title,description,icon}]`, `process[{step,title,description,duration}]`, `results[]`, `faqs[]`.
  - CTA / Contact framing: `ctaTitle`, `ctaDescription`, `emailSubject`, `emailBody`.
  - Optional SEO object (`seo{}`) used when present but not strongly leveraged in generic listing view.

### 2.2 Data Loading
- `getServices()` reads all markdown, returns fully shaped `Service` objects including raw `content` markdown.
- `getServicesForPage()` builds lightweight `ServicePageData` (id, title, description, icon, features (titles only), results, href).
- Services listing pages (`/services` and `ServicesPageClient`) currently rely on `ServicePageData`.
- Lack of strategic meta fields (goals, stages, triggers) -> prevents targeted recommendation and guided selection.

### 2.3 Blog Content
- Location: `content/blog/*.md` with frontmatter: `title`, `slug`, `excerpt`, `categories[]`, `tags[]`, `relatedServices[]`, `keywords[]`, `publishDate`, `seo`, etc.
- No funnel metadata (funnelStage, goalTags, pillar). Has `relatedServices` (basic linking) but not inverse mapping from services to content beyond manual queries.

### 2.4 UI Components
- `ServicesPageClient.tsx` shows hero → static grid → single CTA section (no segmentation or personalization).
- Individual service page (`ServicePage.tsx`) currently linear: hero → markdown content → what you get → features/process/results/FAQ/CTA (not tuned for layered decision journey; lacks friction reduction modules like who/fit, objections, risk, proof snapshots, multi-path CTAs).
- No dynamic module composition based on available metadata.
- No mid-page guidance or segmentation logic.

### 2.5 Observed Gaps
| Gap | Impact |
|-----|--------|
| No structured user goals mapping | Users self-diagnose incorrectly, drop-off. |
| Grid lacks outcome / result emphasis | Reduced perceived differentiation. |
| No progressive education paths | Content consumption not sequenced to services. |
| No micro-conversion layers | Only high friction "consultation" CTA. |
| No analytics instrumentation events | Hard to optimize funnel decisions. |
| No service enrichment fields | Cannot power advisor / filtering. |
| Service page narrative not intent-layered | Users bounce or need manual consultation to clarify fit. |
| No contextual cross-links to educational assets | Slows trust & problem awareness maturation. |

## 3. Target Architecture Overview

```
User
  ↓ (Hero Prompt / Advisor Entry)
Service Advisor (state machine) ──▶ Scoring Engine ──▶ Recommended Services
  │                                        │
  │                                        ├─▶ Content Recommender (blogs, assets)
  │                                        │
  │                                        └─▶ Path Engine (Goal Sequences)
  │
  ├─▶ Micro-Conversions (lead magnet, diagnostic quiz, email capture)
  │
  └─▶ Service Detail Page → Inquiry / Call Booking
```

### Core Layers
1. **Enriched Service Metadata** (extend frontmatter + loader).
2. **Content Metadata Layer** (goalTags, funnelStage, pillar, pathIds). 
3. **Recommendation Engine** (rule-scoring MVP, upgrade path to embeddings).
4. **Service Advisor Component** (phase 1 deterministic flow stored as JSON config).
5. **Instrumentation Bridge** (event emitter abstraction → analytics provider later).
6. **Path Progress / Reco Components** (UI building blocks).

## 4. New Metadata Specifications

### 4.1 Service Frontmatter Additions (Phase 1 Enrichment + Page Redesign Support)
```yaml
# Example (brand-strategy.md additions)
goals: ["Clarify Positioning", "Build Brand Foundation", "Establish Authority"]
stages: ["early", "validating", "growing"]
strategicPillar: brand
timeToValue: standard         # fast | standard | long
outcomes:
  - "Clear differentiated market narrative"
  - "Messaging framework for site + sales"
  - "Internal alignment & decision speed"
# Optional risk / triggers
diagnosticTriggers:
  - "Inconsistent messaging across channels"
  - "Founder writing all copy"
  - "Low win rate vs entrenched competitors"
commitment:
  duration: "6–10 weeks"
  cadence: "Weekly workshops + async collaboration"
# Optional for future pricing representation
priceBand: "Custom"          # or e.g. "From £X"

# New for redesigned service pages (Phase 1B+)
whoFor:
  ideal:
    - "Early-stage SaaS founder validating positioning"
    - "Growing B2B service firm with inconsistent messaging"
  notFor:
    - "Pure e‑commerce seeking only visual refresh"
    - "Teams needing only tactical production"
engagementModel:
  phases:
    - name: Discovery
      duration: "Weeks 1–2"
      focus: "Research & stakeholder interviews"
    - name: Strategy Framework
      duration: "Weeks 3–4"
      focus: "Positioning & messaging architecture"
    - name: Activation
      duration: "Weeks 5–6"
      focus: "Guidelines & roll-out enablement"
proofSnippets:
  - metric: "+140% lead qualification rate"
    context: "Post-messaging clarity overhaul"
  - metric: "2x faster sales cycle"
    context: "Differentiated narrative adoption"
objections:
  - concern: "Can we just redesign first?"
    response: "Redesign before narrative clarity → rework & misalignment risks. Strategy first reduces iteration cost."
  - concern: "We already have a logo."
    response: "Identity ≠ strategic positioning; message hierarchy drives conversion."
riskOfInaction: "Continued price pressure + founder-dependent sales + weak differentiation."
```

### 4.2 Blog Frontmatter Additions
```yaml
funnelStage: awareness        # awareness | education | consideration | decision
goalTags: ["Clarify Positioning", "Increase Qualified Leads"]
pillar: brand                 # brand | demand | seo | content | conversion | ops
pathIds: ["positioning-foundation"]
readingDepth: standard        # quick | standard | deep
# Optional cross-sell hints
recommendedServices: ["brand-strategy"]
```

### 4.3 Path Definition Files
`/content/paths/positioning-foundation.json` (new directory)
```json
{
  "id": "positioning-foundation",
  "goal": "Clarify Positioning",
  "sequence": [
    "why-positioning-matters",      
    "messaging-framework-anatomy",
    "positioning-workshop-structure",
    "/services/brand-strategy"
  ]
}
```

### 4.4 TypeScript Type Updates
File: `src/lib/client/serviceTypes.ts` & `src/lib/server/services.ts`
```ts
export interface EnrichedServicePageData extends ServicePageData {
  goals?: string[];
  stages?: ("early"|"validating"|"growing"|"scaling")[];
  strategicPillar?: string;
  timeToValue?: 'fast'|'standard'|'long';
  outcomes?: string[];
  diagnosticTriggers?: string[];
  commitment?: { duration: string; cadence?: string };
  priceBand?: string;
  whoFor?: { ideal?: string[]; notFor?: string[] };
  engagementModel?: { phases: { name: string; duration: string; focus: string }[] };
  proofSnippets?: { metric: string; context?: string }[];
  objections?: { concern: string; response: string }[];
  riskOfInaction?: string;
}
```

## 5. Loading & Backward Compatibility Strategy
- Extend `Service` interface with optional fields (all optional to avoid breaking existing files).
- In `getServicesForPage()`, include new fields if present, otherwise omit.
- Introduce `getEnrichedServicesForPage()` or upgrade existing function (safer: add new function initially, migrate over UI gradually).
- Validate at build-time: create a script `scripts/validate-services-metadata.ts` to log warnings for missing `goals` or `strategicPillar` once adopted.

## 6. Advisor (Phase 1) Architecture

### 6.1 Conversation Flow Config
File: `src/lib/advisor/flow.ts`
```ts
export interface ConversationNode { id: string; type: 'system'|'single'|'multi'|'summary'; prompt: string; options?: { id:string; label:string; value?:string; next?:string }[]; next?: string | ((s:Session)=>string); }
```
Flow sample nodes: `intro`, `goal_select`, `stage_select`, `summary`.

### 6.2 Matching Engine
File: `src/lib/advisor/match.ts`
```ts
export function score(service: EnrichedServicePageData, session: Session): number {
  let s = 0;
  if (session.goal && service.goals?.includes(session.goal)) s += 3;
  if (session.stage && service.stages?.includes(session.stage)) s += 2;
  if (service.strategicPillar && pillarFromGoal(session.goal) === service.strategicPillar) s += 1;
  if (session.symptoms && service.diagnosticTriggers) {
    const overlap = session.symptoms.filter(t => service.diagnosticTriggers!.includes(t));
    s += Math.min(2, overlap.length); // cap
  }
  return s;
}
```
Return top N sorted; label top 2 as `primary`.

### 6.3 UI Components (Phase 1)
- `ServiceAdvisorLauncher.tsx`: Floating pill or button inserted at bottom-right.
- `ServiceAdvisorPanel.tsx`: Modal/panel with conversation.
- `AdvisorRecommendations.tsx`: Renders recommended services (cards referencing existing styling tokens).
- Minimal styling reuse: use `themeStyles` utilities to stay consistent.

### 6.4 Integration Point
Insert dynamic import in `ServicesPageClient` (defer for performance):
```tsx
const ServiceAdvisor = dynamic(() => import('@/components/advisor/ServiceAdvisor'), { ssr:false });
{/* Near end of layout */}
<ServiceAdvisor services={services} />
```

## 7. Service Page Redesign Architecture (New)

### 7.1 Modular Page Composition
Each service page becomes a composition of atomic, reorderable modules (render only if data available):

| Module | Purpose | Data Dependency |
|--------|---------|-----------------|
| ProblemFraming | Align on pain / archetype | diagnosticTriggers, riskOfInaction |
| OutcomesHero | Transformation framing | outcomes[] (top 3) |
| FitMatrix (Who It's For / Not) | Self-qualification | whoFor.ideal / whoFor.notFor |
| InlineDiagnostic | Micro self-assessment → urgency | diagnosticTriggers (subset) |
| EngagementModel | Process transparency vs timeline | engagementModel.phases + commitment |
| DeliverablesMatrix | Tangible expectation clarity | whatYouGet (grouped) |
| ProofSnippets | Social proof / authority | proofSnippets[] |
| Objections | Friction reduction | objections[] |
| PathEmbed | Education progression suggestion | pathIds (from content) |
| SecondaryContentReco | Lateral learning suggestions | goalTags/pillar (content index) |
| PricingFrame (light) | Investment mindset shift | priceBand, commitment |
| RiskBlock | Nudge action | riskOfInaction |
| CTACluster | Multi-path conversion | emailSubject/emailBody + lead magnet mapping |
| AdvisorReentry | Loop to guided flow | (always) |

### 7.2 Componentization Plan
Create `src/components/service/` directory:
```
ServicePageV2.tsx (orchestrator)
modules/
  ProblemFraming.tsx
  OutcomesHero.tsx
  FitMatrix.tsx
  InlineDiagnostic.tsx
  EngagementModel.tsx
  DeliverablesMatrix.tsx
  ProofSnippets.tsx
  Objections.tsx
  RiskBlock.tsx
  CTACluster.tsx
  AdvisorReentry.tsx
  PathEmbed.tsx
  SecondaryContentReco.tsx
```

### 7.3 Data Mapping Strategies
- Group `whatYouGet` heuristically into categories using keyword stems ("strategy", "framework", "guidelines", etc.) until manual category frontmatter is optionally introduced.
- Limit outcomes displayed to 3 most impactful (prefer those with measurable / action verbs first).
- Objections list: collapse into accordion; track expand events.
- Engagement model: render horizontal timeline (mobile vertical fallback) with structured phases.

### 7.4 UX / Interaction Principles
- Keep first viewport above fold focused on outcomes + qualification link (“Not this? Explore Lead Growth / Brand Clarity”).
- Defer heavy modules (ProofSnippets, SecondaryContentReco) via dynamic imports below fold (IntersectionObserver trigger).
- Provide anchored navigation (sticky) after 30% scroll with module anchors.

### 7.5 Advisor Integration
- Advisor summary deep links to anchors: `#engagement`, `#deliverables`, `#proof`.
- On arrival via advisor referral (`?src=advisor`), auto-expand Diagnostic if present.

### 7.6 Structured Data (Deferred until final content freeze)
- Generate JSON-LD blocks: Service, FAQ (existing), potentially BreadcrumbList.
- Compose via `next/head` or metadata config after migration.

### 7.7 Migration Strategy
1. Implement V2 framework behind flag `SERVICE_PAGE_V2`.
2. Enrich 2 pilot services.
3. Side-by-side QA (visual + lighthouse + Core Web Vitals snapshot).
4. Roll out remaining services in batches (flag-enabled).
5. Remove legacy `ServicePage` after parity + SEO readiness.

### 7.8 Risk Mitigation
| Risk | Mitigation |
|------|------------|
| Sparse metadata early | Conditional rendering; visual placeholders; enrichment script warnings. |
| Overload of info | Accordion & progressive disclosure; collapse lower-intent modules by default. |
| Layout shift | Reserve min-height containers; skeleton placeholders. |
| Performance regression | Lazy load non-critical modules + code splitting. |

## 8. Content Recommendation Layer (Phase 2)
### 7.1 Rule-Based MVP
- Build lookup index at build time: article → goalTags, pillar, funnelStage.
- `recommendContent(goal, stage, currentStage)` transitions to next appropriate funnelStage.
- Show 2 articles under advisor recommendations or inline below grid header.

### 7.2 Upgrade Path
- Add embeddings builder using existing script patterns (`scripts/build-embeddings.*`).
- Store vectors in `public/data/content-embeddings.json`.
- Client-side cosine similarity for user-entered question (Phase 2.5 / 3).

## 9. Micro-Conversions
| Layer | Component | Trigger |
|-------|-----------|---------|
| Lead Magnet | `LeadMagnetOffer` | After 1 blog visit OR advisor summary |
| Diagnostic PDF | `DiagnosticPrompt` | If user selects >1 strategic goal (future) |
| Roadmap CTA | `OutcomeCTA` | After recommendations rendered |

All send events via `emitEvent(name, payload)` central util.

## 10. Instrumentation Plan
Utility: `src/lib/analytics/events.ts`
```ts
export function emitEvent(name: string, payload: Record<string,any>) {
  // window.dataLayer push or console fallback
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: name, ...payload });
  }
}
```
Events:
- `advisor_open`, `advisor_close`
- `advisor_node_enter { nodeId }`
- `advisor_option_select { nodeId, optionId }`
- `advisor_recommendations { services:[{id,score}] }`
- `advisor_cta_click { serviceId, cta }`
- `content_reco_click { source, target, reason }`
- `micro_conversion { type, id }`

## 11. Phased Rollout (Updated Including Page Redesign Track)
| Phase | Scope | Deliverables |
|-------|-------|--------------|
| 0 | Planning | This document, sign-off |
| 1A | Service metadata enrichment core | Type updates, loader extension, pilot enrichment fields |
| 1B | Service Page V2 scaffolding | Module skeletons, orchestrator, feature flag, pilot service wired |
| 1C | Advisor MVP | Flow config, scoring, launcher, recommendations, basic events |
| 2 | Content metadata + rule recommendations | Blog frontmatter additions, article index, inline recos |
| 3 | Path engine + path progress UI | Path JSON, navigation integration, analytics |
| 4 | Micro-conversions layer | Lead magnet + diagnostic + nurture tagging |
| 5 | Semantic enrichment | Embeddings build + question mode fallback |
| 6 | Service page optimization & structured data | JSON-LD, A/B slots, performance tuning |
| 7 | Optional LLM layer | Tool-wrapper prompts, guardrails |

## 12. Backward Compatibility & Transitional Strategy
- All new frontmatter keys optional; absence means service still shows normally.
- Advisor filters only enriched services; if <3 enriched → show fallback messaging encouraging user to explore full list.
- Build-time script warns (does not fail) until coverage threshold (e.g., 70% enriched) reached.

## 13. Validation & Quality Gates
Automated checks (add as `npm` script):
- `validate:services` → ensure each enriched service has ≥1 goal & pillar.
- `validate:content` → every article with `goalTags` also has `funnelStage`.
- Lint unknown goal or pillar values (use enum set).
- Future: integration test for advisor scoring determinism.

## 14. Security & Privacy Considerations
- No PII collection beyond email in magnet (handled by existing forms adapter—ensure compliance copy present).
- LocalStorage usage: store minimal advisor session (`advisorSession_v1`). Avoid sensitive data.
- Opt-out path: allow user to dismiss advisor permanently (set `advisorDismissed=true`).

## 15. Performance Considerations
- Lazy load advisor bundle (dynamic import + IntersectionObserver prefetch). 
- Defer embeddings JSON fetch until user enters question mode.
- Keep service enrichment inline with existing markdown parse (negligible overhead).
- Avoid layout shift: reserve space for inline recommendation sections with min-height wrappers.

## 16. Future Enhancements (Post-Phase 7)
- Personalization weighting (services clicked → re-rank).
- A/B tests: hero CTA variant vs advisor-first pattern.
- Scroll depth → dynamic advisor nudge.
- Case study injection mid-grid (replace one card slot) with metrics tile.
- ROI mini-calculator integration before final CTA.

## 17. Success Metrics & Targets (Initial & Added Page Metrics)
| Metric | Baseline | Target (90d) |
|--------|----------|--------------|
| Services page → any service CTR | (Measure first) | +25% |
| Advisor open rate | N/A | ≥30% of unique sessions |
| Advisor completion → recommendation | N/A | ≥60% of opens |
| Service page → contact conversion (qualified) | (Baseline) | +10% |
| Blog → service visit rate | (Baseline) | +20% |
| Path completion (≥3 sequential nodes) | N/A | 15% |
| Avg modules viewed per service page | Baseline | +20% |
| Service page scroll depth ≥75% | Baseline | +18% |
| Service page → micro-conversion (magnet/diagnostic) | N/A | 12% |

## 18. Open Questions / Decisions Needed
- Do we want a separate `enrichedServices.json` build artifact for static export (SSG) or compute on-the-fly? (Recommend on-the-fly initially.)
- Lead magnet delivery mechanism: existing email platform or need new endpoint? (Specify integration.)
- Advisor visual style: modal vs side panel vs full-height slide-over? (Prototype & choose.)

## 19. Immediate Next Steps (For Phase 1 Execution)
1. Approve metadata schema (services + blog + paths).
2. Add enrichment fields to 2 pilot services (`brand-strategy.md`, `lead-generation.md`).
3. Extend `Service` interface & loader to include optional fields.
4. Create `src/lib/advisor/flow.ts`, `match.ts`, `types.ts`.
5. Scaffold `ServiceAdvisor` component with basic state machine.
6. Inject dynamic import into `ServicesPageClient` (behind feature flag `ENABLE_ADVISOR` env var optionally).
7. Instrument console-based events (swap later to analytics).

---
**Approval:** Once confirmed, Phase 1 branches can be created:
1. `feature/service-enrichment-core`
2. `feature/service-page-v2`
3. `feature/service-advisor-mvp`

Phases 1B & 1C can run in parallel after 1A lands.

