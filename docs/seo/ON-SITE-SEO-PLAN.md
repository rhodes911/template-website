# ON-SITE SEO PLAN & AUDIT TEMPLATE (NEXT.JS LEAD GEN)

> Standalone on-site (on-page) SEO governance & audit system. Combines content, metadata, internal linking, structured data & UX conversion best practices. For off-site & technical see `OFF-SITE-SEO-PLAN.md` and `TECHNICAL-SEO-PLAN.md`.

## QUICK START (PLUG & PLAY)
1. Copy BUSINESS CONTEXT (Section 0) and tailor brand / geo / services.
2. Set env vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ENV`.
3. Update `/content/services/*.md` front-matter keywords & descriptions.
4. Run AI audit: Provide Sections 0–3 + 6 with prompt: `AUDIT NOW – RETURN ISSUE TABLE + PATCHES`.
5. Apply patches until 0 High severity issues.

### Variable Tokens
`{{PRIMARY_SERVICE}}` `{{LOCATION_PRIMARY}}` `{{INDUSTRY}}` `{{BRAND}}` `{{UNIQUE_VALUE}}` `{{CTA}}`

### Page Must-Haves
- One `<h1>` early with main keyword + value.
- Title (51–60 chars) keyword first | Brand.
- Meta description (120–160) benefit + CTA.
- Canonical unique absolute URL.
- 2–3 contextual internal links + 1 hub link.
- JSON-LD matches page type & visible content.
- Core CTAs surfaced above fold & near endings.

---
## 0) BUSINESS CONTEXT (LIVE SITE EXAMPLE)
```json
{
  "brand": "Ellie Edwards Marketing",
  "site_url": "https://www.ellieedwardsmarketing.com",
  "primary_ctas": ["Book Strategy Call", "Schedule Your Call", "Get Your Free Consultation"],
  "audience": ["Small & medium business owners", "Local service-based entrepreneurs", "Marketing leads in Surrey / Hampshire", "Coaches & consultants scaling authority"],
  "services": ["SEO", "PPC", "Content Marketing", "Email Marketing", "Lead Generation", "Brand Strategy", "Social Media", "Website Design", "Digital Campaigns"],
  "locations": ["Camberley", "Surrey", "Hampshire", "Basingstoke", "Reading", "UK-wide"],
  "value_props": ["Strategic marketing that delivers real results", "Integrated SEO, PPC, content & automation", "Local expertise – Surrey & surrounding regions", "No long-term contracts – performance focused", "Data-driven improvement & transparent reporting"],
  "target_keywords": {"primary": ["digital marketing Camberley", "marketing consultant Surrey", "SEO services Surrey", "lead generation services", "content marketing agency", "ppc management Surrey"], "secondary": ["email marketing consultant", "brand strategy consultant", "social media marketing Surrey", "website design marketing", "local business marketing services", "surrey marketing consultant"]},
  "social_profiles": {"linkedin": "https://www.linkedin.com/in/ellie-edwards-marketing/"},
  "schema_defaults": {"organization_name": "Ellie Edwards Marketing", "logo_url": "https://www.ellieedwardsmarketing.com/images/ellie-edwards-logo.png", "contact_phone": "+44 7711152873", "contact_email": "ellieedwardsmarketing@gmail.com", "address": {"streetAddress": "Mytchett", "addressLocality": "Camberley", "postalCode": "GU16 6BA", "addressCountry": "GB"}}
}
```

---
## 1) AUDIT RULES (APP ROUTER AWARE)
Metadata: Title 50–60; Description 120–160; Canonical absolute; OG + Twitter (title/desc/url/type/siteName/image); Robots: `index,follow` prod else `noindex,nofollow`.
Headings: 1x H1; logical H2/H3 hierarchy; no headings in nav/footer.
Content: Above fold = audience + value prop; internal links descriptive; avoid keyword stuffing; scannable formatting.
Images: Descriptive alt; width/height; convert to next/image; compress.
JSON-LD: Organization (layout), WebSite (home), Service (service pages), Article (blog), FAQPage where Q&A.
Performance tie-ins: Min client JS, lazy below fold, hero LCP optimized.
E-E-A-T: Author attribution, case studies, testimonials, trust badges.

---
## 2) FIX SNIPPETS
App Router Metadata template:
```ts
import type { Metadata } from 'next';
import { canonical, IS_PROD } from '@/lib/seo';
export const metadata: Metadata = {
  title: 'Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing',
  description: 'Done-for-you lead gen websites for SMEs. Launch fast with AI-enhanced funnels and measurable ROI.',
  alternates: { canonical: canonical('/current-path') },
  openGraph: { ...{ title: 'Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing', description: 'Done-for-you lead gen websites for SMEs with AI-enhanced funnels.', url: canonical('/current-path'), type: 'website', siteName: 'Ellie Edwards Marketing' } },
  twitter: { card: 'summary_large_image', title: 'Lead Generation Websites – Fast, Measurable | Ellie Edwards Marketing', description: 'AI-enhanced funnels for SME lead gen.' },
  robots: IS_PROD ? 'index,follow' : 'noindex,nofollow'
};
```
Service JSON-LD:
```html
<script type="application/ld+json" suppressHydrationWarning>{
  "@context":"https://schema.org","@type":"Service","name":"Lead Generation Websites","provider":{"@type":"Organization","name":"Ellie Edwards Marketing","url":"https://www.ellieedwardsmarketing.com"},"areaServed":["GB","Surrey","Hampshire"],"description":"Done-for-you lead generation websites with AI-enhanced funnels and measurable ROI.","url":"https://www.ellieedwardsmarketing.com/services/lead-generation"}</script>
```
Article JSON-LD similar pattern.

---
## 3) PAGE CHECKLIST
- [ ] Title / Description / Canonical
- [ ] OG & Twitter
- [ ] 1 H1; hierarchy valid
- [ ] Internal links (2–3 contextual + hub)
- [ ] Image alts & sizes
- [ ] JSON-LD present & valid
- [ ] Primary CTA visible (above fold + end)
- [ ] Value prop & audience early
- [ ] No orphan page

---
## 4) OUTPUT FORMAT (AUDIT RETURN)
1. Summary (counts missing / errors)
2. Issue Table (File | Issue | Why | Fix Snippet | Severity)
3. Top 10 Fixes (impact order)
4. Ready-to-paste patches

---
## 5) HELPER (`lib/seo.ts` EXPECTED)
```ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ellieedwardsmarketing.com';
export const canonical = (p='/' ) => new URL(p, SITE_URL).toString();
export const IS_PROD = process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';
```

---
## 6) EXECUTION (FOR AI PROMPTS)
Use BUSINESS CONTEXT → propose page fixes; do not remove existing metadata—merge. Provide minimal valid TypeScript / HTML snippets. Ensure wording reflects value_props.

---
## 7) GOVERNANCE CADENCE
| Frequency | Action |
|-----------|--------|
| Weekly | Scan new pages for checklist completion |
| Monthly | Full crawl (Screaming Frog) – headings, canonicals, internal link depth |
| Quarterly | Content refresh pass (update stats, add FAQs, improve CTR titles) |

---
## 8) SUCCESS METRICS
| Metric | Target |
|--------|--------|
| Branded CTR (GSC) | >40% |
| Non-brand Impr Growth (90d) | +30% |
| Pages With JSON-LD | >90% eligible |
| Avg Word Count Core Services | >900 strategic words |
| Lead Form Conversion (organic sessions) | >4% |

---
## 9) REFRESH PLAYBOOK
When performance plateaus: Improve intro hook, add FAQ schema, embed fresh stat, add internal links from newer posts, upgrade media (diagram/video), test new CTA variant.

---
## 10) MIGRATION TO NEW BRAND STEPS
1. Replace BUSINESS CONTEXT.
2. Swap logo & brand palette tokens.
3. Rewrite service markdown (retain structure; new keywords).
4. Update org & website JSON-LD.
5. Regenerate sitemap; audit canonicals.
6. Run full audit; patch High severity items.

***
Maintain as living document; append change log below.

CHANGELOG:
- v1: Extracted from legacy combined `next-seo-instructions` and simplified.
