"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Si se pasa, permite selección múltiple y confirma con las URLs marcadas. */
  multi?: boolean;
  selected?: string[];
  onSelect: (urls: string[]) => void;
};

export function MediaLibraryModal({
  open,
  onClose,
  multi = false,
  selected = [],
  onSelect,
}: Props) {
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>(selected);

  useEffect(() => {
    if (!open) return;
    setPicked(selected);
    setQuery("");
    setLoading(true);
    setError("");
    void fetch("/api/admin/media")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "No se pudo cargar");
        setUrls((json.data?.urls as string[]) ?? []);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar medios"),
      )
      .finally(() => setLoading(false));
    // Solo al abrir el modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const filtered = query.trim()
    ? urls.filter((u) => u.toLowerCase().includes(query.trim().toLowerCase()))
    : urls;

  function toggle(url: string) {
    if (!multi) {
      onSelect([url]);
      onClose();
      return;
    }
    setPicked((prev) =>
      prev.includes(url) ? prev.filter((x) => x !== url) : [...prev, url],
    );
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Biblioteca de imágenes"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 px-4 py-3">
          <h3 className="font-serif text-xl text-navy">
            {multi ? "Seleccionar fotos existentes" : "Seleccionar imagen"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-navy/20 px-3 py-1.5 text-xs"
          >
            Cerrar
          </button>
        </div>

        <div className="border-b border-navy/10 px-4 py-3">
          <input
            type="search"
            placeholder="Buscar por ruta…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-navy/15 bg-off-white px-3 py-2 text-sm"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-muted">Cargando imágenes…</p>
          ) : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {!loading && !error && filtered.length === 0 ? (
            <p className="text-sm text-muted">No hay imágenes disponibles.</p>
          ) : null}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {filtered.map((url) => {
              const active = picked.includes(url);
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => toggle(url)}
                  title={url}
                  className={`relative aspect-square overflow-hidden border bg-off-white transition ${
                    active
                      ? "border-gold ring-2 ring-gold"
                      : "border-navy/10 hover:border-navy/40"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {active ? (
                    <span className="absolute right-1 top-1 rounded-sm bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                      ✓
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {multi ? (
          <div className="flex items-center justify-between gap-3 border-t border-navy/10 px-4 py-3">
            <p className="text-xs text-muted">{picked.length} seleccionada(s)</p>
            <button
              type="button"
              onClick={() => {
                onSelect(picked);
                onClose();
              }}
              className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
            >
              Agregar seleccionadas
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
