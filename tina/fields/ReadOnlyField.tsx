"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type Props = { input: any; field: any };

export default function ReadOnlyField({ input, field }: Props) {
  const value = input?.value;
  const label = field?.label || field?.name;
  return (
    <div style={{ opacity: 0.8 }}>
      {label ? (
        <label style={{ display: "block", fontSize: 12, color: "#374151", marginBottom: 4 }}>
          {label}
        </label>
      ) : null}
      <div
        style={{
          padding: "8px 10px",
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          background: "#f9fafb",
          color: "#111827",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
        title="Governed setting (read-only)"
      >
        {typeof value === "boolean" ? String(value) : value ?? ""}
      </div>
      {field?.description ? (
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{field.description}</div>
      ) : null}
    </div>
  );
}
