"use client";

import { useEffect, useState } from "react";
import { StoreEditorForm } from "@/components/admin/StoreEditorForm";
import type {
  FloorLevelOption,
  StoreRow,
} from "@/components/admin/store-types";
import { DEFAULT_FLOOR_PLANS } from "@/data/stores";

export default function AdminNewStorePage() {
  const [levels, setLevels] = useState<FloorLevelOption[]>([]);
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [storesRes, levelsRes] = await Promise.all([
          fetch("/api/admin/stores"),
          fetch("/api/admin/floor-plans"),
        ]);
        const storesJson = await storesRes.json();
        const levelsJson = await levelsRes.json();
        if (!storesRes.ok) throw new Error(storesJson.error || "Error");
        if (!levelsRes.ok) throw new Error(levelsJson.error || "Error");
        setStores(
          (storesJson.data ?? []).map((r: StoreRow) => ({
            ...r,
            leasingStatus: r.leasingStatus || "Disponible",
            floorPlanKey: r.floorPlanKey || "n2",
            area: r.area ?? null,
            hotspotPolygon: Array.isArray(r.hotspotPolygon)
              ? r.hotspotPolygon
              : [],
          })),
        );
        const levelRows: FloorLevelOption[] = levelsJson.data ?? [];
        setLevels(
          levelRows.length
            ? levelRows
            : DEFAULT_FLOOR_PLANS.map((l) => ({ ...l })),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) return <p className="text-sm text-muted">Cargando…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;

  return (
    <StoreEditorForm mode="create" levels={levels} allStores={stores} />
  );
}
