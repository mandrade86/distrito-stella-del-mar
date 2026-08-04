"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { DEFAULT_FLOOR_PLANS } from "@/data/stores";

type FloorLevel = {
  id?: string;
  key: string;
  label: string;
  planImage: string;
  sortOrder: number;
  active: boolean;
};

const blank = (): Omit<FloorLevel, "id"> => ({
  key: "",
  label: "",
  planImage: "/images/masterplan/levels/nivel-2.png",
  sortOrder: 0,
  active: true,
});

export default function AdminFloorPlansPage() {
  const [rows, setRows] = useState<FloorLevel[]>([]);
  const [form, setForm] = useState<(Omit<FloorLevel, "id"> & { id?: string }) | null>(
    null,
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blobOk, setBlobOk] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/floor-plans");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cargar");
      const data: FloorLevel[] = json.data ?? [];
      setRows(data.length ? data : DEFAULT_FLOOR_PLANS.map((l) => ({ ...l })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setRows(DEFAULT_FLOOR_PLANS.map((l) => ({ ...l })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/health");
        const json = await res.json();
        setBlobOk(Boolean(json.blobStorage));
      } catch {
        setBlobOk(null);
      }
    })();
  }, []);

  function startCreate() {
    setForm(blank());
    setMessage("");
  }

  function startEdit(row: FloorLevel) {
    setForm({ ...row });
    setMessage("");
  }

  function setField<K extends keyof FloorLevel>(key: K, value: FloorLevel[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (!form.id) {
        // Ensure defaults exist in DB first if only fallbacks were shown
        const res = await fetch("/api/admin/floor-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "No se pudo crear");
      } else {
        const res = await fetch("/api/admin/floor-plans", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "No se pudo actualizar");
      }
      setMessage("Nivel guardado.");
      setForm(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function seedDefaults() {
    setSaving(true);
    setError("");
    try {
      for (const level of DEFAULT_FLOOR_PLANS) {
        const existing = rows.find((r) => r.key === level.key && r.id);
        if (existing?.id) continue;
        const res = await fetch("/api/admin/floor-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(level),
        });
        if (!res.ok) {
          const json = await res.json();
          // ignore unique conflicts
          if (!String(json.error || "").toLowerCase().includes("unique")) {
            throw new Error(json.error || "Error al crear nivel");
          }
        }
      }
      setMessage("Niveles por defecto creados.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este nivel de plano?")) return;
    const res = await fetch(
      `/api/admin/floor-plans?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
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
          <h1 className="font-serif text-3xl text-navy">Planos / Niveles</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Cada nivel tiene su imagen de plano. Luego asigne locales en{" "}
            <Link href="/admin/stores" className="text-ocean underline">
              Tiendas / Plano
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void seedDefaults()}
            disabled={saving}
            className="rounded-sm border border-navy/20 px-4 py-2 text-sm"
          >
            Crear niveles base
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
          >
            Nuevo nivel
          </button>
        </div>
      </div>

      {blobOk === false ? (
        <div className="border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Blob no configurado.</strong> Las subidas no funcionarán en
          este hosting. En GoDaddy → Secrets agregue{" "}
          <code className="text-xs">BLOB_READ_WRITE_TOKEN</code> (Vercel Blob) y
          haga Redeploy. Compruebe{" "}
          <a href="/api/health" className="underline" target="_blank" rel="noreferrer">
            /api/health
          </a>{" "}
          → <code className="text-xs">blobStorage: true</code>.
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-ocean">{message}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

      {form ? (
        <form
          onSubmit={save}
          className="space-y-4 border border-navy/10 bg-white p-4 md:p-6"
        >
          <h2 className="font-serif text-xl text-navy">
            {form.id ? "Editar nivel" : "Nuevo nivel"}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">
                Clave (única)
              </span>
              <input
                required
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.key}
                onChange={(e) => setField("key", e.target.value)}
                placeholder="n1"
                disabled={Boolean(form.id)}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">Etiqueta</span>
              <input
                required
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.label}
                onChange={(e) => setField("label", e.target.value)}
                placeholder="Nivel 1"
              />
            </label>
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
            <label className="flex items-center gap-2 self-end text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setField("active", e.target.checked)}
              />
              Activo en el sitio
            </label>
            <div className="md:col-span-2">
              <ImageUploadField
                label="Imagen del plano"
                value={form.planImage}
                onChange={(url) => setField("planImage", url)}
              />
            </div>
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
              <th className="px-3 py-2">Clave</th>
              <th className="px-3 py-2">Etiqueta</th>
              <th className="px-3 py-2">Imagen</th>
              <th className="px-3 py-2">Orden</th>
              <th className="px-3 py-2">Activo</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id || row.key} className="border-t border-navy/10">
                <td className="px-3 py-2 font-medium text-navy">{row.key}</td>
                <td className="px-3 py-2">{row.label}</td>
                <td className="max-w-[14rem] truncate px-3 py-2 text-muted">
                  {row.planImage || "—"}
                </td>
                <td className="px-3 py-2">{row.sortOrder}</td>
                <td className="px-3 py-2">{row.active ? "Sí" : "No"}</td>
                <td className="space-x-2 px-3 py-2">
                  {row.id ? (
                    <>
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
                        onClick={() => remove(row.id!)}
                      >
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-muted">
                      Solo en memoria — use “Crear niveles base”
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
