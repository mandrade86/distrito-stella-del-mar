import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { stores as staticStores } from "../src/data/stores";
import { spaces as staticSpaces } from "../src/data/spaces";
import { galleryItems as staticGallery } from "../src/data/gallery";
import { anchorBrands as staticBrands } from "../src/data/brands";
import { masterPlanPhases as staticPhases } from "../src/data/masterplan";

const prisma = new PrismaClient();

const heroSlides = [
  {
    src: "/images/renders-1.jpg",
    alt: "Vista aérea del desarrollo de Distrito Stella del Mar",
  },
  {
    src: "/images/renders/sdm-01.png",
    alt: "Fachada principal de Distrito Stella del Mar",
  },
  {
    src: "/images/renders/sdm-03.png",
    alt: "Acceso peatonal y plaza comercial de Distrito Stella del Mar",
  },
  {
    src: "/images/renders/sdm-05.png",
    alt: "Experiencia de gastronomía y comercio en Distrito Stella del Mar",
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@distritostelladelmar.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: "Administrador" },
    create: { email, name: "Administrador", passwordHash },
  });

  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({
    data: heroSlides.map((slide, index) => ({
      ...slide,
      sortOrder: index,
      active: true,
    })),
  });

  await prisma.floorPlanLevel.deleteMany();
  await prisma.floorPlanLevel.createMany({
    data: [
      {
        key: "n1",
        label: "Planta 1",
        planImage: "/images/masterplan/levels/nivel-1.png",
        sortOrder: 0,
        active: true,
      },
      {
        key: "n2",
        label: "Planta 2",
        planImage: "/images/masterplan/levels/nivel-2.png",
        sortOrder: 1,
        active: true,
      },
    ],
  });

  await prisma.store.deleteMany();
  await prisma.store.createMany({
    data: staticStores.map((store, index) => ({
      code: store.id,
      name: store.name,
      unitLabel: store.unitLabel ?? "",
      phone: store.phone,
      email: store.email ?? "",
      website: store.website ?? "",
      hours: store.hours,
      category: store.category,
      status: store.status ?? "Abierto",
      leasingStatus: store.leasingStatus ?? "Ocupado",
      floorPlanKey: store.floorPlanKey ?? "n2",
      level: store.level ?? "Nivel 2",
      area: store.area ?? null,
      description: store.description ?? "",
      logo: store.logo,
      hotspotX: store.hotspot.x,
      hotspotY: store.hotspot.y,
      hotspotW: store.hotspot.w,
      hotspotH: store.hotspot.h,
      sortOrder: index,
      active: true,
    })),
  });

  await prisma.commercialSpace.deleteMany();
  await prisma.commercialSpace.createMany({
    data: staticSpaces.map((space, index) => ({
      code: space.id,
      name: space.name,
      category: space.category,
      area: space.area,
      phase: space.phase,
      level: space.level ?? null,
      status: space.status,
      featured: Boolean(space.featured),
      sortOrder: index,
    })),
  });

  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: staticGallery.map((item, index) => ({
      src: item.src,
      alt: item.alt,
      span: item.span ?? "square",
      sortOrder: index,
      active: true,
    })),
  });

  await prisma.brand.deleteMany();
  await prisma.brand.createMany({
    data: staticBrands.map((brand, index) => ({
      name: brand.name,
      logo: brand.logo ?? null,
      logoScale: brand.logoScale ?? 1,
      note: brand.note ?? null,
      sortOrder: index,
      active: true,
    })),
  });

  await prisma.masterPlanPhase.deleteMany();
  for (const [index, phase] of staticPhases.entries()) {
    await prisma.masterPlanPhase.create({
      data: {
        tabId: phase.id,
        label: phase.label,
        title: phase.title,
        description: phase.description,
        image: phase.image,
        imageAlt: phase.imageAlt,
        gallery: phase.gallery,
        highlights: phase.highlights,
        sortOrder: index,
      },
    });
  }

  const settings: Record<string, string> = {
    contactEmail: "info@distritostelladelmar.com",
    contactPhone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    footerText:
      "Desarrollo comercial moderno en Puerto Cortés con locales, gastronomía, servicios financieros, entretenimiento y renta de espacio para eventos.",
    addressLine:
      "CA-13, Barrio El Porvenir, frente al Colegio Franklin Delano Roosevelt, Puerto Cortés, Honduras",
    privacyUrl: "/contacto",
    termsUrl: "/contacto",
    mapsUrl: "https://www.google.com/maps?q=15.81699333534756,-87.93110169660831",
    mapLat: "15.81699333534756",
    mapLng: "-87.93110169660831",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  const { PAGE_REGISTRY } = await import("../src/lib/content/page-registry");
  for (const page of PAGE_REGISTRY) {
    for (const section of page.sections) {
      for (const field of section.fields) {
        const forceHomeMasterPlan =
          page.slug === "shared" &&
          section.key === "homeMasterPlan" &&
          ["title", "ctaPrimary", "ctaSecondary", "ctaTitle"].includes(
            field.key,
          );

        await prisma.pageContent.upsert({
          where: {
            pageSlug_sectionKey_fieldKey: {
              pageSlug: page.slug,
              sectionKey: section.key,
              fieldKey: field.key,
            },
          },
          update: forceHomeMasterPlan
            ? { value: field.defaultValue }
            : {},
          create: {
            pageSlug: page.slug,
            sectionKey: section.key,
            fieldKey: field.key,
            value: field.defaultValue,
          },
        });
      }
    }
  }

  const {
    DEFAULT_HOME_WIDGETS,
    DEFAULT_NAV_ITEMS,
    SAMPLE_BLOG_POSTS,
  } = await import("../src/lib/content/defaults-cms");

  for (const widget of DEFAULT_HOME_WIDGETS) {
    await prisma.homeWidget.upsert({
      where: { widgetKey: widget.widgetKey },
      update: {
        label: widget.label,
        kind: widget.kind,
        sortOrder: widget.sortOrder,
      },
      create: {
        widgetKey: widget.widgetKey,
        label: widget.label,
        kind: widget.kind,
        html: widget.html,
        enabled: widget.enabled,
        sortOrder: widget.sortOrder,
      },
    });
  }

  const navCount = await prisma.navItem.count();
  if (!navCount) {
    await prisma.navItem.createMany({
      data: DEFAULT_NAV_ITEMS.map((item) => ({ ...item })),
    });
  } else {
    // Fusion Blog → Novedades: quitar enlace duplicado del menú
    await prisma.navItem.deleteMany({ where: { href: "/blog" } });
    for (const item of DEFAULT_NAV_ITEMS) {
      const existing = await prisma.navItem.findFirst({
        where: { href: item.href },
      });
      if (!existing) {
        await prisma.navItem.create({ data: { ...item } });
      }
    }
  }

  for (const [index, post] of SAMPLE_BLOG_POSTS.entries()) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        status: "published",
        publishedAt: new Date(Date.now() - index * 86400000),
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        status: "published",
        publishedAt: new Date(Date.now() - index * 86400000),
      },
    });
  }

  console.log("Seed OK");
  console.log(`Admin: ${email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
