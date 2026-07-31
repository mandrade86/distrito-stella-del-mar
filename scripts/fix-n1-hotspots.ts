import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import path from "path";

const prisma = new PrismaClient();
const PLAN = path.join(
  process.cwd(),
  "public/images/masterplan/levels/nivel-1-masterplan.png",
);

type Box = {
  code: string;
  unitLabel: string;
  name: string;
  category: string;
  leasingStatus: "Disponible" | "Reservado" | "Ocupado";
  status: string;
  area?: number;
  description?: string;
  logo?: string;
  phone?: string;
  hours?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  sortOrder: number;
  color: string;
};

/** Hotspots % — calibrados sobre crops del plano 1024×1024. */
const UNITS: Box[] = [
  {
    code: "N1-ANCLA",
    unitLabel: "Ancla",
    name: "Tienda Ancla",
    category: "Ancla",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 1000,
    description: "Local ancla — 1,000 m².",
    x: 15.2,
    y: 14.5,
    w: 17.8,
    h: 17.0,
    sortOrder: 1,
    color: "#168ab5",
  },
  {
    code: "N1-SUPER",
    unitLabel: "Supermercado",
    name: "Supermercado",
    category: "Autoservicio",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 1150,
    description: "Espacio para supermercado — 1,150 m².",
    x: 15.2,
    y: 32.0,
    w: 17.8,
    h: 19.5,
    sortOrder: 2,
    color: "#168ab5",
  },
  {
    code: "N1-XTRA",
    unitLabel: "Xtra",
    name: "Tiendas Xtra",
    category: "Autoservicio",
    leasingStatus: "Ocupado",
    status: "Abierto",
    description: "Ancla de autoservicio en Planta 1.",
    logo: "/images/logos/brand-xtra.jpg",
    phone: "+504 2550-0101",
    hours: "Lun–Sáb 10:00–20:00 · Dom 11:00–18:00",
    x: 64.0,
    y: 13.8,
    w: 24.0,
    h: 37.5,
    sortOrder: 3,
    color: "#082f53",
  },
  {
    code: "N1-DIUNSA",
    unitLabel: "Diunsa",
    name: "Diunsa",
    category: "Ancla",
    leasingStatus: "Ocupado",
    status: "Abierto",
    area: 2760.98,
    description: "Tienda ancla Diunsa — 2,760.98 m².",
    logo: "/images/logos/brand-diunsa.png",
    phone: "+504 2550-0001",
    hours: "Lun–Sáb 10:00–20:00 · Dom 10:00–18:00",
    x: 7.5,
    y: 56.8,
    w: 17.8,
    h: 31.0,
    sortOrder: 4,
    color: "#c5a15a",
  },
  // Corredor: locales pegados al atrio (banda estrecha)
  ...Array.from({ length: 8 }, (_, i): Box => ({
    code: `N1-CI-L${i + 1}`,
    unitLabel: `CI-L${i + 1}`,
    name: "Sin asignar",
    category: "Local",
    leasingStatus: "Disponible",
    status: "Próximamente",
    x: 34.0,
    y: 15.8 + i * 4.05,
    w: 5.0,
    h: 3.5,
    sortOrder: 10 + i,
    color: "#22c55e",
  })),
  ...Array.from({ length: 8 }, (_, i): Box => ({
    code: `N1-CI-R${i + 1}`,
    unitLabel: `CI-R${i + 1}`,
    name: "Sin asignar",
    category: "Local",
    leasingStatus: "Disponible",
    status: "Próximamente",
    x: 58.2,
    y: 15.8 + i * 4.05,
    w: 5.0,
    h: 3.5,
    sortOrder: 20 + i,
    color: "#16a34a",
  })),
  {
    code: "N1-AS-01",
    unitLabel: "AS-01",
    name: "Sin asignar",
    category: "Pad",
    leasingStatus: "Disponible",
    status: "Próximamente",
    x: 34.2,
    y: 71.5,
    w: 7.0,
    h: 4.5,
    sortOrder: 30,
    color: "#f59e0b",
  },
  {
    code: "N1-AS-02",
    unitLabel: "AS-02",
    name: "Sin asignar",
    category: "Pad",
    leasingStatus: "Disponible",
    status: "Próximamente",
    x: 34.2,
    y: 81.0,
    w: 7.0,
    h: 4.8,
    sortOrder: 31,
    color: "#f59e0b",
  },
  {
    code: "N1-AS-03",
    unitLabel: "AS-03",
    name: "Sin asignar",
    category: "Pad",
    leasingStatus: "Disponible",
    status: "Próximamente",
    x: 34.2,
    y: 91.0,
    w: 7.0,
    h: 4.8,
    sortOrder: 32,
    color: "#f59e0b",
  },
  {
    code: "N1-AS-04",
    unitLabel: "AS-04",
    name: "Sin asignar",
    category: "Pad",
    leasingStatus: "Disponible",
    status: "Próximamente",
    x: 10.0,
    y: 91.5,
    w: 7.5,
    h: 5.5,
    sortOrder: 33,
    color: "#f59e0b",
  },
  // LE bloque irregular (no grilla uniforme)
  {
    code: "N1-LE-01",
    unitLabel: "LE-01",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 52.47,
    x: 55.5,
    y: 68.5,
    w: 6.0,
    h: 3.4,
    sortOrder: 40,
    color: "#a855f7",
  },
  {
    code: "N1-LE-02",
    unitLabel: "LE-02",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 52.47,
    x: 55.5,
    y: 72.2,
    w: 6.0,
    h: 3.4,
    sortOrder: 41,
    color: "#a855f7",
  },
  {
    code: "N1-LE-03",
    unitLabel: "LE-03",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 52.47,
    x: 55.5,
    y: 75.9,
    w: 6.0,
    h: 3.4,
    sortOrder: 42,
    color: "#a855f7",
  },
  {
    code: "N1-LE-04",
    unitLabel: "LE-04",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 45.1,
    x: 55.5,
    y: 82.5,
    w: 6.0,
    h: 3.2,
    sortOrder: 43,
    color: "#a855f7",
  },
  {
    code: "N1-LE-05",
    unitLabel: "LE-05",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 45.55,
    x: 68.0,
    y: 68.5,
    w: 5.5,
    h: 3.4,
    sortOrder: 44,
    color: "#a855f7",
  },
  {
    code: "N1-LE-06",
    unitLabel: "LE-06",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 45.55,
    x: 68.0,
    y: 72.2,
    w: 5.5,
    h: 3.4,
    sortOrder: 45,
    color: "#a855f7",
  },
  {
    code: "N1-LE-07",
    unitLabel: "LE-07",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 45.55,
    x: 68.0,
    y: 75.9,
    w: 5.5,
    h: 3.4,
    sortOrder: 46,
    color: "#a855f7",
  },
  {
    code: "N1-LE-08",
    unitLabel: "LE-08",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 45.1,
    x: 68.0,
    y: 79.6,
    w: 5.5,
    h: 3.2,
    sortOrder: 47,
    color: "#a855f7",
  },
  {
    code: "N1-LE-09",
    unitLabel: "LE-09",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 45.1,
    x: 68.0,
    y: 83.0,
    w: 5.5,
    h: 3.2,
    sortOrder: 48,
    color: "#a855f7",
  },
  {
    code: "N1-LE-10",
    unitLabel: "LE-10",
    name: "Sin asignar",
    category: "Local exterior",
    leasingStatus: "Disponible",
    status: "Próximamente",
    area: 84.57,
    x: 82.0,
    y: 67.5,
    w: 8.2,
    h: 7.5,
    sortOrder: 50,
    color: "#ec4899",
  },
  ...[11, 12, 13, 14, 15].map(
    (n, i): Box => ({
      code: `N1-LE-${n}`,
      unitLabel: `LE-${n}`,
      name: "Sin asignar",
      category: "Local exterior",
      leasingStatus: "Disponible",
      status: "Próximamente",
      area: 45.1,
      x: 82.0,
      y: 75.5 + i * 3.35,
      w: 8.2,
      h: 3.1,
      sortOrder: 50 + i + 1,
      color: "#ec4899",
    }),
  ),
  ...[
    { n: 16, x: 61.5 },
    { n: 17, x: 68.0 },
    { n: 18, x: 74.5 },
    { n: 19, x: 81.0 },
    { n: 20, x: 87.5 },
  ].map(
    (u, i): Box => ({
      code: `N1-LE-${u.n}`,
      unitLabel: `LE-${u.n}`,
      name: "Sin asignar",
      category: "Local exterior",
      leasingStatus: "Disponible",
      status: "Próximamente",
      area: u.n === 20 ? 45.1 : 47.23,
      x: u.x,
      y: 91.5,
      w: 5.8,
      h: 5.0,
      sortOrder: 60 + i,
      color: "#ec4899",
    }),
  ),
];

