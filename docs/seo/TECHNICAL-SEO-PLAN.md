# TECHNICAL SEO PLAN & PERFORMANCE BLUEPRINT (NEXT.JS LEAD GEN TEMPLATE)

> Purpose: Ensure crawlability, indexability, speed, Core Web Vitals excellence, and scalable multi‑site reusability. **Plug & play** – adjust CONFIG then follow phased implementation.
>
> Complements: `ON-SITE SEO PLAN` & `OFF-SITE-SEO-PLAN.md`.

---
## 0) CONFIG (EDIT PER PROJECT)
```json
{
  "brand": "Ellie Edwards Marketing",
  "primary_domain": "www.ellieedwardsmarketing.com",
  "framework": "Next.js App Router",
  "hosting": "Vercel",
  "edge": true,
  "image_strategy": "next/image + WebP + AVIF",
  "fonts": ["Inter"],
  "log_collection": "Vercel + Log Drains (optional)",
  "environments": ["development", "staging", "production"],
  "perf_targets": {
    "lcp_ms": 1800,
    "cls": 0.05,
    "inp_ms": 150,
    "ttfb_ms": 200,
    "tbt_ms": 150
  },
  "crawl_frequency_days": 7,
  "backup_policy_days": 1,
  "uptime_slo_pct": 99.9
}
```

---
## 1) CORE TECH OBJECTIVES
1. Fast first paint & reduced JS cost (lean client bundles, edge caching).
2. Deterministic metadata & canonical system (single helper file).
3. Automated sitemap & robots by environment.
4. Structured data injection & validation workflow.
5. Accessibility AA baseline baked into component library.
6. Operational observability (crash, perf, uptime, indexing signals).
7. Easy multi‑brand replication (config driven).

---
## 2) ENVIRONMENT & INFRA
| Layer | Action | Tool |
|-------|--------|------|
| Domains | Force HTTPS + HSTS preload | Vercel / DNS |
| Redirects | 301 non‑www→www (or vice versa) | `vercel.json` |
| Security | Add Security Headers (CSP, X-Frame-Options, etc.) | Middleware / headers function |
| Envs | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ENV` | Vercel env vars |
| Edge Caching | Static + ISR for semi‑dynamic pages | Vercel ISR |
| Logging | Access logs → dashboard | Better Stack / Datadog (optional) |

---
## 3) SITE ARCHITECTURE
- Flat, descriptive route naming (`/services/seo`, `/case-studies/slug`).
- Avoid deep nesting >3 levels.
- Consistent dynamic segment patterns `[slug]`.
- Add `/health` lightweight endpoint for uptime monitors.

---
## 4) PERFORMANCE PROGRAM
### a) Measurement Stack
| Metric | Source | Cadence |
|--------|--------|---------|
| CWV Field (LCP, CLS, INP) | CrUX + web-vitals script | Weekly |
| Lab (Lighthouse) | CI (Scheduled) | Weekly |
| Bundle Size | `next build` stats JSON | Per PR |
| Edge Latency | Vercel Analytics | Weekly |
| Error Rate | Sentry | Continuous |

### b) Optimization Checklist
- [ ] Use `next/font` local or Google optimised subset.
- [ ] `preconnect` critical third-parties (already partly done).
- [ ] Eliminate hidden SEO nav (replace with accessible inline links) – reduces unused DOM.
- [ ] Convert large decorative PNG/JPG to WebP/AVIF.
- [ ] Enforce responsive `<Image>` sizes; no layout shift (set width/height).
- [ ] Lazy-load non-critical components via dynamic import.
- [ ] Remove unused polyfills / heavy libs (inspect bundle analyzer).
- [ ] Inline critical CSS under 14KB (App Router handles streaming; keep global minimal).
- [ ] Use `priority` only for LCP hero image.
- [ ] Audit hydration warnings (avoid client components unless interactive).

### c) Tooling Setup
Add script to `package.json`:
```json
"scripts": {
  "analyze": "NEXT_PRIVATE_DEBUG_STATS=1 next build"
}
```
After build, load stats with `webpack-bundle-analyzer` (optionally add plugin) or use `next build --debug`.

---
## 5) CRAWL & INDEX MANAGEMENT
| Element | Implementation | Notes |
|---------|---------------|-------|
| robots.ts | Env aware allow/disallow | Non‑prod `noindex,nofollow` |
| sitemap.ts | Programmatic pages from content MD | Include `lastModified` from front‑matter |
| Canonicals | `lib/seo.ts` canonical helper | Avoid relative canonical misuse |
| Pagination | Add rel=next/prev (if blog listing pagination introduced) | Future |
| Orphans | Crawl with Screaming Frog (custom extraction) | Quarterly |

---
## 6) STRUCTURED DATA SYSTEM
| Type | Where | Source |
|------|------|--------|
| Organization | `layout.tsx` | CONFIG business context |
| WebSite | Home | CONFIG |
| Service | Service detail pages | Markdown front‑matter |
| Article | Blog post pages | Markdown front‑matter |
| BreadcrumbList | All hierarchical pages | Route segments |
| FAQPage | Service / FAQ section if Q&A present | front‑matter `faqs` |

Implementation Pattern (Service):
```ts
const serviceJsonLd = (s: Service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.title,
  description: s.description,
  provider: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
  areaServed: ["GB", "Surrey", "Hampshire"],
  url: canonical(`/services/${s.serviceId}`)
});
```

---
## 7) ACCESSIBILITY (A11Y) BASELINE
- Semantic headings (one `<h1>`).
- All interactive elements keyboard navigable & visible focus.
- Color contrast ≥ WCAG AA.
- Descriptive `aria-label` for icon-only buttons.
- Form fields labelled + error messaging programmatic.
- Run `@axe-core/playwright` in CI (add script).

---
## 8) CODE HEALTH & CI
Add GitHub Actions (example):
```yaml
name: CI
on: [push, pull_request]
jobs:
  build_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck || true
      - run: npm run build
      - run: npm run test --if-present
