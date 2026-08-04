import type { MetadataRoute } from "next";
import { isSiteLive } from "@/lib/site-access";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://distritostelladelmar.com";
  const live = await isSiteLive();

  if (!isProduction || !live) {
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
