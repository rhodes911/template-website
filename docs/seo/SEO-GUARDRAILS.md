# Field‑Level SEO Guardrails

A portable system to apply SEO rules (length, keywords, casing, slug hygiene) per field across pages and content types, with live guidance in Tina and enforcement in the agentic QA loop.

## Goals

- Make SEO rules explicit at the field level (H1, H2, Meta Title, Meta Description, Slug, Excerpt, OG fields).
- Keep rules reusable across page types via a role → rules model (not hard‑coded into schemas).
- Provide live feedback in Tina (badges, counters, pass/fail) and per‑field “Fix with AI”.
- Feed the same rules into the agentic QA loop so AI drafts are compliant by default.
- Keep it easy to extend (add new page types or tweak rules without code churn).

## What exists today

- About → SEO Assistant: QA checks metaTitle (50–60 chars), metaDescription (150–160 chars), and avoids banned phrases.
- Length targets exist in `seo.json` (e.g., About heroDescription words, Blog excerpt chars).
- Missing: heading rules (H1/H2), slug hygiene, per‑field keyword checks/density, casing/punctuation rules, and live Tina indicators.

## Core concepts

- Role: a semantic type of field that has shared SEO rules.
  - metaTitle, metaDescription, h1, h2, h3, slug, excerpt, ogTitle, ogDescription.
- Field → Role map: a central mapping that declares what role each content field plays.
- Role rules: char/word limits, keyword include/avoid, density caps, casing/punctuation, locale preferences.
- Overrides: allow per‑collection or per‑field overrides to deviate from defaults.

## Configuration structure

We store human‑editable rule configs in JSON and import them in code.

- File: `content/settings/seo-fields.json` (source of truth editors can read)
- Optional typed mirror: `src/lib/seo/fieldRules.ts` (for strict typing / IDE help)

Example `content/settings/seo-fields.json`:

```json
{
  "roles": {
    "metaTitle": { "limits": { "chars": { "min": 50, "max": 60 } }, "keyword": { "preferPrimaryAtStart": true, "brandSuffix": true } },
    "metaDescription": { "limits": { "chars": { "min": 150, "max": 160 } }, "style": { "benefitLed": true, "noClaimsWithoutContext": true } },
    "h1": { "limits": { "chars": { "min": 20, "max": 70 } }, "punctuation": { "noTrailingPeriod": true }, "keyword": { "requireAnyOf": ["business.targetKeywords.primary", "business.brand"] } },
    "h2": { "limits": { "chars": { "min": 10, "max": 80 } }, "style": { "sentenceCase": true }, "keyword": { "maxDensityPercent": 4 } },
    "slug": { "limits": { "chars": { "max": 60 } }, "slug": { "kebabCase": true, "dedupeStopwords": true } },
    "excerpt": { "limits": { "chars": { "min": 150, "max": 160 } }, "style": { "noBoilerplate": true } },
    "ogTitle": { "limits": { "chars": { "min": 30, "max": 60 } } },
    "ogDescription": { "limits": { "chars": { "min": 80, "max": 110 } } }
  },
  "overrides": {
    "blogPost": {
      "excerpt": { "limits": { "chars": { "min": 150, "max": 160 } } },
      "slug": { "limits": { "chars": { "max": 60 } }, "slug": { "kebabCase": true } }
    },
    "service": {
      "metaDescription": { "limits": { "chars": { "min": 140, "max": 170 } } }
    }
  },
  "locale": { "code": "en-GB" }
}
```

## Field → Role mapping

Define once, reuse everywhere.

- File: `src/lib/seo/fieldMap.ts`

Example mapping (TypeScript):

```ts
export type Role = 'metaTitle'|'metaDescription'|'h1'|'h2'|'h3'|'slug'|'excerpt'|'ogTitle'|'ogDescription';

export const fieldRoleMap: Record<string, Role> = {
  // About
  'about.heroTitle': 'h1',
  'about.storyApproachTitle': 'h2',
  'about.seo.metaTitle': 'metaTitle',
  'about.seo.metaDescription': 'metaDescription',

  // Services
  'service.heroTitle': 'h1',
  'service.description': 'metaDescription',

  // Blog
  'blogPost.title': 'h1',
  'blogPost.slug': 'slug',
  'blogPost.excerpt': 'excerpt',
  'blogPost.seo.metaTitle': 'metaTitle',
  'blogPost.seo.metaDescription': 'metaDescription'
};
```

