import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/contact";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/proyecto",
    "/master-plan",
    "/tiendas",
    "/impacto",
    "/ubicacion",
    "/novedades",
    "/contacto",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/novedades" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));
}
