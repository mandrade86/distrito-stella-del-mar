import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import {
  PAGE_REGISTRY,
  defaultsForPage,
  getPageDef,
  mergePageCopy,
} from "@/lib/content/page-registry";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  return withAdmin(async () => {
    if (!slug) {
      return {
        pages: PAGE_REGISTRY.map((page) => ({
          slug: page.slug,
          label: page.label,
          path: page.path,
        })),
      };
    }

    const def = getPageDef(slug);
    if (!def) {
      throw new Error("PAGE_NOT_FOUND");
    }

    const rows = await prisma.pageContent.findMany({
      where: { pageSlug: slug },
    });

    return {
      page: { slug: def.slug, label: def.label, path: def.path },
      sections: def.sections,
      values: mergePageCopy(slug, rows),
      defaults: defaultsForPage(slug),
    };
  });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as {
    slug?: string;
    values?: Record<string, Record<string, string>>;
  };

  return withAdmin(async () => {
    const slug = body.slug;
    const values = body.values;
    const def = slug ? getPageDef(slug) : undefined;
    if (!def || !values) {
      throw new Error("INVALID_PAYLOAD");
    }

    const ops = [];
    for (const section of def.sections) {
      for (const field of section.fields) {
        const value = values[section.key]?.[field.key] ?? field.defaultValue;
        ops.push(
          prisma.pageContent.upsert({
            where: {
              pageSlug_sectionKey_fieldKey: {
                pageSlug: slug!,
                sectionKey: section.key,
                fieldKey: field.key,
              },
            },
            create: {
              pageSlug: slug!,
              sectionKey: section.key,
              fieldKey: field.key,
              value,
            },
            update: { value },
          }),
        );
      }
    }
    await prisma.$transaction(ops);
    return { saved: true, slug };
  });
}
