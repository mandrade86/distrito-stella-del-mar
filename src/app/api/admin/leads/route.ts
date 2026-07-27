import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  return withAdmin(async () =>
    prisma.contactLead.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  );
}
