export type FloorLevelOption = {
  id?: string;
  key: string;
  label: string;
  planImage: string;
  sortOrder: number;
  active: boolean;
};

export type StoreRow = {
  id: string;
  code: string;
  name: string;
  unitLabel: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  category: string;
  status: string;
  leasingStatus: string;
  floorPlanKey: string;
  level: string;
  area: number | null;
  description: string;
  logo: string;
  hotspotX: number;
  hotspotY: number;
  hotspotW: number;
  hotspotH: number;
  sortOrder: number;
  active: boolean;
};

export type StoreFormState = Omit<StoreRow, "id"> & { id?: string };

export function blankStore(
  floorPlanKey: string,
  levelLabel: string,
): Omit<StoreRow, "id"> {
  return {
    code: "",
    name: "Sin asignar",
    unitLabel: "",
    phone: "",
    email: "",
    website: "",
    hours: "",
    category: "Local",
    status: "Abierto",
    leasingStatus: "Disponible",
    floorPlanKey,
    level: levelLabel,
    area: null,
    description: "",
    logo: "",
    hotspotX: 20,
    hotspotY: 20,
    hotspotW: 12,
    hotspotH: 8,
    sortOrder: 0,
    active: true,
  };
}
