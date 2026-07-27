"use client";

import { useEffect, useState } from "react";
import { HtmlEditor } from "@/components/admin/HtmlEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { slugify } from "@/lib/sanitize-html";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  publishedAt: string | null;
};

const blank = (): Omit<BlogPost, "id"> & { id?: string } => ({
  title: "",
  slug: "",
  content: "<p>Escriba la entrada del blog aquí.</p>",
  excerpt: "",
  coverImage: "",
  status: "draft",
  publishedAt: null,
});

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<ReturnType<typeof blank> | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cargar");
      setPosts(json.data ?? []);
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

  function startEdit(post: BlogPost) {
    setForm({
      ...post,
      excerpt: post.excerpt ?? "",
      coverImage: post.coverImage ?? "",
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
      const res = await fetch("/api/admin/blog", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || slugify(form.title),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo guardar");
      setMessage("Entrada guardada.");
      setForm(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta entrada?")) return;
    const res = await fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`, {
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
          <h1 className="font-serif text-3xl text-navy">Novedades</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Publique noticias y artículos con HTML. Visibles en /novedades.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          Nueva entrada
        </button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-ocean">{message}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

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
              <span className="mb-1 block font-medium text-navy">Slug</span>
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
                /novedades/{form.slug || "…"}
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
            <label className="block text-sm md:col-span-2">
              <span className="mb-1 block font-medium text-navy">Extracto</span>
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

          <ImageUploadField
            label="Imagen de portada"
            value={form.coverImage ?? ""}
            onChange={(coverImage) =>
              setForm((prev) => (prev ? { ...prev, coverImage } : prev))
            }
          />

          <HtmlEditor
            label="Contenido HTML"
            value={form.content}
            onChange={(content) =>
              setForm((prev) => (prev ? { ...prev, content } : prev))
            }
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Guardando…" : form.id ? "Actualizar" : "Publicar"}
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
              <th className="px-3 py-2">Título</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-navy/10">
                <td className="px-3 py-2 font-medium text-navy">{post.title}</td>
                <td className="px-3 py-2">
                  {post.status === "published" ? "Publicada" : "Borrador"}
                </td>
                <td className="px-3 py-2 text-muted">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("es-HN")
                    : "—"}
                </td>
                <td className="space-x-2 px-3 py-2">
                  <button
                    type="button"
                    className="text-ocean underline"
                    onClick={() => startEdit(post)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="text-red-700 underline"
                    onClick={() => remove(post.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!posts.length && !loading ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-muted">
                  Aún no hay entradas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
