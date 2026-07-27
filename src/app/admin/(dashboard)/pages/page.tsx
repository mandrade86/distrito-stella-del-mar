"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CopySection } from "@/lib/content/page-registry";
import { HtmlEditor } from "@/components/admin/HtmlEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PagesSelectField } from "@/components/admin/PagesSelectField";
import { PercentField } from "@/components/admin/PercentField";

type PageMeta = { slug: string; label: string; path: string };

export default function AdminPagesEditor() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [slug, setSlug] = useState<string | null>(null);
  const [sections, setSections] = useState<CopySection[]>([]);
  const [values, setValues] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const [defaults, setDefaults] = useState<
    Record<string, Record<string, string>>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/pages");
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "No se pudieron cargar las páginas");
        setLoading(false);
        return;
      }
      const list = (json.data.pages ?? []) as PageMeta[];
      setPages(list);
      setLoading(false);

      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") || params.get("slug");
      if (tab && list.some((p) => p.slug === tab)) {
        setSlug(tab);
      }
    })();
  }, []);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setLoading(true);
      setError("");
      setMessage("");
      try {
        const res = await fetch(
          `/api/admin/pages?slug=${encodeURIComponent(slug)}`,
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error al cargar");
        setSections(json.data.sections ?? []);
        setValues(json.data.values ?? {});
        setDefaults(json.data.defaults ?? {});
        const url = new URL(window.location.href);
        url.searchParams.set("slug", slug);
        window.history.replaceState({}, "", url.toString());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  function setField(sectionKey: string, fieldKey: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] ?? {}),
        [fieldKey]: value,
      },
    }));
  }

  function resetField(sectionKey: string, fieldKey: string) {
    const fallback = defaults[sectionKey]?.[fieldKey] ?? "";
    setField(sectionKey, fieldKey, fallback);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!slug) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, values }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo guardar");
      setMessage("Guardado. Ya es visible en el sitio.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  const current = pages.find((page) => page.slug === slug);

  if (!slug) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl text-navy">Páginas del sitio</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Aquí están las páginas fijas del sitio. En{" "}
            <strong>Secciones compartidas</strong> puede marcar en qué páginas
            aparece cada bloque. Para crear una página HTML nueva use{" "}
            <Link href="/admin/cms-pages" className="text-ocean underline">
              Páginas extra (HTML)
            </Link>
            .
          </p>
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <button
              key={page.slug}
              type="button"
              onClick={() => setSlug(page.slug)}
              className="border border-navy/10 bg-white p-4 text-left transition hover:border-ocean/40 hover:shadow-sm"
            >
              <p className="font-serif text-xl text-navy">{page.label}</p>
              <p className="mt-1 text-xs text-muted">
                {page.path === "—"
                  ? "Secciones usadas en varias páginas"
                  : `Ruta: ${page.path}`}
              </p>
              <p className="mt-3 text-sm font-medium text-ocean">Editar →</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => {
              setSlug(null);
              setSections([]);
              const url = new URL(window.location.href);
              url.searchParams.delete("slug");
              url.searchParams.delete("tab");
              window.history.replaceState({}, "", url.pathname);
            }}
            className="text-sm text-ocean underline"
          >
            ← Volver a todas las páginas
          </button>
          <h1 className="mt-2 font-serif text-3xl text-navy">
            {current?.label ?? "Editar página"}
          </h1>
          {current ? (
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ocean">
              {current.path === "—"
                ? "Usado en varias páginas"
                : `Ruta pública: ${current.path}`}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {pages.map((page) => (
          <button
            key={page.slug}
            type="button"
            onClick={() => setSlug(page.slug)}
            className={`rounded-sm px-3 py-2 text-sm font-medium ${
              slug === page.slug
                ? "bg-navy text-white"
                : "border border-navy/15 bg-white text-navy hover:border-ocean/40"
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-ocean">{message}</p> : null}
      {loading ? <p className="text-sm text-muted">Cargando…</p> : null}

      {!loading ? (
        <form onSubmit={save} className="space-y-6">
          {sections.map((section) => (
            <fieldset
              key={section.key}
              className="border border-navy/10 bg-white p-4 md:p-5"
            >
              <legend className="px-1 font-serif text-xl text-navy">
                {section.label}
              </legend>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {section.fields.map((field) =>
                  field.type === "pages" ? (
                    <PagesSelectField
                      key={field.key}
                      label={field.label}
                      value={values[section.key]?.[field.key] ?? ""}
                      onChange={(next) =>
                        setField(section.key, field.key, next)
                      }
                    />
                  ) : field.type === "percent" ? (
                    <PercentField
                      key={field.key}
                      label={field.label}
                      value={values[section.key]?.[field.key] ?? "0"}
                      onChange={(next) =>
                        setField(section.key, field.key, next)
                      }
                      onReset={() => resetField(section.key, field.key)}
                    />
                  ) : field.type === "html" ? (
                    <div key={field.key} className="md:col-span-2">
                      <div className="mb-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => resetField(section.key, field.key)}
                          className="text-[11px] text-ocean underline"
                        >
                          Restaurar
                        </button>
                      </div>
                      <HtmlEditor
                        label={field.label}
                        value={values[section.key]?.[field.key] ?? ""}
                        onChange={(html) =>
                          setField(section.key, field.key, html)
                        }
                      />
                    </div>
                  ) : field.type === "image" ? (
                    <div key={field.key} className="md:col-span-1">
                      <div className="mb-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => resetField(section.key, field.key)}
                          className="text-[11px] text-ocean underline"
                        >
                          Restaurar
                        </button>
                      </div>
                      <ImageUploadField
                        label={field.label}
                        value={values[section.key]?.[field.key] ?? ""}
                        onChange={(url) =>
                          setField(section.key, field.key, url)
                        }
                      />
                    </div>
                  ) : (
                    <label
                      key={field.key}
                      className={`block text-sm ${
                        field.multiline ? "md:col-span-2" : ""
                      }`}
                    >
                      <span className="mb-1 flex items-center justify-between gap-2 font-medium text-navy">
                        <span>{field.label}</span>
                        <button
                          type="button"
                          onClick={() => resetField(section.key, field.key)}
                          className="text-[11px] font-normal text-ocean underline"
                        >
                          Restaurar
                        </button>
                      </span>
                      {field.multiline ? (
                        <textarea
                          rows={4}
                          className="w-full border border-navy/15 bg-off-white px-3 py-2"
                          value={values[section.key]?.[field.key] ?? ""}
                          onChange={(e) =>
                            setField(section.key, field.key, e.target.value)
                          }
                        />
                      ) : (
                        <input
                          className="w-full border border-navy/15 bg-off-white px-3 py-2"
                          value={values[section.key]?.[field.key] ?? ""}
                          onChange={(e) =>
                            setField(section.key, field.key, e.target.value)
                          }
                        />
                      )}
                    </label>
                  ),
                )}
              </div>
            </fieldset>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-navy px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
