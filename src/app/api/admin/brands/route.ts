import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  return withAdmin(async () =>
    prisma.brand.findMany({ orderBy: { sortOrder: "asc" } }),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.brand.create({
      data: {
        name: String(body.name ?? ""),
        logo: body.logo ? String(body.logo) : null,
        logoScale: Number(body.logoScale ?? 1),
        note: body.note ? String(body.note) : null,
        sortOrder: Number(body.sortOrder ?? 0),
        active: body.active !== false,
      },
    }),
  );
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.brand.update({
      where: { id: String(body.id) },
      data: {
        name: String(body.name ?? ""),
        logo: body.logo ? String(body.logo) : null,
        logoScale: Number(body.logoScale ?? 1),
        note: body.note ? String(body.note) : null,
        sortOrder: Number(body.sortOrder ?? 0),
        active: body.active !== false,
      },
    }),
  );
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  return withAdmin(async () => {
    if (!id) throw new Error("Missing id");
    return prisma.brand.delete({ where: { id } });
  });
}
