# AI-Driven Local Lead Gen Machine — Single Source Blueprint

**Purpose:** A single, adaptable, and scalable template to spin up high-converting lead gen sites with embedded local AI agents, instant lead handling, and recurring-revenue add-ons.

**Usage:** Drop into repo root (e.g., README.md). Use the checkboxes to drive implementation. Copilot can suggest tasks as you work.

## 1) Product Objectives

- [ ] **One-Fits-All Template:** Works for any local niche with minimal config (branding, copy, services).
- [ ] **Fast Deployments:** New client live in < 1 hour with scripted setup.
- [ ] **AI Conversion Layer:** 24/7 FAQ + triage + booking handoff.
- [ ] **Recurring Revenue:** Hosting + AI + insights + review booster.
- [ ] **Multi-Monetisation:** Rent-a-site, pay-per-lead, turnkey sale, agency white-label.
- [ ] **Scalable & Maintainable:** Multi-tenant friendly, low ops overhead.

### Success Metrics

- [ ] TTFD (time to first deployment) < 60 min
- [ ] p95 page load (mobile) < 2.0s
- [ ] CVR (visitor→lead) ≥ 8% baseline
- [ ] Monthly churn < 5%
- [ ] Setup effort per new client < 45 min after first 3

## 2) Non-Goals (for now)

- [ ] Full CRM replacement (we integrate/sync)
- [ ] Complex multi-page sites (single, high-converting landing primary)
- [ ] Heavy blogging/CMS (optional later as add-on)

## 3) Offer Stack (What We Ship)

### 3.1 Core (MVP)

