import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import {
  parseHotspotPolygon,
  polygonToBox,
} from "@/lib/hotspot-polygon";

function storeData(body: Record<string, unknown>) {
  const leasing = String(body.leasingStatus ?? "Disponible").trim();
  const leasingStatus =
    leasing === "Reservado" || leasing === "Ocupado" ? leasing : "Disponible";
  const areaRaw = body.area;
  const area =
    areaRaw === "" || areaRaw == null || Number.isNaN(Number(areaRaw))
      ? null
      : Number(areaRaw);

  const polygon = parseHotspotPolygon(body.hotspotPolygon);
  const boxFromPoly = polygon.length >= 3 ? polygonToBox(polygon) : null;

  return {
    code: String(body.code ?? "").trim(),
    name: String(body.name ?? "").trim() || "Sin asignar",
    unitLabel: String(body.unitLabel ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    email: String(body.email ?? "").trim(),
    website: String(body.website ?? "").trim(),
    hours: String(body.hours ?? "").trim(),
    category: String(body.category ?? "").trim() || "Local",
    status: String(body.status ?? "Abierto").trim() || "Abierto",
    leasingStatus,
    floorPlanKey: String(body.floorPlanKey ?? "n2").trim() || "n2",
    level: String(body.level ?? "Nivel 2").trim() || "Nivel 2",
    area,
    description: String(body.description ?? "").trim() || null,
    logo: String(body.logo ?? "").trim(),
    hotspotX: boxFromPoly?.x ?? Number(body.hotspotX ?? 0),
    hotspotY: boxFromPoly?.y ?? Number(body.hotspotY ?? 0),
    hotspotW: boxFromPoly?.w ?? Number(body.hotspotW ?? 10),
    hotspotH: boxFromPoly?.h ?? Number(body.hotspotH ?? 10),
    hotspotPolygon:
      polygon.length >= 3
        ? (polygon as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
    sortOrder: Number(body.sortOrder ?? 0),
    active: body.active !== false,
  };
}

export async function GET(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  return withAdmin(async () => {
    if (id) {
      return prisma.store.findUniqueOrThrow({ where: { id } });
    }
    return prisma.store.findMany({
      orderBy: [{ floorPlanKey: "asc" }, { sortOrder: "asc" }],
    });
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => prisma.store.create({ data: storeData(body) }));
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.store.update({
      where: { id: String(body.id) },
      data: storeData(body),
    }),
  );
}

export async function DELETE(request: NextRequest) {
  return withAdmin(async () => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    let ids: string[] = id ? [id] : [];

    if (!ids.length) {
      try {
        const body = await request.json();
        if (Array.isArray(body?.ids)) {
          ids = body.ids.map((v: unknown) => String(v)).filter(Boolean);
        } else if (body?.id) {
          ids = [String(body.id)];
        }
      } catch {
        // sin body JSON
      }
    }

    if (!ids.length) throw new Error("Missing id");

    const result = await prisma.store.deleteMany({
      where: { id: { in: ids } },
    });
    return { deleted: result.count, ids };
  });
}
