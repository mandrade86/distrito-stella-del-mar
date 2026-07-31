"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StoreEditorForm } from "@/components/admin/StoreEditorForm";
import type {
  FloorLevelOption,
  StoreRow,
} from "@/components/admin/store-types";
import { DEFAULT_FLOOR_PLANS } from "@/data/stores";

export default function AdminEditStorePage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [store, setStore] = useState<StoreRow | null>(null);
  const [levels, setLevels] = useState<FloorLevelOption[]>([]);
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const [oneRes, storesRes, levelsRes] = await Promise.all([
          fetch(`/api/admin/stores?id=${encodeURIComponent(id)}`),
          fetch("/api/admin/stores"),
          fetch("/api/admin/floor-plans"),
        ]);
        const oneJson = await oneRes.json();
        const storesJson = await storesRes.json();
        const levelsJson = await levelsRes.json();
        if (!oneRes.ok) throw new Error(oneJson.error || "Local no encontrado");
        if (!storesRes.ok) throw new Error(storesJson.error || "Error");
        if (!levelsRes.ok) throw new Error(levelsJson.error || "Error");

        const row = oneJson.data as StoreRow;
        setStore({
          ...row,
          leasingStatus: row.leasingStatus || "Disponible",
          floorPlanKey: row.floorPlanKey || "n2",
          area: row.area ?? null,
          description: row.description ?? "",
        });
        setStores(
          (storesJson.data ?? []).map((r: StoreRow) => ({
            ...r,
            leasingStatus: r.leasingStatus || "Disponible",
            floorPlanKey: r.floorPlanKey || "n2",
            area: r.area ?? null,
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
  }, [id]);

  if (loading) return <p className="text-sm text-muted">Cargando…</p>;
  if (error || !store) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-700">{error || "Local no encontrado"}</p>
        <Link href="/admin/stores" className="text-sm text-ocean underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <StoreEditorForm
      mode="edit"
      initial={store}
      levels={levels}
      allStores={stores}
    />
  );
}
