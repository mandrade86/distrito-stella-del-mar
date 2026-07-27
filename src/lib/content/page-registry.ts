import { SHARED_SECTION_PAGE_DEFAULTS } from "@/lib/content/shared-pages";

export type CopyField = {
  key: string;
  label: string;
  defaultValue: string;
  multiline?: boolean;
  /** Editor HTML, imagen, selector de páginas o porcentaje 0–100 */
  type?: "text" | "html" | "image" | "pages" | "percent";
};

export type CopySection = {
  key: string;
  label: string;
  fields: CopyField[];
};

export type PageDef = {
  slug: string;
  label: string;
  path: string;
  sections: CopySection[];
};

/** Campos estándar de cover / PageHero (imagen + transparencias %). */
export function pageHeroFields(opts: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageOpacity?: string;
  overlayOpacity?: string;
}): CopyField[] {
  return [
    { key: "eyebrow", label: "Eyebrow", defaultValue: opts.eyebrow },
    { key: "title", label: "Título", defaultValue: opts.title },
    {
      key: "description",
      label: "Descripción",
      multiline: true,
      defaultValue: opts.description,
    },
    {
      key: "image",
      label: "Imagen de cover",
      type: "image",
      defaultValue: opts.image,
    },
    {
      key: "imageAlt",
      label: "Alt de la imagen",
      defaultValue: opts.imageAlt,
    },
    {
      key: "imageOpacity",
      label: "Opacidad de la imagen (%)",
      type: "percent",
      defaultValue: opts.imageOpacity ?? "100",
    },
    {
      key: "overlayOpacity",
      label: "Opacidad del overlay navy (%)",
      type: "percent",
      defaultValue: opts.overlayOpacity ?? "75",
    },
  ];
}

