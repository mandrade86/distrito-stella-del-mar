import { PrismaClient } from "@prisma/client";
import { getPageDef } from "../src/lib/content/page-registry";

const prisma = new PrismaClient();

/** Mueve créditos al Hero: quita widget y asegura campos CMS (logos + URLs). */
async function main() {
  const removed = await prisma.homeWidget.deleteMany({
    where: { widgetKey: "projectCredits" },
  });
  console.log(`Removed projectCredits widget rows: ${removed.count}`);

  const shared = getPageDef("shared");
  const section = shared?.sections.find((s) => s.key === "projectCredits");
  if (!section) {
    throw new Error("projectCredits section missing in registry");
  }

  for (const field of section.fields) {
    await prisma.pageContent.upsert({
      where: {
        pageSlug_sectionKey_fieldKey: {
          pageSlug: "shared",
          sectionKey: "projectCredits",
          fieldKey: field.key,
        },
      },
      update: {},
      create: {
        pageSlug: "shared",
        sectionKey: "projectCredits",
        fieldKey: field.key,
        value: field.defaultValue,
      },
    });
  }

  // Ya no usa showOnPages (vive fijo en Hero)
  await prisma.pageContent.deleteMany({
    where: {
      pageSlug: "shared",
      sectionKey: "projectCredits",
      fieldKey: "showOnPages",
    },
  });

  console.log("projectCredits CMS fields ready for Hero");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
