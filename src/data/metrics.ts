export interface MetricItem {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

export const valueMetrics: MetricItem[] = [
  {
    id: "population",
    value: 200229,
    label: "Habitantes en el mercado potencial",
  },
  {
    id: "growth",
    value: 3,
    suffix: "%",
    label: "Proyección de crecimiento anual",
  },
  {
    id: "jobs-direct",
    value: 800,
    label: "Empleos directos proyectados",
  },
  {
    id: "jobs-indirect",
    value: 960,
    label: "Empleos indirectos proyectados",
  },
  {
    id: "tourists-min",
    value: 100000,
    label: "Visitantes turísticos anuales (mín.)",
  },
  {
    id: "tourists-max",
    value: 150000,
    label: "Visitantes turísticos anuales (máx.)",
  },
];

export const heroStrip = [
  { label: "92 espacios comerciales" },
  { label: "15,251.9 m² de proyecto" },
  { label: "Dos fases de desarrollo" },
  { label: "Ubicación estratégica sobre la CA-13" },
] as const;
