import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

function levelData(body: Record<string, unknown>) {
  return {
    key: String(body.key ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-"),
    label: String(body.label ?? "").trim(),
    planImage: String(body.planImage ?? "").trim(),
    sortOrder: Number(body.sortOrder ?? 0),
    active: body.active !== false,
  };
}

export async function GET() {
  return withAdmin(async () =>
    prisma.floorPlanLevel.findMany({ orderBy: { sortOrder: "asc" } }),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => {
    const data = levelData(body);
    if (!data.key || !data.label) throw new Error("INVALID");
    return prisma.floorPlanLevel.create({ data });
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => {
    const data = levelData(body);
    return prisma.floorPlanLevel.update({
      where: { id: String(body.id) },
      data,
    });
  });
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  return withAdmin(async () => {
    if (!id) throw new Error("Missing id");
    return prisma.floorPlanLevel.delete({ where: { id } });
  });
}
