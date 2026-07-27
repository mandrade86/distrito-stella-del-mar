/**
 * Contacto y enlaces públicos.
 * Preferir variables NEXT_PUBLIC_* en .env.local.
 * Valores PENDING_* = pendiente de configuración (no inventar datos reales).
 */

const env = (key: string) => process.env[key]?.trim() || "";

export const siteConfig = {
  name: "Distrito Stella del Mar",
  tagline: "Más que un distrito comercial… un nuevo destino en Puerto Cortés.",
  shortDescription:
    "Desarrollo comercial moderno en Puerto Cortés con locales, gastronomía, servicios financieros, entretenimiento y renta de espacio para eventos.",
  addressLine:
    "CA-13, Barrio El Porvenir, frente al Colegio Franklin Delano Roosevelt, Puerto Cortés, Honduras",
  siteUrl: env("NEXT_PUBLIC_SITE_URL") || "https://distritostelladelmar.com",
  email:
    env("NEXT_PUBLIC_CONTACT_EMAIL") || "info@distritostelladelmar.com",
  phone: env("NEXT_PUBLIC_CONTACT_PHONE") || "PENDING_PHONE",
  whatsapp: env("NEXT_PUBLIC_WHATSAPP_NUMBER") || "PENDING_WHATSAPP",
  mapsUrl:
    env("NEXT_PUBLIC_MAPS_URL") ||
    "https://www.google.com/maps?q=15.81699333534756,-87.93110169660831",
  mapLat: env("NEXT_PUBLIC_MAP_LAT") || "15.81699333534756",
  mapLng: env("NEXT_PUBLIC_MAP_LNG") || "-87.93110169660831",
  social: {
    facebook: env("NEXT_PUBLIC_FACEBOOK_URL") || "PENDING_FACEBOOK",
    instagram: env("NEXT_PUBLIC_INSTAGRAM_URL") || "PENDING_INSTAGRAM",
    linkedin: env("NEXT_PUBLIC_LINKEDIN_URL") || "PENDING_LINKEDIN",
    tiktok: env("NEXT_PUBLIC_TIKTOK_URL") || "PENDING_TIKTOK",
  },
} as const;

export function isConfigured(value: string) {
  return Boolean(value) && !value.startsWith("PENDING_");
}

export function whatsappHref(message?: string, numberOverride?: string) {
  const number = numberOverride ?? siteConfig.whatsapp;
  if (!isConfigured(number)) return null;
  const digits = number.replace(/\D/g, "");
  const text =
    message ??
    "Hola, deseo recibir información sobre los espacios disponibles en Distrito Stella del Mar.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
