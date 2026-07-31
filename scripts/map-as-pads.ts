import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import path from "path";

const prisma = new PrismaClient();
const PLAN = path.join(
  process.cwd(),
  "public/images/masterplan/levels/nivel-1-masterplan.png",
);

/** % sobre plano 1024×1024 — pads en estacionamiento. */
const AS_UNITS = [
  {
    code: "N1-AS-01",
    unitLabel: "AS-01",
    x: 35.8,
    y: 72.6,
    w: 7.2,
    h: 5.0,
  },
  {
    code: "N1-AS-02",
    unitLabel: "AS-02",
    x: 35.5,
    y: 82.2,
    w: 8.4,
    h: 5.6,
  },
  {
    code: "N1-AS-03",
    unitLabel: "AS-03",
    x: 35.5,
    y: 92.0,
    w: 8.4,
    h: 5.6,
  },
  {
    code: "N1-AS-04",
    unitLabel: "AS-04",
    x: 9.5,
    y: 93.0,
    w: 8.6,
    h: 5.6,
  },
];

async function overlay() {
  const { width: W = 1024, height: H = 1024 } = await sharp(PLAN).metadata();
  const rects = AS_UNITS.map((b) => {
    const width = Math.max(2, Math.round((b.w / 100) * W));
    const height = Math.max(2, Math.round((b.h / 100) * H));
    return {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <rect width="100%" height="100%" rx="6" fill="#f59e0b" fill-opacity="0.45" stroke="#000" stroke-width="2"/>
          <text x="4" y="16" font-size="13" font-family="Arial" font-weight="bold" fill="#000">${b.unitLabel}</text>
        </svg>`,
      ),
      left: Math.round((b.x / 100) * W),
      top: Math.round((b.y / 100) * H),
    };
  });
  const out = path.join(
    process.cwd(),
    "public/images/masterplan/levels/_as-check.jpg",
  );
  await sharp(PLAN).composite(rects).jpeg({ quality: 82 }).toFile(out);
  console.log("overlay", out);
}

async function seed() {
  for (const [i, u] of AS_UNITS.entries()) {
    await prisma.store.upsert({
      where: { code: u.code },
      update: {
        name: "Sin asignar",
        unitLabel: u.unitLabel,
        category: "Pad",
        status: "Próximamente",
        leasingStatus: "Disponible",
        floorPlanKey: "n1",
        level: "Planta 1",
        description: `Local tipo pad ${u.unitLabel} en estacionamiento.`,
        hotspotX: u.x,
        hotspotY: u.y,
        hotspotW: u.w,
        hotspotH: u.h,
        sortOrder: 30 + i,
        active: true,
        phone: "",
        hours: "",
        logo: "",
      },
      create: {
        code: u.code,
        name: "Sin asignar",
        unitLabel: u.unitLabel,
        phone: "",
        email: "",
        website: "",
        hours: "",
        category: "Pad",
        status: "Próximamente",
        leasingStatus: "Disponible",
        floorPlanKey: "n1",
        level: "Planta 1",
        description: `Local tipo pad ${u.unitLabel} en estacionamiento.`,
        logo: "",
        hotspotX: u.x,
        hotspotY: u.y,
        hotspotW: u.w,
        hotspotH: u.h,
        sortOrder: 30 + i,
        active: true,
      },
    });
  }
  console.log("AS-01…AS-04 activos");
}

async function main() {
  await overlay();
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
