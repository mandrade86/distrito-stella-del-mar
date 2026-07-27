import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/sanitize-html";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  return withAdmin(async () => {
    if (id) {
      const page = await prisma.cmsPage.findUnique({ where: { id } });
      if (!page) throw new Error("NOT_FOUND");
      return page;
    }
    const pages = await prisma.cmsPage.findMany({
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });
    return pages;
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => {
    const title = String(body.title || "").trim();
    if (!title) throw new Error("INVALID");
    let slug = String(body.slug || slugify(title)).trim() || slugify(title);
    slug = slugify(slug);
    const existing = await prisma.cmsPage.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    return prisma.cmsPage.create({
      data: {
        title,
        slug,
        content: String(body.content ?? "<p></p>"),
        excerpt: body.excerpt ? String(body.excerpt) : null,
        status: body.status === "published" ? "published" : "draft",
        showInNav: Boolean(body.showInNav),
        navLabel: body.navLabel ? String(body.navLabel) : null,
        sortOrder: Number(body.sortOrder ?? 0),
        seoTitle: body.seoTitle ? String(body.seoTitle) : null,
        seoDescription: body.seoDescription
          ? String(body.seoDescription)
          : null,
      },
    });
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => {
    /** Reordenar lista: { order: [{ id, sortOrder }] } */
    if (Array.isArray(body.order)) {
      await prisma.$transaction(
        body.order.map(
          (row: { id?: string; sortOrder?: number }, index: number) =>
            prisma.cmsPage.update({
              where: { id: String(row.id) },
              data: {
                sortOrder:
                  typeof row.sortOrder === "number" ? row.sortOrder : index,
              },
            }),
        ),
      );
      return { reordered: true };
    }

    const id = String(body.id || "");
    if (!id) throw new Error("INVALID");
    const title = String(body.title || "").trim();
    let slug = slugify(String(body.slug || title));
    const clash = await prisma.cmsPage.findFirst({
      where: { slug, NOT: { id } },
    });
    if (clash) slug = `${slug}-${Date.now().toString(36)}`;

    return prisma.cmsPage.update({
      where: { id },
      data: {
        title,
        slug,
        content: String(body.content ?? ""),
        excerpt: body.excerpt ? String(body.excerpt) : null,
        status: body.status === "published" ? "published" : "draft",
        showInNav: Boolean(body.showInNav),
        navLabel: body.navLabel ? String(body.navLabel) : null,
        sortOrder: Number(body.sortOrder ?? 0),
        seoTitle: body.seoTitle ? String(body.seoTitle) : null,
        seoDescription: body.seoDescription
          ? String(body.seoDescription)
          : null,
      },
    });
  });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  return withAdmin(async () => {
    if (!id) throw new Error("INVALID");
    await prisma.cmsPage.delete({ where: { id } });
    return { deleted: true };
  });
}
