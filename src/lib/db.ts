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

function isStale(client: PrismaClient) {
  // Tras agregar modelos/campos el singleton de Next puede quedar viejo
  if (!(client as { navItem?: unknown }).navItem) return true;
  if (!clientKnowsGallery()) return true;
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

export async function dbAvailable() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
