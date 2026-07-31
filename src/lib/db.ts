import { Prisma, PrismaClient } from "@prisma/client";

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

/** Diagnóstico de conexión MySQL (GoDaddy / cPanel). */
export async function getDbStatus(): Promise<DbStatus> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    return {
      ok: false,
      reason:
        "Falta DATABASE_URL. En GoDaddy cPanel → Setup Node.js App → Environment Variables, o cree un archivo .env en la raíz del proyecto.",
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
          "MySQL rechazó usuario/contraseña. Revise DATABASE_URL (en cPanel el usuario suele ser cuenta_usuario).",
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
          "La base de datos no existe. Créela en cPanel → MySQL Databases y asigne el usuario.",
      };
    }
    if (
      lower.includes("econnrefused") ||
      lower.includes("enotfound") ||
      lower.includes("can't reach") ||
      lower.includes("p1001") ||
      lower.includes("connect")
    ) {
      return {
        ok: false,
        reason:
          "No se puede conectar al host MySQL. En cPanel use host 127.0.0.1 o localhost (no la IP pública).",
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
