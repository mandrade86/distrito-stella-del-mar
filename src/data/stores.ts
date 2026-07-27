export interface StoreHotspot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Store {
  id: string;
  name: string;
  unitLabel?: string;
  phone: string;
  email?: string;
  website?: string;
  hours: string;
  category: string;
  status?: string;
  level?: string;
  description?: string;
  logo: string;
  hotspot: StoreHotspot;
}

/**
 * Hotspots en % sobre el plano interactivo.
 * Se reasignan desde Admin → Tiendas.
 */
export const stores: Store[] = [
  {
    id: "T-ANCLA",
    name: "Diunsa",
    unitLabel: "Ancla",
    phone: "+504 2550-0001",
    email: "",
    website: "",
    hours: "Lun–Sáb 10:00–20:00 · Dom 10:00–18:00",
    category: "Ancla",
    status: "Abierto",
    level: "Nivel 2",
    description: "Tienda ancla de departamento y hogar.",
    logo: "/images/logos/brand-diunsa.png",
    hotspot: { x: 13.2, y: 8.5, w: 52, h: 22 },
  },
  {
    id: "T-R01",
    name: "Tiendas Carrion",
    unitLabel: "R-01",
    phone: "+504 2550-0201",
    hours: "Lun–Sáb 10:00–20:00 · Dom 11:00–18:00",
    category: "Retail",
    status: "Abierto",
    level: "Nivel 2",
    description: "Moda y accesorios.",
    logo: "/images/logos/brand-carrion.png",
    hotspot: { x: 66.4, y: 31, w: 28.9, h: 16.8 },
  },
  {
    id: "T-R02",
    name: "Farmacia del Puerto",
    unitLabel: "R-02",
    phone: "+504 2550-0202",
    hours: "Lun–Dom 08:00–21:00",
    category: "Servicios",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/icon-star-color.png",
    hotspot: { x: 66.6, y: 49, w: 28.1, h: 7 },
  },
  {
    id: "T-L01",
    name: "Supertiendas Xtra",
    unitLabel: "L-01",
    phone: "+504 2550-0101",
    hours: "Lun–Sáb 10:00–20:00 · Dom 11:00–18:00",
    category: "Autoservicio",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/brand-xtra.jpg",
    hotspot: { x: 13.2, y: 54.3, w: 17.7, h: 8.5 },
  },
  {
    id: "T-R03",
    name: "Joyería Mar",
    unitLabel: "R-03",
    phone: "+504 2550-0203",
    hours: "Lun–Sáb 10:00–19:00 · Dom cerrado",
    category: "Retail",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/logo-gold.png",
    hotspot: { x: 66.4, y: 57.3, w: 14.3, h: 7.8 },
  },
  {
    id: "T-R04",
    name: "Área financiera",
    unitLabel: "R-04",
    phone: "+504 2550-0204",
    hours: "Lun–Vie 09:00–16:00 · Sáb 09:00–12:00",
    category: "Financiero",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/logo-blue-crop.png",
    hotspot: { x: 81.1, y: 57.3, w: 14.3, h: 7.8 },
  },
  {
    id: "T-L02",
    name: "El Super Barato",
    unitLabel: "L-02",
    phone: "+504 2550-0102",
    hours: "Lun–Sáb 10:00–20:00 · Dom 11:00–18:00",
    category: "Autoservicio",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/brand-super-barato.jpg",
    hotspot: { x: 13.2, y: 65.5, w: 15, h: 5.5 },
  },
  {
    id: "T-L03",
    name: "Óptica Stella",
    unitLabel: "L-03",
    phone: "+504 2550-0103",
    hours: "Lun–Vie 10:00–19:00 · Sáb 10:00–18:00",
    category: "Servicios",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/icon-star-color.png",
    hotspot: { x: 13.2, y: 71, w: 15.3, h: 7.2 },
  },
  {
    id: "T-FC02",
    name: "Pizza Stella",
    unitLabel: "FC-02",
    phone: "+504 2550-0302",
    hours: "Lun–Dom 11:00–21:00",
    category: "Food Court",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/logo-full-color.png",
    hotspot: { x: 50.6, y: 71, w: 15.5, h: 7.2 },
  },
  {
    id: "T-L04",
    name: "Electrónica Express",
    unitLabel: "L-04",
    phone: "+504 2550-0104",
    hours: "Lun–Sáb 10:00–20:00 · Dom 10:00–18:00",
    category: "Retail",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/logo-blue-crop.png",
    hotspot: { x: 13.2, y: 78.8, w: 15.5, h: 6 },
  },
  {
    id: "T-FC03",
    name: "Sabor Caribe",
    unitLabel: "FC-03",
    phone: "+504 2550-0303",
    hours: "Lun–Dom 11:00–21:00",
    category: "Food Court",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/logo-gold.png",
    hotspot: { x: 50.4, y: 78.8, w: 15.7, h: 6 },
  },
  {
    id: "T-FC01",
    name: "Café del Distrito",
    unitLabel: "FC-01",
    phone: "+504 2550-0301",
    hours: "Lun–Dom 08:00–21:00",
    category: "Food Court",
    status: "Abierto",
    level: "Nivel 2",
    logo: "/images/logos/icon-star-color.png",
    hotspot: { x: 13.2, y: 85, w: 16.4, h: 6 },
  },
];
