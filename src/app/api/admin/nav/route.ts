import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { DEFAULT_NAV_ITEMS } from "@/lib/content/defaults-cms";

export async function GET() {
  return withAdmin(async () => {
    let rows = await prisma.navItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) {
      await prisma.navItem.createMany({
        data: DEFAULT_NAV_ITEMS.map((item) => ({ ...item })),
      });
      rows = await prisma.navItem.findMany({
        orderBy: { sortOrder: "asc" },
      });
    }
    return rows;
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => {
    const items = Array.isArray(body.items) ? body.items : [];

    const keepIds = items
      .map((item: { id?: string }) => item.id)
      .filter(
        (id: string | undefined) => id && !String(id).startsWith("default-"),
      ) as string[];

    await prisma.$transaction(async (tx) => {
      if (keepIds.length) {
        await tx.navItem.deleteMany({
          where: { id: { notIn: keepIds } },
        });
      } else {
        await tx.navItem.deleteMany();
      }

      for (const [index, item] of items.entries()) {
        const data = {
          label: String(item.label || "").trim() || "Enlace",
          href: String(item.href || "/").trim() || "/",
          enabled: Boolean(item.enabled),
          sortOrder: Number(item.sortOrder ?? index),
        };
        if (item.id && !String(item.id).startsWith("default-")) {
          await tx.navItem.update({
            where: { id: item.id },
            data,
          });
        } else {
          await tx.navItem.create({ data });
        }
      }
    });

    return { saved: true };
  });
}
