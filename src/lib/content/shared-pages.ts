/** Páginas donde se pueden publicar secciones compartidas. */
export const SHARED_SECTION_PAGE_OPTIONS = [
  { slug: "home", label: "Inicio (/)" },
  { slug: "proyecto", label: "El proyecto" },
  { slug: "master-plan", label: "Master Plan" },
  { slug: "tiendas", label: "Tiendas" },
  { slug: "impacto", label: "Impacto" },
  { slug: "ubicacion", label: "Ubicación" },
  { slug: "novedades", label: "Novedades" },
  { slug: "contacto", label: "Contacto" },
] as const;

export type SharedSectionPageSlug =
  (typeof SHARED_SECTION_PAGE_OPTIONS)[number]["slug"];

/** Defaults de visibilidad (comportamiento actual del sitio). */
export const SHARED_SECTION_PAGE_DEFAULTS: Record<string, string> = {
  homeInvite: "home",
  projectIntro: "home,proyecto",
  whyPuerto: "home,proyecto,impacto,ubicacion",
  experiences: "proyecto",
  anchorBrands: "home,master-plan",
  ctaBand: "home",
  homeMasterPlan: "home",
  impactStats: "home",
};

export function parseShowOnPages(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[,;\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function serializeShowOnPages(slugs: string[]): string {
  return slugs.join(",");
}

export function showsOnPage(
  section: Record<string, string> | undefined,
  pageSlug: string,
  sectionKey?: string,
): boolean {
  const fallback =
    (sectionKey && SHARED_SECTION_PAGE_DEFAULTS[sectionKey]) || "";
  const raw =
    section?.showOnPages != null && section.showOnPages !== ""
      ? section.showOnPages
      : fallback;
  const pages = parseShowOnPages(raw);
  if (!pages.length) return false;
  return pages.includes(pageSlug.toLowerCase());
}
