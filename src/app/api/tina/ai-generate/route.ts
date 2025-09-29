/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs';
import fs from "fs";
import path from "path";
import { searchRag, formatCitations } from "@/lib/rag";

type CollectionType = "blogPost" | "service" | "caseStudy" | "testimonial" | "about";
type AboutSection = "hero" | "credentials" | "values" | "testimonials" | "body" | "bodyIntro" | "bodyApproach" | "bodyResults" | "bodyClosing" | "cta" | "seo";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const DEFAULT_VARIANTS = Number(process.env.AI_VARIANTS || 2);
const DEFAULT_MAX_ITERS = Number(process.env.AI_MAX_ITERS || 2);
const QA_MODEL = process.env.OPENAI_QA_MODEL || DEFAULT_MODEL;

type AiSettings = {
  systemInstructions?: string;
  brandVoice?: string;
  model?: string;
  siteUrl?: string;
  business?: any;
  seo?: any;
};

function loadAiSettings(): AiSettings {
  try {
    const settingsPath = path.join(process.cwd(), "content", "settings", "ai.json");
    const raw = fs.readFileSync(settingsPath, "utf8");
    const json = JSON.parse(raw);
    // try to merge business info if present
    try {
      const bizPath = path.join(process.cwd(), "content", "settings", "business.json");
      const bizRaw = fs.readFileSync(bizPath, "utf8");
      const business = JSON.parse(bizRaw);
      // optionally merge seo settings if present
      try {
        const seoPath = path.join(process.cwd(), "content", "settings", "seo.json");
        const seoRaw = fs.readFileSync(seoPath, "utf8");
        const seo = JSON.parse(seoRaw);
        return { ...(json as AiSettings), business, seo } as AiSettings;
      } catch {
        return { ...(json as AiSettings), business } as AiSettings;
      }
    } catch {
      // if business not present, still try seo
      try {
        const seoPath = path.join(process.cwd(), "content", "settings", "seo.json");
        const seoRaw = fs.readFileSync(seoPath, "utf8");
        const seo = JSON.parse(seoRaw);
        return { ...(json as AiSettings), seo } as AiSettings;
      } catch {
        return json as AiSettings;
      }
    }
  } catch {
    return {};
  }
}

const COLLECTION_SCHEMAS: Record<CollectionType, string> = {
  blogPost: `{
    "title": string,
    "slug": string,
    "excerpt": string,
    "featuredImage": string,
    "alt": string,
    "author": { "name": string, "bio": string, "avatar": string, "linkedin"?: string, "twitter"?: string },
    "categories": string[],
    "tags": string[],
    "keywords": string[],
    "publishDate": string, // ISO 8601
    "lastModified": string, // ISO 8601
    "featured": boolean,
    "readingTime": number,
    "seo"?: { "metaTitle"?: string, "metaDescription"?: string, "canonicalUrl"?: string, "noIndex"?: boolean },
    "socialShare"?: { "title"?: string, "description"?: string, "image"?: string },
    "body": string // Markdown content only
  }`,
  service: `{
    "serviceId": string,
    "title": string,
    "subtitle": string,
    "description": string, // meta description
    "keywords": string[],
    "icon": string,
    "featured": boolean,
    "order"?: number,
    "heroTitle": string,
    "heroSubtitle": string,
    "heroDescription": string,
    "whatYouGet": string[],
    "features": { "title": string, "description": string, "icon": string }[],
    "process": { "step": string, "title": string, "description": string, "duration": string }[],
    "results": string[],
    "faqs": { "question": string, "answer": string }[],
    "ctaTitle": string,
    "ctaDescription": string,
    "emailSubject": string,
    "emailBody": string,
    "body": string // Markdown content only
  }`,
  caseStudy: `{
    "title": string,
    "client": string,
    "industry": string,
    "challenge": string,
    "solution": string,
    "image": string,
    "date": string, // e.g. "November 2023" to match current content style
    "readTime": string, // e.g. "12 min read"
    "featured": boolean,
    "order"?: number,
    "tags"?: string[],
    "results"?: { [k: string]: string },
    "body": string // Markdown content only
  }`,
  testimonial: `{
    "name": string,
    "role": string,
    "company": string,
    "image": string,
    "rating": number,
    "featured": boolean,
    "order"?: number,
    "body": string // Markdown content only
  }`,
  about: `{
    "name": string,
    "title": string,
    "subtitle": string,
    "heroTitle": string,
    "heroSubtitle": string,
    "heroDescription": string,
    "profileImage": string,
    "rating": number,
    "totalClients": string,
    "ctaTitle": string,
    "ctaDescription": string,
    "credentials": string[],
    "values": { "title": string, "description": string, "icon": string }[],
    "testimonials"?: { "name": string, "company": string, "quote": string, "rating": number }[],
    "body": string // Markdown content only
  }`,
};

function buildSystemPrompt(collection: CollectionType, siteUrl?: string, brandVoice?: string, customSystemInstructions?: string, seoSettings?: any) {
  const schema = COLLECTION_SCHEMAS[collection];
  return [
  customSystemInstructions,
    siteUrl ? `Website URL (for context only): ${siteUrl}` : "",
    brandVoice ? `Brand voice: ${brandVoice}` : "",
  
  seoSettings?.region || seoSettings?.locale ? `Region/Locale: ${[seoSettings?.region, seoSettings?.locale].filter(Boolean).join(" / ")}` : "",
    "Output strictly valid JSON only. Do not include markdown fences or commentary.",
    "Match this exact JSON shape and property names for the requested collection:",
    schema,
  ].filter(Boolean).join("\n");
}

