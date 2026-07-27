import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  return withAdmin(async () =>
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.heroSlide.create({
      data: {
        src: String(body.src ?? ""),
        alt: String(body.alt ?? ""),
        sortOrder: Number(body.sortOrder ?? 0),
        active: body.active !== false,
      },
    }),
  );
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.heroSlide.update({
      where: { id: String(body.id) },
      data: {
        src: String(body.src ?? ""),
        alt: String(body.alt ?? ""),
        sortOrder: Number(body.sortOrder ?? 0),
        active: body.active !== false,
      },
    }),
  );
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return withAdmin(async () => {
      throw new Error("Missing id");
    });
  }
  return withAdmin(async () => prisma.heroSlide.delete({ where: { id } }));
}
