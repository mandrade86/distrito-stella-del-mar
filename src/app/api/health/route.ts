import { NextResponse } from "next/server";
import { getDbStatus } from "@/lib/db";

/** Extrae host/puerto/BD sin revelar usuario ni contraseña. */
function safeMysqlTarget(raw?: string) {
  const url = raw?.trim();
  if (!url) return null;
  try {
    const u = new URL(url);
    const dbName = decodeURIComponent(u.pathname.replace(/^\//, "").split("?")[0] || "");
    return {
      host: u.hostname || "(vacío)",
      port: u.port || "3306",
      database: dbName || "(vacío)",
      protocol: u.protocol.replace(":", ""),
    };
  } catch {
    return { parseError: true as const };
  }
}

/** Diagnóstico rápido de MySQL (sin secretos). Útil en GoDaddy. */
export async function GET() {
  const db = await getDbStatus();
  const target = safeMysqlTarget(process.env.DATABASE_URL);
  return NextResponse.json({
    ok: db.ok,
    database: db.ok ? "connected" : "unavailable",
    detail: db.reason,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL?.trim()),
    mysql: target,
    tip:
      !db.ok && target && "host" in target && target.host !== "127.0.0.1" && target.host !== "localhost"
        ? "El host no es 127.0.0.1/localhost. En cPanel cámbielo; no use la IP pública del sitio."
        : undefined,
    siteEnv: process.env.NEXT_PUBLIC_SITE_ENV ?? "unset",
  });
}