function buildUserPrompt(params: {
  collection: CollectionType;
  section?: AboutSection;
  subsection?: string;
  brief?: string;
  topic?: string;
  keywords?: string[];
  mustInclude?: string[];
  avoid?: string[];
  wordCount?: number;
  context?: any;
  aiSettings?: AiSettings;
}) {
  const { collection, section, subsection, brief, topic, keywords, mustInclude, avoid, wordCount, context, aiSettings } = params;
  const lines: string[] = [];
  if (section && collection === "about") {
    if (section === "body" && subsection) {
      lines.push(`Create only the About body subsection: ${subsection}.`);
    } else {
      lines.push(`Create only the ${section} section for the About page.`);
    }
  } else {
    lines.push(`Create a ${collection} draft suitable for direct publishing.`);
  }
  if (topic) lines.push(`Topic: ${topic}`);
  if (brief) lines.push(`Brief: ${brief}`);
  if (keywords?.length) lines.push(`Target keywords: ${keywords.join(", ")}`);
  if (mustInclude?.length) lines.push(`Must include: ${mustInclude.join(", ")}`);
  if (avoid?.length) lines.push(`Avoid: ${avoid.join(", ")}`);
  if (!section && wordCount) lines.push(`Aim for about ${wordCount} words of body content.`);
  if (!section) lines.push("Body must be clean Markdown, structured with H2/H3 sections where appropriate.");
  if (context && typeof context === 'object') {
    try {
  const ctx: any = { ...context };
  // Attach business info if available
  if (aiSettings?.business) ctx.business = aiSettings.business;
  if (aiSettings?.seo) ctx.seo = aiSettings.seo;
  const ctxKeys = Object.keys(ctx).slice(0, 30);
  const slim = ctxKeys.reduce((acc: any, k: string) => { acc[k] = ctx[k]; return acc; }, {} as any);
  lines.push("Context (site fields + business info; do not invent facts beyond this):");
  lines.push(JSON.stringify(slim));
    } catch {}
  }
  // Apply SEO nudges/constraints
  if (aiSettings?.seo) {
    const s = aiSettings.seo;
    if (s.keywordPolicy?.includeAlways?.length) lines.push(`Always include these keywords where natural: ${s.keywordPolicy.includeAlways.join(", ")}.`);
    if (s.keywordPolicy?.includePreferred?.length) lines.push(`Prefer these keywords where relevant: ${s.keywordPolicy.includePreferred.join(", ")}.`);
    if (s.keywordPolicy?.avoid?.length) lines.push(`Avoid these phrases: ${s.keywordPolicy.avoid.join(", ")}.`);
    if (collection === "blogPost" && s.lengthTargets?.blogPost?.excerptChars) {
      const ex = s.lengthTargets.blogPost.excerptChars;
      lines.push(`Keep excerpt between ${ex.min}-${ex.max} characters.`);
    }
    const lt = s.lengthTargets?.[collection as keyof typeof s.lengthTargets];
    if (lt?.body?.minWords && lt?.body?.maxWords && !section) {
      lines.push(`Aim body length between ${lt.body.minWords}-${lt.body.maxWords} words.`);
    }
    if (collection === "about" && section === "hero" && s.lengthTargets?.about?.heroDescription) {
      const h = s.lengthTargets.about.heroDescription;
      lines.push(`Hero description should be ${h.minWords}-${h.maxWords} words.`);
    }
  }
  // Collection-specific nudges
  if (collection === "blogPost") {
    lines.push(
      "Provide a compelling SEO title, a strong excerpt, and realistic readingTime. Use factual, non-fabricated data only."
    );
  }
  if (collection === "service") {
    lines.push("Use concise bullets for whatYouGet, features, process, and FAQs. Avoid fluff.");
  }
  if (collection === "caseStudy") {
    lines.push("Use authentic but generic results; do not invent company names beyond provided topic/brief.");
  }
  if (collection === "about" && section) {
  if (section === "hero") lines.push("Return heroDescription only (single concise string), keeping tone consistent with heroTitle and heroSubtitle.");
    if (section === "credentials") lines.push("Return credentials as a string array of concise credentials.");
    if (section === "values") lines.push("Return values as an array of objects with title, description, icon (Lucide name). Avoid repetition.");
    if (section === "testimonials") lines.push("Return testimonials as an array of objects: name, company, quote, rating (1-5). Keep quotes short and realistic.");
    if (section === "body") lines.push("Return body as Markdown string only; no extra keys.");
  if (section === "bodyIntro") lines.push("Return body as a Markdown intro for the About page.");
  if (section === "bodyApproach") lines.push("Return body as Markdown describing your approach/process.");
  if (section === "bodyResults") lines.push("Return body as Markdown showing outcomes and proof points (no fabrications).");
  if (section === "bodyClosing") lines.push("Return body as a Markdown closing section with a soft CTA.");
    if (section === "cta") lines.push("Return ctaTitle and ctaDescription only.");
    if (section === "seo") {
      lines.push("Return a single 'seo' object with metaTitle, metaDescription, optional canonicalUrl/noIndex/keywords, and openGraph { ogTitle, ogDescription, ogImage? } if useful.");
      lines.push("Meta Title: aim 50–60 characters; clear, benefit-led, brand-safe; UK English.");
      lines.push("Meta Description: aim 150–160 characters; specific and compelling, no fluff or claims not present in context.");
      lines.push("Do not copy competitor names or fabricate data. Match tone and locale.");
    }
  }
  return lines.join("\n");
}

