"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = { input: any; field: any; form: any };

export default function ImageFocusControl({ input, form }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const values = form?.getState?.()?.values || {};
  const imageUrl: string | undefined = values?.profileImage;

  const value = (input?.value as any) || {};
  const [x, setX] = useState<number>(typeof value.x === "number" ? value.x : 50);
  const [y, setY] = useState<number>(typeof value.y === "number" ? value.y : 50);
  const [zoom, setZoom] = useState<number>(typeof value.zoom === "number" ? value.zoom : 115);
  const [dragging, setDragging] = useState(false);

  const setValue = useCallback((val: { x: number; y: number; zoom: number }) => {
    try {
      if (typeof form?.change === "function") { form.change(input.name, val); return; }
      if (typeof form?.finalForm?.change === "function") { form.finalForm.change(input.name, val); return; }
      if (typeof form?.mutators?.setValue === "function") { form.mutators.setValue(input.name, val); return; }
    } catch {}
  }, [form, input?.name]);

  useEffect(() => {
    setValue({ x, y, zoom });
  }, [x, y, zoom, setValue]);

  const onPointer = useCallback((e: React.PointerEvent) => {
    const el = containerRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 100;
    const ny = ((e.clientY - rect.top) / rect.height) * 100;
    setX(Math.max(0, Math.min(100, nx)));
    setY(Math.max(0, Math.min(100, ny)));
  }, []);

  const handleDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true); onPointer(e);
  };
  const handleMove = (e: React.PointerEvent) => { if (dragging) onPointer(e); };
  const handleUp = () => setDragging(false);

  const bgStyle = useMemo(() => {
    const s = Math.max(100, Math.min(250, zoom));
    return {
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      backgroundSize: `${s}%`,
      backgroundPosition: `${x}% ${y}%`,
    } as React.CSSProperties;
  }, [imageUrl, x, y, zoom]);

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          ref={containerRef}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          style={{
            width: 240, height: 240, position: "relative", overflow: "hidden",
            borderRadius: "50%", backgroundColor: "#f3f4f6", cursor: "grab",
            backgroundRepeat: "no-repeat", ...bgStyle,
          }}
          title="Drag to set focus"
        >
          {/* Marker */}
          <div style={{
            position: "absolute", left: `calc(${x}% - 6px)`, top: `calc(${y}% - 6px)`,
            width: 12, height: 12, borderRadius: 9999, background: "#ef4444",
            boxShadow: "0 0 0 2px #fff, 0 0 0 4px rgba(239,68,68,.35)", pointerEvents: "none",
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>Zoom</div>
          <input
            type="range"
            min={100}
            max={180}
            step={1}
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value || "115", 10))}
            style={{ width: "100%" }}
          />
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>X: {Math.round(x)}%  Y: {Math.round(y)}%  Zoom: {Math.round(zoom)}%</div>
          {!imageUrl && <div style={{ marginTop: 8, fontSize: 12, color: "#b45309" }}>Select a Profile Image first.</div>}
        </div>
      </div>
    </div>
  );
}
