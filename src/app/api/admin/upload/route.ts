import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/auth/admin";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 8 * 1024 * 1024;

function sanitizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Archivo requerido" },
        { status: 400 },
      );
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Formato no permitido (jpg, png, webp, gif)" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "La imagen supera 8 MB" },
        { status: 400 },
      );
    }

    const ext =
      path.extname(file.name).toLowerCase() ||
      (file.type === "image/png"
        ? ".png"
        : file.type === "image/webp"
          ? ".webp"
          : file.type === "image/gif"
            ? ".gif"
            : ".jpg");

    const base = sanitizeName(path.basename(file.name, path.extname(file.name))) || "image";
    const filename = `${Date.now()}-${base}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ ok: true, data: { url, filename } });
  } catch (error) {
    console.error("[admin/upload]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo subir la imagen" },
      { status: 500 },
    );
  }
}
