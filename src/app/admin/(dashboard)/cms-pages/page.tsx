"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HtmlEditor } from "@/components/admin/HtmlEditor";
import { SortableList } from "@/components/admin/SortableList";
import { slugify } from "@/lib/sanitize-html";

type CmsPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  status: string;
  showInNav: boolean;
  navLabel: string | null;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

const blank = (): Omit<CmsPage, "id"> & { id?: string } => ({
  title: "",
  slug: "",
  content: "<p>Escriba el contenido de la página aquí.</p>",
  excerpt: "",
  status: "draft",
  showInNav: false,
  navLabel: "",
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
});

export default function AdminCmsPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [form, setForm] = useState<ReturnType<typeof blank> | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms-pages");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cargar");
      setPages(json.data ?? []);
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

  function startEdit(page: CmsPage) {
    setForm({
      ...page,
      excerpt: page.excerpt ?? "",
      navLabel: page.navLabel ?? "",
      seoTitle: page.seoTitle ?? "",
      seoDescription: page.seoDescription ?? "",
    });
    setMessage("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
      };
      const res = await fetch("/api/admin/cms-pages", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo guardar");
      setMessage("Página guardada.");
      setForm(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta página?")) return;
    const res = await fetch(`/api/admin/cms-pages?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "No se pudo eliminar");
      return;
    }
    await load();
  }

  async function reorder(next: CmsPage[]) {
    const ordered = next.map((page, i) => ({ ...page, sortOrder: i }));
    setPages(ordered);
    setReordering(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: ordered.map((page) => ({
            id: page.id,
            sortOrder: page.sortOrder,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo reordenar");
      setMessage("Orden actualizado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      await load();
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy">Páginas extra (HTML)</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Cree páginas HTML nuevas (estilo WordPress) en{" "}
            <code className="text-xs">/pagina/su-slug</code>. Las páginas fijas
            del sitio (Proyecto, Master Plan, Contacto, etc.) ya existen en{" "}
            <Link href="/admin/pages" className="text-ocean underline">
              Páginas del sitio
            </Link>
            . Arrastre ⋮⋮ para reordenar.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          Nueva página
        </button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-ocean">{message}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}
      {reordering ? (
        <p className="text-sm text-muted">Guardando orden…</p>
      ) : null}

      {form ? (
        <form
          onSubmit={save}
          className="space-y-4 border border-navy/10 bg-white p-4 md:p-6"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">Título</span>
              <input
                required
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          title,
                          slug: prev.id ? prev.slug : slugify(title),
                        }
                      : prev,
                  );
                }}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">
                Slug (URL)
              </span>
              <input
                required
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, slug: slugify(e.target.value) } : prev,
                  )
                }
              />
              <span className="mt-1 block text-[11px] text-muted">
                Pública en /pagina/{form.slug || "…"}
              </span>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">Estado</span>
              <select
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, status: e.target.value } : prev,
                  )
                }
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicada</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input
                type="checkbox"
                checked={form.showInNav}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, showInNav: e.target.checked } : prev,
                  )
                }
              />
              Mostrar en el menú principal
            </label>
            {form.showInNav ? (
              <label className="block text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-navy">
                  Etiqueta en menú
                </span>
                <input
                  className="w-full border border-navy/15 bg-off-white px-3 py-2"
                  placeholder={form.title || "Nombre en menú"}
                  value={form.navLabel ?? ""}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev ? { ...prev, navLabel: e.target.value } : prev,
                    )
                  }
                />
              </label>
            ) : null}
            <label className="block text-sm md:col-span-2">
              <span className="mb-1 block font-medium text-navy">Resumen</span>
              <textarea
                rows={2}
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.excerpt ?? ""}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, excerpt: e.target.value } : prev,
                  )
                }
              />
            </label>
          </div>

          <HtmlEditor
            label="Contenido HTML"
            value={form.content}
            onChange={(content) =>
              setForm((prev) => (prev ? { ...prev, content } : prev))
            }
          />

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">SEO título</span>
              <input
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.seoTitle ?? ""}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, seoTitle: e.target.value } : prev,
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-navy">
                SEO descripción
              </span>
              <input
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={form.seoDescription ?? ""}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, seoDescription: e.target.value } : prev,
                  )
                }
              />
            </label>
          </div>

          <div className="flex gap-2">
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

      {!loading && pages.length ? (
        <SortableList
          items={pages}
          getKey={(page) => page.id}
          onReorder={reorder}
          renderItem={(page) => (
            <div className="flex flex-wrap items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="font-medium text-navy">{page.title}</p>
                <p className="text-xs text-muted">/pagina/{page.slug}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted">
                  {page.status === "published" ? "Publicada" : "Borrador"}
                </span>
                <span className="text-muted">
                  Menú: {page.showInNav ? "Sí" : "—"}
                </span>
                <button
                  type="button"
                  className="text-ocean underline"
                  onClick={() => startEdit(page)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="text-red-700 underline"
                  onClick={() => remove(page.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        />
      ) : null}

      {!pages.length && !loading ? (
        <p className="border border-navy/10 bg-white px-3 py-6 text-center text-sm text-muted">
          Aquí aún no hay páginas extra. Las del menú (Proyecto, Master Plan,
          etc.) se editan en{" "}
          <Link href="/admin/pages" className="text-ocean underline">
            Páginas del sitio
          </Link>
          . Use &quot;Nueva página&quot; solo si necesita una página HTML
          adicional.
        </p>
      ) : null}
    </div>
  );
}
