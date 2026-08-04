import { NextResponse } from "next/server";
import { ensureDatabaseUrl } from "@/lib/database-url";
import { getDbStatus } from "@/lib/db";

/** Si este valor no aparece en producción, GoDaddy no desplegó el master actual. */
export const CODE_VERSION = "airo-2026-08-04c";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Diagnóstico rápido de MySQL / Blob (sin secretos). */
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

  const blobStorage = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      process.env.VERCEL_BLOB_READ_WRITE_TOKEN?.trim(),
  );

  return NextResponse.json(
    {
      ok: db.ok,
      codeVersion: CODE_VERSION,
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
      blobStorage,
      tip: !db.ok
        ? db.reason
        : !blobStorage
          ? "Falta BLOB_READ_WRITE_TOKEN en Secrets de la app (o el deploy no lo inyectó). Redeploy tras guardar el secret."
          : undefined,
      siteEnv: process.env.NEXT_PUBLIC_SITE_ENV ?? "unset",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
