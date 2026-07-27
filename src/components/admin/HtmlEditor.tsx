"use client";

import { useRef, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Props = {
  label: string;
  value: string;
  onChange: (html: string) => void;
  rows?: number;
};

export function HtmlEditor({ label, value, onChange, rows = 16 }: Props) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [showImage, setShowImage] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  function wrap(tag: string, attrs = "") {
    const el = taRef.current;
    if (!el) {
      onChange(`${value}<${tag}${attrs}></${tag}>`);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "texto";
    const open = attrs ? `<${tag}${attrs}>` : `<${tag}>`;
    const next =
      value.slice(0, start) + open + selected + `</${tag}>` + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + open.length, start + open.length + selected.length);
    });
  }

  function insertImage(url: string) {
    if (!url) return;
    const snippet = `\n<p><img src="${url}" alt="" /></p>\n`;
    const el = taRef.current;
    if (!el) {
      onChange(value + snippet);
      return;
    }
    const pos = el.selectionStart;
    onChange(value.slice(0, pos) + snippet + value.slice(pos));
    setShowImage(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-navy">{label}</span>
        <div className="flex gap-1 text-xs">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`rounded-sm px-2 py-1 ${
              tab === "edit" ? "bg-navy text-white" : "border border-navy/15"
            }`}
          >
            HTML
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-sm px-2 py-1 ${
              tab === "preview" ? "bg-navy text-white" : "border border-navy/15"
            }`}
          >
            Vista previa
          </button>
        </div>
      </div>

      {tab === "edit" ? (
        <>
          <div className="flex flex-wrap gap-1">
            {(
              [
                ["p", "P"],
                ["h2", "H2"],
                ["h3", "H3"],
                ["strong", "B"],
                ["em", "I"],
                ["ul", "Lista"],
                ["a", "Link"],
              ] as const
            ).map(([tag, labelBtn]) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  wrap(tag, tag === "a" ? ' href="#" target="_blank" rel="noopener"' : "")
                }
                className="rounded-sm border border-navy/15 bg-white px-2 py-1 text-xs font-medium text-navy"
              >
                {labelBtn}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowImage((v) => !v)}
              className="rounded-sm border border-navy/15 bg-white px-2 py-1 text-xs font-medium text-navy"
            >
              Imagen
            </button>
          </div>
          {showImage ? (
            <ImageUploadField
              label="Insertar imagen"
              value=""
              onChange={insertImage}
            />
          ) : null}
          <textarea
            ref={taRef}
            rows={rows}
            spellCheck={false}
            className="w-full border border-navy/15 bg-off-white px-3 py-2 font-mono text-xs leading-relaxed"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="<p>Escriba HTML aquí…</p>"
          />
        </>
      ) : (
        <div
          className="cms-html min-h-48 border border-navy/10 bg-white p-4"
          dangerouslySetInnerHTML={{ __html: value || "<p class='text-muted'>Sin contenido</p>" }}
        />
      )}
      <p className="text-[11px] text-muted">
        Puede usar HTML (párrafos, títulos, listas, enlaces, imágenes). Scripts no
        permitidos en el sitio público.
      </p>
    </div>
  );
}
