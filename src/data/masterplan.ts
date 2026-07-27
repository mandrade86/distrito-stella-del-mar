export type MasterPlanTab = "general" | "phase1" | "phase2";

export interface MasterPlanPhase {
  id: MasterPlanTab;
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Galería de imágenes de la fase (URLs). */
  gallery: string[];
  highlights: string[];
}

export const masterPlanPhases: MasterPlanPhase[] = [
  {
    id: "general",
    label: "Vista general",
    title: "Un desarrollo pensado para crecer",
    description:
      "Distrito Stella del Mar se articula en dos fases que combinan anclas comerciales, locales, gastronomía, servicios financieros y renta de espacio para eventos, con una arquitectura contemporánea orientada al flujo peatonal y vehicular.",
    image: "/images/masterplan/overview.jpg",
    imageAlt: "Vista aérea general del master plan de Distrito Stella del Mar",
    gallery: [
      "/images/masterplan/overview.jpg",
      "/images/masterplan/phase-1.jpg",
      "/images/masterplan/phase-2.jpg",
      "/images/masterplan/planta-2n.png",
      "/images/renders/render-aerial.webp",
      "/images/renders/sdm-01.png",
      "/images/renders/sdm-08.png",
      "/images/renders/sdm-09.png",
      "/images/renders/sdm-10.png",
      "/images/renders/render-2.jpg",
    ],
    highlights: [
      "15,251.9 m² de proyecto",
      "92 espacios comerciales",
      "Dos fases de desarrollo",
      "Ubicación estratégica sobre la CA-13",
    ],
  },
  {
    id: "phase1",
    label: "Fase 1",
    title: "Fase 1 — Anclas y locales abiertos",
    description:
      "La primera fase concentra las marcas ancla y una oferta de locales comerciales abiertos que impulsan afluencia desde el inicio del proyecto.",
    image: "/images/masterplan/phase-1.jpg",
    imageAlt: "Render asociado a la Fase 1 del desarrollo",
    gallery: [
      "/images/masterplan/phase-1.jpg",
      "/images/masterplan/overview.jpg",
      "/images/renders/sdm-02.png",
      "/images/renders/sdm-03.png",
      "/images/renders/sdm-04.png",
      "/images/renders/sdm-11.png",
      "/images/renders/sdm-12.png",
      "/images/renders/sdm-13.png",
      "/images/renders/render-1.jpg",
      "/images/renders/render-3.jpg",
    ],
    highlights: [
      "Diunsa: 2,780 m²",
      "Supertiendas Xtra: 2,850 m²",
      "El Super Barato: 1,150 m²",
      "4 espacios de autoservicio",
      "26 locales comerciales abiertos",
    ],
  },
  {
    id: "phase2",
    label: "Fase 2",
    title: "Fase 2 — Centro climatizado y renta de espacio",
    description:
      "La segunda fase incorpora un centro comercial climatizado en dos niveles, food court, área financiera, quioscos y un espacio en renta de aproximadamente 1,000 m².",
    image: "/images/masterplan/phase-2.jpg",
    imageAlt: "Render asociado a la Fase 2 del desarrollo",
    gallery: [
      "/images/masterplan/phase-2.jpg",
      "/images/masterplan/planta-2n.png",
      "/images/masterplan/planta-2n-crop.png",
      "/images/renders/sdm-05.png",
      "/images/renders/sdm-06.png",
      "/images/renders/sdm-07.png",
      "/images/renders/sdm-14.png",
      "/images/renders/sdm-15.png",
      "/images/renders/sdm-16.png",
      "/images/renders/sdm-17.png",
    ],
    highlights: [
      "Centro comercial climatizado (Nivel 1 y 2)",
      "Tiendas Carrion: 1,500 m²",
      "Renta de espacio: 1,000 m²",
      "Food Court",
      "Área financiera, quioscos y locales",
    ],
  },
];
