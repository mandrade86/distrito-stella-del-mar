import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://distritostelladelmar.com";

  if (!isProduction) {
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
