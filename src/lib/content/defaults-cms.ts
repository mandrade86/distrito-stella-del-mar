export const DEFAULT_HOME_WIDGETS = [
  {
    widgetKey: "homeInvite",
    label: "Invitación (título + botones)",
    kind: "builtin" as const,
    html: null as string | null,
    enabled: true,
    sortOrder: 0,
  },
  {
    widgetKey: "homeMasterPlan",
    label: "Master Plan (fases / fotos)",
    kind: "builtin" as const,
    html: null as string | null,
    enabled: true,
    sortOrder: 1,
  },
  {
    widgetKey: "projectIntro",
    label: "Intro del proyecto",
    kind: "builtin" as const,
    html: null as string | null,
    enabled: true,
    sortOrder: 2,
  },
  {
    widgetKey: "anchorBrands",
    label: "Marcas ancla",
    kind: "builtin" as const,
    html: null as string | null,
    enabled: true,
    sortOrder: 3,
  },
  {
    widgetKey: "impactStats",
    label: "Estadísticas de impacto",
    kind: "builtin" as const,
    html: null as string | null,
    enabled: true,
    sortOrder: 4,
  },
  {
    widgetKey: "whyPuerto",
    label: "¿Por qué Puerto Cortés?",
    kind: "builtin" as const,
    html: null as string | null,
    enabled: true,
    sortOrder: 5,
  },
  {
    widgetKey: "ctaBand",
    label: "Banda CTA",
    kind: "builtin" as const,
    html: null as string | null,
    enabled: true,
    sortOrder: 6,
  },
] as const;

export type HomeWidgetKey = (typeof DEFAULT_HOME_WIDGETS)[number]["widgetKey"];

export const BUILTIN_HOME_WIDGET_KEYS = new Set<string>(
  DEFAULT_HOME_WIDGETS.map((w) => w.widgetKey),
);

export function isHtmlHomeWidget(widget: {
  kind?: string | null;
  widgetKey: string;
}) {
  return widget.kind === "html" || widget.widgetKey.startsWith("html-");
}

export const DEFAULT_NAV_ITEMS = [
  { label: "El proyecto", href: "/proyecto", enabled: true, sortOrder: 0 },
  { label: "Master Plan", href: "/master-plan", enabled: true, sortOrder: 1 },
  { label: "Tiendas", href: "/tiendas", enabled: true, sortOrder: 2 },
  { label: "Impacto", href: "/impacto", enabled: true, sortOrder: 3 },
  { label: "Ubicación", href: "/ubicacion", enabled: true, sortOrder: 4 },
  { label: "Novedades", href: "/novedades", enabled: true, sortOrder: 5 },
  { label: "Contacto", href: "/contacto", enabled: true, sortOrder: 6 },
] as const;

export const SAMPLE_BLOG_POSTS = [
  {
    slug: "distrito-stella-del-mar-nuevo-destino",
    title: "Distrito Stella del Mar: el nuevo destino comercial de Puerto Cortés",
    excerpt:
      "Conozca la visión del proyecto que integra comercio, gastronomía, servicios y experiencias en un mismo destino urbano.",
    coverImage: "/images/renders/sdm-05.png",
    content: `<p>Distrito Stella del Mar nace como una propuesta contemporánea para Puerto Cortés: un espacio donde el comercio, la gastronomía y los servicios se encuentran con una nueva forma de vivir la ciudad.</p>
<p>El desarrollo articula locales, anclas, plaza abierta y experiencias pensadas para residentes, visitantes e inversionistas.</p>
<p>Con dos fases de crecimiento y una ubicación estratégica sobre la CA-13, el proyecto acompaña la transformación urbana del puerto más importante de Honduras.</p>`,
  },
  {
    slug: "oportunidades-comerciales-puerto-cortes",
    title: "Oportunidades comerciales en el corazón del crecimiento de Puerto Cortés",
    excerpt:
      "Locales, food court, servicios financieros y renta de espacio para eventos: formatos pensados para distintos modelos de negocio.",
    coverImage: "/images/renders/sdm-01.png",
    content: `<p>El master plan de Distrito Stella del Mar contempla una mezcla comercial diversa: tiendas ancla, locales, gastronomía, área financiera y un espacio en renta de aproximadamente 1,000 m² para eventos.</p>
<p>Esta diversidad permite a marcas, franquicias e inversionistas encontrar el formato adecuado para su operación, en un entorno con alto potencial de flujo y conectividad.</p>
<p>Si desea conocer disponibilidad, puede solicitar información personalizada a través del formulario de contacto.</p>`,
  },
  {
    slug: "ubicacion-estrategica-ca-13",
    title: "Ubicación estratégica sobre la CA-13 en Barrio El Porvenir",
    excerpt:
      "Cercanía al puerto, la playa, residenciales e instituciones: un punto de encuentro natural para la dinámica de Puerto Cortés.",
    coverImage: "/images/renders/sdm-18.jpg",
    content: `<p>El proyecto se ubica sobre la CA-13, en Barrio El Porvenir, una zona de alto tránsito con conexión directa hacia el puerto, la costa y las principales vías regionales.</p>
<p>Esta posición fortalece el potencial comercial del distrito y lo convierte en un referente para quienes buscan invertir o establecer su marca en el norte de Honduras.</p>`,
  },
] as const;
