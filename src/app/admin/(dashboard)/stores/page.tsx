"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  FloorHotspotEditor,
  type HotspotBox,
} from "@/components/admin/FloorHotspotEditor";

type StoreRow = {
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
  level: string;
  description: string;
  logo: string;
  hotspotX: number;
  hotspotY: number;
  hotspotW: number;
  hotspotH: number;
  sortOrder: number;
  active: boolean;
};

const PLAN =
  "/images/masterplan/plano-tiendas-render.png";

const blank = (): Omit<StoreRow, "id"> => ({
  code: "",
  name: "",
  unitLabel: "",
  phone: "",
  email: "",
  website: "",
  hours: "Lun–Sáb 10:00–20:00 · Dom 10:00–18:00",
  category: "Retail",
  status: "Abierto",
  level: "Nivel 2",
  description: "",
  logo: "/images/logos/icon-star-color.png",
  hotspotX: 20,
  hotspotY: 20,
  hotspotW: 12,
  hotspotH: 8,
  sortOrder: 0,
  active: true,
});

export default function AdminStoresPage() {
  const [rows, setRows] = useState<StoreRow[]>([]);
  const [form, setForm] = useState<(Omit<StoreRow, "id"> & { id?: string }) | null>(
    null,
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stores");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cargar");
      setRows(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function startCreate() {
    setForm(blank());
    setMessage("");
  }

  function startEdit(row: StoreRow) {
    setForm({
      ...row,
      unitLabel: row.unitLabel ?? "",
      email: row.email ?? "",
      website: row.website ?? "",
      description: row.description ?? "",
      status: row.status || "Abierto",
      level: row.level || "Nivel 2",
      logo: row.logo ?? "",
    });
    setMessage("");
  }

  function setField<K extends keyof StoreRow>(key: K, value: StoreRow[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function setHotspot(box: HotspotBox) {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            hotspotX: box.x,
            hotspotY: box.y,
            hotspotW: box.w,
            hotspotH: box.h,
          }
        : prev,
    );
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/stores", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo guardar");
      setMessage("Local guardado.");
      setForm(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

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

  const otherHotspots = rows
    .filter((r) => r.id !== form?.id)
    .map((r) => ({
      x: r.hotspotX,
      y: r.hotspotY,
      w: r.hotspotW,
      h: r.hotspotH,
      label: r.unitLabel || r.code,
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy">Tiendas / Plano</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Asigne cada local sobre el plano (arrastre la zona), complete la
            información comercial y publíquelo. La imagen del plano se puede
            cambiar en{" "}
            <Link
              href="/admin/pages?slug=tiendas"
              className="text-ocean underline"
            >
              Páginas del sitio → Tiendas → Plano
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo local
        </button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-ocean">{message}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

      {form ? (
        <form
          onSubmit={save}
          className="space-y-5 border border-navy/10 bg-white p-4 md:p-6"
        >
          <h2 className="font-serif text-xl text-navy">
            {form.id ? "Editar local" : "Nuevo local"}
          </h2>

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
                Nombre comercial
              </span>
              <input
                required
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">Categoría</span>
              <input
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                placeholder="Retail, Food Court, Ancla…"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">Estado</span>
              <select
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option>Abierto</option>
                <option>Próximamente</option>
                <option>Cerrado</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">Nivel</span>
              <input
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.level}
                onChange={(e) => setField("level", e.target.value)}
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
              <span className="mb-1 block font-medium text-navy">
                Descripción
              </span>
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
              Asignación en el plano
            </p>
            <FloorHotspotEditor
              planSrc={PLAN}
              value={{
                x: form.hotspotX,
                y: form.hotspotY,
                w: form.hotspotW,
                h: form.hotspotH,
              }}
              onChange={setHotspot}
              otherHotspots={otherHotspots}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Guardando…" : form.id ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-sm border border-navy/20 px-4 py-2 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-x-auto border border-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs uppercase tracking-wide text-navy">
            <tr>
              <th className="px-3 py-2">Local</th>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Teléfono</th>
              <th className="px-3 py-2">Visible</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-navy/10">
                <td className="px-3 py-2 font-medium text-navy">
                  {row.unitLabel || row.code}
                </td>
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2 text-muted">{row.category}</td>
                <td className="px-3 py-2">{row.status}</td>
                <td className="px-3 py-2 text-muted">{row.phone || "—"}</td>
                <td className="px-3 py-2">{row.active ? "Sí" : "No"}</td>
                <td className="space-x-2 px-3 py-2">
                  <button
                    type="button"
                    className="text-ocean underline"
                    onClick={() => startEdit(row)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="text-red-700 underline"
                    onClick={() => remove(row.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && !loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-muted">
                  Aún no hay locales. Cree el primero.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
