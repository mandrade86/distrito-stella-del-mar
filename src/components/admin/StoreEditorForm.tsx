"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  FloorHotspotEditor,
  type HotspotBox,
} from "@/components/admin/FloorHotspotEditor";
import {
  blankStore,
  type FloorLevelOption,
  type StoreFormState,
  type StoreRow,
} from "@/components/admin/store-types";
import { DEFAULT_FLOOR_PLANS, LEASING_STATUSES, STORE_CATEGORIES } from "@/data/stores";

type Props = {
  mode: "create" | "edit";
  initial?: StoreRow | null;
  levels: FloorLevelOption[];
  allStores: StoreRow[];
};

export function StoreEditorForm({ mode, initial, levels, allStores }: Props) {
  const router = useRouter();
  const planOptions =
    levels.length > 0
      ? levels
      : DEFAULT_FLOOR_PLANS.map((l) => ({ ...l }));

  const [form, setForm] = useState<StoreFormState>(() => {
    if (initial) {
      return {
        ...initial,
        unitLabel: initial.unitLabel ?? "",
        email: initial.email ?? "",
        website: initial.website ?? "",
        description: initial.description ?? "",
        status: initial.status || "Abierto",
        leasingStatus: initial.leasingStatus || "Disponible",
        floorPlanKey: initial.floorPlanKey || "n2",
        level: initial.level || "Nivel 2",
        logo: initial.logo ?? "",
        area: initial.area ?? null,
      };
    }
    const key = planOptions[0]?.key || "n2";
    const label = planOptions.find((p) => p.key === key)?.label || "Nivel 2";
    return blankStore(key, label);
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const activePlanImage = useMemo(() => {
    const match = planOptions.find((p) => p.key === form.floorPlanKey);
    return (
      match?.planImage ||
      DEFAULT_FLOOR_PLANS.find((p) => p.key === "n2")?.planImage ||
      "/images/masterplan/plano-tiendas-render.png"
    );
  }, [form.floorPlanKey, planOptions]);

  const otherHotspots = allStores
    .filter(
      (r) =>
        r.id !== form.id &&
        r.floorPlanKey === form.floorPlanKey,
    )
    .map((r) => ({
      x: r.hotspotX,
      y: r.hotspotY,
      w: r.hotspotW,
      h: r.hotspotH,
      label: r.unitLabel || r.code,
      polygon: r.hotspotPolygon,
    }));

  function setField<K extends keyof StoreFormState>(
    key: K,
    value: StoreFormState[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "floorPlanKey") {
        const match = planOptions.find((p) => p.key === String(value));
        if (match) next.level = match.label;
      }
      return next;
    });
  }

  function setHotspot(next: {
    box: HotspotBox;
    polygon: StoreFormState["hotspotPolygon"];
  }) {
    setForm((prev) => ({
      ...prev,
      hotspotX: next.box.x,
      hotspotY: next.box.y,
      hotspotW: next.box.w,
      hotspotH: next.box.h,
      hotspotPolygon: next.polygon,
    }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stores", {
        method: mode === "edit" && form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo guardar");
      router.push("/admin/stores");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/stores"
          className="inline-flex items-center gap-1.5 text-sm text-ocean hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-3xl text-navy">
          {mode === "edit" ? "Editar local" : "Nuevo local"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Complete los datos y dibuje el local por puntos en el plano del nivel
          (polígono, no solo un rectángulo).
        </p>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <form
        onSubmit={save}
        className="space-y-5 border border-navy/10 bg-white p-4 md:p-6"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Código</span>
            <input
              required
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.code}
              onChange={(e) => setField("code", e.target.value)}
              placeholder="T-L01"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">
              Etiqueta en plano
            </span>
            <input
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.unitLabel}
              onChange={(e) => setField("unitLabel", e.target.value)}
              placeholder="L-01"
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-navy">
              Nombre comercial (vacío = Sin asignar)
            </span>
            <input
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Sin asignar"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">
              Plano / nivel
            </span>
            <select
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.floorPlanKey}
              onChange={(e) => setField("floorPlanKey", e.target.value)}
            >
              {planOptions.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">
              Estado de alquiler
            </span>
            <select
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.leasingStatus}
              onChange={(e) => setField("leasingStatus", e.target.value)}
            >
              {LEASING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Categoría</span>
            <select
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
            >
              {!STORE_CATEGORIES.includes(
                form.category as (typeof STORE_CATEGORIES)[number],
              ) && form.category ? (
                <option value={form.category}>{form.category}</option>
              ) : null}
              {STORE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Área (m²)</span>
            <input
              type="number"
              step="0.01"
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.area ?? ""}
              onChange={(e) =>
                setField(
                  "area",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Teléfono</span>
            <input
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Correo</span>
            <input
              type="email"
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">Sitio web</span>
            <input
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.website}
              onChange={(e) => setField("website", e.target.value)}
              placeholder="https://"
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-navy">Horarios</span>
            <textarea
              rows={2}
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.hours}
              onChange={(e) => setField("hours", e.target.value)}
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-navy">Descripción</span>
            <textarea
              rows={3}
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </label>
          <div className="md:col-span-1">
            <ImageUploadField
              label="Logo"
              value={form.logo}
              onChange={(url) => setField("logo", url)}
            />
          </div>
          <div className="space-y-3 md:col-span-1">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">Orden</span>
              <input
                type="number"
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.sortOrder}
                onChange={(e) =>
                  setField("sortOrder", Number(e.target.value) || 0)
                }
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setField("active", e.target.checked)}
              />
              Visible en el plano público
            </label>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-navy">
            Forma del local en el plano ({form.level})
          </p>
          <FloorHotspotEditor
            planSrc={activePlanImage}
            value={{
              x: form.hotspotX,
              y: form.hotspotY,
              w: form.hotspotW,
              h: form.hotspotH,
            }}
            polygon={form.hotspotPolygon}
            onChange={setHotspot}
            otherHotspots={otherHotspots}
            activeLabel={form.unitLabel}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando…" : mode === "edit" ? "Actualizar" : "Crear"}
          </button>
          <Link
            href="/admin/stores"
            className="rounded-sm border border-navy/20 px-4 py-2 text-sm"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
