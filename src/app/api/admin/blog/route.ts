import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/sanitize-html";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  return withAdmin(async () => {
    if (id) {
      const post = await prisma.blogPost.findUnique({ where: { id } });
      if (!post) throw new Error("NOT_FOUND");
      return post;
    }
    return prisma.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    });
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => {
    const title = String(body.title || "").trim();
    if (!title) throw new Error("INVALID");
    let slug = slugify(String(body.slug || title));
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    const status = body.status === "published" ? "published" : "draft";

    return prisma.blogPost.create({
      data: {
        title,
        slug,
        content: String(body.content ?? "<p></p>"),
        excerpt: body.excerpt ? String(body.excerpt) : null,
        coverImage: body.coverImage ? String(body.coverImage) : null,
        status,
        publishedAt:
          status === "published"
            ? body.publishedAt
              ? new Date(body.publishedAt)
              : new Date()
            : null,
      },
    });
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => {
    const id = String(body.id || "");
    if (!id) throw new Error("INVALID");
    const title = String(body.title || "").trim();
    let slug = slugify(String(body.slug || title));
    const clash = await prisma.blogPost.findFirst({
      where: { slug, NOT: { id } },
    });
    if (clash) slug = `${slug}-${Date.now().toString(36)}`;
    const status = body.status === "published" ? "published" : "draft";
    const current = await prisma.blogPost.findUnique({ where: { id } });

    return prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content: String(body.content ?? ""),
        excerpt: body.excerpt ? String(body.excerpt) : null,
        coverImage: body.coverImage ? String(body.coverImage) : null,
        status,
        publishedAt:
          status === "published"
            ? body.publishedAt
              ? new Date(body.publishedAt)
              : current?.publishedAt ?? new Date()
            : null,
      },
    });
  });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  return withAdmin(async () => {
    if (!id) throw new Error("INVALID");
    await prisma.blogPost.delete({ where: { id } });
    return { deleted: true };
  });
}
