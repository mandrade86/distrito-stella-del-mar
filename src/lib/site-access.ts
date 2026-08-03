import { prisma } from "@/lib/db";

export const SITE_LIVE_KEY = "siteLive";

/**
 * Sitio público abierto a todos.
 * - SITE_LIVE=true|false en env tiene prioridad (hosting / emergencia)
 * - Si no, lee SiteSetting `siteLive` (`true` / `false`)
 * - Sin valor → no público (solo admin logueado)
 */
export async function isSiteLive(): Promise<boolean> {
  const env = process.env.SITE_LIVE?.trim().toLowerCase();
  if (env === "true" || env === "1") return true;
  if (env === "false" || env === "0") return false;

  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: SITE_LIVE_KEY },
    });
    if (!row) return false;
    return parseSiteLiveFlag(row.value);
  } catch {
    return false;
  }
}

export function parseSiteLiveFlag(value: unknown): boolean {
  const v = String(value ?? "")
    .trim()
    .toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}
