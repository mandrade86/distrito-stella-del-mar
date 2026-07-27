import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  return withAdmin(async () =>
    prisma.commercialSpace.findMany({ orderBy: { sortOrder: "asc" } }),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.commercialSpace.create({
      data: {
        code: String(body.code ?? ""),
        name: String(body.name ?? ""),
        category: String(body.category ?? "local"),
        area: Number(body.area ?? 0),
        phase: Number(body.phase ?? 1),
        level: body.level ? String(body.level) : null,
        status: String(body.status ?? "Disponible"),
        featured: Boolean(body.featured),
        image: body.image ? String(body.image) : null,
        sortOrder: Number(body.sortOrder ?? 0),
      },
    }),
  );
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.commercialSpace.update({
      where: { id: String(body.id) },
      data: {
        code: String(body.code ?? ""),
        name: String(body.name ?? ""),
        category: String(body.category ?? "local"),
        area: Number(body.area ?? 0),
        phase: Number(body.phase ?? 1),
        level: body.level ? String(body.level) : null,
        status: String(body.status ?? "Disponible"),
        featured: Boolean(body.featured),
        image: body.image ? String(body.image) : null,
        sortOrder: Number(body.sortOrder ?? 0),
      },
    }),
  );
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  return withAdmin(async () => {
    if (!id) throw new Error("Missing id");
    return prisma.commercialSpace.delete({ where: { id } });
  });
}
