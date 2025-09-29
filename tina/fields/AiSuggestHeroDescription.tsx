
"use client";
import React, { useCallback, useMemo, useState } from "react";

type Props = { input: any; field: any; form: any };

export default function AiSuggestHeroDescription({ form }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>("");

  const apiBase = useMemo(() => {
    if (typeof window === "undefined") return "";
    const loc = window.location;
    return loc.port === "4001" ? "http://localhost:3000" : "";
  }, []);

  const setValue = useCallback((name: string, value: any) => {
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
    setPreview("");
    try {
      const vals = form?.getState?.()?.values || {};
      // Minimal context strictly for hero description
      const context = {
        name: vals.name,
        title: vals.title,
        subtitle: vals.subtitle,
        heroTitle: vals.heroTitle,
        heroSubtitle: vals.heroSubtitle,
        currentHeroDescription: vals.heroDescription,
      };
      const brief = mode === "improve"
        ? `Improve the current hero description while keeping tone and meaning. Keep it concise (1-2 sentences). Current: ${vals.heroDescription || ""}`
        : `Write a fresh hero description based on the context. Keep it concise (1-2 sentences).`;
      // Provide a topic to help retrieval target relevant site content
      const topic = vals.heroTitle || vals.title || vals.name || "About hero description";
  const res = await fetch(`${apiBase}/api/tina/ai-generate?debug=1&report=1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "about", section: "hero", brief, topic, agentic: true, context }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Failed (${res.status})`);
      const heroDesc = data?.result?.heroDescription;
      if (typeof heroDesc === "string" && heroDesc.trim()) setPreview(heroDesc);
      else setPreview("");
    } catch (e: any) {
      setError(e?.message || "Failed to suggest");
    } finally {
      setLoading(false);
    }
  }, [apiBase, form]);

  const onApply = useCallback(() => {
    if (!preview.trim()) return;
    setValue("heroDescription", preview.trim());
  }, [preview, setValue]);

  return (
    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10, marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#374151" }}>AI Suggestion:</span>
        <button type="button" onClick={() => onSuggest("replace")} disabled={loading} title="Generate a new hero description"
          style={{ padding: "4px 8px", border: "1px solid #111827", borderRadius: 4, background: "#111827", color: "white", fontSize: 12 }}>
          {loading ? "Working…" : "Replace"}
        </button>
        <button type="button" onClick={() => onSuggest("improve")} disabled={loading} title="Improve the current hero description"
          style={{ padding: "4px 8px", border: "1px solid #6b7280", borderRadius: 4, background: "white", color: "#111827", fontSize: 12 }}>
          Improve
        </button>
        <button type="button" onClick={onApply} disabled={!preview} title="Apply the suggested text below"
          style={{ marginLeft: "auto", padding: "4px 8px", border: "1px solid #6b7280", borderRadius: 4, background: "white", color: "#111827", fontSize: 12 }}>
          Apply
        </button>
      </div>
      {error && <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>{error}</div>}
      {preview && (
        <div style={{ marginTop: 8, padding: 8, background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 4, whiteSpace: "pre-wrap", fontSize: 13 }}>
          {preview}
        </div>
      )}
    </div>
  );
}
