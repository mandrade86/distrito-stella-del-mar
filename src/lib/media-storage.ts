import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function isAllowedImageType(type: string) {
  return ALLOWED.has(type);
}

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function sanitizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function buildUploadFilename(originalName: string, mimeType: string) {
  const ext =
    path.extname(originalName).toLowerCase() ||
    (mimeType === "image/png"
      ? ".png"
      : mimeType === "image/webp"
        ? ".webp"
        : mimeType === "image/gif"
          ? ".gif"
          : ".jpg");
  const base =
    sanitizeName(path.basename(originalName, path.extname(originalName))) ||
    "image";
  return `${Date.now()}-${base}${ext}`;
}

function isReadOnlyFsError(error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  const code = (error as NodeJS.ErrnoException)?.code;
  return (
    /erofs|eacces|read-only|permission denied|eperm/i.test(msg) ||
    code === "EROFS" ||
    code === "EACCES" ||
    code === "EPERM"
  );
}

export type StoredUpload = {
  url: string;
  filename: string;
  driver: "blob" | "local";
};

/** Sube a Vercel Blob (recomendado en GoDaddy Git-connected) o a public/uploads. */
export async function storeCmsImage(opts: {
  bytes: Buffer;
  filename: string;
  contentType: string;
}): Promise<StoredUpload> {
  const { bytes, filename, contentType } = opts;

  if (blobConfigured()) {
    const blob = await put(`cms/${filename}`, bytes, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });
    return { url: blob.url, filename, driver: "blob" };
  }

  // En producción (GoDaddy Git) el disco no sirve: no devolver /uploads/ que luego dan 404
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Falta BLOB_READ_WRITE_TOKEN. En GoDaddy → Secrets agregue el token de Vercel Blob, reinicie/redeploy, y vuelva a subir la imagen. No use /uploads/ en este hosting.",
    );
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);
    return { url: `/uploads/${filename}`, filename, driver: "local" };
  } catch (error) {
    if (isReadOnlyFsError(error)) {
      throw new Error(
        "El disco de la app es de solo lectura (Git-connected). Configure BLOB_READ_WRITE_TOKEN (Vercel Blob) en Secrets para subir imágenes desde el CMS.",
      );
    }
    throw error;
  }
}

/** Lista URLs públicas en el store de Blob (carpeta cms/). */
export async function listBlobCmsUrls(): Promise<string[]> {
  if (!blobConfigured()) return [];
  try {
    const urls: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({
        prefix: "cms/",
        cursor,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      for (const b of page.blobs) {
        if (b.url) urls.push(b.url);
      }
      cursor = page.cursor;
      if (!page.hasMore) break;
    } while (cursor);
    return urls;
  } catch (error) {
    console.error("[media] list blob", error);
    return [];
  }
}
