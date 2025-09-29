"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { useCMS } from "tinacms";

type TinaFieldProps = {
  input: { value?: string[]; onChange: (val: string[]) => void };
  field: any;
};

type CaseStudy = {
  slug: string;
  title?: string | null;
  client?: string | null;
};

export default function CaseStudyMultiSelect({ input, field }: TinaFieldProps) {
  const cms = useCMS();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CaseStudy[]>([]);

  const selected = useMemo(() => Array.isArray(input?.value) ? input.value : [], [input?.value]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    // Fetch case studies from Tina GraphQL via the admin client and map to slugs
    (cms?.api as any)?.tina?.request?.(
      `
        query AllCaseStudies($first: Float) {
          caseStudyConnection(first: $first) {
            edges { node { __typename _sys { relativePath } ... on CaseStudy { title client } } }
          }
        }
      `,
      { first: 500 }
    ).then((res: any) => {
      if (cancelled) return;
      const edges = res?.caseStudyConnection?.edges || [];
      const mapped: CaseStudy[] = edges.map((e: any) => {
        const rel: string = e?.node?._sys?.relativePath || "";
        const slug = rel.replace(/\.md$/i, "");
        return { slug, title: e?.node?.title, client: e?.node?.client };
      });
      // Sort by title/client for nicer UX
      mapped.sort((a, b) => (a.title || a.client || a.slug).localeCompare(b.title || b.client || b.slug));
      setItems(mapped);
      setLoading(false);
    }).catch((err: any) => {
      if (cancelled) return;
      const msg = err?.message || (typeof err === 'string' ? err : '') || 'Failed to load case studies';
      setError(msg);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [cms]);

  const toggle = (slug: string) => {
    const set = new Set(selected);
    if (set.has(slug)) set.delete(slug); else set.add(slug);
    input.onChange(Array.from(set));
  };

  const move = (slug: string, dir: -1 | 1) => {
    const arr = [...selected];
    const idx = arr.indexOf(slug);
    if (idx === -1) return;
    const to = idx + dir;
    if (to < 0 || to >= arr.length) return;
    const tmp = arr[to];
    arr[to] = arr[idx];
    arr[idx] = tmp;
    input.onChange(arr);
  };

  const clearAll = () => input.onChange([]);

  const isSelected = (slug: string) => selected.includes(slug);

  const renderLabel = (cs: CaseStudy) => (cs.title || cs.client) ? `${cs.title ?? cs.client} (${cs.slug})` : cs.slug;

  return (
    <div>
      {field?.label ? (
        <label style={{ display: "block", fontSize: 12, color: "#374151", marginBottom: 6 }}>{field.label}</label>
      ) : null}
      {field?.description ? (
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>{field.description}</div>
      ) : null}

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong style={{ fontSize: 12, color: "#111827" }}>All Case Studies</strong>
            <button type="button" onClick={clearAll} style={{ fontSize: 12, color: "#6b7280" }}>Clear</button>
          </div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 8, maxHeight: 220, overflow: "auto", background: "#fff" }}>
            {loading ? <div style={{ fontSize: 12, color: "#6b7280" }}>Loading…</div> : null}
            {error ? <div style={{ fontSize: 12, color: "#b91c1c" }}>{error}</div> : null}
            {!loading && !error && items.length === 0 ? (
              <div style={{ fontSize: 12, color: "#6b7280" }}>No case studies found.</div>
            ) : null}
            {!loading && !error && items.map((cs) => (
              <label key={cs.slug} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 4px", cursor: "pointer" }}>
                <input type="checkbox" checked={isSelected(cs.slug)} onChange={() => toggle(cs.slug)} />
                <span style={{ fontSize: 13, color: "#111827" }}>{renderLabel(cs)}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong style={{ fontSize: 12, color: "#111827" }}>Selected (order matters)</strong>
            <span style={{ fontSize: 12, color: "#6b7280" }}>{selected.length} chosen</span>
          </div>
          <ol style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 8, maxHeight: 220, overflow: "auto", background: "#fff", listStyle: "none", margin: 0 }}>
            {selected.map((slug) => {
              const cs = items.find((x) => x.slug === slug) || { slug } as CaseStudy;
              return (
                <li key={slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 4px", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: 13, color: "#111827" }}>{renderLabel(cs)}</span>
                  <span style={{ display: "inline-flex", gap: 6 }}>
                    <button type="button" aria-label="Move up" onClick={() => move(slug, -1)} style={btnStyle}>↑</button>
                    <button type="button" aria-label="Move down" onClick={() => move(slug, 1)} style={btnStyle}>↓</button>
                    <button type="button" aria-label="Remove" onClick={() => toggle(slug)} style={btnDanger}>✕</button>
                  </span>
                </li>
              );
            })}
            {selected.length === 0 ? (
              <li style={{ fontSize: 12, color: "#6b7280", padding: 6 }}>Nothing selected yet.</li>
            ) : null}
          </ol>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  color: "#374151",
  borderRadius: 4,
  padding: "2px 6px",
  cursor: "pointer",
  fontSize: 12,
};

const btnDanger: React.CSSProperties = {
  ...btnStyle,
  color: "#b91c1c",
};
