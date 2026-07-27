"use client";

import { useRef, useState } from "react";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export function ImageUploadField({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al subir");
      onChange(String(json.data.url));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Suelte un archivo de imagen (JPG, PNG, WebP o GIF).");
      return;
    }
    void uploadFile(file);
  }

  return (
    <div className="block text-sm md:col-span-1">
      <span className="mb-1 block font-medium text-navy">{label}</span>
      <div
        className={cn(
          "space-y-2 border bg-off-white p-3 transition",
          dragOver ? "border-ocean ring-1 ring-ocean/40" : "border-navy/15",
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setDragOver(false);
        }}
        onDrop={onDrop}
      >
        {value ? (
          <div className="flex h-28 items-center justify-center overflow-hidden border border-navy/10 bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="flex h-28 flex-col items-center justify-center gap-1 border border-dashed border-navy/20 px-3 text-center text-xs text-muted">
            <span>{dragOver ? "Suelte la imagen aquí" : "Sin imagen"}</span>
            <span className="text-[10px] text-muted/80">
              Arrastre una imagen o use los botones
            </span>
          </div>
        )}
        <input
          className="w-full border border-navy/15 bg-white px-3 py-2 text-xs"
          placeholder="/images/... o URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-sm bg-navy px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            {uploading ? "Subiendo…" : "Subir imagen"}
          </button>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="rounded-sm border border-navy/20 bg-white px-3 py-1.5 text-xs font-medium text-navy"
          >
            Seleccionar existente
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-sm border border-navy/20 px-3 py-1.5 text-xs"
            >
              Quitar
            </button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onFileChange}
        />
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
      </div>

      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        selected={value ? [value] : []}
        onSelect={(urls) => {
          if (urls[0]) onChange(urls[0]);
        }}
      />
    </div>
  );
}