- [ ] Mobile-first landing page (Hero, Trust, Services, FAQ, CTA)
- [ ] Sticky CTA bar ("Call Now", "Book Online")
- [ ] Lead capture: Form + phone click + AI chat → lead record
- [ ] AI agent trained from client markdown (/ai/*.md)
- [ ] Instant lead alerts (email; SMS optional)
- [ ] Weekly insights email (# leads, sources, top queries)

### 3.2 Add-ons (Upsell)

- [ ] Google review booster (opt-in follow-up workflow)
- [ ] CRM sync (HubSpot/Pipedrive/Zoho)
- [ ] WhatsApp/email auto-responder (AI drafted replies)
- [ ] Performance dashboard (lead table + charts)
- [ ] Local SEO pack (schema, GMB nudges, content pack)

## 4) Architecture (High-Level)

```
Visitor → Next.js Site (SSR/ISR) → Form/API Routes → Supabase (Leads)
                                   ↘ AI Chat (RAG on /ai/*.md → Ollama/API)
Leads → Resend (owner alerts) → Optional SMS
Jobs → Cron (weekly insights, review booster)
Admin → Minimal dashboard (stats, export)
```

- [ ] Stateless front-end, config via env + client JSON
- [ ] RAG reads markdown files per client (no hardcoded answers)
- [ ] All outbound comms logged (audit trail)
- [ ] Feature flags for add-ons

## 5) Template & Theming

### Brand Variables

- [ ] {{CLIENT_NAME}}, {{PRIMARY_COLOR}}, {{PHONE}}, {{EMAIL}}, {{SERVICE_AREAS}}

### Theming

- [ ] CSS variables (lightweight)
- [ ] Logo upload (/public/logo.svg)
- [ ] Favicon & OG images auto-generated (CLI task)

### Content Slots

- [ ] **Hero:** Headline, Subheadline, PrimaryCTA, SecondaryCTA
- [ ] **Services:** up to 6 bullets (icons optional)
- [ ] **Trust:** Ratings, review snippets, accreditation badges
- [ ] **FAQ:** Collapsible list, also used by AI
- [ ] **Footer:** Contact, hours, service areas

## 6) Lead Model & Data

### Leads Table (Supabase)

- [ ] lead_id (uuid, pk)
- [ ] client_slug (text, idx)
- [ ] source (enum: form, chat, call_click, ads, seo)
- [ ] name (text, nullable)
- [ ] email (text, nullable)
- [ ] phone (text, nullable)
- [ ] message (text)
- [ ] tags (text[]; e.g., ["roof-repair","emergency"])
- [ ] utm (jsonb)
- [ ] created_at (timestamptz, default now)
- [ ] status (enum: new, contacted, qualified, won, lost)
- [ ] owner_alerted (bool)

### AI Query Log

- [ ] query_id (uuid, pk)
- [ ] client_slug
- [ ] question, answer_summary
- [ ] handoff (enum: form, call, none)
- [ ] created_at

### Retention

- [ ] 30/90-day data retention policy configurable per client
- [ ] GDPR-compliant deletion endpoint

## 7) API Routes (Next.js)

- [ ] POST /api/lead/submit → validate → store → alert owner
- [ ] POST /api/ai/query → RAG → answer → optional handoff → log
- [ ] POST /api/insights/run → aggregate weekly → queue email
- [ ] POST /api/reviews/nudge → schedule follow-up requests
- [ ] POST /api/crm/sync → push leads to CRM
- [ ] DELETE /api/lead/:id → GDPR delete (auth required)

### Acceptance

- [ ] All endpoints rate-limited
- [ ] Schema validation (zod)
- [ ] Auth for admin-only endpoints

## 8) Environment & Secrets

- [ ] NEXT_PUBLIC_CLIENT_NAME
- [ ] NEXT_PUBLIC_PRIMARY_COLOR
- [ ] NEXT_PUBLIC_PHONE
- [ ] NEXT_PUBLIC_EMAIL
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE (server-only)
- [ ] RESEND_API_KEY
- [ ] OLLAMA_URL or AI_API_BASE
- [ ] OLLAMA_MODEL (e.g., llama3)
- [ ] CRON_SECRET (for scheduled jobs)
- [ ] ADMIN_TOKEN (for admin endpoints)
- [ ] REVIEW_NUDGE_TEMPLATE_ID (email)

### Acceptance

- [ ] No secrets on client bundle
- [ ] Per-client env overlay via .env.client.<slug>

## 9) File/Folder Layout (CURRENT STATE AUDIT)

### ✅ IMPLEMENTED - Core Structure
- [x] **src/app/page.tsx** - Main landing page (Hero with logo, services carousel, lead form)
- [x] **src/components/** - Complete component library:
  - [x] **LeadForm.tsx** - Advanced form with 9 service checkboxes, validation (react-hook-form + zod)
  - [x] **ServicesCarouselClient.tsx** - Animated services showcase with 462 lines
  - [x] **Navigation.tsx** + NavigationClient.tsx - Responsive navigation
  - [x] **Footer.tsx** + FooterClient.tsx - Complete footer with contact info
  - [x] **CaseStudiesClient.tsx** - Client testimonials carousel
  - [x] **FAQSection.tsx** - Collapsible FAQ component
  - [x] **TinaProvider.tsx** - CMS integration wrapper
- [x] **src/app/api/** - Complete API routes:
  - [x] **submit/route.ts** - Lead capture with duplicate email handling (157 lines)
  - [x] **about/route.ts** - About content API
  - [x] **services/route.ts** - Services data API
  - [x] **leads/route.ts** - Lead management API
  - [x] **subscribe/route.ts** - Newsletter subscription
- [x] **src/lib/** - Complete utility library:
  - [x] **supabase.ts** - Database client with debug logging
  - [x] **email.ts** - Resend integration with HTML templates (137 lines)
  - [x] **validations.ts** - Zod schemas for forms with 9 services enum
  - [x] **services.ts** + servicesData.ts - Complete services data management
  - [x] **metadata.ts** - SEO and meta tag utilities

### ✅ IMPLEMENTED - Content Management (TinaCMS)
- [x] **tina/config.ts** - Full CMS configuration
- [x] **content/** - Markdown-driven content:
  - [x] **services/** - 9 service pages (seo.md, ppc.md, etc.) with 140+ lines each
  - [x] **case-studies/** - Multiple case study files
  - [x] **testimonials/** - Client testimonial files
  - [x] **about.md** - About page content
- [x] **public/admin/** - TinaCMS admin interface
- [x] **public/images/** - Complete image assets with optimized delivery

### ✅ IMPLEMENTED - Database & Infrastructure
- [x] **database-setup.sql** - Production-ready Supabase schema (156 lines)
- [x] **services-migration.sql** - Database migration scripts
- [x] **vercel.json** - Production deployment configuration
- [x] **.env.example** - Complete environment variable template
- [x] **next.config.js** - Image optimization and performance config

### ❌ MISSING - AI/Automation Features (Blueprint Requirements)
- [ ] **/ai/<client_slug>/faq.md** - RAG source files per client
- [ ] **/lib/ai/** - AI/RAG implementation:
  - [ ] loader.ts - Markdown embedding loader
  - [ ] cache.ts - Embedding cache management
  - [ ] query.ts - RAG query processor
- [ ] **/components/ChatWidget.tsx** - AI chat interface
- [ ] **/api/ai/query** - RAG endpoint for AI responses
- [ ] **/scripts/init-client.ts** - Client bootstrapping automation
- [ ] **/scripts/seed-demo.ts** - Demo data generation

### ❌ MISSING - Analytics & Insights
- [ ] **/lib/metrics/** - Analytics utilities:
  - [ ] events.ts - Event tracking
  - [ ] utm.ts - UTM parameter handling
  - [ ] attribution.ts - Source attribution
- [ ] **/api/insights/run** - Weekly insights generation
- [ ] **/dashboard/** - Admin dashboard components

### ❌ MISSING - Automation & Workflows
- [ ] **/api/reviews/nudge** - Review request automation
- [ ] **/api/crm/sync** - CRM integration endpoints
- [ ] **/lib/email/templates/** - Automated email templates
- [ ] **/workflows/** - Background job definitions

### 🔧 SUGGESTED ADDITIONS (Based on Current Implementation)

#### High Priority - Multi-Tenant Support
```
/config/
  clients/
    ellie-edwards/
      branding.json     # Current: hardcoded in components
      services.json     # Current: in src/lib/servicesData.ts
      content.json      # Current: scattered in content/
    template/
      default.json      # Blueprint defaults
```

#### Medium Priority - Analytics Enhancement
```
/lib/analytics/
  google.ts            # GA4 integration (referenced in docs)
  conversion.ts        # Lead conversion tracking
  performance.ts       # Site performance monitoring
```

#### Low Priority - Integration Layer
```
/lib/integrations/
  hubspot.ts          # CRM sync capabilities
  mailchimp.ts        # Email marketing sync
  zapier.ts           # Webhook automations
```

### 📊 AUDIT SUMMARY

**IMPLEMENTATION STATUS: 65% Complete for Single-Client MVP**

**✅ FULLY IMPLEMENTED:**
- Landing page with hero, services, testimonials, FAQ
- Advanced lead capture form (9 services, validation)
- Email notifications via Resend
- Supabase database with comprehensive schema
- TinaCMS content management
- Mobile-responsive design with accessibility fixes
- Production deployment pipeline (Vercel)

**🚧 PARTIALLY IMPLEMENTED:**
- Multi-tenant architecture (single client hardcoded)
- Analytics (database views exist, no GA4)
- Email templates (basic notifications only)

**❌ NOT IMPLEMENTED:**
- AI chat/RAG system
- Client onboarding automation
- Review workflows
- CRM integrations
- Multi-client management
- Analytics dashboard
- Performance insights

**🎯 NEXT STEPS FOR AGENCY WHITE-LABEL:**
1. **Extract hardcoded "Ellie Edwards" branding** into config files
2. **Implement /scripts/init-client.ts** for rapid client setup
3. **Add basic AI chat widget** with FAQ RAG
4. **Create simple analytics dashboard** for client insights
5. **Build client management interface** for white-label operations

## 10) Build & Deploy

### CLI

- [ ] `npm run init:client -- --slug acme-roofing --name "Acme Roofing" --phone "+44..." --email "..." --areas "Guildford,Woking"`
  - [ ] Creates env overlay
  - [ ] Generates /ai/<slug>/faq.md from prompt template
  - [ ] Injects brand vars + logo placeholders
  - [ ] Generates OG images

### Deployment Targets

- [ ] Vercel (primary)
- [ ] Docker (compose: app + supabase + worker)
- [ ] Netlify (alt)

### CI/CD

- [ ] Lint, typecheck, test, build
- [ ] Preview deploy per PR
- [ ] Secret scanning
- [ ] Tag vX.Y → production promotion

## 11) Observability & Ops

### Metrics

- [ ] Pageviews, bounce, CVR, FCP/LCP/CLS
- [ ] Leads per day, per source
- [ ] AI usage (# queries, handoffs)
- [ ] Alert latency (lead→owner)

### Logging

- [ ] Structured logs for API routes
- [ ] Error reporting (Sentry or equivalent)

### Monitoring

- [ ] Uptime ping on /healthz
- [ ] Error budget alerts

### Backups

- [ ] Nightly Supabase backups
- [ ] Export leads CSV (admin-only)

## 12) SEO & Performance

- [ ] Meta + OG tags per client
- [ ] Local business schema (JSON-LD)
- [ ] Lazy-load non-critical assets
- [ ] Image optimization
- [ ] p95 LCP < 2.0s mobile
- [ ] Lighthouse ≥ 90 (PWA not required)

## 13) Security & Privacy

- [ ] HTTPS everywhere
- [ ] CSRF protection on forms
- [ ] Input sanitisation + output encoding
- [ ] Rate limiting on API
- [ ] GDPR compliance: consent copy, privacy page, DSR endpoint
- [ ] Minimal PII stored; encryption at rest (DB-level)

## 14) Pricing & Monetisation (FOCUSED: Agency White-Label)

### Primary Model: Agency White-Label
- [x] **Agency white-label:** £500 setup + £100–£250/mo
  - £500 one-time setup fee per new client
  - £100/mo basic tier (hosting + lead capture + basic insights)
  - £150/mo standard tier (+ AI chat + review automation)
  - £250/mo premium tier (+ CRM sync + advanced analytics + custom branding)

### Pricing Breakdown
**Setup Fee (£500):**
- Domain setup and DNS configuration
- Brand customization (logo, colors, copy)
- Service configuration (up to 9 services)
- Lead form setup and testing
- Email notification configuration
- Initial content population
- Go-live testing and handover

**Monthly Recurring (£100-£250):**
- Hosting and infrastructure
- Lead capture and storage
- Email notifications
- Basic performance monitoring
- Security updates and maintenance
- 99.9% uptime SLA

### Add-on Services
- [ ] **AI Chat Enhancement:** +£50/mo (when implemented)
- [ ] **Advanced Analytics Dashboard:** +£30/mo
- [ ] **CRM Integration (HubSpot/Pipedrive):** +£40/mo
- [ ] **Review Automation Workflow:** +£25/mo
- [ ] **Custom Domain + SSL:** +£15/mo
- [ ] **Priority Support (24h response):** +£20/mo

### Revenue Projections (Agency Model)
**Month 1:** 2 clients × £500 setup = £1,000
**Month 2:** 3 clients × £500 setup + 2 × £150 = £1,800
**Month 3:** 5 clients × £500 setup + 5 × £150 = £3,250
**Month 6:** 15 clients × £150/mo = £2,250/mo recurring
**Month 12:** 30 clients × £175/mo avg = £5,250/mo recurring

### Cost Structure
**Infrastructure (per client):**
- Vercel hosting: £15/mo
- Supabase database: £10/mo
- Resend email: £5/mo
- Domain/SSL: £10/mo
- **Total COGS:** £40/mo per client

**Gross Margin:** 60-75% (£60-£135 profit per client monthly)

## 15) Playbooks

### Onboarding (New Client)

- [ ] Buy/point domain
- [ ] Run init:client
- [ ] Add logo, brand color, copy polish
- [ ] Fill faq.md from discovery call
- [ ] Test lead submit + owner alert
- [ ] Set weekly insights cron
- [ ] Publish + hand over tracking links (UTM)

### Offboarding

- [ ] Export leads CSV
- [ ] Revoke API keys
- [ ] Wipe client AI files
- [ ] Archive env overlay
- [ ] Confirm data deletion (GDPR)

## 16) Roadmap & Definition of Done (UPDATED BASED ON AUDIT)

### 🎯 CURRENT STATE: Single-Client MVP (65% Complete)
**Already Implemented:**
- ✅ Landing page with hero, services carousel, testimonials, FAQ
- ✅ Advanced lead capture form with 9 service options
- ✅ Supabase database with comprehensive schema
- ✅ Email notifications via Resend
- ✅ TinaCMS content management
- ✅ Production deployment on Vercel
- ✅ Mobile-responsive design with accessibility compliance

### v1.0 - Agency White-Label Foundation (Next 2-4 weeks)
- [ ] **Extract hardcoded branding** into config files
  - [ ] Move "Ellie Edwards" references to `/config/clients/template/`
  - [ ] Create brand variable system (colors, logo, contact info)
  - [ ] Update all components to use configurable branding
- [ ] **Build client initialization script** (`/scripts/init-client.ts`)
  - [ ] Automated client setup with CLI parameters
  - [ ] Generate client-specific config files
  - [ ] Copy and customize content templates
  - [ ] Set up environment variables
- [ ] **Multi-tenant database structure**
  - [ ] Add `client_slug` to all relevant tables
  - [ ] Implement client isolation in API routes
  - [ ] Create client management utilities
- [ ] **Basic analytics dashboard** (`/dashboard/`)
  - [ ] Lead count and source breakdown
  - [ ] Basic conversion metrics
  - [ ] Export functionality

**DoD:** Can deploy new client in < 30 minutes with automated script. All branding configurable.

### v1.1 - AI Enhancement (4-6 weeks)
- [ ] **AI Chat widget** implementation
  - [ ] RAG system using client-specific markdown files
  - [ ] Basic FAQ answering capability
  - [ ] Handoff to lead form for complex queries
- [ ] **Client content system** (`/ai/<client_slug>/`)
  - [ ] FAQ.md per client for RAG training
  - [ ] Service-specific knowledge base
  - [ ] Industry-specific templates
- [ ] **AI API routes** (`/api/ai/`)
  - [ ] Query processing with RAG
  - [ ] Response logging and analytics
  - [ ] Rate limiting and abuse protection
- [ ] **Enhanced insights** system
  - [ ] Weekly email reports to clients
  - [ ] AI query analytics
  - [ ] Lead quality scoring

**DoD:** AI chat live on 3 client sites, successfully answering 80% of FAQ queries, generating weekly insights.

### v1.2 - Automation & Integration (6-8 weeks)
- [ ] **Review automation workflow**
  - [ ] Follow-up email sequences for new leads
  - [ ] Review request automation (7-day delay)
  - [ ] Review monitoring and alerts
- [ ] **CRM integration adapters**
  - [ ] HubSpot API integration
  - [ ] Pipedrive connector
  - [ ] Generic webhook system
- [ ] **Advanced analytics**
  - [ ] Google Analytics 4 integration
  - [ ] Conversion funnel tracking
  - [ ] A/B testing framework
- [ ] **Client self-service portal**
  - [ ] Basic dashboard for clients
  - [ ] Lead export functionality
  - [ ] Content editing interface

**DoD:** 10 clients live with full automation, CRM integrations tested, review workflow generating results.

### v1.3 - Scale & Optimization (8-12 weeks)
- [ ] **Performance optimization**
  - [ ] Image optimization automation
  - [ ] CDN implementation
  - [ ] Database query optimization
  - [ ] Caching layer implementation
- [ ] **Advanced features**
  - [ ] SMS notifications
  - [ ] WhatsApp integration
  - [ ] Advanced form builders
  - [ ] Landing page A/B testing
- [ ] **Agency management tools**
  - [ ] Multi-client dashboard
  - [ ] Billing integration
  - [ ] Client lifecycle management
  - [ ] Performance benchmarking

**DoD:** 25+ clients live, < 2s page load times, agency dashboard operational, profitable unit economics.

### 🚨 CRITICAL TECHNICAL DEBT (Address in v1.0)
1. **Hardcoded Client Data:** "Ellie Edwards" references throughout codebase
2. **No Client Isolation:** Database queries not filtered by client_slug
3. **Static Configuration:** No dynamic branding system
4. **Manual Deployment:** No automated client onboarding
5. **Missing Analytics:** No client performance insights

### 🎯 SUCCESS METRICS BY VERSION
**v1.0:** 5 clients onboarded in < 30 min each
**v1.1:** 80% AI chat accuracy, 15 clients live
**v1.2:** 25 clients, 90% automation rate, positive unit economics
**v1.3:** 50+ clients, < 15 min support time per client per month

## 17) Risks & Mitigations

- [ ] **Low conversion in some niches** → A/B test hero copy, add review proof, adjust CTA
- [ ] **Owner slow to follow up** → Auto-responder + SMS alerts + booking link
- [ ] **AI hallucinations** → Strict retrieval scope, disclaimers, handoff to form/phone
- [ ] **Data privacy** → Minimise PII, retention windows, DSR tooling

## 18) Acceptance Checklist (Hand to Client)

- [ ] Brand correct (logo, color, contact)
- [ ] Services + FAQ accurate
- [ ] Lead capture tested (email proof)
- [ ] AI answers match FAQ, no off-topic scope
- [ ] Weekly insights received (sample)
- [ ] Privacy & T&Cs live

## 19) Notes for Adaptability

- [ ] All copy in config/markdown (no code edits required)
- [ ] Icons/images are swappable without layout breaks
- [ ] Features toggled by flags (env or client JSON)
- [ ] Minimal niche assumptions; generic language defaults
- [ ] Clear extension points (crm, messaging, analytics)

---

## 🔍 DEEP DIVE AUDIT SUMMARY (August 10, 2025)

### 💪 STRENGTHS OF CURRENT IMPLEMENTATION

**1. Robust Technical Foundation**
- Modern Next.js 14 with App Router architecture
- Type-safe development with TypeScript and Zod validation
- Production-ready Supabase database with comprehensive schema
- Professional email system with HTML templates via Resend
- Mobile-first responsive design with accessibility compliance (WCAG 2.1 AA)

**2. Advanced Lead Capture System**
- Sophisticated form with 9 service checkboxes and validation
- Duplicate email handling (recently updated to allow multiple submissions)
- Real-time email notifications with detailed service interest tracking
- Database storage with UTM tracking capabilities (schema ready)

**3. Content Management Excellence**
- Full TinaCMS integration with live editing
- Markdown-driven content system for easy client customization
- 9 comprehensive service pages (140+ lines each) with SEO optimization
- Case studies and testimonials management

**4. Production-Ready Infrastructure**
- Vercel deployment with optimized build pipeline
- Image optimization and performance configuration
- Environment variable management with security best practices
- Error handling and logging throughout the stack

**5. User Experience & Design**
- Professional branding with logo integration
- Smooth animations and micro-interactions
- Services carousel with touch-friendly navigation (44px+ touch targets)
- FAQ accordion with seamless UX

### ⚠️ CRITICAL ISSUES TO ADDRESS

**1. Single-Client Hardcoding**
- "Ellie Edwards Marketing" branded throughout components
- No client isolation in database queries
- Static configuration preventing multi-tenant usage
- Manual deployment process for each new client

**2. Missing AI/Automation Layer**
- No AI chat widget or RAG implementation
- No automated client onboarding
- No review workflow automation
- No weekly insights generation

**3. Limited Analytics & Insights**
- No Google Analytics 4 integration
- No client performance dashboard
- No conversion tracking beyond form submissions
- No source attribution in practice

### 🎯 TRANSFORMATION STRATEGY FOR AGENCY MODEL

**Phase 1: De-Brand & Templatize (Week 1-2)**
1. Extract all "Ellie Edwards" references into config files
2. Create client template system with variable substitution
3. Implement dynamic branding across all components
4. Test with 2-3 dummy client configurations

**Phase 2: Automation & Scaling (Week 3-4)**
1. Build automated client onboarding script
2. Implement client isolation in database and APIs
3. Create basic client dashboard for insights
4. Develop pricing and billing integration

**Phase 3: AI & Advanced Features (Week 5-8)**
1. Implement AI chat widget with RAG
2. Add review automation workflows
3. Integrate with popular CRM systems
4. Build agency management dashboard

### 💰 BUSINESS MODEL VALIDATION

**Current Infrastructure Can Support:**
- 50+ clients on current Vercel/Supabase setup
- £5,000+/month recurring revenue at scale
- 60-75% gross margins with optimized operations
- Agency white-label model with rapid client deployment

**Key Success Factors:**
1. **Rapid Deployment:** Must achieve < 30 min client setup
2. **Quality Maintenance:** Ensure consistent performance across all clients
3. **Support Efficiency:** Minimize ongoing support burden per client
4. **Feature Standardization:** Resist custom development for individual clients

**Status:** Start with MVP checklist. Focus on de-branding and multi-tenant architecture first. AI features secondary to business model validation.
