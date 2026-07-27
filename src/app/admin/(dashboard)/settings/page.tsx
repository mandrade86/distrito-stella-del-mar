"use client";

import { useEffect, useState } from "react";

const KEYS = [
  "footerText",
  "addressLine",
  "contactEmail",
  "contactPhone",
  "whatsapp",
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "privacyUrl",
  "termsUrl",
  "mapsUrl",
  "mapLat",
  "mapLng",
] as const;

const LABELS: Record<(typeof KEYS)[number], string> = {
  footerText: "Texto del footer (descripción)",
  addressLine: "Dirección (footer / contacto)",
  contactEmail: "Correo de contacto",
  contactPhone: "Teléfono",
  whatsapp: "WhatsApp (número)",
  facebook: "Facebook (URL)",
  instagram: "Instagram (URL)",
  linkedin: "LinkedIn (URL)",
  tiktok: "TikTok (URL)",
  privacyUrl: "URL Política de privacidad",
  termsUrl: "URL Términos y condiciones",
  mapsUrl: "Google Maps (URL)",
  mapLat: "Latitud",
  mapLng: "Longitud",
};

const MULTILINE = new Set<string>(["footerText", "addressLine"]);

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "No se pudieron cargar ajustes");
        return;
      }
      const map: Record<string, string> = {};
      for (const row of json.data ?? []) {
        map[row.key] = row.value;
      }
      for (const key of KEYS) {
        if (!(key in map)) map[key] = "";
      }
      setSettings(map);
    })();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "No se pudo guardar");
      return;
    }
    setMessage("Ajustes guardados.");
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-navy">Ajustes del sitio</h1>
      <form onSubmit={save} className="max-w-2xl space-y-3 border border-navy/10 bg-white p-5">
        {KEYS.map((key) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium text-navy">
              {LABELS[key]}
            </span>
            {MULTILINE.has(key) ? (
              <textarea
                rows={3}
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={settings[key] ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            ) : (
              <input
                className="w-full border border-navy/15 bg-off-white px-3 py-2"
                value={settings[key] ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            )}
          </label>
        ))}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? <p className="text-sm text-ocean">{message}</p> : null}
        <button
          type="submit"
          className="rounded-sm bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
