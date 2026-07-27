export interface AnchorBrand {
  id: string;
  name: string;
  logo?: string;
  /** Compensa el espacio en blanco interno de cada archivo para que todos los logos se perciban del mismo tamaño. */
  logoScale?: number;
  note?: string;
}

export const anchorBrands: AnchorBrand[] = [
  {
    id: "diunsa",
    name: "Diunsa",
    logo: "/images/logos/brand-diunsa.png",
    logoScale: 1,
  },
  {
    id: "xtra",
    name: "Supertiendas Xtra",
    logo: "/images/logos/brand-xtra.jpg",
    logoScale: 1.1,
  },
  {
    id: "carrion",
    name: "Tiendas Carrion",
    logo: "/images/logos/brand-carrion.png",
    logoScale: 1,
  },
  {
    id: "super-barato",
    name: "El Super Barato",
    logo: "/images/logos/brand-super-barato.jpg",
    logoScale: 1.2,
  },
];
