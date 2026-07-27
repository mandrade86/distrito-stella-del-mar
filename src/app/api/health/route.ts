import { NextResponse } from "next/server";
import { getDbStatus } from "@/lib/db";

/** Diagnóstico rápido de MySQL (sin secretos). Útil en GoDaddy. */
export async function GET() {
  const db = await getDbStatus();
  return NextResponse.json({
    ok: db.ok,
    database: db.ok ? "connected" : "unavailable",
    detail: db.reason,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL?.trim()),
    siteEnv: process.env.NEXT_PUBLIC_SITE_ENV ?? "unset",
  });
}
