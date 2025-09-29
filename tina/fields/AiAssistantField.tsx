"use client";
import React, { useCallback, useMemo, useState } from "react";

type Props = {
  input: any;
  field: any;
  form: any;
};

function detectCollection(values: any): "blogPost" | "service" | "caseStudy" | "testimonial" | "about" | undefined {
  if (!values) return undefined;
  if (values.serviceId || values.whatYouGet || values.process) return "service";
  if (values.author || values.publishDate || values.readingTime) return "blogPost";
  if (values.client || values.industry || values.readTime) return "caseStudy";
  if (values.company && typeof values.rating !== "undefined") return "testimonial";
  if (values.profileImage || values.credentials) return "about";
  return undefined;
}

export default function AiAssistantField({ input, field, form }: Props) {
  const currentValues = form?.getState?.()?.values || form?.values || form?.zustand?.getState?.()?.values;
  const autoCollection = useMemo(() => detectCollection(currentValues), [currentValues]);
  const initialCollection = (autoCollection as string | undefined) || (field?.defaultCollection as string | undefined) || undefined;
  const [collection, setCollection] = useState<string | undefined>(initialCollection);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [wordCount, setWordCount] = useState<number | undefined>(undefined);
  const [model, setModel] = useState<string>("");

  const siteUrl = (typeof window !== "undefined" ? window.location.origin : "") || "";
  const apiBase = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const loc = window.location;
      // When running inside Tina dev (port 4001), call Next app on 3000
      if (loc.port === "4001") return "http://localhost:3000";
      // Otherwise use same-origin
      return "";
    } catch {
      return "";
    }
  }, []);

  // Helpers hoisted so both Generate and Self Test can use them
  const toRichText = useCallback((markdown: string) => {
    const paras = (markdown || "").split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    return {
      type: "root",
      children: paras.length > 0
        ? paras.map((p: string) => ({ type: "p", children: [{ type: "text", text: p }] }))
        : [{ type: "p", children: [{ type: "text", text: markdown || "" }] }],
    } as any;
  }, []);

  const setValue = useCallback((name: string, value: any) => {
    try {
      if (typeof form?.change === "function") { form.change(name, value); return true; }
      if (typeof form?.finalForm?.change === "function") { form.finalForm.change(name, value); return true; }
      if (typeof form?.mutators?.setValue === "function") { form.mutators.setValue(name, value); return true; }
      if (input?.name === name && typeof input?.onChange === "function") { input.onChange(value); return true; }
    } catch (e) {
      console.warn("AI setValue error for", name, e);
    }
    return false;
  }, [form, input]);

  const setBody = useCallback((markdown?: string) => {
    if (!markdown) return;
    const ast = toRichText(markdown);
    // Candidate field names across versions
    const candidates = ["body", "content", "_body", "markdown", "raw", "rawBody", "markdownBody"];
    // 1) Children array attempts first
    const children = (ast as any)?.children;
    if (Array.isArray(children)) {
      for (const name of candidates) setValue(name, children);
      try { if (typeof form?.change === "function") form.change("body.children", children); } catch {}
      try { if (typeof form?.finalForm?.change === "function") form.finalForm.change("body.children", children); } catch {}
      try {
        if (children[0]) {
          for (const prefix of ["body", "content"]) {
            setValue(`${prefix}.0`, children[0]);
            if (children[0].children && children[0].children[0] && typeof children[0].children[0].text === 'string') {
              setValue(`${prefix}.0.children.0.text`, children[0].children[0].text);
            }
          }
        }
      } catch {}
    }
    // 2) Raw markdown next (markdown parser UIs accept this)
    for (const name of candidates) setValue(name, markdown);
    // Mirror into a plain textarea field for visibility when present (AI Drafts)
    try {
      const hasDraftMarkdown = Object.prototype.hasOwnProperty.call(form?.getState?.()?.values || {}, "draftMarkdown");
      const isAiDraft = !["blogPost","service","caseStudy","testimonial","about"].includes(collection || "");
      if (hasDraftMarkdown || isAiDraft) setValue("draftMarkdown", markdown);
    } catch {}
  // 3) Finally, set raw markdown again as the authoritative value (best compatibility)
  setValue("body", "");
  setValue("body", markdown);
  setTimeout(() => { try { setValue("body", markdown); } catch {} }, 10);
    setTimeout(() => {
      try {
        const v = form?.getState?.()?.values?.body;
        console.log("[AI] After set, body type:", Array.isArray(v) ? "array" : typeof v, v && (typeof v === 'string' ? v.slice(0,60) : JSON.stringify(v).slice(0,120)));
      } catch {}
    }, 0);
    setTimeout(() => {
      try {
        const vals = form?.getState?.()?.values || {};
        console.log("[AI] Body candidates snapshot:", Object.fromEntries(
          Object.entries(vals).filter(([k]) => ["body","content","_body","markdown","raw","rawBody","markdownBody"].includes(k))
        ));
      } catch {}
    }, 50);
  }, [form, setValue, toRichText, collection]);

  const copyDraftToBody = useCallback(() => {
    try {
      const vals = form?.getState?.()?.values || {};
      const md = typeof vals?.draftMarkdown === "string" ? vals.draftMarkdown : "";
      if (!md.trim()) return;
      setBody(md);
    } catch {}
  }, [form, setBody]);

  const onGenerate = useCallback(async () => {
    if (!collection) return;
    setError(null);
    setLoading(true);
    try {
  const res = await fetch(`${apiBase}/api/tina/ai-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection,
          brief: instructions || "Generate a small sample draft for testing only.",
          topic: topic || (collection === "blogPost" ? "Sample blog post" : collection === "service" ? "Sample service" : collection === "caseStudy" ? "Sample case study" : collection === "testimonial" ? "Sample testimonial" : "Sample about page"),
          keywords: (keywords || "sample, test").split(",").map((k: string) => k.trim()).filter(Boolean),
          wordCount: wordCount ?? 200,
          model: model || undefined,
          siteUrl: siteUrl || undefined,
        }),
      });
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) data = JSON.parse(match[0]);
      }
      if (!res.ok || !data?.ok) {
        const msg = data?.error || `AI generation failed (${res.status})`;
        console.error("AI generate error:", { status: res.status, text, data });
        throw new Error(msg);
      }
      const result = data.result || {};

      const firstString = (...vals: any[]) => vals.find(v => typeof v === "string" && v.trim().length > 0) as string | undefined;
      const fromSections = (sections: any) => {
        if (!Array.isArray(sections)) return undefined;
        try {
          return sections
            .map((s) => {
              const t = typeof s?.title === "string" ? s.title.trim() : "";
              const c = typeof s?.content === "string" ? s.content.trim() : "";
              if (t && c) return `## ${t}\n\n${c}`;
              if (c) return c;
              return "";
            })
            .filter(Boolean)
            .join("\n\n");
        } catch {
          return undefined;
        }
      };
      const bodyText = firstString(
        result.body,
        result.content,
        result.markdown,
        result.article,
        result.text,
        result.draft,
        fromSections(result.sections)
      );
      const excerptText = firstString(result.excerpt, result.summary, result.description);

  // helpers now hoisted

      // Debug: log the keys and body length we plan to set
      try {
        const keys = Object.keys(result || {});
        console.log("[AI] Client result keys:", keys);
        if (bodyText) console.log("[AI] Client body length:", bodyText.length);
      } catch {}

  // setBody hoisted

      if (collection === "blogPost") {
        if (result.title) setValue("title", result.title);
        if (excerptText) setValue("excerpt", excerptText);
        if (bodyText) setBody(bodyText);
      } else if (collection === "service") {
        if (result.title) setValue("title", result.title);
        if (result.subtitle) setValue("subtitle", result.subtitle);
        if (excerptText || result.description) setValue("description", excerptText || result.description);
        if (bodyText) setBody(bodyText);
      } else if (collection === "caseStudy") {
        if (result.title) setValue("title", result.title);
        if (result.client) setValue("client", result.client);
        if (bodyText) setBody(bodyText);
      } else if (collection === "testimonial") {
        if (result.name) setValue("name", result.name);
        if (result.company) setValue("company", result.company);
        if (bodyText) setBody(bodyText);
      } else if (collection === "about") {
        if (result.title) setValue("title", result.title);
        if (bodyText) setBody(bodyText);
      } else {
        // AI Drafts or unknown: set simple fields if present
        if (result.title) setValue("title", result.title);
        if (bodyText) setBody(bodyText);
      }
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [collection, instructions, topic, keywords, wordCount, model, siteUrl, currentValues, form, setBody, setValue]);

  const onSelfTest = useCallback(() => {
    setError(null);
    try {
      const md = `# Self-test\n\nThis is a test paragraph written by the self-test.\n\n- Bullet A\n- Bullet B\n`;
      console.log("[AI] SelfTest: collection:", collection);
      if (collection === "about") {
        setValue("name", "Self Test Name");
        setValue("title", "Self Test Title");
        setValue("subtitle", "Self Test Subtitle");
        setValue("heroTitle", "Self Test Hero Title");
        setValue("heroSubtitle", "Self Test Hero Subtitle");
        setValue("heroDescription", "Self Test hero description for the About page.");
        setValue("profileImage", "/images/profile.jpg");
        setValue("rating", 5);
        setValue("totalClients", "100+");
        setValue("ctaTitle", "Let’s talk");
        setValue("ctaDescription", "Book a free consultation.");
        setValue("credentials", ["Google Analytics Certified", "HubSpot Inbound Certified"]);
        setValue("values", [
          { title: "Integrity", description: "We do what’s right.", icon: "Shield" },
          { title: "Results", description: "Outcome focused.", icon: "TrendingUp" },
        ]);
        setValue("testimonials", [
          { name: "Alex", company: "Acme Co", quote: "Great to work with.", rating: 5 },
        ]);
        setValue("bodyIntro", "### Intro\n\nWe’re passionate about growing small businesses.");
        setValue("bodyApproach", "### Our Approach\n\nPragmatic, data-informed, and collaborative.");
        setValue("bodyResults", "### Results\n\nClear KPIs and meaningful outcomes.");
        setValue("bodyClosing", "### Closing\n\nReady when you are—let’s start.");
        setBody(md);
      } else if (collection === "service") {
        setValue("serviceId", "self-test");
        setValue("title", "Self Test Service");
        setValue("subtitle", "Reliable growth engine");
        setValue("description", "Meta description for self test service.");
        setValue("keywords", ["service", "growth", "marketing"]);
        setValue("icon", "Star");
        setValue("featured", false);
        setValue("order", 1);
        setValue("heroTitle", "Grow with confidence");
        setValue("heroSubtitle", "Practical plans that convert");
        setValue("heroDescription", "We build and execute revenue-focused campaigns.");
        setValue("whatYouGet", ["Strategy", "Execution", "Reporting"]);
        setValue("features", [
          { title: "Clarity", description: "Clear goals and plans.", icon: "Target" },
          { title: "Speed", description: "Launch quickly and iterate.", icon: "Rocket" },
        ]);
        setValue("process", [
          { step: "01", title: "Discovery", description: "Understand goals.", duration: "1w" },
          { step: "02", title: "Launch", description: "Go live and learn.", duration: "2w" },
        ]);
        setValue("results", ["More leads", "Higher ROI"]);
        setValue("faqs", [
          { question: "How fast?", answer: "Most see traction in 2–4 weeks." },
          { question: "What’s included?", answer: "Strategy, setup, and optimization." },
        ]);
        setValue("ctaTitle", "Get Started");
        setValue("ctaDescription", "Book a discovery call.");
        setValue("emailSubject", "Thanks for reaching out");
        setValue("emailBody", "We’ll be in touch shortly.");
        setBody(md);
      } else if (collection === "caseStudy") {
        setValue("title", "Self Test Case Study");
        setValue("client", "Acme Bakery");
        setValue("industry", "Food & Beverage");
        setValue("challenge", "Low online orders");
        setValue("solution", "Local SEO + paid social");
        setValue("image", "/images/case.jpg");
        setValue("date", "August 2025");
        setValue("readTime", "5 min read");
        setValue("featured", false);
        setValue("order", 1);
        setValue("tags", ["Local SEO", "Paid Social"]);
        setValue("results", { revenue: "+22%", onlineOrders: "+31%", socialFollowing: "+18%", customerRetention: "+9%" });
        setBody(md);
      } else if (collection === "testimonial") {
        setValue("name", "Jordan Lee");
        setValue("role", "Owner");
        setValue("company", "Bright Studio");
        setValue("image", "/images/person.jpg");
        setValue("rating", 5);
        setValue("featured", false);
        setValue("order", 1);
        setBody("Ellie’s team delivered results quickly and clearly.");
      } else {
        // blogPost or unknown
        setValue("title", "Self Test Blog Post");
        setValue("slug", "self-test-post");
        setValue("excerpt", "This is a self-test excerpt for the blog post.");
        setValue("featuredImage", "/images/sample.jpg");
        setValue("alt", "Sample image");
        setValue("author", { name: "Author Name", bio: "Short bio.", avatar: "/images/avatar.png", linkedin: "", twitter: "" });
        setValue("categories", ["SEO", "Digital Marketing"]);
        setValue("tags", ["self-test", "example"]);
        setValue("keywords", ["test", "sample"]);
        setValue("publishDate", new Date().toISOString());
        setValue("lastModified", new Date().toISOString());
        setValue("featured", false);
        setValue("readingTime", 3);
        setValue("seo", { metaTitle: "Self Test Meta Title", metaDescription: "Self test meta description.", canonicalUrl: "", noIndex: false });
        setValue("socialShare", { title: "Self Test Share", description: "Preview of the post.", image: "/images/sample.jpg" });
        setBody(md);
      }
      setTimeout(() => {
        try {
          const v = form?.getState?.()?.values;
          console.log("[AI] SelfTest snapshot keys:", Object.keys(v || {}));
        } catch {}
      }, 0);
    } catch (e: any) {
      setError(e?.message || "Self test error");
    }
  }, [form, setValue, setBody]);

  const disabled = !collection || loading;
  const bodyVal = form?.getState?.()?.values?.body;
  let bodyDebug = "(none)";
  try {
    if (typeof bodyVal === "string") bodyDebug = `string:${bodyVal.slice(0,60)}`;
    else if (Array.isArray(bodyVal)) bodyDebug = `array[len=${bodyVal.length}] ${JSON.stringify(bodyVal[0]||{}).slice(0,60)}`;
    else if (bodyVal && typeof bodyVal === "object") bodyDebug = `object ${JSON.stringify(bodyVal).slice(0,60)}`;
  } catch {}

  return (
    <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 6, background: "#fafafa" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong>AI Content Assistant</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={onSelfTest} disabled={loading} style={{ padding: "6px 10px", border: "1px solid #6b7280", borderRadius: 4, background: "white", color: "#111827" }}>
            Self Test
          </button>
          {(() => {
            try {
              const hasDraftMarkdown = Object.prototype.hasOwnProperty.call(form?.getState?.()?.values || {}, "draftMarkdown");
              if (!hasDraftMarkdown) return null;
            } catch { return null; }
            return (
              <button type="button" onClick={copyDraftToBody} disabled={loading} title="Copy Draft Markdown into Draft Content" style={{ padding: "6px 10px", border: "1px solid #6b7280", borderRadius: 4, background: "white", color: "#111827" }}>
                Copy to Draft Content
              </button>
            );
          })()}
          <button type="button" onClick={onGenerate} disabled={disabled} style={{ padding: "6px 10px", border: "1px solid #111827", borderRadius: 4, background: "#111827", color: "white" }}>
          {loading ? "Generating…" : "Generate Sample"}
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <label>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Collection</div>
          <select value={collection ?? ""} onChange={(e) => setCollection(e.target.value || undefined)} style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }}>
            <option value="">Select…</option>
            <option value="blogPost">Blog Post</option>
            <option value="service">Service</option>
            <option value="caseStudy">Case Study</option>
            <option value="testimonial">Testimonial</option>
            <option value="about">About</option>
          </select>
        </label>
        <label>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Topic</div>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Local SEO for restaurants" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
        </label>
        <label>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Instructions / Brief</div>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="Optional. Brand voice or sections to include…" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Keywords (comma separated)</div>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="sample, test" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
          </label>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Target Body Words</div>
            <input type="number" value={wordCount ?? ""} onChange={(e) => setWordCount(e.target.value ? Number(e.target.value) : undefined)} placeholder="200" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
          </label>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Model (optional)</div>
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
          </label>
        </div>
        {error && <div style={{ color: "#b91c1c", fontSize: 12 }}>{error}</div>}
  <div style={{ fontSize: 12, color: "#6b7280" }}>This will overwrite any returned fields in this draft. Review before saving.</div>
  <div style={{ fontSize: 11, color: "#6b7280" }}>Body Debug: {bodyDebug}</div>
      </div>
    </div>
  );
}
