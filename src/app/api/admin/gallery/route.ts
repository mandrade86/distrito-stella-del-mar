import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  return withAdmin(async () =>
    prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } }),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.galleryItem.create({
      data: {
        src: String(body.src ?? ""),
        alt: String(body.alt ?? ""),
        span: String(body.span ?? "square"),
        sortOrder: Number(body.sortOrder ?? 0),
        active: body.active !== false,
      },
    }),
  );
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () =>
    prisma.galleryItem.update({
      where: { id: String(body.id) },
      data: {
        src: String(body.src ?? ""),
        alt: String(body.alt ?? ""),
        span: String(body.span ?? "square"),
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
    return prisma.galleryItem.delete({ where: { id } });
  });
}