export const PAGE_REGISTRY: PageDef[] = [
  {
    slug: "home",
    label: "Inicio (Home)",
    path: "/",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: [
          {
            key: "imageOpacity",
            label: "Opacidad de la imagen de fondo (%)",
            type: "percent",
            defaultValue: "100",
          },
          {
            key: "overlayOpacity",
            label: "Opacidad del overlay navy (%)",
            type: "percent",
            defaultValue: "70",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "El nuevo destino de Puerto Cortés",
          },
          {
            key: "subtitle",
            label: "Subtítulo",
            multiline: true,
            defaultValue:
              "Comercio, gastronomía, servicios y experiencias frente a una nueva visión de ciudad.",
          },
          {
            key: "ctaPrimary",
            label: "Botón principal",
            defaultValue: "Solicitar disponibilidad",
          },
          {
            key: "ctaSecondary",
            label: "Botón secundario",
            defaultValue: "Explorar espacios comerciales",
          },
          {
            key: "metric1",
            label: "Métrica 1",
            defaultValue: "92 espacios comerciales",
          },
          {
            key: "metric2",
            label: "Métrica 2",
            defaultValue: "15,251.9 m² de proyecto",
          },
          {
            key: "metric3",
            label: "Métrica 3",
            defaultValue: "Dos fases de desarrollo",
          },
          {
            key: "metric4",
            label: "Métrica 4",
            defaultValue: "Ubicación estratégica sobre la CA-13",
          },
        ],
      },
    ],
  },
  {
    slug: "proyecto",
    label: "El proyecto",
    path: "/proyecto",
    sections: [
      {
        key: "pageHero",
        label: "Encabezado",
        fields: pageHeroFields({
          eyebrow: "El proyecto",
          title: "Una nueva visión de ciudad para Puerto Cortés",
          description:
            "Comercio, servicios, gastronomía, turismo e inversión integrados en un destino urbano con identidad propia.",
          image: "/images/renders/sdm-05.png",
          imageAlt: "Plaza interior de Distrito Stella del Mar",
        }),
      },
    ],
  },
  {
    slug: "master-plan",
    label: "Master Plan",
    path: "/master-plan",
    sections: [
      {
        key: "pageHero",
        label: "Encabezado",
        fields: pageHeroFields({
          eyebrow: "Master Plan",
          title: "Un desarrollo diseñado para evolucionar",
          description:
            "Dos fases complementarias articulan anclas, plaza abierta, centro climatizado, gastronomía, servicios y renta de espacio para eventos.",
          image: "/images/masterplan/overview.jpg",
          imageAlt: "Vista aérea del master plan de Distrito Stella del Mar",
        }),
      },
      {
        key: "masterPlan",
        label: "Sección Master Plan",
        fields: [
          { key: "eyebrow", label: "Eyebrow", defaultValue: "Master Plan" },
          {
            key: "title",
            label: "Título",
            defaultValue: "Un desarrollo pensado para crecer",
          },
        ],
      },
      {
        key: "opportunityTypes",
        label: "Formatos comerciales",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Formatos comerciales",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "Oportunidades para distintos modelos de negocio",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Una mezcla de espacios diseñada para marcas, servicios, gastronomía, instituciones y experiencias.",
          },
        ],
      },
      {
        key: "commercialSpaces",
        label: "Locales",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Oportunidades comerciales",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "Encuentre el espacio ideal para su negocio",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Explore locales, food court, quioscos, área financiera y más. Los precios no se publican; solicite información personalizada.",
          },
        ],
      },
      {
        key: "convention",
        label: "Renta de espacio",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Renta de espacio",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "Un espacio para reunir grandes ideas",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Distrito Stella del Mar contempla un espacio en renta de aproximadamente 1,000 m², diseñado para eventos empresariales, sociales y comerciales.",
          },
          {
            key: "cta",
            label: "Botón",
            defaultValue: "Consultar disponibilidad para eventos",
          },
        ],
      },
      {
        key: "virtualTour",
        label: "Recorrido virtual",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Recorrido virtual",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "Explore el proyecto desde una nueva perspectiva",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "El recorrido virtual y el documento descargable serán publicados cuando los recursos oficiales estén disponibles.",
          },
          {
            key: "ctaPrimary",
            label: "Botón principal",
            defaultValue: "Solicitar recorrido",
          },
          {
            key: "ctaSecondary",
            label: "Botón secundario",
            defaultValue: "Solicitar master plan",
          },
        ],
      },
    ],
  },
  {
    slug: "tiendas",
    label: "Tiendas",
    path: "/tiendas",
    sections: [
      {
        key: "pageHero",
        label: "Encabezado",
        fields: pageHeroFields({
          eyebrow: "Tiendas",
          title: "Directorio del distrito",
          description:
            "Consulte el plano interactivo para ubicar locales y conocer teléfonos y horarios de atención.",
          image: "/images/renders/sdm-05.png",
          imageAlt: "Plaza interior de Distrito Stella del Mar",
        }),
      },
      {
        key: "floorPlan",
        label: "Plano",
        fields: [
          { key: "eyebrow", label: "Eyebrow", defaultValue: "Directorio" },
          {
            key: "title",
            label: "Título",
            defaultValue: "Explore el plano del centro",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Toque un local en el plano para ver logo, teléfono, horarios y más detalles. La asignación de cada tienda se gestiona desde el CMS.",
          },
          {
            key: "planImage",
            label: "Imagen del plano",
            type: "image",
            defaultValue: "/images/masterplan/plano-tiendas-render.png",
          },
        ],
      },
    ],
  },
  {
    slug: "impacto",
    label: "Impacto",
    path: "/impacto",
    sections: [
      {
        key: "pageHero",
        label: "Encabezado",
        fields: pageHeroFields({
          eyebrow: "Impacto",
          title: "Un proyecto que impulsa ciudad y oportunidades",
          description:
            "Desarrollo económico, empleo, turismo, transformación urbana y calidad de vida para Puerto Cortés.",
          image: "/images/renders-1.jpg",
          imageAlt: "Vista aérea del desarrollo comercial y su contexto",
          imageOpacity: "75",
        }),
      },
      {
        key: "pillars",
        label: "Pilares",
        fields: [
          { key: "eyebrow", label: "Eyebrow", defaultValue: "Impacto" },
          {
            key: "title",
            label: "Título",
            defaultValue: "Una inversión en la evolución de Puerto Cortés",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "El valor del distrito se mide también por su capacidad de generar actividad, empleo, ciudad y nuevas experiencias.",
          },
        ],
      },
      {
        key: "valueProp",
        label: "Propuesta de valor",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Propuesta de valor",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "Un proyecto con impacto real en la región",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Cifras que contextualizan el potencial comercial y social de Distrito Stella del Mar.",
          },
        ],
      },
    ],
  },
  {
    slug: "ubicacion",
    label: "Ubicación",
    path: "/ubicacion",
    sections: [
      {
        key: "pageHero",
        label: "Encabezado",
        fields: pageHeroFields({
          eyebrow: "Ubicación",
          title: "Conectado con el crecimiento de Puerto Cortés",
          description:
            "Sobre la CA-13, cerca del puerto, la playa, residenciales, instituciones y las principales conexiones regionales.",
          image: "/images/renders/sdm-18.jpg",
          imageAlt: "Vista aérea del entorno de Distrito Stella del Mar",
        }),
      },
      {
        key: "location",
        label: "Sección ubicación",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Ubicación estratégica",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "En el centro del crecimiento de Puerto Cortés",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Una posición privilegiada sobre la CA-13, con conectividad urbana, portuaria y turística.",
          },
          {
            key: "cta",
            label: "Botón mapa",
            defaultValue: "Ver ubicación en Google Maps",
          },
        ],
      },
    ],
  },
  {
    slug: "novedades",
    label: "Novedades",
    path: "/novedades",
    sections: [
      {
        key: "pageHero",
        label: "Encabezado",
        fields: pageHeroFields({
          eyebrow: "Novedades",
          title: "Sigue la evolución del nuevo distrito",
          description:
            "Avance de obra, noticias, aliados, aperturas y eventos publicados con información oficial.",
          image: "/images/renders/render-2.jpg",
          imageAlt: "Vista general del desarrollo Distrito Stella del Mar",
        }),
      },
      {
        key: "construction",
        label: "Avance de obra",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Avance de obra",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "El proyecto continúa tomando forma",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Este espacio reunirá actualizaciones verificadas sobre construcción, nuevos aliados, aperturas y eventos.",
          },
          {
            key: "note",
            label: "Nota",
            multiline: true,
            defaultValue:
              "Las fechas y porcentajes de avance se publicarán únicamente cuando sean confirmados oficialmente.",
          },
          {
            key: "badge",
            label: "Badge imagen",
            defaultValue: "Seguimiento del desarrollo",
          },
          {
            key: "cta",
            label: "Botón",
            defaultValue: "Ver novedades",
          },
        ],
      },
      {
        key: "news",
        label: "Actualidad",
        fields: [
          { key: "eyebrow", label: "Eyebrow", defaultValue: "Actualidad" },
          {
            key: "title",
            label: "Título",
            defaultValue: "Todo lo que ocurre en Distrito Stella del Mar",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Las publicaciones aparecerán aquí cuando exista información oficial confirmada.",
          },
          {
            key: "comingSoon",
            label: "Etiqueta próximamente",
            defaultValue: "Próximamente",
          },
        ],
      },
      {
        key: "gallery",
        label: "Galería",
        fields: [
          { key: "eyebrow", label: "Eyebrow", defaultValue: "Galería" },
          {
            key: "title",
            label: "Título",
            defaultValue: "Renders del proyecto",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Perspectivas aéreas, fachadas, plazas, accesos y ambientes del distrito.",
          },
        ],
      },
    ],
  },
  {
    slug: "contacto",
    label: "Contacto",
    path: "/contacto",
    sections: [
      {
        key: "pageHero",
        label: "Encabezado",
        fields: pageHeroFields({
          eyebrow: "Contacto",
          title: "Conversemos sobre su próxima oportunidad",
          description:
            "Ventas, arrendamientos, inversión, franquicias y eventos en el nuevo destino de Puerto Cortés.",
          image: "/images/renders/sdm-03.png",
          imageAlt: "Espacios comerciales de Distrito Stella del Mar",
        }),
      },
      {
        key: "contact",
        label: "Formulario",
        fields: [
          { key: "eyebrow", label: "Eyebrow", defaultValue: "Contacto" },
          {
            key: "title",
            label: "Título",
            defaultValue: "Conversemos sobre su próximo espacio",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Complete el formulario y un asesor le contactará con información sobre disponibilidad. No publicamos precios en línea.",
          },
        ],
      },
    ],
  },
  {
    slug: "shared",
    label: "Secciones compartidas",
    path: "—",
    sections: [
      {
        key: "homeInvite",
        label: "Invitación Home (título + botones)",
        fields: [
          {
            key: "title",
            label: "Título",
            defaultValue: "El nuevo destino de Puerto Cortés",
          },
          {
            key: "subtitle",
            label: "Subtítulo",
            multiline: true,
            defaultValue:
              "Comercio, gastronomía, servicios y experiencias frente a una nueva visión de ciudad.",
          },
          {
            key: "ctaPrimary",
            label: "Botón principal",
            defaultValue: "Solicitar disponibilidad",
          },
          {
            key: "ctaSecondary",
            label: "Botón secundario",
            defaultValue: "Explorar espacios comerciales",
          },
        ],
      },
      {
        key: "projectCredits",
        label: "Créditos / logos (Hero)",
        fields: [
          {
            key: "creditProject",
            label: "Etiqueta logo 1",
            defaultValue: "Proyecto de",
          },
          {
            key: "logoProject",
            label: "Logo 1",
            type: "image",
            defaultValue: "/images/logos/rcj-inmobiliaria.webp",
          },
          {
            key: "logoProjectAlt",
            label: "Alt logo 1",
            defaultValue: "RCJ Inmobiliaria Honduras",
          },
          {
            key: "logoProjectUrl",
            label: "Enlace logo 1 (URL)",
            defaultValue: "",
          },
          {
            key: "creditCompany",
            label: "Etiqueta logo 2",
            defaultValue: "Una empresa de",
          },
          {
            key: "logoCompany",
            label: "Logo 2",
            type: "image",
            defaultValue: "/images/logos/rcj-corporacion.webp",
          },
          {
            key: "logoCompanyAlt",
            label: "Alt logo 2",
            defaultValue: "RCJ Corporación",
          },
          {
            key: "logoCompanyUrl",
            label: "Enlace logo 2 (URL)",
            defaultValue: "",
          },
        ],
      },
      {
        key: "projectIntro",
        label: "Intro del proyecto (texto + imagen)",
        fields: [
          { key: "eyebrow", label: "Eyebrow", defaultValue: "El proyecto" },
          {
            key: "title",
            label: "Título",
            defaultValue: "Un nuevo punto de encuentro para Puerto Cortés",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Un espacio contemporáneo donde comercio, gastronomía y experiencias acompañan el crecimiento de la ciudad.",
          },
          {
            key: "body",
            label: "Texto adicional",
            multiline: true,
            defaultValue: "",
          },
          {
            key: "image",
            label: "Imagen",
            type: "image",
            defaultValue: "/images/renders/sdm-05.png",
          },
          {
            key: "imageAlt",
            label: "Texto alternativo de la imagen",
            defaultValue: "Plaza interior con arquitectura contemporánea",
          },
        ],
      },
      {
        key: "whyPuerto",
        label: "¿Por qué Puerto Cortés? (texto + imagen + tarjetas)",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "¿Por qué Puerto Cortés?",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "Una ciudad estratégica con vocación de futuro",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Distrito Stella del Mar nace en un punto donde convergen logística, turismo, crecimiento urbano y nuevas oportunidades de inversión.",
          },
          {
            key: "body",
            label: "Texto adicional",
            multiline: true,
            defaultValue:
              "El proyecto no busca sumar únicamente locales: propone un nuevo lugar de encuentro capaz de acompañar el crecimiento económico y la transformación urbana de Puerto Cortés.",
          },
          {
            key: "image",
            label: "Imagen",
            type: "image",
            defaultValue: "/images/renders/sdm-18.jpg",
          },
          {
            key: "imageAlt",
            label: "Texto alternativo de la imagen",
            defaultValue:
              "Vista aérea de Distrito Stella del Mar y su entorno urbano",
          },
          {
            key: "reason1Title",
            label: "Tarjeta 1 — título",
            defaultValue: "Vocación portuaria",
          },
          {
            key: "reason1Text",
            label: "Tarjeta 1 — texto",
            multiline: true,
            defaultValue:
              "Puerto Cortés es un nodo logístico y empresarial clave para Honduras y la región.",
          },
          {
            key: "reason1Icon",
            label: "Tarjeta 1 — ícono (anchor, route, palmtree, map)",
            defaultValue: "anchor",
          },
          {
            key: "reason2Title",
            label: "Tarjeta 2 — título",
            defaultValue: "Conectividad regional",
          },
          {
            key: "reason2Text",
            label: "Tarjeta 2 — texto",
            multiline: true,
            defaultValue:
              "La CA-13 conecta el proyecto con barrios, residenciales, el puerto y la frontera.",
          },
          {
            key: "reason2Icon",
            label: "Tarjeta 2 — ícono (anchor, route, palmtree, map)",
            defaultValue: "route",
          },
          {
            key: "reason3Title",
            label: "Tarjeta 3 — título",
            defaultValue: "Turismo y costa",
          },
          {
            key: "reason3Text",
            label: "Tarjeta 3 — texto",
            multiline: true,
            defaultValue:
              "La actividad turística y la cercanía al mar amplían el potencial de visitas y experiencias.",
          },
          {
            key: "reason3Icon",
            label: "Tarjeta 3 — ícono (anchor, route, palmtree, map)",
            defaultValue: "palmtree",
          },
          {
            key: "reason4Title",
            label: "Tarjeta 4 — título",
            defaultValue: "Crecimiento urbano",
          },
          {
            key: "reason4Text",
            label: "Tarjeta 4 — texto",
            multiline: true,
            defaultValue:
              "Una ciudad en evolución necesita nuevos espacios para comercio, servicios y convivencia.",
          },
          {
            key: "reason4Icon",
            label: "Tarjeta 4 — ícono (anchor, route, palmtree, map)",
            defaultValue: "map",
          },
        ],
      },
      {
        key: "experiences",
        label: "Experiencias",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Experiencias del distrito",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "Un ecosistema comercial completo",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Compras, gastronomía, servicios, eventos y espacios abiertos en una misma propuesta urbana.",
          },
        ],
      },
      {
        key: "anchorBrands",
        label: "Marcas ancla",
        fields: [
          {
            key: "eyebrow",
            label: "Eyebrow",
            defaultValue: "Marcas ancla",
          },
          {
            key: "title",
            label: "Título",
            defaultValue: "Marcas que impulsan el proyecto",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "La presencia de marcas ancla fortalece el flujo de visitantes y el potencial comercial de cada espacio.",
          },
        ],
      },
      {
        key: "ctaBand",
        label: "Banda CTA",
        fields: [
          {
            key: "title",
            label: "Título",
            defaultValue:
              "Haga crecer su negocio en el nuevo destino de Puerto Cortés",
          },
          {
            key: "description",
            label: "Descripción",
            multiline: true,
            defaultValue:
              "Conozca las oportunidades disponibles para alquiler, inversión y desarrollo comercial.",
          },
          {
            key: "cta",
            label: "Botón",
            defaultValue: "Contáctenos",
          },
        ],
      },
      {
        key: "homeMasterPlan",
        label: "Master Plan en Home",
        fields: [
          {
            key: "title",
            label: "Título",
            defaultValue: "Master Plan",
          },
          {
            key: "ctaTitle",
            label: "Franja azul — título",
            defaultValue: "Reserve su espacio en el nuevo destino",
          },
          {
            key: "ctaPrimary",
            label: "Botón principal",
            defaultValue: "Contáctenos",
          },
          {
            key: "ctaSecondary",
            label: "Botón secundario",
            defaultValue: "Master Plan",
          },
        ],
      },
      {
        key: "impactStats",
        label: "Estadísticas de impacto (Home)",
        fields: [
          {
            key: "title",
            label: "Título",
            defaultValue: "Impacto económico",
          },
          { key: "stat1Value", label: "Dato 1 — cifra", defaultValue: "800" },
          {
            key: "stat1Label",
            label: "Dato 1 — etiqueta",
            defaultValue: "Empleos directos",
          },
          { key: "stat2Value", label: "Dato 2 — cifra", defaultValue: "960" },
          {
            key: "stat2Label",
            label: "Dato 2 — etiqueta",
            defaultValue: "Empleos indirectos",
          },
          { key: "stat3Value", label: "Dato 3 — cifra", defaultValue: "92" },
          {
            key: "stat3Label",
            label: "Dato 3 — etiqueta",
            defaultValue: "Espacios comerciales",
          },
          {
            key: "stat4Value",
            label: "Dato 4 — cifra",
            defaultValue: "200,229",
          },
          {
            key: "stat4Label",
            label: "Dato 4 — etiqueta",
            defaultValue: "Habitantes (mercado potencial)",
          },
          {
            key: "stat5Value",
            label: "Dato 5 — cifra",
            defaultValue: "100000",
          },
          {
            key: "stat5Label",
            label: "Dato 5 — etiqueta",
            defaultValue: "Visitantes turísticos anuales",
          },
          { key: "stat6Value", label: "Dato 6 — cifra", defaultValue: "3%" },
          {
            key: "stat6Label",
            label: "Dato 6 — etiqueta",
            defaultValue: "Crecimiento anual proyectado",
          },
        ],
      },
    ],
  },
];