// --- Compliance helpers for About → Hero ---
function countWords(s: string): number {
  return String(s || "").trim().split(/\s+/).filter(Boolean).length;
}

function getHeroLengthTarget(aiSettings?: AiSettings): { min?: number; max?: number } {
  const lt = (aiSettings as any)?.seo?.lengthTargets?.about?.heroDescription;
  return lt ? { min: lt.minWords, max: lt.maxWords } : {};
}

function includesAll(text: string, phrases: string[] = []): { pass: boolean; missing: string[] } {
  const t = (text || "").toLowerCase();
  const missing = (phrases || []).filter(p => p && !t.includes(String(p).toLowerCase()));
  return { pass: missing.length === 0, missing };
}

function avoidsAll(text: string, phrases: string[] = []): { pass: boolean; violations: string[] } {
  const t = (text || "").toLowerCase();
  const violations = (phrases || []).filter(p => p && t.includes(String(p).toLowerCase()));
  return { pass: violations.length === 0, violations };
}

function evaluateHeroCompliance(text: string, aiSettings?: AiSettings, extras?: { mustInclude?: string[]; avoid?: string[] }): {
  length: { pass: boolean; words: number; min?: number; max?: number };
  includes: { pass: boolean; missing: string[] };
  avoid: { pass: boolean; violations: string[] };
  overallPass: boolean;
} {
  const wc = countWords(text);
  const { min, max } = getHeroLengthTarget(aiSettings);
  const lengthPass = (min ? wc >= min : true) && (max ? wc <= max : true);
  const includeAlways = (aiSettings as any)?.seo?.keywordPolicy?.includeAlways || [];
  const reqIncludes = [...(includeAlways || []), ...((extras?.mustInclude) || [])];
  const incl = includesAll(text, reqIncludes);
  const avoidSet = (aiSettings as any)?.seo?.keywordPolicy?.avoid || [];
  const avoidCombined = [...(avoidSet || []), ...((extras?.avoid) || [])];
  const av = avoidsAll(text, avoidCombined);
  const overall = lengthPass && incl.pass && av.pass;
  return { length: { pass: lengthPass, words: wc, min, max }, includes: incl, avoid: av, overallPass: overall };
}

// --- Compliance helpers for About → SEO ---
function measureChars(s: string): number {
  return String(s || "").trim().length;
}

function evaluateSeoCompliance(meta: { title?: string; description?: string }, aiSettings?: AiSettings): {
  title: { pass: boolean; len: number; min: number; max: number };
  description: { pass: boolean; len: number; min: number; max: number };
  avoid: { pass: boolean; violations: string[] };
  overallPass: boolean;
} {
  const title = String(meta.title || "");
  const desc = String(meta.description || "");
  const tlen = measureChars(title);
  const dlen = measureChars(desc);
  const tMin = 50, tMax = 60;
  const dMin = 150, dMax = 160;
  const titlePass = tlen >= tMin && tlen <= tMax;
  const descPass = dlen >= dMin && dlen <= dMax;
  const avoidSet = (aiSettings as any)?.seo?.keywordPolicy?.avoid || [];
  const violations = (avoidSet || []).filter((p: string) => p && (title + " " + desc).toLowerCase().includes(String(p).toLowerCase()));
  const avoidPass = violations.length === 0;
  const overallPass = titlePass && descPass && avoidPass;
  return { title: { pass: titlePass, len: tlen, min: tMin, max: tMax }, description: { pass: descPass, len: dlen, min: dMin, max: dMax }, avoid: { pass: avoidPass, violations }, overallPass };
}

async function callOpenAIJSON(opts: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  temperature?: number;
}): Promise<{ ok: boolean; json?: any; error?: any; contentRaw?: string }> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.7,
      response_format: { type: "json_object" },
    }),
  });
  if (!resp.ok) {
    return { ok: false, error: { status: resp.status, statusText: resp.statusText, details: await resp.text() } };
  }
  const data = await resp.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) return { ok: false, error: { reason: 'empty_completion', data } };
  try {
    const json = JSON.parse(content);
    return { ok: true, json, contentRaw: content };
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try { return { ok: true, json: JSON.parse(match[0]), contentRaw: content }; } catch {}
    }
    return { ok: false, error: { reason: 'json_parse_error', content } };
  }
}

// (no-op helper section)

