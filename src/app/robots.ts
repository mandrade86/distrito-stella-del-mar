import type { MetadataRoute } from "next";

/**
 * No consulta MySQL en build (en GoDaddy el build a veces no alcanza la BD).
 * El gate real del sitio está en layout + SITE_LIVE / Admin «Sitio en vivo».
 * Aquí: si no es production, o SITE_LIVE=false → noindex.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://distritostelladelmar.com";
  const envLive = process.env.SITE_LIVE?.trim().toLowerCase();
  const forcedPrivate = envLive === "false" || envLive === "0";

  if (!isProduction || forcedPrivate) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