export type SectionCopy = Record<string, string>;
export type PageCopy = Record<string, SectionCopy>;

export function getPageDef(slug: string) {
  const page = PAGE_REGISTRY.find((p) => p.slug === slug);
  if (!page) return undefined;

  if (page.slug === "shared") {
    return {
      ...page,
      sections: page.sections.map((section) => {
        const defaultPages = SHARED_SECTION_PAGE_DEFAULTS[section.key];
        if (!defaultPages) return section;
        if (section.fields.some((f) => f.key === "showOnPages")) return section;
        return {
          ...section,
          fields: [
            {
              key: "showOnPages",
              label: "Mostrar en páginas",
              type: "pages" as const,
              defaultValue: defaultPages,
            },
            ...section.fields,
          ],
        };
      }),
    };
  }

  const hasHtml = page.sections.some((s) => s.key === "htmlBody");
  if (hasHtml) return page;
  return {
    ...page,
    sections: [...page.sections, htmlBodySection()],
  };
}

export function defaultsForPage(slug: string): PageCopy {
  const page = getPageDef(slug);
  if (!page) return {};
  const copy: PageCopy = {};
  for (const section of page.sections) {
    copy[section.key] = {};
    for (const field of section.fields) {
      copy[section.key][field.key] = field.defaultValue;
    }
  }
  return copy;
}

export function mergePageCopy(
  slug: string,
  overrides: Array<{ sectionKey: string; fieldKey: string; value: string }>,
): PageCopy {
  const copy = defaultsForPage(slug);
  for (const row of overrides) {
    if (!copy[row.sectionKey]) copy[row.sectionKey] = {};
    copy[row.sectionKey][row.fieldKey] = row.value;
  }
  return copy;
}

export function sectionCopy(
  pageCopy: PageCopy,
  sectionKey: string,
): SectionCopy {
  return pageCopy[sectionKey] ?? {};
}

export function copyValue(
  section: SectionCopy | undefined,
  key: string,
  fallback: string,
) {
  const value = section?.[key];
  return value != null && value !== "" ? value : fallback;
}

/** Bloque HTML libre por página (además de títulos/estructura). */
export function htmlBodySection(): CopySection {
  return {
    key: "htmlBody",
    label: "Contenido HTML libre",
    fields: [
      {
        key: "content",
        label: "HTML de la página (se muestra bajo el encabezado)",
        type: "html",
        multiline: true,
        defaultValue: "",
      },
    ],
  };
}