export async function POST(req: NextRequest) {
  const baseSettings = loadAiSettings();
  const origin = req.headers.get("origin");
  const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4001",
    "http://127.0.0.1:4001",
    process.env.NEXT_PUBLIC_SITE_URL || "",
  ].filter(Boolean));
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : "*";

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    const res = NextResponse.json(
      { error: "Missing OPENAI_API_KEY environment variable" },
      { status: 500 }
    );
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res;
  }

  const url = req.nextUrl;
  const debug = url?.searchParams?.get("debug") === "1" || !!process.env.AI_DEBUG;
  const wantReport = url?.searchParams?.get("report") === "1" || !!process.env.AI_DEBUG;
  const body = await req.json().catch(() => ({}));
  const {
    collection,
    section,
    subsection,
    brief,
    topic,
    keywords,
    mustInclude,
    avoid,
    wordCount,
  model,
    siteUrl,
    brandVoice,
    context,
  agentic,
    settingsOverride,
  variants: variantsOverride,
  maxIters: maxItersOverride,
  } = body as Partial<{
    collection: CollectionType;
    section: AboutSection;
    subsection?: string;
    brief: string;
    topic: string;
    keywords: string[];
    mustInclude: string[];
    avoid: string[];
    wordCount: number;
    context?: any;
    model: string;
    siteUrl: string;
    brandVoice: string;
  agentic: boolean;
    settingsOverride: Partial<AiSettings> & { seo?: any; business?: any };
  variants: number;
  maxIters: number;
  }>;
  // Deep merge utility for overrides (arrays override by replacement)
  const deepMerge = (a: any, b: any): any => {
    if (!b) return a;
    if (Array.isArray(a) || Array.isArray(b)) return b ?? a;
    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return b ?? a;
    const out: any = { ...a };
    for (const k of Object.keys(b)) {
      out[k] = k in a ? deepMerge(a[k], b[k]) : b[k];
    }
    return out;
  };
  const aiSettings: AiSettings = deepMerge(baseSettings, settingsOverride || {});
  // Default to agentic mode unless explicitly disabled
  const agenticEffective = agentic !== false;

  if (!collection || !(collection in COLLECTION_SCHEMAS)) {
    const res = NextResponse.json({ error: "Invalid or missing collection" }, { status: 400 });
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res;
  }

  // If about+section, override schema guidance to be section-specific
  const resolvedModel = model || aiSettings.model || DEFAULT_MODEL;
  const resolvedSiteUrl = siteUrl || aiSettings.siteUrl;
  const resolvedBrandVoice = brandVoice || aiSettings.brandVoice;
  const customSystem = aiSettings.systemInstructions;
  // Enforce presence of explicit system instructions (no fallback allowed)
  if (!customSystem || typeof customSystem !== 'string' || !customSystem.trim()) {
    const res = NextResponse.json(
      { error: "Missing systemInstructions in content/settings/ai.json. This endpoint requires explicit system instructions (no fallback)." },
      { status: 500 }
    );
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res;
  }
  let systemPrompt = buildSystemPrompt(collection, resolvedSiteUrl, resolvedBrandVoice, customSystem, aiSettings.seo);
  // Reporting helpers
  const startAt = Date.now();
  const timeline: Array<{ at: number; step: string; data?: any }> = [];
  const push = (step: string, data?: any) => {
    try { timeline.push({ at: Date.now() - startAt, step, data }); } catch {}
  };
  const makeReportId = () => {
    const ts = new Date().toISOString().replace(/[:]/g, '-');
    const sec = section ? `_${section}` : '';
    const agent = agenticEffective ? '_agentic' : '';
    return `${ts}_${collection}${sec}${agent}`;
  };
  const writeReport = (report: any) => {
    if (!wantReport) return null;
    try {
      const dir = path.join(process.cwd(), 'reports', 'ai');
      fs.mkdirSync(dir, { recursive: true });
      const id = makeReportId();
      const jsonPath = path.join(dir, `${id}.json`);
      const mdPath = path.join(dir, `${id}.md`);
      fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
      // Basic markdown rendering
      const lines: string[] = [];
      lines.push(`# AI Run Report: ${collection}${section? ' / '+section: ''}`);
      lines.push('');
      lines.push(`- Started: ${new Date(report.startedAt).toISOString()}`);
      lines.push(`- Duration: ${report.durationMs} ms`);
      lines.push(`- Model: ${report.model}`);
      lines.push(`- Agentic: ${report.agentic}`);
      if (report.topic) lines.push(`- Topic: ${report.topic}`);
      lines.push('');
      lines.push('## Timeline');
      for (const ev of report.timeline) {
        lines.push(`- [${String(ev.at).padStart(5,' ')} ms] ${ev.step}${ev.data ? ` — ${typeof ev.data==='string'?ev.data:JSON.stringify(ev.data)}`:''}`);
      }
      lines.push('');
      if (report.retrieval?.hits?.length) {
        lines.push('## Retrieval Hits');
        report.retrieval.hits.forEach((h: any, i: number) => {
          lines.push(`- [${i+1}] ${h.score.toFixed(3)} ${h.path} — ${h.title}`);
        });
        lines.push('');
      }
      if (report.outputPreview) {
        lines.push('## Output Preview');
        lines.push('');
        lines.push('```');
        lines.push(report.outputPreview);
        lines.push('```');
        lines.push('');
      }
      fs.writeFileSync(mdPath, lines.join('\n'), 'utf8');
      return { id, jsonPath, mdPath };
    } catch (e) {
      console.warn('[AI] Report write failed:', (e as any)?.message);
      return null;
    }
  };

  if (collection === "about" && section) {
    const SECTION_SCHEMAS: Record<AboutSection, string> = {
  hero: `{ "heroDescription": string }`,
      credentials: `{ "credentials": string[] }`,
      values: `{ "values": { "title": string, "description": string, "icon": string }[] }`,
      testimonials: `{ "testimonials": { "name": string, "company": string, "quote": string, "rating": number }[] }`,
      body: `{ "body": string }`,
      bodyIntro: `{ "body": string }`,
      bodyApproach: `{ "body": string }`,
      bodyResults: `{ "body": string }`,
      bodyClosing: `{ "body": string }`,
      cta: `{ "ctaTitle": string, "ctaDescription": string }`,
  seo: `{ "seo": { "metaTitle": string, "metaDescription": string, "canonicalUrl"?: string, "noIndex"?: boolean, "keywords"?: string[], "openGraph"?: { "ogTitle"?: string, "ogDescription"?: string, "ogImage"?: string } } }`,
    };
    systemPrompt = [
  customSystem,
      resolvedSiteUrl ? `Website URL (for context only): ${resolvedSiteUrl}` : "",
      resolvedBrandVoice ? `Brand voice: ${resolvedBrandVoice}` : "",
      
      aiSettings?.seo?.region || aiSettings?.seo?.locale ? `Region/Locale: ${[aiSettings?.seo?.region, aiSettings?.seo?.locale].filter(Boolean).join(" / ")}` : "",
      "Output strictly valid JSON only. Do not include markdown fences or commentary.",
      "Return only the fields for the requested About section, matching this exact JSON shape:",
      SECTION_SCHEMAS[section],
    ].filter(Boolean).join("\n");
  }
  const t0 = Date.now();
  if (debug) console.log("[AI] START", { collection, section, subsection, topic, wordCount, model: model || aiSettings.model || DEFAULT_MODEL });
  push('start', { collection, section, subsection, topic, wordCount, model: resolvedModel, agentic: agenticEffective });
  // Ensure business/seo context is available in prompts for About flows even if caller didn't provide context
  const contextEffective = (collection === 'about')
    ? ((context && typeof context === 'object') ? context : {})
    : context;
  let userPrompt = buildUserPrompt({ collection, section, subsection, brief, topic, keywords, mustInclude, avoid, wordCount, context: contextEffective as any, aiSettings });
  let retrievalSummary: undefined | { q: string; hits: { path: string; title: string; score: number; count?: number }[]; totalHits?: number; uniqueDocs?: number } = undefined;
  let retrievalCitationsText: string | undefined = undefined;
  // Agentic retrieve: inject top-k citations for grounding
  if (agenticEffective) {
    const q = [topic, brief, (keywords || []).join(' '), collection, section].filter(Boolean).join(' ');
    if (debug) console.log("[AI] Retrieve q=", q);
    const hits = searchRag(q, { k: 4, debug });
    if (hits.length) {
      const cites = formatCitations(hits);
      retrievalCitationsText = cites;
      userPrompt += `\n\nUse only the following retrieved site context. Cite inline with [1], [2]... when copying facts.\n${cites}`;
      if (debug) {
        console.log("[AI] Retrieved", hits.length, "chunks; appended citations block");
      }
      // Deduplicate hits by path for reporting clarity (retain best score and count occurrences)
      const byPath = new Map<string, { path: string; title: string; score: number; count: number }>();
      for (const h of hits) {
        const key = h.path;
        const existing = byPath.get(key);
        if (!existing) {
          byPath.set(key, { path: h.path, title: h.title, score: h.score, count: 1 });
        } else {
          existing.count += 1;
          if (h.score > existing.score) existing.score = h.score;
        }
      }
      const deduped = Array.from(byPath.values()).sort((a, b) => b.score - a.score);
      retrievalSummary = { q, hits: deduped, totalHits: hits.length, uniqueDocs: deduped.length };
      push('retrieve.done', retrievalSummary);
    } else {
      push('retrieve.none', { q });
    }
  }

  try {
  // Full loop only for About → Hero when agentic is on; other cases use the original single-pass
    if (collection === 'about' && section === 'hero' && agenticEffective) {
      const variants = Math.max(1, Number.isFinite(variantsOverride as any) ? Number(variantsOverride) : DEFAULT_VARIANTS);
      const maxIters = Math.max(0, Number.isFinite(maxItersOverride as any) ? Number(maxItersOverride) : DEFAULT_MAX_ITERS);
      const allVariants: Array<{
        index: number;
        draft: any;
        final: any;
        iterations: Array<{ n: number; compliance: any; text: string }>;
        compliance: any;
        score: number;
        contentRaw?: string;
      }> = [];

      const sectionSystem = [
        customSystem,
        resolvedSiteUrl ? `Website URL (for context only): ${resolvedSiteUrl}` : "",
        resolvedBrandVoice ? `Brand voice: ${resolvedBrandVoice}` : "",
        aiSettings?.seo?.region || aiSettings?.seo?.locale ? `Region/Locale: ${[aiSettings?.seo?.region, aiSettings?.seo?.locale].filter(Boolean).join(" / ")}` : "",
        "Output strictly valid JSON only. Do not include markdown fences or commentary.",
        "Return only the fields for the requested About section, matching this exact JSON shape:",
        `{ "heroDescription": string }`,
      ].filter(Boolean).join("\n");

      for (let i = 0; i < variants; i++) {
        const variantUser = `${userPrompt}\n\nVariant hint: option ${i + 1}.`;
        if (debug) console.log(`[AI] Variant ${i+1} draft…`);
        push('openai.request', { provider: 'openai', model: resolvedModel, variant: i+1 });
        const draftResp = await callOpenAIJSON({ apiKey: OPENAI_API_KEY, model: resolvedModel, system: sectionSystem, user: variantUser, temperature: 0.8 });
        if (!draftResp.ok) {
          push('openai.response', { error: draftResp.error, variant: i+1 });
          allVariants.push({ index: i+1, draft: null, final: null, iterations: [], compliance: { overallPass: false, error: draftResp.error }, score: -1 });
          continue;
        }
        const draft = draftResp.json || {};
        const hero = String(draft?.heroDescription || "");
        push('openai.response', { keys: Object.keys(draft || {}), variant: i+1 });
        const iterLog: Array<{ n: number; compliance: any; text: string }> = [];
        let current = hero;
        let compliance = evaluateHeroCompliance(current, aiSettings, { mustInclude, avoid });
        iterLog.push({ n: 0, compliance, text: current });

        // QA revise loop
        for (let n = 1; n <= maxIters && !compliance.overallPass; n++) {
          const issues: string[] = [];
          if (!compliance.length.pass) issues.push(`Length must be ${compliance.length.min ?? 'any'}-${compliance.length.max ?? 'any'} words; current ${compliance.length.words}.`);
          if (!compliance.includes.pass && compliance.includes.missing.length) issues.push(`Missing required phrases: ${compliance.includes.missing.join(', ')}`);
          if (!compliance.avoid.pass && compliance.avoid.violations.length) issues.push(`Remove banned phrases: ${compliance.avoid.violations.join(', ')}`);
          const constraints: string[] = [];
          const lt = getHeroLengthTarget(aiSettings);
          if (lt.min || lt.max) constraints.push(`Hero description must be between ${lt.min ?? '0'} and ${lt.max ?? '∞'} words.`);
          const inclAlways = (aiSettings as any)?.seo?.keywordPolicy?.includeAlways || [];
          if (inclAlways.length) constraints.push(`Include always (where natural): ${inclAlways.join(', ')}`);
          const avoidList = (aiSettings as any)?.seo?.keywordPolicy?.avoid || [];
          if (avoidList.length) constraints.push(`Avoid: ${avoidList.join(', ')}`);
          if (Array.isArray(mustInclude) && mustInclude.length) constraints.push(`Must include: ${mustInclude.join(', ')}`);
          if (Array.isArray(avoid) && avoid.length) constraints.push(`Also avoid: ${avoid.join(', ')}`);
          const qaSystem = [
            "You are a strict marketing editor. Rewrite to satisfy constraints exactly.",
            resolvedBrandVoice ? `Maintain brand voice: ${resolvedBrandVoice}` : "",
            "Return JSON only: { \"heroDescription\": string }",
          ].filter(Boolean).join("\n");
          const qaUser = [
            `Candidate hero: ${JSON.stringify(current)}`,
            constraints.length ? `Constraints:\n- ${constraints.join('\n- ')}` : '',
            issues.length ? `Fix these issues:\n- ${issues.join('\n- ')}` : 'If compliant already, tighten clarity without breaking constraints.',
            retrievalCitationsText ? `Use only this site context if needed; do not fabricate facts:\n${retrievalCitationsText}` : '',
          ].filter(Boolean).join("\n\n");
          if (debug) console.log(`[AI] QA revise ${n} for variant ${i+1}…`);
          push('qa.revise.request', { model: QA_MODEL, variant: i+1, iter: n });
          const qaResp = await callOpenAIJSON({ apiKey: OPENAI_API_KEY, model: QA_MODEL, system: qaSystem, user: qaUser, temperature: 0.3 });
          if (!qaResp.ok) {
            push('qa.revise.response', { error: qaResp.error, variant: i+1, iter: n });
            break;
          }
          const revised = String(qaResp.json?.heroDescription || current);
          push('qa.revise.response', { keys: Object.keys(qaResp.json || {}), variant: i+1, iter: n });
          current = revised;
          compliance = evaluateHeroCompliance(current, aiSettings, { mustInclude, avoid });
          iterLog.push({ n, compliance, text: current });
        }

        // Score: prioritize overall pass, then distance to mid length
        let score = 0;
        if (compliance.overallPass) {
          score += 1000;
          const lt = getHeroLengthTarget(aiSettings);
          if (typeof lt.min === 'number' && typeof lt.max === 'number') {
            const minNum = Number(lt.min);
            const maxNum = Number(lt.max);
            const mid = (minNum + maxNum) / 2;
            const wc = countWords(current);
            const dist = Math.abs((wc as number) - (mid as number));
            score += Math.max(0, 200 - Math.min(200, dist * 10));
          }
        } else {
          // partial credit
          if (compliance.length.pass) score += 100;
          if (compliance.includes.pass) score += 100;
          if (compliance.avoid.pass) score += 100;
        }

        allVariants.push({ index: i+1, draft, final: { heroDescription: current }, iterations: iterLog, compliance, score, contentRaw: draftResp.contentRaw });
        push('variant.produced', { variant: i+1, score, pass: compliance.overallPass });
      }

      // Select best variant
      const sorted = allVariants.slice().sort((a,b)=> b.score - a.score);
      const winner = sorted[0] || allVariants[0];
      push('variant.selected', { variant: winner?.index, score: winner?.score, pass: winner?.compliance?.overallPass });

      const resultJson = winner?.final || { heroDescription: allVariants[0]?.final?.heroDescription || '' };

      const reportInfo = writeReport({
        startedAt: t0,
        durationMs: Date.now() - t0,
        model: resolvedModel,
        agentic: agenticEffective,
        topic,
        collection,
        section,
        timeline,
        settings: { siteUrl: resolvedSiteUrl, brandVoice: resolvedBrandVoice, hasBusiness: !!aiSettings.business, hasSeo: !!aiSettings.seo },
        retrieval: retrievalSummary,
        variants: allVariants.map(v=> ({ index: v.index, score: v.score, compliance: v.compliance, draftKeys: v.draft ? Object.keys(v.draft) : [], finalPreview: String(v.final?.heroDescription || '').slice(0,200), iterations: v.iterations })),
        outputPreview: String(resultJson?.heroDescription || '').slice(0, 600),
      });

      const res = NextResponse.json({ ok: true, collection, result: resultJson, report: reportInfo });
      res.headers.set("Access-Control-Allow-Origin", allowOrigin);
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      return res;
    }

    // Agentic loop for About → SEO
    if (collection === 'about' && section === 'seo' && agenticEffective) {
      const variants = Math.max(1, Number.isFinite(variantsOverride as any) ? Number(variantsOverride) : DEFAULT_VARIANTS);
      const maxIters = Math.max(0, Number.isFinite(maxItersOverride as any) ? Number(maxItersOverride) : DEFAULT_MAX_ITERS);
      const allVariants: Array<{
        index: number;
        draft: any;
        final: any;
        iterations: Array<{ n: number; compliance: any; data: any }>;
        compliance: any;
        score: number;
        contentRaw?: string;
      }> = [];

      const sectionSystem = [
        customSystem,
        resolvedSiteUrl ? `Website URL (for context only): ${resolvedSiteUrl}` : "",
        resolvedBrandVoice ? `Brand voice: ${resolvedBrandVoice}` : "",
        aiSettings?.seo?.region || aiSettings?.seo?.locale ? `Region/Locale: ${[aiSettings?.seo?.region, aiSettings?.seo?.locale].filter(Boolean).join(" / ")}` : "",
        "Output strictly valid JSON only. Do not include markdown fences or commentary.",
        "Return only the fields for the requested About section, matching this exact JSON shape:",
        `{ "seo": { "metaTitle": string, "metaDescription": string, "canonicalUrl"?: string, "noIndex"?: boolean, "keywords"?: string[], "openGraph"?: { "ogTitle"?: string, "ogDescription"?: string, "ogImage"?: string } } }`,
      ].filter(Boolean).join("\n");

      for (let i = 0; i < variants; i++) {
        const variantUser = `${userPrompt}\n\nVariant hint: option ${i + 1}.`;
        if (debug) console.log(`[AI] SEO Variant ${i+1} draft…`);
        push('openai.request', { provider: 'openai', model: resolvedModel, variant: i+1 });
        const draftResp = await callOpenAIJSON({ apiKey: OPENAI_API_KEY, model: resolvedModel, system: sectionSystem, user: variantUser, temperature: 0.8 });
        if (!draftResp.ok) {
          push('openai.response', { error: draftResp.error, variant: i+1 });
          allVariants.push({ index: i+1, draft: null, final: null, iterations: [], compliance: { overallPass: false, error: draftResp.error }, score: -1 });
          continue;
        }
        const draft = draftResp.json || {};
        const seoObj = (draft?.seo || {}) as any;
        const cur = { title: String(seoObj?.metaTitle || ''), description: String(seoObj?.metaDescription || '') };
        push('openai.response', { keys: Object.keys(draft || {}), variant: i+1 });
        const iterLog: Array<{ n: number; compliance: any; data: any }> = [];
        let current = { ...seoObj };
        let compliance = evaluateSeoCompliance({ title: cur.title, description: cur.description }, aiSettings);
        iterLog.push({ n: 0, compliance, data: current });

        for (let n = 1; n <= maxIters && !compliance.overallPass; n++) {
          const issues: string[] = [];
          if (!compliance.title.pass) issues.push(`Title must be ${compliance.title.min}-${compliance.title.max} chars; current ${compliance.title.len}.`);
          if (!compliance.description.pass) issues.push(`Description must be ${compliance.description.min}-${compliance.description.max} chars; current ${compliance.description.len}.`);
          if (!compliance.avoid.pass && compliance.avoid.violations.length) issues.push(`Remove banned phrases: ${compliance.avoid.violations.join(', ')}`);
          const constraints: string[] = [
            "Title 50–60 chars; Description 150–160 chars; UK English; clear and compelling; no fluff.",
          ];
          const avoidList = (aiSettings as any)?.seo?.keywordPolicy?.avoid || [];
          if (avoidList.length) constraints.push(`Avoid: ${avoidList.join(', ')}`);
          const inclAlways = (aiSettings as any)?.seo?.keywordPolicy?.includeAlways || [];
          if (inclAlways.length) constraints.push(`Use these only if natural: ${inclAlways.join(', ')}`);
          const qaSystem = [
            "You are a strict SEO editor. Rewrite to satisfy constraints exactly.",
            resolvedBrandVoice ? `Maintain brand voice: ${resolvedBrandVoice}` : "",
            "Return JSON only: { \"seo\": { \"metaTitle\": string, \"metaDescription\": string, \"canonicalUrl\"?: string, \"noIndex\"?: boolean, \"keywords\"?: string[], \"openGraph\"?: { \"ogTitle\"?: string, \"ogDescription\"?: string, \"ogImage\"?: string } } }",
          ].filter(Boolean).join("\n");
          const qaUser = [
            `Candidate SEO: ${JSON.stringify(current)}`,
            constraints.length ? `Constraints:\n- ${constraints.join('\n- ')}` : '',
            issues.length ? `Fix these issues:\n- ${issues.join('\n- ')}` : 'If compliant already, tighten clarity without breaking constraints.',
            retrievalCitationsText ? `Use only this site context if needed; do not fabricate facts:\n${retrievalCitationsText}` : '',
          ].filter(Boolean).join("\n\n");
          if (debug) console.log(`[AI] SEO QA revise ${n} for variant ${i+1}…`);
          push('qa.revise.request', { model: QA_MODEL, variant: i+1, iter: n });
          const qaResp = await callOpenAIJSON({ apiKey: OPENAI_API_KEY, model: QA_MODEL, system: qaSystem, user: qaUser, temperature: 0.3 });
          if (!qaResp.ok) { push('qa.revise.response', { error: qaResp.error, variant: i+1, iter: n }); break; }
          const revisedSeo = (qaResp.json?.seo || current) as any;
          push('qa.revise.response', { keys: Object.keys(qaResp.json || {}), variant: i+1, iter: n });
          current = revisedSeo;
          compliance = evaluateSeoCompliance({ title: String(current?.metaTitle || ''), description: String(current?.metaDescription || '') }, aiSettings);
          iterLog.push({ n, compliance, data: current });
        }

        // Score: prioritize overall pass; small bonus for closeness to mid-range
        let score = 0;
        if (compliance.overallPass) {
          score += 1000;
          const tMid = (compliance.title.min + compliance.title.max) / 2;
          const dMid = (compliance.description.min + compliance.description.max) / 2;
          const tDist = Math.abs(measureChars(current?.metaTitle || '') - tMid);
          const dDist = Math.abs(measureChars(current?.metaDescription || '') - dMid);
          score += Math.max(0, 200 - Math.min(200, tDist * 5));
          score += Math.max(0, 200 - Math.min(200, dDist * 2));
        } else {
          if (compliance.title.pass) score += 100;
          if (compliance.description.pass) score += 100;
          if (compliance.avoid.pass) score += 100;
        }

        allVariants.push({ index: i+1, draft, final: { seo: current }, iterations: iterLog, compliance, score, contentRaw: draftResp.contentRaw });
        push('variant.produced', { variant: i+1, score, pass: compliance.overallPass });
      }

      const sorted = allVariants.slice().sort((a,b)=> b.score - a.score);
      const winner = sorted[0] || allVariants[0];
      push('variant.selected', { variant: winner?.index, score: winner?.score, pass: winner?.compliance?.overallPass });
      const resultJson = winner?.final || { seo: allVariants[0]?.final?.seo || {} };

      const reportInfo = writeReport({
        startedAt: t0,
        durationMs: Date.now() - t0,
        model: resolvedModel,
        agentic: agenticEffective,
        topic,
        collection,
        section,
        timeline,
        settings: { siteUrl: resolvedSiteUrl, brandVoice: resolvedBrandVoice, hasBusiness: !!aiSettings.business, hasSeo: !!aiSettings.seo },
        retrieval: retrievalSummary,
        variants: allVariants.map(v=> ({ index: v.index, score: v.score, compliance: v.compliance, draftKeys: v.draft ? Object.keys(v.draft) : [], finalPreview: String(v.final?.seo?.metaTitle || '').slice(0,120) + ' | ' + String(v.final?.seo?.metaDescription || '').slice(0,180), iterations: v.iterations })),
        outputPreview: `${String(resultJson?.seo?.metaTitle || '').slice(0,80)}\n${String(resultJson?.seo?.metaDescription || '').slice(0, 200)}`,
      });

      const res = NextResponse.json({ ok: true, collection, result: resultJson, report: reportInfo });
      res.headers.set("Access-Control-Allow-Origin", allowOrigin);
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      return res;
    }

    // Fallback to original single-pass for other requests
    if (debug) console.log("[AI] Calling OpenAI…");
    push('openai.request', { provider: 'openai', model: resolvedModel });
    const single = await callOpenAIJSON({ apiKey: OPENAI_API_KEY, model: resolvedModel, system: systemPrompt, user: userPrompt, temperature: 0.7 });
    if (!single.ok) {
      console.error("[AI] OpenAI error:", single.error);
      const reportInfo = writeReport({
        startedAt: t0,
        durationMs: Date.now() - t0,
        model: resolvedModel,
        agentic: agenticEffective,
        topic,
        collection,
        section,
        timeline,
        settings: { siteUrl: resolvedSiteUrl, brandVoice: resolvedBrandVoice, hasBusiness: !!aiSettings.business, hasSeo: !!aiSettings.seo },
        error: single.error,
      });
      const res = NextResponse.json(
        { error: "OpenAI API error", details: single.error, report: reportInfo },
        { status: 502 }
      );
      res.headers.set("Access-Control-Allow-Origin", allowOrigin);
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      return res;
    }
    const json = single.json;
    try {
      push('openai.response', { keys: Object.keys(json || {}) });
    } catch {}
    const bodyLikeForReport = typeof (json?.body || json?.content || json?.markdown || json?.text || '') === 'string' ? (json?.body || json?.content || json?.markdown || json?.text || '') : '';
    const reportInfo = writeReport({
      startedAt: t0,
      durationMs: Date.now() - t0,
      model: resolvedModel,
      agentic: agenticEffective,
      topic,
      collection,
      section,
      timeline,
      settings: { siteUrl: resolvedSiteUrl, brandVoice: resolvedBrandVoice, hasBusiness: !!aiSettings.business, hasSeo: !!aiSettings.seo },
      retrieval: retrievalSummary,
      outputPreview: bodyLikeForReport ? String(bodyLikeForReport).slice(0, 600) : undefined,
    });

    const res = NextResponse.json({ ok: true, collection, result: json, report: reportInfo });
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res;
  } catch (err: any) {
    console.error("[AI] Route error:", err);
    const reportInfo = writeReport({
      startedAt: t0,
      durationMs: Date.now() - t0,
      model: resolvedModel,
      agentic: agenticEffective,
      topic,
      collection,
      section,
      timeline,
      retrieval: retrievalSummary,
      settings: { siteUrl: resolvedSiteUrl, brandVoice: resolvedBrandVoice, hasBusiness: !!aiSettings.business, hasSeo: !!aiSettings.seo },
      error: { reason: 'exception', message: err?.message }
    });
    const res = NextResponse.json({ error: err?.message || "Unexpected error", report: reportInfo }, { status: 500 });
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res;
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4001",
    "http://127.0.0.1:4001",
    process.env.NEXT_PUBLIC_SITE_URL || "",
  ].filter(Boolean));
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : "*";
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", allowOrigin);
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}
