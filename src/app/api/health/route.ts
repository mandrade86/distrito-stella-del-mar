import { NextResponse } from "next/server";
import { ensureDatabaseUrl } from "@/lib/database-url";
import { getDbStatus } from "@/lib/db";

/** Diagnóstico rápido de MySQL (sin secretos). Útil en GoDaddy / hosting. */
export async function GET() {
  const resolved = ensureDatabaseUrl();
  const db = await getDbStatus();
  const { isSiteLive } = await import("@/lib/site-access");
  let siteLive = false;
  try {
    siteLive = await isSiteLive();
  } catch {
    siteLive = false;
  }
  return NextResponse.json({
    ok: db.ok,
    database: db.ok ? "connected" : "unavailable",
    detail: db.reason,
    hasDatabaseUrl: Boolean(resolved.url),
    dbSource: resolved.source,
    mysql: resolved.url
      ? {
          host: resolved.host ?? "(vacío)",
          port: resolved.port ?? "3306",
          database: resolved.database ?? "(vacío)",
          protocol: "mysql",
        }
      : null,
    hasDbSecrets: Boolean(
      process.env.DB_HOST?.trim() &&
        process.env.DB_USER?.trim() &&
        process.env.DB_NAME?.trim(),
    ),
    siteLive,
    blobStorage: Boolean(
      process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
        process.env.VERCEL_BLOB_READ_WRITE_TOKEN?.trim(),
    ),
    tip:
      !db.ok && resolved.source === "DATABASE_URL" && !process.env.DB_HOST
        ? "Si el hosting adjunta la BD, use los Secrets DB_HOST/DB_USER/DB_PASSWORD/DB_NAME (no arme DATABASE_URL a mano con localhost)."
        : !(
              process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
              process.env.VERCEL_BLOB_READ_WRITE_TOKEN?.trim()
            )
          ? "Para subir imágenes desde el CMS en GoDaddy (Git read-only), agregue BLOB_READ_WRITE_TOKEN (Vercel Blob) en Secrets y Redeploy."
          : undefined,
    siteEnv: process.env.NEXT_PUBLIC_SITE_ENV ?? "unset",
  });
}
