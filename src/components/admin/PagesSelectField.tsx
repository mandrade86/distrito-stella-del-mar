"use client";

import {
  SHARED_SECTION_PAGE_OPTIONS,
  parseShowOnPages,
  serializeShowOnPages,
} from "@/lib/content/shared-pages";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function PagesSelectField({ label, value, onChange }: Props) {
  const selected = new Set(parseShowOnPages(value));

  function toggle(slug: string) {
    const next = new Set(selected);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    const ordered = SHARED_SECTION_PAGE_OPTIONS.map((p) => p.slug).filter((s) =>
      next.has(s),
    );
    onChange(serializeShowOnPages(ordered));
  }

  return (
    <div className="md:col-span-2">
      <p className="mb-2 text-sm font-medium text-navy">{label}</p>
      <p className="mb-3 text-xs text-muted">
        Elija en qué páginas del sitio se muestra esta sección. En Inicio también
        debe estar visible en Widgets Home.
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {SHARED_SECTION_PAGE_OPTIONS.map((page) => {
          const checked = selected.has(page.slug);
          return (
            <label
              key={page.slug}
              className={`flex cursor-pointer items-center gap-2 border px-3 py-2 text-sm ${
                checked
                  ? "border-ocean/40 bg-ocean/5 text-navy"
                  : "border-navy/15 bg-off-white text-muted"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(page.slug)}
              />
              <span>{page.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
