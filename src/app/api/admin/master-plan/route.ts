import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { fromJsonText, toJsonText } from "@/lib/json-text";

export async function GET() {
  return withAdmin(async () => {
    const rows = await prisma.masterPlanPhase.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((row) => ({
      ...row,
      gallery: fromJsonText<string[]>(row.gallery, []),
      highlights: fromJsonText<string[]>(row.highlights, []),
    }));
  });
}

function parseLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const highlights = parseLines(body.highlights);
  const gallery = parseLines(body.gallery);

  return withAdmin(async () =>
    prisma.masterPlanPhase.create({
      data: {
        tabId: String(body.tabId ?? ""),
        label: String(body.label ?? ""),
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        image: String(body.image ?? ""),
        imageAlt: String(body.imageAlt ?? ""),
        gallery: toJsonText(gallery),
        highlights: toJsonText(highlights),
        sortOrder: Number(body.sortOrder ?? 0),
      },
    }),
  );
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const highlights = parseLines(body.highlights);
  const gallery = parseLines(body.gallery);

  return withAdmin(async () =>
    prisma.masterPlanPhase.update({
      where: { id: String(body.id) },
      data: {
        tabId: String(body.tabId ?? ""),
        label: String(body.label ?? ""),
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        image: String(body.image ?? ""),
        imageAlt: String(body.imageAlt ?? ""),
        gallery: toJsonText(gallery),
        highlights: toJsonText(highlights),
        sortOrder: Number(body.sortOrder ?? 0),
      },
    }),
  );
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  return withAdmin(async () => {
    if (!id) throw new Error("Missing id");
    return prisma.masterPlanPhase.delete({ where: { id } });
  });
}
