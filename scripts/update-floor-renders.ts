import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const levels = [
    {
      key: "n1",
      label: "Planta 1",
      planImage: "/images/masterplan/levels/nivel-1-masterplan.png",
      sortOrder: 0,
    },
    {
      key: "n2",
      label: "Planta 2",
      planImage: "/images/masterplan/levels/nivel-2.png",
      sortOrder: 1,
    },
  ];

  for (const level of levels) {
    await prisma.floorPlanLevel.upsert({
      where: { key: level.key },
      update: {
        planImage: level.planImage,
        label: level.label,
        active: true,
        sortOrder: level.sortOrder,
      },
      create: { ...level, active: true },
    });
  }

  console.log("Planta 1 y Planta 2 listas para el mapa interactivo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
