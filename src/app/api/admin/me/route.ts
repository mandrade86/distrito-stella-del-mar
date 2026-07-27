import { NextResponse } from "next/server";
import { getAdminSession, unauthorized } from "@/lib/admin-api";
import { dbAvailable, prisma } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();
  if (!(await dbAvailable())) {
    return NextResponse.json({ ok: false, error: "DB offline" }, { status: 503 });
  }

  const [slides, stores, spaces, gallery, brands, phases, leads, pages, cmsPages, blog] =
    await Promise.all([
      prisma.heroSlide.count(),
      prisma.store.count(),
      prisma.commercialSpace.count(),
      prisma.galleryItem.count(),
      prisma.brand.count(),
      prisma.masterPlanPhase.count(),
      prisma.contactLead.count(),
      prisma.pageContent.groupBy({ by: ["pageSlug"] }).then((rows) => rows.length),
      prisma.cmsPage.count(),
      prisma.blogPost.count(),
    ]);

  return NextResponse.json({
    ok: true,
    data: {
      email: session.email,
      counts: {
        slides,
        stores,
        spaces,
        gallery,
        brands,
        phases,
        leads,
        pages,
        cmsPages,
        blog,
      },
    },
  });
}
