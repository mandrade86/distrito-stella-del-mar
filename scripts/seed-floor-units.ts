/**
 * Seed de niveles de plano + unidades placeholder (Disponible)
 * para colocar hotspots en Admin → Tiendas.
 *
 * Uso: npx tsx scripts/seed-floor-units.ts
 */
import { PrismaClient } from "@prisma/client";
import { DEFAULT_FLOOR_PLANS, stores as staticStores } from "../src/data/stores";

const prisma = new PrismaClient();

/** Locales placeholder Nivel 1 (a colocar en el plano). */
const N1_UNITS = [
  "L-101",
  "L-102",
  "L-103",
  "L-104",
  "L-105",
  "L-106",
  "L-107",
  "L-108",
  "L-109",
  "L-110",
  "L-111",
  "L-112",
  "A-101",
  "A-102",
  "FC-101",
  "FC-102",
  "FC-103",
  "K-101",
  "K-102",
  "K-103",
];

/** Locales adicionales Nivel 2 aún sin marca (Disponible). */
const N2_EXTRA = [
  "L-05",
  "L-06",
  "L-07",
  "L-08",
  "L-09",
  "L-10",
  "L-11",
  "L-12",
  "R-05",
  "R-06",
  "R-07",
  "R-08",
  "FC-04",
  "FC-05",
  "K-01",
  "K-02",
  "K-03",
  "K-04",
];

function gridHotspot(index: number, cols = 5) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    hotspotX: 8 + col * 17,
    hotspotY: 12 + row * 14,
    hotspotW: 14,
    hotspotH: 10,
  };
}

async function main() {
  for (const level of DEFAULT_FLOOR_PLANS) {
    await prisma.floorPlanLevel.upsert({
      where: { key: level.key },
      update: {
        label: level.label,
        planImage: level.planImage,
        sortOrder: level.sortOrder,
        active: true,
      },
      create: {
        key: level.key,
        label: level.label,
        planImage: level.planImage,
        sortOrder: level.sortOrder,
        active: true,
      },
    });
  }

  // Sync known occupied stores (static) onto n2
  for (const [i, s] of staticStores.entries()) {
    await prisma.store.upsert({
      where: { code: s.id },
      update: {
        name: s.name,
        unitLabel: s.unitLabel ?? "",
        phone: s.phone,
        email: s.email ?? "",
        website: s.website ?? "",
        hours: s.hours,
        category: s.category,
        status: s.status ?? "Abierto",
        leasingStatus: s.leasingStatus ?? "Ocupado",
        floorPlanKey: s.floorPlanKey ?? "n2",
        level: s.level ?? "Nivel 2",
        area: s.area ?? null,
        description: s.description ?? null,
        logo: s.logo,
        hotspotX: s.hotspot.x,
        hotspotY: s.hotspot.y,
        hotspotW: s.hotspot.w,
        hotspotH: s.hotspot.h,
        sortOrder: i,
        active: true,
      },
      create: {
        code: s.id,
        name: s.name,
        unitLabel: s.unitLabel ?? "",
        phone: s.phone,
        email: s.email ?? "",
        website: s.website ?? "",
        hours: s.hours,
        category: s.category,
        status: s.status ?? "Abierto",
        leasingStatus: s.leasingStatus ?? "Ocupado",
        floorPlanKey: s.floorPlanKey ?? "n2",
        level: s.level ?? "Nivel 2",
        area: s.area ?? null,
        description: s.description ?? null,
        logo: s.logo,
        hotspotX: s.hotspot.x,
        hotspotY: s.hotspot.y,
        hotspotW: s.hotspot.w,
        hotspotH: s.hotspot.h,
        sortOrder: i,
        active: true,
      },
    });
  }

  let created = 0;
  for (const [i, label] of N1_UNITS.entries()) {
    const code = `N1-${label}`;
    const box = gridHotspot(i);
    const result = await prisma.store.upsert({
      where: { code },
      update: {},
      create: {
        code,
        name: "Sin asignar",
        unitLabel: label,
        phone: "",
        email: "",
        website: "",
        hours: "",
        category: "Local",
        status: "Próximamente",
        leasingStatus: "Disponible",
        floorPlanKey: "n1",
        level: "Nivel 1",
        description: null,
        logo: "",
        ...box,
        sortOrder: 100 + i,
        active: true,
      },
    });
    if (result) created += 1;
  }

  for (const [i, label] of N2_EXTRA.entries()) {
    const code = `N2-${label}`;
    const box = gridHotspot(i, 6);
    await prisma.store.upsert({
      where: { code },
      update: {},
      create: {
        code,
        name: "Sin asignar",
        unitLabel: label,
        phone: "",
        email: "",
        website: "",
        hours: "",
        category: "Local",
        status: "Próximamente",
        leasingStatus: "Disponible",
        floorPlanKey: "n2",
        level: "Nivel 2",
        description: null,
        logo: "",
        ...box,
        sortOrder: 200 + i,
        active: true,
      },
    });
    created += 1;
  }

  console.log(
    `Floor levels ready. Placeholder/occupied units upserted (incl. ${created} placeholders).`,
  );
  console.log(
    "Next: Admin → Planos / Niveles (subir planos del PDF) → Tiendas (ajustar hotspots).",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
