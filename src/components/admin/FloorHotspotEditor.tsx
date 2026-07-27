"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type HotspotBox = { x: number; y: number; w: number; h: number };

type Props = {
  planSrc: string;
  value: HotspotBox;
  onChange: (next: HotspotBox) => void;
  otherHotspots?: Array<HotspotBox & { label?: string }>;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Editor visual: arrastre en el plano para asignar el local. */
export function FloorHotspotEditor({
  planSrc,
  value,
  onChange,
  otherHotspots = [],
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  } | null>(null);

  function pctFromEvent(clientX: number, clientY: number) {
    const el = ref.current;
    if (!el) return { x: 0, y: 0 };
    const box = el.getBoundingClientRect();
    return {
      x: clamp(((clientX - box.left) / box.width) * 100, 0, 100),
      y: clamp(((clientY - box.top) / box.height) * 100, 0, 100),
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p = pctFromEvent(e.clientX, e.clientY);
    setDrawing({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drawing) return;
    const p = pctFromEvent(e.clientX, e.clientY);
    setDrawing({ ...drawing, x1: p.x, y1: p.y });
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!drawing) return;
    const p = pctFromEvent(e.clientX, e.clientY);
    const x0 = drawing.x0;
    const y0 = drawing.y0;
    const x1 = p.x;
    const y1 = p.y;
    const x = Math.min(x0, x1);
    const y = Math.min(y0, y1);
    const w = Math.max(2, Math.abs(x1 - x0));
    const h = Math.max(2, Math.abs(y1 - y0));
    onChange({
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      w: Number(w.toFixed(1)),
      h: Number(h.toFixed(1)),
    });
    setDrawing(null);
  }

  const preview = drawing
    ? {
        x: Math.min(drawing.x0, drawing.x1),
        y: Math.min(drawing.y0, drawing.y1),
        w: Math.max(0.5, Math.abs(drawing.x1 - drawing.x0)),
        h: Math.max(0.5, Math.abs(drawing.y1 - drawing.y0)),
      }
    : value;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">
        Arrastre sobre el plano para marcar la zona del local. Los demás locales
        se muestran en azul claro.
      </p>
      <div
        ref={ref}
        className="relative touch-none select-none overflow-hidden border border-navy/15 bg-white"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={planSrc}
          alt="Plano para asignar locales"
          className="pointer-events-none block h-auto w-full"
          draggable={false}
        />
        {otherHotspots.map((h, i) => (
          <div
            key={i}
            className="pointer-events-none absolute border border-ocean/30 bg-ocean/10"
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              width: `${h.w}%`,
              height: `${h.h}%`,
            }}
          >
            {h.label ? (
              <span className="absolute left-0.5 top-0.5 bg-white/90 px-1 text-[9px] font-semibold text-navy">
                {h.label}
              </span>
            ) : null}
          </div>
        ))}
        <div
          className={cn(
            "pointer-events-none absolute border-2 border-gold bg-gold/25",
            drawing && "border-dashed",
          )}
          style={{
            left: `${preview.x}%`,
            top: `${preview.y}%`,
            width: `${preview.w}%`,
            height: `${preview.h}%`,
          }}
        />
      </div>
      <p className="text-[11px] text-muted">
        X {value.x}% · Y {value.y}% · W {value.w}% · H {value.h}%
      </p>
    </div>
  );
}
