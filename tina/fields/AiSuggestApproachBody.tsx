"use client";
import React, { useCallback, useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { input: unknown; field: unknown; form: any };

export default function AiSuggestApproachBody({ form }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>("");

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
    setPreview("");
    try {
      const vals = form?.getState?.()?.values || {};
      const context = {
        name: vals.name,
        title: vals.title,
        subtitle: vals.subtitle,
        heroTitle: vals.heroTitle,
        heroSubtitle: vals.heroSubtitle,
        heroDescription: vals.heroDescription,
        storyApproachTitle: vals.storyApproachTitle,
        storyApproachIcon: vals.storyApproachIcon,
        storyApproachTagline: vals.storyApproachTagline,
        currentApproachBody: vals.storyApproachBody,
      };
      const brief = mode === "improve"
        ? `Improve the current Approach body while keeping tone and meaning. One short paragraph (2–4 sentences). Current: ${vals.storyApproachBody || ""}`
        : "Write a concise 'Approach' body section: one short paragraph (2–4 sentences) describing your process, principles, and what clients can expect.";
      const topic = vals.storyApproachTitle || vals.heroTitle || vals.title || vals.name || "About approach body";
      const res = await fetch(`${apiBase}/api/tina/ai-generate?debug=1&report=1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "about", section: "bodyApproach", brief, topic, agentic: true, context }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Failed (${res.status})`);
      const body = data?.result?.body;
      if (typeof body === "string" && body.trim()) setPreview(body);
      else setPreview("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to suggest";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [apiBase, form]);

  const onApply = useCallback(() => {
    if (!preview.trim()) return;
    setValue("storyApproachBody", preview.trim());
  }, [preview, setValue]);

  return (
    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10, marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#374151" }}>AI Suggestion:</span>
        <button type="button" onClick={() => onSuggest("replace")} disabled={loading} title="Generate a new approach body"
          style={{ padding: "4px 8px", border: "1px solid #111827", borderRadius: 4, background: "#111827", color: "white", fontSize: 12 }}>
          {loading ? "Working…" : "Replace"}
        </button>
        <button type="button" onClick={() => onSuggest("improve")} disabled={loading} title="Improve the current approach body"
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
