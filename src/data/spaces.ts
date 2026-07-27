export type SpaceCategory =
  | "plaza"
  | "local"
  | "food-court"
  | "quiosco"
  | "financiero"
  | "autoservicio"
  | "convenciones";

export interface CommercialSpace {
  id: string;
  name: string;
  category: SpaceCategory;
  area: number;
  phase: 1 | 2;
  level?: string;
  status: "Disponible" | "Vendido" | "Rentado" | "Reservado";
  featured?: boolean;
}

export const categoryLabels: Record<SpaceCategory | "all", string> = {
  all: "Todos",
  plaza: "Plaza abierta",
  local: "Locales comerciales",
  "food-court": "Food Court",
  quiosco: "Quioscos",
  financiero: "Área financiera",
  autoservicio: "Autoservicios",
  convenciones: "Renta de espacio",
};

export const spaces: CommercialSpace[] = [
  {
    id: "LE-01",
    name: "Local plaza abierta LE-01",
    category: "plaza",
    area: 47.3,
    phase: 1,
    status: "Disponible",
    featured: true,
  },
  {
    id: "LE-08",
    name: "Local plaza abierta LE-08",
    category: "plaza",
    area: 52.4,
    phase: 1,
    status: "Disponible",
    featured: true,
  },
  {
    id: "AS-01",
    name: "Autoservicio AS-01",
    category: "autoservicio",
    area: 180,
    phase: 1,
    status: "Disponible",
    featured: true,
  },
  {
    id: "L1",
    name: "Local comercial L1",
    category: "local",
    area: 60.16,
    phase: 2,
    level: "Nivel 1",
    status: "Disponible",
    featured: true,
  },
  {
    id: "L12",
    name: "Local comercial L12",
    category: "local",
    area: 74.8,
    phase: 2,
    level: "Nivel 1",
    status: "Disponible",
    featured: true,
  },
  {
    id: "LF01",
    name: "Food Court LF01",
    category: "food-court",
    area: 15.25,
    phase: 2,
    level: "Nivel 2",
    status: "Disponible",
    featured: true,
  },
  {
    id: "LB01",
    name: "Área financiera LB01",
    category: "financiero",
    area: 123.71,
    phase: 2,
    level: "Nivel 2",
    status: "Disponible",
    featured: true,
  },
  {
    id: "Q-03",
    name: "Quiosco Q-03",
    category: "quiosco",
    area: 12.5,
    phase: 2,
    level: "Nivel 1",
    status: "Disponible",
    featured: true,
  },
  {
    id: "CC-01",
    name: "Renta de espacio",
    category: "convenciones",
    area: 1000,
    phase: 2,
    level: "Nivel 2",
    status: "Disponible",
    featured: false,
  },
];

export const featuredSpaces = spaces.filter((s) => s.featured).slice(0, 8);