```
Add separate workflow weekly for Lighthouse CI (cron) storing JSON to `/performance-reports/` for trend diff.

---
## 9) ERROR & QUALITY MONITORING
| Aspect | Tool | Threshold |
|--------|------|-----------|
| Runtime errors | Sentry | Spike >5/min triggers alert |
| 404 / 500 rates | Vercel Logs | >1% route errors investigation |
| Core Web Vitals | CrUX / Web-Vitals | LCP >2500ms triggers sprint |
| Index Coverage | GSC | Sudden excluded +15% week |

Add web-vitals listener:
```ts
// app/web-vitals.ts
import { onCLS, onINP, onLCP } from 'web-vitals';
export function reportWebVitals(cb: (metric: any) => void) {
  onCLS(cb); onINP(cb); onLCP(cb);
}
```
In `next.config.js`: `export const experimental = { instrumentationHook: true }` if using instrumentation.

---
## 10) DATA FLOW & CONTENT SOURCE
- Markdown → parse front‑matter → central typed model (services, blog, case studies).
- Avoid duplicate metadata functions (consolidate).
- Add caching layer (in‑memory Map) for content reads in production.
- Future: Consider edge KV (Upstash / Vercel KV) for frequently hit lists.

---
## 11) IMAGE & MEDIA POLICY
| Rule | Detail |
|------|-------|
| Format Priority | AVIF > WebP > fallback PNG/JPG |
| Dimensions | Provide explicit width/height always |
| Lazy | Default; `priority` only hero/LCP |
| CDN | Use Vercel Image Optimization |
| Compression | Target <100KB hero, <60KB support |

Add script (optional) to audit oversized images via `sharp`.

---
## 12) SECURITY & COMPLIANCE
| Area | Control | Note |
|------|---------|------|
| Headers | CSP, Referrer-Policy, X-Content-Type-Options | Add middleware |
| Forms | Basic spam honeypot + server validation | Add hidden timestamp field |
| Dependency | `npm audit --production` monthly | Automate in CI |
| Backups | Daily DB snapshot (if DB) | Not critical if static only |

Example CSP (adjust domains):
```
Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://www.google-analytics.com; font-src 'self' data:; frame-ancestors 'none';
```

---
## 13) MIGRATION / SCALE CHECKLIST (NEW BRAND SPIN-UP)
- [ ] Duplicate repo; update CONFIG objects.
- [ ] Replace business context JSON & env vars.
- [ ] Update logo & brand color tokens (Tailwind/theme).
- [ ] Purge service markdown & load new service set.
- [ ] Regenerate sitemap & run Screaming Frog crawl.
- [ ] Update Organization / WebSite JSON-LD.
- [ ] Validate canonical & robots in staging (noindex enforced).
- [ ] Remove any legacy redirects not needed.

---
## 14) AUDIT CADENCE
| Frequency | Task |
|-----------|------|
| Weekly | Lighthouse run, 404 scan, GSC coverage glance |
| Monthly | Full crawl (Screaming Frog), bundle size diff, schema validation sample |
| Quarterly | Tech debt review (duplicate helpers, dead code), performance retune |

---
## 15) QUICK TRIAGE FLOW (ISSUE RESPONSE)
1. Detect (alert / dashboard).
2. Reproduce locally (`npm run build && npm start`).
3. Classify (Performance / Crawlability / Indexing / Stability / Security).
4. Create issue with severity + acceptance criteria.
5. Fix behind feature flag if risky.
6. Validate (metrics return to baseline) then close.

---
## 16) MINIMUM LIGHTHOUSE TARGETS
| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | 100 |

Failing one target → create ticket with root cause breakdown.

---
## 17) DEPRECATION & CLEANUP POLICY
- Remove unused components after 30 days inactivity (no imports) – measured via code search.
- Consolidate duplicate util (e.g., service metadata) immediately.
- Archive old experiments under `/experiments/` with README context.

---
## 18) CHECKLIST (PRE-LAUNCH)
- [ ] All core pages have metadata & structured data.
- [ ] robots/sitemap valid & accessible.
- [ ] No console errors / hydration mismatches.
- [ ] CLS < 0.1 on all templates in lab tests.
- [ ] Images optimized and correctly sized.
- [ ] Contact / lead forms validated server-side.
- [ ] 404 & 500 custom pages present.
- [ ] Security headers applied.
- [ ] Env vars correct (prod domain) & canonical outputs verified.

---
## 19) EXIT CRITERIA (TECH FOUNDATION “DONE”)
- Core Web Vitals pass across 75% visits.
- Automated weekly CI Lighthouse with green baseline.
- Zero duplicate metadata helpers.
- Structured data coverage >90% of eligible templates.
- Bundle size stabilized (no >10% month-over-month growth without justification).

---
> Keep this doc versioned; append CHANGELOG at bottom when major system changes applied.
