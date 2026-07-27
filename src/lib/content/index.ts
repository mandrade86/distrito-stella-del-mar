import type { Store } from "@/data/stores";
import type { CommercialSpace } from "@/data/spaces";
import type { GalleryItem } from "@/data/gallery";
import type { AnchorBrand } from "@/data/brands";
import type { MasterPlanPhase } from "@/data/masterplan";
import { stores as staticStores } from "@/data/stores";
import { spaces as staticSpaces, featuredSpaces as staticFeatured } from "@/data/spaces";
import { galleryItems as staticGallery } from "@/data/gallery";
import { anchorBrands as staticBrands } from "@/data/brands";
import { masterPlanPhases as staticPhases } from "@/data/masterplan";
import { dbAvailable, prisma } from "@/lib/db";
import {
  defaultsForPage,
  mergePageCopy,
  type PageCopy,
} from "@/lib/content/page-registry";

import { isConfigured, siteConfig } from "@/config/contact";

export type PublicContact = {
  email: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  mapLat: string;
  mapLng: string;
  footerText: string;
  addressLine: string;
  privacyUrl: string;
  termsUrl: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
  };
};

function pick(db: string | undefined, fallback: string) {
  const value = db?.trim();
  return value ? value : fallback;
}

/** Contacto/redes: CMS (Ajustes) tiene prioridad sobre .env. */
export async function getPublicContact(): Promise<PublicContact> {
  const base: PublicContact = {
    email: siteConfig.email,
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
    mapsUrl: siteConfig.mapsUrl,
    mapLat: siteConfig.mapLat,
    mapLng: siteConfig.mapLng,
    footerText: siteConfig.shortDescription,
    addressLine: siteConfig.addressLine,
    privacyUrl: "/contacto",
    termsUrl: "/contacto",
    social: { ...siteConfig.social },
  };

  if (!(await dbAvailable())) return base;

  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            "contactEmail",
            "contactPhone",
            "whatsapp",
            "facebook",
            "instagram",
            "linkedin",
            "tiktok",
            "mapsUrl",
            "mapLat",
            "mapLng",
            "footerText",
            "addressLine",
            "privacyUrl",
            "termsUrl",
          ],
        },
      },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      email: pick(map.contactEmail, base.email),
      phone: pick(map.contactPhone, base.phone),
      whatsapp: pick(map.whatsapp, base.whatsapp),
      mapsUrl: pick(map.mapsUrl, base.mapsUrl),
      mapLat: pick(map.mapLat, base.mapLat),
      mapLng: pick(map.mapLng, base.mapLng),
      footerText: pick(map.footerText, base.footerText),
      addressLine: pick(map.addressLine, base.addressLine),
      privacyUrl: pick(map.privacyUrl, base.privacyUrl),
      termsUrl: pick(map.termsUrl, base.termsUrl),
      social: {
        facebook: pick(map.facebook, base.social.facebook),
        instagram: pick(map.instagram, base.social.instagram),
        linkedin: pick(map.linkedin, base.social.linkedin),
        tiktok: pick(map.tiktok, base.social.tiktok),
      },
    };
  } catch {
    return base;
  }
}

export { isConfigured };

export type HeroSlideData = { src: string; alt: string };
export type { PageCopy };

const staticHeroSlides: HeroSlideData[] = [
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

export async function getHeroSlides(): Promise<HeroSlideData[]> {
  if (!(await dbAvailable())) return staticHeroSlides;
  const rows = await prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) return staticHeroSlides;
  return rows.map((row) => ({ src: row.src, alt: row.alt }));
}

export async function getPageCopy(slug: string): Promise<PageCopy> {
  if (!(await dbAvailable())) return defaultsForPage(slug);
  try {
    const rows = await prisma.pageContent.findMany({
      where: { pageSlug: slug },
    });
    return mergePageCopy(slug, rows);
  } catch {
    return defaultsForPage(slug);
  }
}

export async function getSharedCopy(): Promise<PageCopy> {
  return getPageCopy("shared");
}

export type CmsPageData = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  navLabel: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export async function getPublishedCmsPages(): Promise<
  Array<{
    slug: string;
    title: string;
    navLabel: string | null;
    sortOrder: number;
    showInNav: boolean;
  }>
> {
  if (!(await dbAvailable())) return [];
  try {
    return prisma.cmsPage.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true,
        title: true,
        navLabel: true,
        sortOrder: true,
        showInNav: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getCmsPageBySlug(
  slug: string,
): Promise<CmsPageData | null> {
  if (!(await dbAvailable())) return null;
  try {
    return prisma.cmsPage.findFirst({
      where: { slug, status: "published" },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        excerpt: true,
        navLabel: true,
        seoTitle: true,
        seoDescription: true,
      },
    });
  } catch {
    return null;
  }
}

export type BlogPostData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  publishedAt: Date | null;
};

