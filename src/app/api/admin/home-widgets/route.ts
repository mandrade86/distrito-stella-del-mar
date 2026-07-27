import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import {
  BUILTIN_HOME_WIDGET_KEYS,
  DEFAULT_HOME_WIDGETS,
  isHtmlHomeWidget,
} from "@/lib/content/defaults-cms";
import { slugify } from "@/lib/sanitize-html";

function mapRow(row: {
  id: string;
  widgetKey: string;
  label: string;
  kind: string;
  html: string | null;
  enabled: boolean;
  sortOrder: number;
}) {
  return {
    id: row.id,
    widgetKey: row.widgetKey,
    label: row.label,
    kind: row.kind === "html" ? "html" : "builtin",
    html: row.html ?? "",
    enabled: row.enabled,
    sortOrder: row.sortOrder,
  };
}

export async function GET() {
  return withAdmin(async () => {
    let rows = await prisma.homeWidget.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) {
      await prisma.homeWidget.createMany({
        data: DEFAULT_HOME_WIDGETS.map((w) => ({
          widgetKey: w.widgetKey,
          label: w.label,
          kind: w.kind,
          html: w.html,
          enabled: w.enabled,
          sortOrder: w.sortOrder,
        })),
      });
      rows = await prisma.homeWidget.findMany({
        orderBy: { sortOrder: "asc" },
      });
    }
    return rows
      .filter((row) => row.widgetKey !== "projectCredits")
      .map(mapRow);
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return withAdmin(async () => {
    const widgets = Array.isArray(body.widgets) ? body.widgets : [];
    const incomingKeys = new Set<string>();

    await prisma.$transaction(async (tx) => {
      for (const [index, raw] of widgets.entries()) {
        const label = String(raw.label || "Bloque HTML").trim() || "Bloque HTML";
        let widgetKey = String(raw.widgetKey || "").trim();
        const kind =
          raw.kind === "html" ||
          (widgetKey && isHtmlHomeWidget({ kind: raw.kind, widgetKey }))
            ? "html"
            : "builtin";
        const enabled = Boolean(raw.enabled);
        const sortOrder =
          typeof raw.sortOrder === "number" ? raw.sortOrder : index;
        const html =
          kind === "html"
            ? String(raw.html ?? "")
            : null;

        if (!widgetKey) {
          if (kind !== "html") throw new Error("INVALID");
          widgetKey = `html-${slugify(label) || "bloque"}-${Date.now().toString(36)}`;
        }

        if (kind === "builtin" && !BUILTIN_HOME_WIDGET_KEYS.has(widgetKey)) {
          // No crear builtins inventados
          continue;
        }

        incomingKeys.add(widgetKey);

        await tx.homeWidget.upsert({
          where: { widgetKey },
          create: {
            widgetKey,
            label,
            kind,
            html,
            enabled,
            sortOrder,
          },
          update: {
            label,
            kind,
            html,
            enabled,
            sortOrder,
          },
        });
      }

      // Eliminar widgets HTML que ya no vienen en la lista
      const existing = await tx.homeWidget.findMany({
        where: { kind: "html" },
        select: { widgetKey: true },
      });
      const toDelete = existing
        .map((r) => r.widgetKey)
        .filter((key) => !incomingKeys.has(key));
      if (toDelete.length) {
        await tx.homeWidget.deleteMany({
          where: { widgetKey: { in: toDelete }, kind: "html" },
        });
      }
    });

    return { saved: true };
  });
}

export async function DELETE(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("widgetKey");
  return withAdmin(async () => {
    if (!key) throw new Error("INVALID");
    if (BUILTIN_HOME_WIDGET_KEYS.has(key)) {
      throw new Error("No se pueden eliminar las secciones fijas; ocúltelas.");
    }
    await prisma.homeWidget.deleteMany({
      where: { widgetKey: key, kind: "html" },
    });
    return { deleted: true };
  });
}
