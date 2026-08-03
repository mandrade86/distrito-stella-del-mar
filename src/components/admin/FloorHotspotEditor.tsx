"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  boxToPolygon,
  isValidPolygon,
  polygonToBox,
  polygonToSvgPoints,
  type HotspotBox,
  type HotspotPoint,
} from "@/lib/hotspot-polygon";

export type { HotspotBox, HotspotPoint };

type OtherHotspot = HotspotBox & {
  label?: string;
  polygon?: HotspotPoint[];
};

type Props = {
  planSrc: string;
  value: HotspotBox;
  polygon: HotspotPoint[];
  onChange: (next: { box: HotspotBox; polygon: HotspotPoint[] }) => void;
  otherHotspots?: OtherHotspot[];
  activeLabel?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Editor por puntos: clic para agregar vértices; arrastre para moverlos. */
export function FloorHotspotEditor({
  planSrc,
  value,
  polygon,
  onChange,
  otherHotspots = [],
  activeLabel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const points = polygon.length ? polygon : [];

  function pctFromEvent(clientX: number, clientY: number) {
    const el = ref.current;
    if (!el) return { x: 0, y: 0 };
    const box = el.getBoundingClientRect();
    return {
      x: clamp(((clientX - box.left) / box.width) * 100, 0, 100),
      y: clamp(((clientY - box.top) / box.height) * 100, 0, 100),
    };
  }

  function commit(nextPoints: HotspotPoint[]) {
    const box =
      nextPoints.length >= 3 ? polygonToBox(nextPoints) : value;
    onChange({
      box,
      polygon: nextPoints.map((p) => ({
        x: Number(p.x.toFixed(2)),
        y: Number(p.y.toFixed(2)),
      })),
    });
  }

  function onCanvasClick(e: React.MouseEvent) {
    if (dragIndex !== null) return;
    // No agregar si clic en un handle
    if ((e.target as HTMLElement).dataset.vertex != null) return;
    const p = pctFromEvent(e.clientX, e.clientY);
    commit([...points, p]);
  }

  function onVertexPointerDown(index: number, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragIndex(index);
  }

  function onVertexPointerMove(e: React.PointerEvent) {
    if (dragIndex === null) return;
    e.preventDefault();
    const p = pctFromEvent(e.clientX, e.clientY);
    const next = points.map((pt, i) => (i === dragIndex ? p : pt));
    commit(next);
  }

  function onVertexPointerUp(e: React.PointerEvent) {
    if (dragIndex === null) return;
    e.preventDefault();
    setDragIndex(null);
  }

  function undoLast() {
    if (!points.length) return;
    commit(points.slice(0, -1));
  }

  function clearAll() {
    commit([]);
  }

  function useRectangleFallback() {
    commit(boxToPolygon(value));
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">
        Haga clic en las esquinas del local para dibujar el polígono. Arrastre
        los puntos para ajustar. Se necesitan al menos 3 puntos.
        {activeLabel ? (
          <>
            {" "}
            Editando <strong>{activeLabel}</strong>.
          </>
        ) : null}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={undoLast}
          disabled={!points.length}
          className="rounded-sm border border-navy/15 px-2.5 py-1 text-xs disabled:opacity-40"
        >
          Deshacer punto
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={!points.length}
          className="rounded-sm border border-navy/15 px-2.5 py-1 text-xs disabled:opacity-40"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={useRectangleFallback}
          className="rounded-sm border border-navy/15 px-2.5 py-1 text-xs"
        >
          Convertir rectángulo actual a 4 puntos
        </button>
      </div>

      <div
        ref={ref}
        className="relative touch-none select-none overflow-hidden border border-navy/15 bg-white"
        onClick={onCanvasClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={planSrc}
          alt="Plano para asignar locales"
          className="pointer-events-none block h-auto w-full"
          draggable={false}
        />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {otherHotspots.map((h, i) => {
            const poly = isValidPolygon(h.polygon)
              ? h.polygon!
              : boxToPolygon(h);
            return (
              <polygon
                key={i}
                points={polygonToSvgPoints(poly)}
                className="fill-ocean/15 stroke-ocean/40"
                strokeWidth={0.35}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {points.length >= 2 ? (
            <polyline
              points={polygonToSvgPoints(
                points.length >= 3 ? [...points, points[0]] : points,
              )}
              className="fill-gold/25 stroke-gold"
              strokeWidth={0.45}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          {points.length >= 3 ? (
            <polygon
              points={polygonToSvgPoints(points)}
              className="fill-gold/30 stroke-gold"
              strokeWidth={0.45}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>

        {points.map((p, i) => (
          <button
            key={i}
            type="button"
            data-vertex={i}
            title={`Punto ${i + 1}`}
            className={cn(
              "absolute z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gold shadow",
              dragIndex === i && "scale-125 bg-navy",
            )}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onPointerDown={(e) => onVertexPointerDown(i, e)}
            onPointerMove={onVertexPointerMove}
            onPointerUp={onVertexPointerUp}
            onClick={(e) => e.stopPropagation()}
          />
        ))}
      </div>

      <p className="text-[11px] text-muted">
        {points.length} punto{points.length === 1 ? "" : "s"}
        {isValidPolygon(points)
          ? ` · polígono listo · bbox X ${value.x}% Y ${value.y}% W ${value.w}% H ${value.h}%`
          : " · agregue al menos 3 puntos"}
      </p>
    </div>
  );
}
