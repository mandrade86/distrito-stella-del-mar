import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

function storeData(body: Record<string, unknown>) {
  const leasing = String(body.leasingStatus ?? "Disponible").trim();
  const leasingStatus =
    leasing === "Reservado" || leasing === "Ocupado" ? leasing : "Disponible";
  const areaRaw = body.area;
  const area =
    areaRaw === "" || areaRaw == null || Number.isNaN(Number(areaRaw))
      ? null
      : Number(areaRaw);

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
    hotspotX: Number(body.hotspotX ?? 0),
    hotspotY: Number(body.hotspotY ?? 0),
    hotspotW: Number(body.hotspotW ?? 10),
    hotspotH: Number(body.hotspotH ?? 10),
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
  const id = new URL(request.url).searchParams.get("id");
  return withAdmin(async () => {
    if (!id) throw new Error("Missing id");
    return prisma.store.delete({ where: { id } });
  });
}
