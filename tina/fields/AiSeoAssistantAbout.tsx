"use client";
import React, { useCallback, useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { input: unknown; field: unknown; form: any };

export default function AiSeoAssistantAbout({ form }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<null | {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    keywords?: string[];
    openGraph?: { ogTitle?: string; ogDescription?: string; ogImage?: string };
  }>(null);

  const apiBase = useMemo(() => {
    if (typeof window === "undefined") return "";
    const loc = window.location;
    return loc.port === "4001" ? "http://localhost:3000" : "";
  }, []);

  const setValue = useCallback((name: string, value: unknown) => {
    try {
      if (typeof form?.change === "function") { form.change(name, value); return true; }
      if (typeof form?.finalForm?.change === "function") { form.finalForm.change(name, value); return true; }
      if (typeof form?.mutators?.setValue === "function") { form.mutators.setValue(name, value); return true; }
    } catch {}
    return false;
  }, [form]);

  const onSuggest = useCallback(async (mode: "replace" | "improve") => {
    setError(null);
    setLoading(true);
    setPreview(null);
    try {
      const vals = form?.getState?.()?.values || {};
      const context = {
        name: vals.name,
        title: vals.title,
        subtitle: vals.subtitle,
        heroTitle: vals.heroTitle,
        heroSubtitle: vals.heroSubtitle,
        heroDescription: vals.heroDescription,
        // Existing SEO (for improve mode)
        currentSeo: vals.seo || {},
        business: undefined,
      };
      const baseBrief = "Propose the best meta title/description for the About page. UK English, brand-safe, clear and compelling. No fluff or fabricated claims.";
      const brief = mode === "improve" && vals?.seo?.metaTitle
        ? `${baseBrief} Improve current values while keeping intent and tone. Current title: ${vals.seo.metaTitle || ""}. Current description: ${vals.seo.metaDescription || ""}.`
        : baseBrief;
      const topic = vals.heroTitle || vals.title || vals.name || "About page SEO";
      const res = await fetch(`${apiBase}/api/tina/ai-generate?debug=1&report=1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "about", section: "seo", brief, topic, agentic: true, context }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Failed (${res.status})`);
      const seo = data?.result?.seo;
      if (seo && (seo.metaTitle || seo.metaDescription)) setPreview(seo);
      else setPreview(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to suggest";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [apiBase, form]);

  const onApplyField = useCallback((field: string) => {
    if (!preview) return;
    const get = (path: string): unknown => {
      const parts = path.split('.');
      let cur: unknown = preview as unknown;
      for (const key of parts) {
        if (cur && typeof cur === 'object' && key in (cur as Record<string, unknown>)) {
          cur = (cur as Record<string, unknown>)[key];
        } else {
          return undefined;
        }
      }
      return cur;
    };
    const val = get(field);
    if (val === undefined) return;
    setValue(`seo.${field}`, val);
  }, [preview, setValue]);

  return (
    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10, marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#374151" }}>AI SEO Assistant:</span>
        <button type="button" onClick={() => onSuggest("replace")} disabled={loading}
          title="Generate new meta title and description"
          style={{ padding: "4px 8px", border: "1px solid #111827", borderRadius: 4, background: "#111827", color: "white", fontSize: 12 }}>
          {loading ? "Working…" : "Replace"}
        </button>
        <button type="button" onClick={() => onSuggest("improve")} disabled={loading}
          title="Improve the current meta title and description"
          style={{ padding: "4px 8px", border: "1px solid #6b7280", borderRadius: 4, background: "white", color: "#111827", fontSize: 12 }}>
          Improve
        </button>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
          Generate first, then apply individual fields below
        </div>
      </div>
      {error && <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>{error}</div>}
      {preview && (
        <div style={{ marginTop: 8, padding: 8, background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 4, fontSize: 13 }}>
          {typeof preview.metaTitle === 'string' && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>Meta Title</strong>
                <button type="button" onClick={() => onApplyField('metaTitle')} title="Apply title" style={{ padding: '2px 6px', border: '1px solid #6b7280', borderRadius: 4, background: 'white' }}>Apply</button>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{(preview.metaTitle || '').trim().length} chars</span>
              </div>
              <div style={{ color: "#111827", marginTop: 4 }}>{preview.metaTitle}</div>
            </div>
          )}
          {typeof preview.metaDescription === 'string' && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>Meta Description</strong>
                <button type="button" onClick={() => onApplyField('metaDescription')} title="Apply description" style={{ padding: '2px 6px', border: '1px solid #6b7280', borderRadius: 4, background: 'white' }}>Apply</button>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{(preview.metaDescription || '').trim().length} chars</span>
              </div>
              <div style={{ color: "#111827", marginTop: 4 }}>{preview.metaDescription}</div>
            </div>
          )}
          {typeof preview.canonicalUrl === 'string' && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>Canonical URL</strong>
                <button type="button" onClick={() => onApplyField('canonicalUrl')} title="Apply canonical" style={{ padding: '2px 6px', border: '1px solid #6b7280', borderRadius: 4, background: 'white' }}>Apply</button>
              </div>
              <div style={{ color: "#111827", marginTop: 4 }}>{preview.canonicalUrl}</div>
            </div>
          )}
          {typeof preview.noIndex === 'boolean' && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>No Index</strong>
                <button type="button" onClick={() => onApplyField('noIndex')} title="Apply robots noindex" style={{ padding: '2px 6px', border: '1px solid #6b7280', borderRadius: 4, background: 'white' }}>Apply</button>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{preview.noIndex ? 'true' : 'false'}</span>
              </div>
            </div>
          )}
          {Array.isArray(preview.keywords) && preview.keywords.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>Keywords</strong>
                <button type="button" onClick={() => onApplyField('keywords')} title="Apply keywords" style={{ padding: '2px 6px', border: '1px solid #6b7280', borderRadius: 4, background: 'white' }}>Apply</button>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{preview.keywords.length} items</span>
              </div>
              <div style={{ color: "#111827", marginTop: 4 }}>{preview.keywords.join(', ')}</div>
            </div>
          )}
          {typeof preview?.openGraph?.ogTitle === 'string' && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>OG Title</strong>
                <button type="button" onClick={() => onApplyField('openGraph.ogTitle')} title="Apply OG title" style={{ padding: '2px 6px', border: '1px solid #6b7280', borderRadius: 4, background: 'white' }}>Apply</button>
              </div>
              <div style={{ color: "#111827", marginTop: 4 }}>{preview.openGraph?.ogTitle}</div>
            </div>
          )}
          {typeof preview?.openGraph?.ogDescription === 'string' && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>OG Description</strong>
                <button type="button" onClick={() => onApplyField('openGraph.ogDescription')} title="Apply OG description" style={{ padding: '2px 6px', border: '1px solid #6b7280', borderRadius: 4, background: 'white' }}>Apply</button>
              </div>
              <div style={{ color: "#111827", marginTop: 4 }}>{preview.openGraph?.ogDescription}</div>
            </div>
          )}
          {typeof preview?.openGraph?.ogImage === 'string' && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>OG Image</strong>
                <button type="button" onClick={() => onApplyField('openGraph.ogImage')} title="Apply OG image URL" style={{ padding: '2px 6px', border: '1px solid #6b7280', borderRadius: 4, background: 'white' }}>Apply</button>
              </div>
              <div style={{ color: "#111827", marginTop: 4 }}>{preview.openGraph?.ogImage}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
