import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

function storeData(body: Record<string, unknown>) {
  return {
    code: String(body.code ?? "").trim(),
    name: String(body.name ?? "").trim(),
    unitLabel: String(body.unitLabel ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    email: String(body.email ?? "").trim(),
    website: String(body.website ?? "").trim(),
    hours: String(body.hours ?? "").trim(),
    category: String(body.category ?? "").trim(),
    status: String(body.status ?? "Abierto").trim() || "Abierto",
    level: String(body.level ?? "Nivel 2").trim() || "Nivel 2",
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

export async function GET() {
  return withAdmin(async () =>
    prisma.store.findMany({ orderBy: { sortOrder: "asc" } }),
  );
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