Tip: Keep keys as `<collection>.<fieldPath>` to avoid ambiguity.

## Shared validator library

- File: `src/lib/seo/validate.ts`
- Purpose: single engine for both Tina UI and the agentic QA loop.

Contract:

```ts
export interface ValidateInput {
  value: string;
  role: Role;
  collection: 'about'|'service'|'blogPost'|'caseStudy'|'testimonial';
  settings: {
    rules: any;        // parsed seo-fields.json
    business?: any;    // business.json (brand, target keywords)
    page?: any;        // current doc frontmatter (targetKeywords etc.)
    locale?: string;   // e.g., en-GB
  };
}

export interface ValidateResult {
  pass: boolean;
  severity: 'ok'|'warn'|'error';
  metrics: { chars: number; words: number; density?: Record<string, number> };
  issues: string[];
}

export function validate(input: ValidateInput): ValidateResult;
```

Checks implemented:

- Limits: characters and words per role (and collection overrides).
- Keywords: must‑include any of (brand or primary), avoid phrases, density soft cap.
- Casing: title/sentence case by locale.
- Punctuation: no trailing period on H1, etc.
- Slug hygiene: kebab‑case, no duplicates or trailing slashes, length cap.

## Tina CMS: live guardrails UI

- Component: `tina/fields/SeoFieldGuard.tsx`
  - Shows counters and pass/warn/error badges for the current field’s role.
  - Optional “Fix with AI” button (calls our API to revise to compliance without changing meaning).
- Wiring examples in schema (`tina/config.ts`):
  - About → `heroTitle` as H1: add the guard UI below the input.
  - About → SEO metaTitle/metaDescription: guard below each input.
- Optional save policy:
  - Global toggle in settings (e.g., `seo.blockOnError: true/false`).
  - If true, block saving when severity is `error` for the mapped role.

## Agentic QA loop integration

- In `src/app/api/tina/ai-generate/route.ts`:
  - Load rules for the target role(s) based on `fieldRoleMap`.
  - Add constraints into the QA prompt (e.g., “Title 50–60 chars, UK English, avoid X”).
  - After each revision, run the same `validate()` and stop when compliant or iterations exhausted.

Pseudocode:

```ts
const rules = loadFieldRules();
const role = 'metaTitle';
let candidate = draft.metaTitle;
for (let i=1; i<=maxIters; i++) {
  const res = validate({ value: candidate, role, collection: 'about', settings });
  if (res.pass) break;
  const issues = formatIssues(res);
  candidate = await openAiRevise(candidate, issues, role, settings);
}
```

## Reuse across content types

- To extend to Services/Blog/Case Studies:
  1) Map their fields in `fieldRoleMap.ts`.
  2) Adjust `seo-fields.json` overrides if needed.
  3) Attach `SeoFieldGuard` to the mapped fields in Tina.
  4) For AI generators on those pages, include role constraints via the validator.

## Scanner script (optional but handy)

- File: `scripts/seo-validate-content.ts`
  - Scans `content/**` and validates mapped fields.
  - Prints a summary table: file, field, role, issues, severity, and metrics.

## Rollout plan

- Day 1
  - Add `seo-fields.json`, `fieldMap.ts`, `validate.ts`.
  - Wire guards to About: `heroTitle` (H1), `seo.metaTitle`, `seo.metaDescription`.
- Day 2
  - Extend to Services (heroTitle, description) and Blog (title, slug, excerpt).
  - Add per‑field “Fix with AI” using existing API.
- Day 3
  - CLI scanner + docs + optional block‑on‑error toggle.

## Risks & mitigations

- Over‑constraint frustration → Default to `warn`, not `error`. Provide a one‑click AI fix.
- Locale nuances (en‑GB) → Read from `seo.json` and adjust casing/punctuation.
- Pixel vs character measurements → Start with characters; add pixel approximation later if needed.

## Appendix

- Severity levels
  - ok: passes all checks.
  - warn: minor issues (e.g., 2 chars outside range); save allowed.
  - error: major issues (e.g., missing required keyword, slug invalid); may block save if toggle enabled.
- Casing presets
  - sentenceCase, titleCase (with proper minor word handling for en‑GB).
- Slug rules
  - Lowercase kebab‑case, no stopword duplication, remove trailing slashes, <= 60 characters.

---

If you want, I can scaffold the files (`seo-fields.json`, `fieldMap.ts`, `validate.ts`) and wire the guard UI to the About page so you can see it live.