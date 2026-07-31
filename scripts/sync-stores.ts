import { PrismaClient } from "@prisma/client";
import { stores } from "../src/data/stores";

const prisma = new PrismaClient();

async function main() {
  for (const [i, s] of stores.entries()) {
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

  await prisma.pageContent.upsert({
    where: {
      pageSlug_sectionKey_fieldKey: {
        pageSlug: "tiendas",
        sectionKey: "floorPlan",
        fieldKey: "planImage",
      },
    },
    update: { value: "/images/masterplan/levels/nivel-2.png" },
    create: {
      pageSlug: "tiendas",
      sectionKey: "floorPlan",
      fieldKey: "planImage",
      value: "/images/masterplan/levels/nivel-2.png",
    },
  });

  console.log(`Synced ${stores.length} stores + planImage`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
