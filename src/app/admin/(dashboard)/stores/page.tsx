"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import type {
  FloorLevelOption,
  StoreRow,
} from "@/components/admin/store-types";
import { DEFAULT_FLOOR_PLANS } from "@/data/stores";

export default function AdminStoresPage() {
  const [rows, setRows] = useState<StoreRow[]>([]);
  const [levels, setLevels] = useState<FloorLevelOption[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [storesRes, levelsRes] = await Promise.all([
        fetch("/api/admin/stores"),
        fetch("/api/admin/floor-plans"),
      ]);
      const storesJson = await storesRes.json();
      const levelsJson = await levelsRes.json();
      if (!storesRes.ok) throw new Error(storesJson.error || "Error al cargar tiendas");
      if (!levelsRes.ok) throw new Error(levelsJson.error || "Error al cargar niveles");

      const levelRows: FloorLevelOption[] = levelsJson.data ?? [];
      setLevels(
        levelRows.length
          ? levelRows
          : DEFAULT_FLOOR_PLANS.map((l) => ({ ...l })),
      );
      setRows(
        (storesJson.data ?? []).map((row: StoreRow) => ({
          ...row,
          leasingStatus: row.leasingStatus || "Disponible",
          floorPlanKey: row.floorPlanKey || "n2",
          area: row.area ?? null,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const planOptions = useMemo(
    () =>
      levels.length
        ? levels
        : DEFAULT_FLOOR_PLANS.map((l) => ({ ...l })),
    [levels],
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filterLevel !== "all" && r.floorPlanKey !== filterLevel) return false;
      if (!q) return true;
      const haystack = [
        r.code,
        r.unitLabel,
        r.name,
        r.category,
        r.leasingStatus,
        r.level,
        r.phone,
        r.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, filterLevel, query]);

  async function remove(id: string) {
    if (!confirm("¿Eliminar este local del plano?")) return;
    const res = await fetch(`/api/admin/stores?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "No se pudo eliminar");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy">Tiendas / Plano</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Inventario por nivel: Disponible, Reservado u Ocupado. Gestione
            imágenes de planos en{" "}
            <Link href="/admin/floor-plans" className="text-ocean underline">
              Planos / Niveles
            </Link>
            .
          </p>
        </div>
        <Link
          href="/admin/stores/new"
          className="inline-flex items-center gap-2 rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Nuevo local
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[16rem] flex-1 text-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por local, nombre, categoría…"
            className="w-full border border-navy/15 bg-white py-2 pl-9 pr-3"
          />
        </label>
        <label className="text-sm">
          <span className="mr-2 font-medium text-navy">Nivel</span>
          <select
            className="border border-navy/15 bg-white px-3 py-2"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">Todos</option>
            {planOptions.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-muted">
          <span className="mr-3 inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 bg-ocean/70" /> Disponible
          </span>
          <span className="mr-3 inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 bg-gold" /> Reservado
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 bg-navy" /> Ocupado
          </span>
        </p>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

      <div className="overflow-x-auto border border-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs uppercase tracking-wide text-navy">
            <tr>
              <th className="px-3 py-2">Local</th>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Nivel</th>
              <th className="px-3 py-2">Alquiler</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Visible</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className="border-t border-navy/10">
                <td className="px-3 py-2 font-medium text-navy">
                  {row.unitLabel || row.code}
                </td>
                <td className="px-3 py-2">{row.name || "Sin asignar"}</td>
                <td className="px-3 py-2 text-muted">
                  {planOptions.find((p) => p.key === row.floorPlanKey)?.label ||
                    row.level}
                </td>
                <td className="px-3 py-2">{row.leasingStatus || "Disponible"}</td>
                <td className="px-3 py-2 text-muted">{row.category}</td>
                <td className="px-3 py-2">{row.active ? "Sí" : "No"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/stores/${row.id}`}
                      className="inline-flex items-center gap-1 rounded-sm border border-navy/15 px-2.5 py-1.5 text-xs font-medium text-navy hover:border-ocean/40 hover:text-ocean"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      onClick={() => remove(row.id)}
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredRows.length && !loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-muted">
                  {query.trim()
                    ? "No hay resultados para esa búsqueda."
                    : "Aún no hay locales en este filtro."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
