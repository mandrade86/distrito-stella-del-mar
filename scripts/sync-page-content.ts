import { PrismaClient } from "@prisma/client";
import {
  PAGE_REGISTRY,
  getPageDef,
} from "../src/lib/content/page-registry";

const prisma = new PrismaClient();

async function main() {
  let created = 0;
  for (const pageMeta of PAGE_REGISTRY) {
    const page = getPageDef(pageMeta.slug);
    if (!page) continue;
    for (const section of page.sections) {
      for (const field of section.fields) {
        const existing = await prisma.pageContent.findUnique({
          where: {
            pageSlug_sectionKey_fieldKey: {
              pageSlug: page.slug,
              sectionKey: section.key,
              fieldKey: field.key,
            },
          },
        });
        if (!existing) {
          await prisma.pageContent.create({
            data: {
              pageSlug: page.slug,
              sectionKey: section.key,
              fieldKey: field.key,
              value: field.defaultValue,
            },
          });
          created += 1;
          console.log(`+ ${page.slug}.${section.key}.${field.key}`);
        }
      }
    }
  }
  console.log(`Done. Created ${created} missing fields.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
