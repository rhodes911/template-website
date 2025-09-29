"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type Props = { input: any; field: any };

export default function ColorWithHistory({ input, field }: Props) {
  const label = field?.label || field?.name;
  const name: string = input?.name; // e.g. primary.c500
  const value: string = input?.value || "";
  const storageKey = `colorHistory:${name}`;
  const [history, setHistory] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setHistory(JSON.parse(raw));
      else setHistory([]);
    } catch {
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const onPick = (hex: string) => {
    if (!hex) return;
    // push previous into history if distinct
    const prev = value;
    const cap = 8;
    let nextHistory = history.slice();
    if (prev && prev !== hex) {
      nextHistory = [prev, ...history.filter((v) => v !== prev)].slice(0, cap);
      setHistory(nextHistory);
      try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); } catch {}
    }
    input.onChange(hex);
  };

  const revertTo = (hex: string) => {
    if (!hex) return;
    // move current to history front
    const cap = 8;
    const cur = value;
    let nextHistory = history.slice();
    if (cur && cur !== hex) {
      nextHistory = [cur, ...history.filter((v) => v !== cur)].slice(0, cap);
    }
    nextHistory = nextHistory.filter((v) => v !== hex);
    setHistory(nextHistory);
    try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); } catch {}
    input.onChange(hex);
  };

  const clearHistory = () => {
    setHistory([]);
    try { localStorage.setItem(storageKey, JSON.stringify([])); } catch {}
  };

  return (
    <div style={{ display: "grid", gap: 6 }}>
      {label ? (
        <label style={{ fontSize: 12, color: "#374151" }}>{label}</label>
      ) : null}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(e) => onPick(e.target.value)}
          style={{ width: 36, height: 28, border: "1px solid #e5e7eb", borderRadius: 4 }}
          title={name}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onPick(e.target.value)}
          placeholder="#RRGGBB"
          style={{
            fontFamily: "monospace",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: "6px 8px",
            width: 120,
          }}
        />
        {history.length > 0 ? (
          <button
            type="button"
            onClick={() => revertTo(history[0])}
            style={{
              fontSize: 12,
              padding: "6px 8px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              background: "#fff",
              cursor: "pointer",
            }}
            title="Revert to most recent previous value"
          >
            Undo
          </button>
        ) : null}
        {history.length > 0 ? (
          <button
            type="button"
            onClick={clearHistory}
            style={{
              fontSize: 12,
              padding: "6px 8px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              background: "#fff",
              cursor: "pointer",
            }}
            title="Clear history for this shade"
          >
            Clear
          </button>
        ) : null}
      </div>
      {history.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {history.map((h, idx) => (
            <button
              key={`${h}-${idx}`}
              type="button"
              onClick={() => revertTo(h)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                background: /^#[0-9a-fA-F]{6}$/.test(h) ? h : "#fff",
                cursor: "pointer",
              }}
              title={`Revert to ${h}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
