/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

export function AiAssistantField({ input, field, form }: Props) {
  const currentValues = form?.values || form?.zustand?.getState?.()?.values;
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

  const siteUrl = (typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL) || "";

  const onGenerate = useCallback(async () => {
    if (!collection) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tina/ai-generate", {
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
        // Try salvage JSON object substring if present
        const match = text.match(/\{[\s\S]*\}/);
        if (match) data = JSON.parse(match[0]);
      }
      if (!res.ok || !data?.ok) {
        const msg = data?.error || `AI generation failed (${res.status})`;
        throw new Error(msg);
      }
      const result = data.result || {};
      // Map fields into the simplest targets based on collection
      const updated = { ...(currentValues || {}) } as any;
      if (collection === "blogPost") {
        if (result.title) updated.title = result.title;
        if (result.excerpt) updated.excerpt = result.excerpt;
        if (result.body) updated.body = result.body;
      } else if (collection === "service") {
        if (result.title) updated.title = result.title;
        if (result.subtitle) updated.subtitle = result.subtitle;
        if (result.description) updated.description = result.description;
        if (result.body) updated.body = result.body;
      } else if (collection === "caseStudy") {
        if (result.title) updated.title = result.title;
        if (result.client) updated.client = result.client;
        if (result.body) updated.body = result.body;
      } else if (collection === "testimonial") {
        if (result.name) updated.name = result.name;
        if (result.company) updated.company = result.company;
        if (result.body) updated.body = result.body;
      } else if (collection === "about") {
        if (result.title) updated.title = result.title;
        if (result.body) updated.body = result.body;
      }
      // Fallback: if current doc is in AI Drafts collection, just set title/body
      if (!updated.title && result.title) updated.title = result.title;
      if (!updated.body && result.body) updated.body = result.body;
      form.updateValues(updated);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [collection, instructions, topic, keywords, wordCount, model, siteUrl, currentValues, form]);

  const disabled = !collection || loading;

  return (
    <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 6, background: "#fafafa" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong>AI Content Assistant</strong>
        <button type="button" onClick={onGenerate} disabled={disabled} style={{ padding: "6px 10px", border: "1px solid #111827", borderRadius: 4, background: "#111827", color: "white" }}>
          {loading ? "Generating…" : "Generate Sample"}
        </button>
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
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={4} placeholder="Brand voice, target audience, goals, sections to include…" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
        </label>
        <label>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Keywords (comma separated)</div>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="seo, local seo, citations" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Target Body Words</div>
            <input type="number" value={wordCount ?? ""} onChange={(e) => setWordCount(e.target.value ? Number(e.target.value) : undefined)} placeholder="800" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
          </label>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}>Model (optional)</div>
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" style={{ width: "100%", border: "1px solid #d1d5db", padding: 6, borderRadius: 4 }} />
          </label>
        </div>
        {error && <div style={{ color: "#b91c1c", fontSize: 12 }}>{error}</div>}
        <div style={{ fontSize: 12, color: "#6b7280" }}>This will overwrite any fields returned by AI. Review before saving.</div>
      </div>
    </div>
  );
}

export default AiAssistantField;
