import { Prisma, PrismaClient } from "@prisma/client";
import { ensureDatabaseUrl } from "@/lib/database-url";

// Debe correr antes de new PrismaClient (Prisma lee process.env.DATABASE_URL)
ensureDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function clientKnowsGallery() {
  const phase = Prisma.dmmf.datamodel.models.find(
    (m) => m.name === "MasterPlanPhase",
  );
  return Boolean(phase?.fields.some((f) => f.name === "gallery"));
}

function clientHasFloorPlanLevel(client: PrismaClient) {
  return Boolean((client as { floorPlanLevel?: unknown }).floorPlanLevel);
}

function isStale(client: PrismaClient) {
  // Tras agregar modelos/campos el singleton de Next puede quedar viejo
  if (!(client as { navItem?: unknown }).navItem) return true;
  if (!clientKnowsGallery()) return true;
  // FloorPlanLevel es requerido por /api/admin/floor-plans; si falta, regenerar cliente
  if (!clientHasFloorPlanLevel(client)) return true;
  return false;
}

export const prisma = (() => {
  const existing = globalForPrisma.prisma;
  if (existing && !isStale(existing)) {
    return existing;
  }
  if (existing) {
    void existing.$disconnect().catch(() => undefined);
  }
  const client = createClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
})();

export type DbStatus = {
  ok: boolean;
  /** Mensaje seguro para mostrar en UI / logs (sin secretos). */
  reason: string;
};

/** Diagnóstico de conexión MySQL (GoDaddy / cPanel / Secrets DB_*). */
export async function getDbStatus(): Promise<DbStatus> {
  const resolved = ensureDatabaseUrl();
  if (!resolved.url) {
    return {
      ok: false,
      reason:
        "Falta conexión MySQL. Adjunte la base en el hosting (Secrets DB_HOST/DB_USER/…) o defina DATABASE_URL.",
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, reason: "ok" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[db]", message);

    const lower = message.toLowerCase();
    if (
      lower.includes("access denied") ||
      lower.includes("authentication") ||
      lower.includes("p1000")
    ) {
      return {
        ok: false,
        reason:
          "MySQL rechazó usuario/contraseña. Revise DB_USER/DB_PASSWORD (o DATABASE_URL).",
      };
    }
    if (
      lower.includes("unknown database") ||
      lower.includes("p1003") ||
      lower.includes("doesn't exist")
    ) {
      return {
        ok: false,
        reason:
          "La base de datos no existe. Revise DB_NAME o créela en el panel de hosting.",
      };
    }
    if (
      lower.includes("econnrefused") ||
      lower.includes("enotfound") ||
      lower.includes("can't reach") ||
      lower.includes("p1001") ||
      lower.includes("connect e") ||
      (lower.includes("connect") && !lower.includes("access denied"))
    ) {
      const host = resolved.host || "(desconocido)";
      return {
        ok: false,
        reason: `No se puede conectar al host MySQL "${host}". Use el DB_HOST que inyecta el hosting (Secrets), no la IP pública.`,
      };
    }
    if (lower.includes("p2021") || lower.includes("does not exist")) {
      return {
        ok: false,
        reason:
          "Conectó, pero faltan tablas. Ejecute: npx prisma db push && npx tsx prisma/seed.ts",
      };
    }

    return {
      ok: false,
      reason: `Error de base de datos: ${message.slice(0, 180)}`,
    };
  }
}

export async function dbAvailable() {
  const status = await getDbStatus();
  return status.ok;
}
