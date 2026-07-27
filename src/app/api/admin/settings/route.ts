import { NextRequest } from "next/server";
import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  return withAdmin(async () => prisma.siteSetting.findMany({ orderBy: { key: "asc" } }));
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as { settings?: Record<string, string> };
  const settings = body.settings ?? {};
  return withAdmin(async () => {
    const entries = Object.entries(settings);
    await Promise.all(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value ?? "") },
          create: { key, value: String(value ?? "") },
        }),
      ),
    );
    return prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  });
}
