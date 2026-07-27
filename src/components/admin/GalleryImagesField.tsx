"use client";

import { useRef, useState } from "react";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";

type Props = {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
};

export function GalleryImagesField({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error al subir");
        uploaded.push(String(json.data.url));
      }
      onChange([...value, ...uploaded.filter((u) => !value.includes(u))]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="block text-sm md:col-span-2">
      <span className="mb-1 block font-medium text-navy">{label}</span>
      <div className="space-y-3 border border-navy/15 bg-off-white p-3">
        {value.length ? (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {value.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="overflow-hidden border border-navy/10 bg-white"
              >
                <div className="relative aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1 p-1.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    className="rounded-sm border border-navy/15 px-1.5 py-0.5 text-[10px]"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    className="rounded-sm border border-navy/15 px-1.5 py-0.5 text-[10px]"
                    disabled={index === value.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="ml-auto rounded-sm border border-red-200 px-1.5 py-0.5 text-[10px] text-red-700"
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-24 items-center justify-center border border-dashed border-navy/20 text-xs text-muted">
            Sin fotos en la galería
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-sm bg-navy px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            {uploading ? "Subiendo…" : "Subir fotos"}
          </button>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="rounded-sm border border-navy/20 bg-white px-3 py-1.5 text-xs font-medium text-navy"
          >
            Seleccionar existentes
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
      </div>

      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        multi
        selected={value}
        onSelect={(urls) => {
          onChange([...new Set([...value, ...urls])]);
        }}
      />
    </div>
  );
}
