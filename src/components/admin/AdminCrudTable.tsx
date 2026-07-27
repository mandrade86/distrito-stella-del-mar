"use client";

import { useEffect, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { GalleryImagesField } from "@/components/admin/GalleryImagesField";

type Field = {
  name: string;
  label: string;
  type?:
    | "text"
    | "number"
    | "textarea"
    | "checkbox"
    | "select"
    | "image"
    | "images";
  options?: string[];
};

type Props = {
  title: string;
  endpoint: string;
  fields: Field[];
  idField?: string;
};

function asUrlList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function AdminCrudTable({
  title,
  endpoint,
  fields,
  idField = "id",
}: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(endpoint);
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
  }, [endpoint]);

  function startCreate() {
    setEditingId(null);
    const blank: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "checkbox") blank[field.name] = true;
      else if (field.type === "images") blank[field.name] = [];
      else blank[field.name] = "";
    }
    setForm(blank);
  }

  function startEdit(row: Record<string, unknown>) {
    setEditingId(String(row[idField]));
    const next: Record<string, unknown> = { ...row };
    if (Array.isArray(row.highlights)) {
      next.highlights = (row.highlights as string[]).join("\n");
    }
    for (const field of fields) {
      if (field.type === "images") {
        next[field.name] = asUrlList(row[field.name]);
      }
    }
    setForm(next);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const payload = { ...form };
    if (typeof payload.highlights === "string") {
      payload.highlights = String(payload.highlights)
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    for (const field of fields) {
      if (field.type === "images") {
        payload[field.name] = asUrlList(payload[field.name]);
      }
    }
    const res = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId ? { ...payload, [idField]: editingId } : payload,
      ),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "No se pudo guardar");
      return;
    }
    setForm({});
    setEditingId(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este registro?")) return;
    const res = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, {
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-navy">{title}</h1>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo
        </button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

      {Object.keys(form).length > 0 ? (
        <form
          onSubmit={save}
          className="grid gap-3 border border-navy/10 bg-white p-4 md:grid-cols-2"
        >
          {fields.map((field) =>
            field.type === "image" ? (
              <ImageUploadField
                key={field.name}
                label={field.label}
                value={String(form[field.name] ?? "")}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, [field.name]: url }))
                }
              />
            ) : field.type === "images" ? (
              <GalleryImagesField
                key={field.name}
                label={field.label}
                value={asUrlList(form[field.name])}
                onChange={(urls) =>
                  setForm((prev) => ({ ...prev, [field.name]: urls }))
                }
              />
            ) : (
              <label key={field.name} className="block text-sm md:col-span-1">
                <span className="mb-1 block font-medium text-navy">
                  {field.label}
                </span>
                {field.type === "textarea" ? (
                  <textarea
                    className="w-full border border-navy/15 bg-off-white px-3 py-2"
                    rows={4}
                    value={String(form[field.name] ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.name]: e.target.checked,
                      }))
                    }
                  />
                ) : field.type === "select" ? (
                  <select
                    className="w-full border border-navy/15 bg-off-white px-3 py-2"
                    value={String(form[field.name] ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                  >
                    {(field.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    className="w-full border border-navy/15 bg-off-white px-3 py-2"
                    value={String(form[field.name] ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.name]:
                          field.type === "number"
                            ? e.target.value === ""
                              ? ""
                              : Number(e.target.value)
                            : e.target.value,
                      }))
                    }
                  />
                )}
              </label>
            ),
          )}
          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
            >
              {editingId ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({});
                setEditingId(null);
              }}
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
              {fields.slice(0, 4).map((field) => (
                <th key={field.name} className="px-3 py-2 font-semibold">
                  {field.label}
                </th>
              ))}
              <th className="px-3 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row[idField])} className="border-t border-navy/10">
                {fields.slice(0, 4).map((field) => (
                  <td key={field.name} className="px-3 py-2 align-top">
                    {field.type === "image" && row[field.name] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={String(row[field.name])}
                        alt=""
                        className="h-12 w-16 object-contain"
                      />
                    ) : field.type === "images" ? (
                      `${asUrlList(row[field.name]).length} foto(s)`
                    ) : (
                      String(row[field.name] ?? "—")
                    )}
                  </td>
                ))}
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
                    onClick={() => remove(String(row[idField]))}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
