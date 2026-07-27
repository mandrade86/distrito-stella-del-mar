import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { unauthorized } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

async function listImages(
  absDir: string,
  webBase: string,
): Promise<string[]> {
  try {
    const entries = await readdir(absDir, { withFileTypes: true });
    const urls: string[] = [];
    for (const entry of entries) {
      const abs = path.join(absDir, entry.name);
      const web = `${webBase}/${entry.name}`.replace(/\\/g, "/");
      if (entry.isDirectory()) {
        urls.push(...(await listImages(abs, web)));
        continue;
      }
      if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
        urls.push(web);
      }
    }
    return urls;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const publicRoot = path.join(process.cwd(), "public");
  const [fromImages, fromUploads, galleryRows] = await Promise.all([
    listImages(path.join(publicRoot, "images"), "/images"),
    listImages(path.join(publicRoot, "uploads"), "/uploads"),
    prisma.galleryItem
      .findMany({ select: { src: true }, orderBy: { sortOrder: "asc" } })
      .catch(() => [] as { src: string }[]),
  ]);

  const urls = [
    ...new Set([
      ...fromUploads,
      ...fromImages,
      ...galleryRows.map((g) => g.src).filter(Boolean),
    ]),
  ].sort((a, b) => a.localeCompare(b));

  return NextResponse.json({ ok: true, data: { urls } });
}
