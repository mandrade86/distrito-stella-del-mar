"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/me");
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "No se pudo cargar el dashboard");
        return;
      }
      setCounts(json.data.counts);
    })();
  }, []);

  const cards = [
    ["pages", "Páginas del sitio", "/admin/pages"],
    ["cmsPages", "Páginas extra (HTML)", "/admin/cms-pages"],
    ["blog", "Novedades", "/admin/blog"],
    ["slides", "Hero slides", "/admin/slides"],
    ["stores", "Tiendas", "/admin/stores"],
    ["spaces", "Locales", "/admin/spaces"],
    ["gallery", "Galería", "/admin/gallery"],
    ["brands", "Marcas", "/admin/brands"],
    ["phases", "Master Plan", "/admin/master-plan"],
    ["leads", "Contactos", "/admin/leads"],
  ] as const;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-navy">Dashboard</h1>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([key, label, href]) => (
          <Link
            key={key}
            href={href}
            className="border border-navy/10 bg-white p-5 transition hover:border-ocean/40"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ocean">
              {label}
            </p>
            <p className="mt-3 font-serif text-4xl text-navy">
              {counts ? counts[key] ?? 0 : "—"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
