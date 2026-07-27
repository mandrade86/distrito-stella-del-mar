export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  span?: "tall" | "wide" | "square";
}

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    src: "/images/renders/sdm-01.png",
    alt: "Fachada principal de Distrito Stella del Mar sobre la CA-13",
    span: "wide",
  },
  {
    id: "g2",
    src: "/images/renders/sdm-05.png",
    alt: "Plaza abierta con áreas de compras y gastronomía",
    span: "tall",
  },
  {
    id: "g3",
    src: "/images/renders-1.jpg",
    alt: "Vista aérea del desarrollo con anclas comerciales",
    span: "wide",
  },
  {
    id: "g4",
    src: "/images/renders/sdm-02.png",
    alt: "Perspectiva de locales comerciales y accesos peatonales",
    span: "square",
  },
  {
    id: "g5",
    src: "/images/renders/sdm-03.png",
    alt: "Zona de restaurantes y terraza exterior",
    span: "square",
  },
  {
    id: "g6",
    src: "/images/renders/sdm-04.png",
    alt: "Acceso vehicular y paisaje urbano del proyecto",
    span: "tall",
  },
  {
    id: "g7",
    src: "/images/renders/render-2.jpg",
    alt: "Vista general del complejo comercial",
    span: "wide",
  },
  {
    id: "g8",
    src: "/images/renders/sdm-06.png",
    alt: "Área peatonal con arquitectura contemporánea",
    span: "square",
  },
  {
    id: "g9",
    src: "/images/renders/sdm-07.png",
    alt: "Fachada de locales y señalética del distrito",
    span: "square",
  },
  {
    id: "g10",
    src: "/images/renders/sdm-19.png",
    alt: "Perspectiva nocturna del desarrollo",
    span: "wide",
  },
  {
    id: "g11",
    src: "/images/renders/sdm-20.png",
    alt: "Iluminación nocturna de plazas y accesos",
    span: "tall",
  },
  {
    id: "g12",
    src: "/images/renders/render-3.jpg",
    alt: "Edificio principal y contexto urbano de Puerto Cortés",
    span: "wide",
  },
];