export async function getPublishedBlogPosts(): Promise<BlogPostData[]> {
  if (!(await dbAvailable())) return [];
  try {
    return prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostData | null> {
  if (!(await dbAvailable())) return null;
  try {
    return prisma.blogPost.findFirst({
      where: { slug, status: "published" },
    });
  } catch {
    return null;
  }
}

export type HomeWidgetData = {
  widgetKey: string;
  label: string;
  kind: "builtin" | "html";
  html: string;
  enabled: boolean;
  sortOrder: number;
};

export async function getHomeWidgets(): Promise<HomeWidgetData[]> {
  const { DEFAULT_HOME_WIDGETS } = await import("@/lib/content/defaults-cms");
  if (!(await dbAvailable())) {
    return DEFAULT_HOME_WIDGETS.map((w) => ({
      widgetKey: w.widgetKey,
      label: w.label,
      kind: w.kind,
      html: w.html ?? "",
      enabled: w.enabled,
      sortOrder: w.sortOrder,
    }));
  }
  try {
    const rows = await prisma.homeWidget.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) {
      return DEFAULT_HOME_WIDGETS.map((w) => ({
        widgetKey: w.widgetKey,
        label: w.label,
        kind: w.kind,
        html: w.html ?? "",
        enabled: w.enabled,
        sortOrder: w.sortOrder,
      }));
    }
    return rows
      .filter((row) => row.widgetKey !== "projectCredits")
      .map((row) => ({
      widgetKey: row.widgetKey,
      label: row.label,
      kind: row.kind === "html" ? "html" : "builtin",
      html: row.html ?? "",
      enabled: row.enabled,
      sortOrder: row.sortOrder,
    }));
  } catch {
    return DEFAULT_HOME_WIDGETS.map((w) => ({
      widgetKey: w.widgetKey,
      label: w.label,
      kind: w.kind,
      html: w.html ?? "",
      enabled: w.enabled,
      sortOrder: w.sortOrder,
    }));
  }
}

export type NavItemData = {
  label: string;
  href: string;
  enabled: boolean;
  sortOrder: number;
};

export async function getNavItems(): Promise<NavItemData[]> {
  const { DEFAULT_NAV_ITEMS } = await import("@/lib/content/defaults-cms");
  const fallback = () => DEFAULT_NAV_ITEMS.map((item) => ({ ...item }));

  if (!(await dbAvailable())) return fallback();

  // Cliente Prisma desactualizado (falta regenerar)
  if (!("navItem" in prisma) || !(prisma as { navItem?: unknown }).navItem) {
    return fallback();
  }

  try {
    const rows = await prisma.navItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) return fallback();
    return rows.map((row) => ({
      label: row.label,
      href: row.href,
      enabled: row.enabled,
      sortOrder: row.sortOrder,
    }));
  } catch {
    return fallback();
  }
}

export async function getStores(): Promise<Store[]> {
  if (!(await dbAvailable())) return staticStores;
  try {
    const rows = await prisma.store.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) return staticStores;
    return rows.map((row) => ({
      id: row.code,
      name: row.name,
      unitLabel: row.unitLabel || undefined,
      phone: row.phone,
      email: row.email || undefined,
      website: row.website || undefined,
      hours: row.hours,
      category: row.category,
      status: row.status || undefined,
      level: row.level || undefined,
      description: row.description || undefined,
      logo: row.logo,
      hotspot: {
        x: row.hotspotX,
        y: row.hotspotY,
        w: row.hotspotW,
        h: row.hotspotH,
      },
    }));
  } catch {
    return staticStores;
  }
}

export async function getSpaces(): Promise<CommercialSpace[]> {
  if (!(await dbAvailable())) return staticSpaces;
  const rows = await prisma.commercialSpace.findMany({
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) return staticSpaces;
  return rows.map((row) => ({
    id: row.code,
    name: row.name,
    category: row.category as CommercialSpace["category"],
    area: row.area,
    phase: row.phase as 1 | 2,
    level: row.level ?? undefined,
    status: row.status as CommercialSpace["status"],
    featured: row.featured,
  }));
}

export async function getFeaturedSpaces(): Promise<CommercialSpace[]> {
  const all = await getSpaces();
  const featured = all.filter((s) => s.featured).slice(0, 8);
  return featured.length ? featured : staticFeatured;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!(await dbAvailable())) return staticGallery;
  const rows = await prisma.galleryItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) return staticGallery;
  return rows.map((row) => ({
    id: row.id,
    src: row.src,
    alt: row.alt,
    span: row.span as GalleryItem["span"],
  }));
}

export async function getBrands(): Promise<AnchorBrand[]> {
  if (!(await dbAvailable())) return staticBrands;
  const rows = await prisma.brand.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) return staticBrands;
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    logo: row.logo ?? undefined,
    logoScale: row.logoScale,
    note: row.note ?? undefined,
  }));
}

export async function getMasterPlanPhases(): Promise<MasterPlanPhase[]> {
  if (!(await dbAvailable())) return staticPhases;
  const rows = await prisma.masterPlanPhase.findMany({
    orderBy: { sortOrder: "asc" },
  });
  if (!rows.length) return staticPhases;
  return rows.map((row) => {
    const gallery = Array.isArray(row.gallery)
      ? (row.gallery as unknown[]).map(String).filter(Boolean)
      : [];
    return {
      id: row.tabId as MasterPlanPhase["id"],
      label: row.label,
      title: row.title,
      description: row.description,
      image: row.image,
      imageAlt: row.imageAlt,
      gallery: gallery.length ? gallery : [row.image].filter(Boolean),
      highlights: Array.isArray(row.highlights)
        ? (row.highlights as string[])
        : [],
    };
  });
}
