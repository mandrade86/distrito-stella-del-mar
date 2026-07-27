"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { HtmlEditor } from "@/components/admin/HtmlEditor";
import { SortableList } from "@/components/admin/SortableList";
import { BUILTIN_HOME_WIDGET_KEYS } from "@/lib/content/defaults-cms";
import { cn } from "@/lib/utils";

type Widget = {
  id?: string;
  widgetKey: string;
  label: string;
  kind: "builtin" | "html";
  html: string;
  enabled: boolean;
  sortOrder: number;
};

export default function AdminHomeWidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/home-widgets");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cargar");
      setWidgets(
        (json.data ?? []).map((w: Widget) => ({
          ...w,
          kind: w.kind === "html" ? "html" : "builtin",
          html: w.html ?? "",
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function toggleHidden(widgetKey: string) {
    setWidgets((prev) =>
      prev.map((w) =>
        w.widgetKey === widgetKey ? { ...w, enabled: !w.enabled } : w,
      ),
    );
  }

  function addHtmlBlock() {
    const key = `html-bloque-${Date.now().toString(36)}`;
    const next: Widget = {
      widgetKey: key,
      label: "Nuevo bloque HTML",
      kind: "html",
      html: "<h2>Título de la sección</h2><p>Escriba aquí el contenido del bloque.</p>",
      enabled: true,
      sortOrder: widgets.length,
    };
    setWidgets((prev) => [...prev, next]);
    setEditingKey(key);
    setMessage("");
  }

  function removeHtml(widgetKey: string) {
    if (BUILTIN_HOME_WIDGET_KEYS.has(widgetKey)) return;
    if (!confirm("¿Eliminar este bloque HTML?")) return;
    setWidgets((prev) =>
      prev
        .filter((w) => w.widgetKey !== widgetKey)
        .map((w, i) => ({ ...w, sortOrder: i })),
    );
    if (editingKey === widgetKey) setEditingKey(null);
  }

  function updateWidget(widgetKey: string, patch: Partial<Widget>) {
    setWidgets((prev) =>
      prev.map((w) => (w.widgetKey === widgetKey ? { ...w, ...patch } : w)),
    );
  }

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/home-widgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgets }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo guardar");
      setMessage("Widgets actualizados. Recargue el Home para ver los cambios.");
      setEditingKey(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  const editing = widgets.find((w) => w.widgetKey === editingKey);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy">Widgets del Home</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Muestre, oculte y reordene secciones. Puede agregar{" "}
            <strong>bloques HTML nuevos</strong>. Los textos de las secciones
            fijas se editan en{" "}
            <Link href="/admin/pages?slug=shared" className="text-ocean underline">
              Páginas del sitio → Secciones compartidas
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={addHtmlBlock}
          className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          Agregar bloque HTML
        </button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-ocean">{message}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

      <SortableList
        items={widgets}
        getKey={(w) => w.widgetKey}
        onReorder={(next) =>
          setWidgets(next.map((w, i) => ({ ...w, sortOrder: i })))
        }
        itemClassName={(widget) =>
          widget.enabled
            ? "border-navy/10 bg-white"
            : "border-dashed border-navy/20 bg-sand/40 opacity-80"
        }
        renderItem={(widget, index) => (
          <div className="flex flex-wrap items-center gap-3 py-2 pr-2">
            <span className="w-8 text-xs text-muted">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-navy">{widget.label}</p>
              <p className="text-xs text-muted">
                {widget.kind === "html" ? "Bloque HTML · " : "Sección fija · "}
                {widget.enabled ? "Visible" : "Oculto"}
              </p>
            </div>
            {widget.kind === "html" ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setEditingKey(
                      editingKey === widget.widgetKey ? null : widget.widgetKey,
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-sm border border-navy/15 px-3 py-1.5 text-xs font-medium text-navy"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeHtml(widget.widgetKey)}
                  className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => toggleHidden(widget.widgetKey)}
              className={cn(
                "inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-medium",
                widget.enabled
                  ? "border-navy/15 text-navy"
                  : "border-ocean/30 bg-ocean/10 text-ocean",
              )}
            >
              {widget.enabled ? (
                <>
                  <Eye className="h-3.5 w-3.5" /> Visible
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5" /> Oculto
                </>
              )}
            </button>
          </div>
        )}
      />

      {editing && editing.kind === "html" ? (
        <div className="space-y-4 border border-navy/10 bg-white p-4 md:p-5">
          <h2 className="font-serif text-xl text-navy">Editar bloque HTML</h2>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-navy">
              Nombre (solo admin)
            </span>
            <input
              className="w-full border border-navy/15 bg-off-white px-3 py-2"
              value={editing.label}
              onChange={(e) =>
                updateWidget(editing.widgetKey, { label: e.target.value })
              }
            />
          </label>
          <HtmlEditor
            label="Contenido HTML"
            value={editing.html}
            onChange={(html) => updateWidget(editing.widgetKey, { html })}
          />
          <button
            type="button"
            onClick={() => setEditingKey(null)}
            className="rounded-sm border border-navy/20 px-4 py-2 text-sm"
          >
            Cerrar editor
          </button>
        </div>
      ) : null}

      <button
        type="button"
        disabled={saving}
        onClick={save}
        className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
