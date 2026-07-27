"use client";

import { useEffect, useState } from "react";
import { SortableList } from "@/components/admin/SortableList";

type NavItem = {
  id?: string;
  label: string;
  href: string;
  enabled: boolean;
  sortOrder: number;
};

export default function AdminNavPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/nav");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cargar");
      setItems(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        label: "Nuevo enlace",
        href: "/",
        enabled: true,
        sortOrder: prev.length,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((row, i) => ({ ...row, sortOrder: i })),
    );
  }

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/nav", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo guardar");
      setMessage("Menú actualizado. Recargue el sitio para verlo.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy">Menú del sitio</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Edite etiquetas, URLs y visibilidad. Arrastre el ícono ⋮⋮ para
            cambiar el orden del menú (Header y Footer).
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          Agregar enlace
        </button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-ocean">{message}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

      <SortableList
        items={items}
        getKey={(item, index) => item.id ?? `new-${index}`}
        onReorder={(next) =>
          setItems(next.map((row, i) => ({ ...row, sortOrder: i })))
        }
        renderItem={(item, index) => (
          <div className="grid gap-2 py-2 md:grid-cols-[1fr_1fr_auto_auto]">
            <input
              className="border border-navy/15 bg-off-white px-3 py-2 text-sm"
              placeholder="Etiqueta"
              value={item.label}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row,
                  ),
                )
              }
            />
            <input
              className="border border-navy/15 bg-off-white px-3 py-2 text-sm"
              placeholder="/ruta o URL"
              value={item.href}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((row, i) =>
                    i === index ? { ...row, href: e.target.value } : row,
                  ),
                )
              }
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((row, i) =>
                      i === index
                        ? { ...row, enabled: e.target.checked }
                        : row,
                    ),
                  )
                }
              />
              Visible
            </label>
            <button
              type="button"
              className="text-sm text-red-700 underline"
              onClick={() => removeItem(index)}
            >
              Quitar
            </button>
          </div>
        )}
      />

      <button
        type="button"
        disabled={saving}
        onClick={save}
        className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Guardar menú"}
      </button>
    </div>
  );
}
