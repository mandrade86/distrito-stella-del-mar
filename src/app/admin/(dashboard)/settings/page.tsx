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
  const [siteLive, setSiteLive] = useState(false);
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
      const liveRaw = (map.siteLive ?? "false").toLowerCase();
      setSiteLive(liveRaw === "true" || liveRaw === "1" || liveRaw === "yes");
      setSettings(map);
    })();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    const payload = {
      ...settings,
      siteLive: siteLive ? "true" : "false",
    };
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: payload }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "No se pudo guardar");
      return;
    }
    setMessage(
      siteLive
        ? "Ajustes guardados. El sitio está en vivo para el público."
        : "Ajustes guardados. El sitio solo es visible para usuarios logueados.",
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-navy">Ajustes del sitio</h1>

      <form onSubmit={save} className="max-w-2xl space-y-5">
        <div className="border border-navy/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium text-navy">Sitio en vivo</p>
              <p className="mt-1 text-sm text-muted">
                Si está apagado, solo quienes inicien sesión en{" "}
                <code className="text-xs">/admin</code> verán el sitio. El
                público verá una pantalla de “próximamente”.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={siteLive}
              onClick={() => setSiteLive((v) => !v)}
              className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                siteLive ? "bg-ocean" : "bg-navy/20"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                  siteLive ? "left-7" : "left-1"
                }`}
              />
              <span className="sr-only">
                {siteLive ? "Sitio en vivo" : "Sitio privado"}
              </span>
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">
            Estado:{" "}
            <strong className="text-navy">
              {siteLive ? "Público (en vivo)" : "Solo equipo logueado"}
            </strong>
            . Opcional en el servidor:{" "}
            <code className="text-[11px]">SITE_LIVE=true|false</code> fuerza el
            modo sin pasar por la base de datos.
          </p>
        </div>

        <div className="space-y-3 border border-navy/10 bg-white p-5">
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
        </div>

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