async function writeOverlay() {
  const meta = await sharp(PLAN).metadata();
  const W = meta.width!;
  const H = meta.height!;
  const rects = UNITS.map((b) => ({
    input: Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.max(2, Math.round((b.w / 100) * W))}" height="${Math.max(2, Math.round((b.h / 100) * H))}">
        <rect width="100%" height="100%" fill="${b.color}" fill-opacity="0.4" stroke="#000" stroke-width="1"/>
      </svg>`,
    ),
    left: Math.round((b.x / 100) * W),
    top: Math.round((b.y / 100) * H),
  }));
  await sharp(PLAN)
    .composite(rects)
    .png()
    .toFile(path.join(process.cwd(), "public/images/masterplan/levels/_n1-check.png"));
  console.log("overlay ok");
}

async function seed() {
  await prisma.floorPlanLevel.upsert({
    where: { key: "n1" },
    update: {
      planImage: "/images/masterplan/levels/nivel-1-masterplan.png",
      label: "Planta 1",
      active: true,
      sortOrder: 0,
    },
    create: {
      key: "n1",
      label: "Planta 1",
      planImage: "/images/masterplan/levels/nivel-1-masterplan.png",
      sortOrder: 0,
      active: true,
    },
  });

  const keep = new Set(UNITS.map((u) => u.code));
  for (const row of await prisma.store.findMany({
    where: { floorPlanKey: "n1" },
    select: { code: true },
  })) {
    if (!keep.has(row.code)) {
      await prisma.store.update({
        where: { code: row.code },
        data: { active: false },
      });
    }
  }

  for (const u of UNITS) {
    await prisma.store.upsert({
      where: { code: u.code },
      update: {
        name: u.name,
        unitLabel: u.unitLabel,
        phone: u.phone ?? "",
        hours: u.hours ?? "",
        category: u.category,
        status: u.status,
        leasingStatus: u.leasingStatus,
        floorPlanKey: "n1",
        level: "Planta 1",
        area: u.area ?? null,
        description: u.description ?? null,
        logo: u.logo ?? "",
        hotspotX: u.x,
        hotspotY: u.y,
        hotspotW: u.w,
        hotspotH: u.h,
        sortOrder: u.sortOrder,
        active: true,
      },
      create: {
        code: u.code,
        name: u.name,
        unitLabel: u.unitLabel,
        phone: u.phone ?? "",
        email: "",
        website: "",
        hours: u.hours ?? "",
        category: u.category,
        status: u.status,
        leasingStatus: u.leasingStatus,
        floorPlanKey: "n1",
        level: "Planta 1",
        area: u.area ?? null,
        description: u.description ?? null,
        logo: u.logo ?? "",
        hotspotX: u.x,
        hotspotY: u.y,
        hotspotW: u.w,
        hotspotH: u.h,
        sortOrder: u.sortOrder,
        active: true,
      },
    });
  }
  console.log(`seeded ${UNITS.length}`);
}

async function main() {
  await writeOverlay();
  await seed();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
