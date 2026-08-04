import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/db";
import {
  buildUploadFilename,
  isAllowedImageType,
  MAX_UPLOAD_BYTES,
  storeCmsImage,
} from "@/lib/media-storage";

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

    if (!isAllowedImageType(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Formato no permitido (jpg, png, webp, gif)" },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { ok: false, error: "La imagen supera 8 MB" },
        { status: 400 },
      );
    }

    const filename = buildUploadFilename(file.name, file.type);
    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await storeCmsImage({
      bytes: buffer,
      filename,
      contentType: file.type,
    });

    // Registro en BD para la biblioteca de medios (sobrevive aploys Git)
    try {
      await prisma.mediaAsset.create({
        data: {
          url: stored.url,
          filename: stored.filename,
          driver: stored.driver,
        },
      });
    } catch (dbError) {
      console.error("[admin/upload] mediaAsset", dbError);
    }

    return NextResponse.json({
      ok: true,
      data: {
        url: stored.url,
        filename: stored.filename,
        driver: stored.driver,
      },
    });
  } catch (error) {
    console.error("[admin/upload]", error);
    const message =
      error instanceof Error ? error.message : "No se pudo subir la imagen";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
