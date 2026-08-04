export type HotspotPoint = { x: number; y: number };

export type HotspotBox = { x: number; y: number; w: number; h: number };

export function parseHotspotPolygon(raw: unknown): HotspotPoint[] {
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  const points: HotspotPoint[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const x = Number((item as { x?: unknown }).x);
    const y = Number((item as { y?: unknown }).y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    points.push({
      x: Math.min(100, Math.max(0, Number(x.toFixed(2)))),
      y: Math.min(100, Math.max(0, Number(y.toFixed(2)))),
    });
  }
  return points;
}

export function isValidPolygon(points: HotspotPoint[] | undefined | null) {
  return Boolean(points && points.length >= 3);
}

/** Bounding box del polígono (para tooltips / fallback rect). */
export function polygonToBox(points: HotspotPoint[]): HotspotBox {
  if (!points.length) return { x: 0, y: 0, w: 10, h: 10 };
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  return {
    x: Number(minX.toFixed(2)),
    y: Number(minY.toFixed(2)),
    w: Number(Math.max(0.5, maxX - minX).toFixed(2)),
    h: Number(Math.max(0.5, maxY - minY).toFixed(2)),
  };
}

export function boxToPolygon(box: HotspotBox): HotspotPoint[] {
  const x2 = box.x + box.w;
  const y2 = box.y + box.h;
  return [
    { x: box.x, y: box.y },
    { x: x2, y: box.y },
    { x: x2, y: y2 },
    { x: box.x, y: y2 },
  ];
}

export function polygonToSvgPoints(points: HotspotPoint[]) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}
