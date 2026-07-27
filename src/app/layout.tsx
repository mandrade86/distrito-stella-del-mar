import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { siteConfig } from "@/config/contact";
import { getNavItems, getPublishedCmsPages, getPublicContact } from "@/lib/content";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const title =
  "Distrito Stella del Mar | Nuevo destino comercial en Puerto Cortés";
const description =
  "Conozca Distrito Stella del Mar, un nuevo desarrollo comercial en Puerto Cortés con locales, restaurantes, servicios financieros, renta de espacio para eventos y oportunidades de inversión.";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title,
  description,
  keywords: [
    "Distrito Stella del Mar",
    "Locales comerciales Puerto Cortés",
    "Centro comercial Puerto Cortés",
    "Inversión comercial Honduras",
    "Alquiler de locales Puerto Cortés",
    "Franquicias Honduras",
    "Renta de espacio para eventos Puerto Cortés",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_HN",
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    title,
    description,
    images: [
      {
        url: "/images/renders/sdm-01.png",
        width: 1200,
        height: 630,
        alt: "Distrito Stella del Mar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/renders/sdm-01.png"],
  },
  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ShoppingCenter",
  name: siteConfig.name,
  description: siteConfig.shortDescription,
  url: siteConfig.siteUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: "CA-13, Barrio El Porvenir",
    addressLocality: "Puerto Cortés",
    addressCountry: "HN",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navItems, cmsPages, contact] = await Promise.all([
    getNavItems(),
    getPublishedCmsPages(),
    getPublicContact(),
  ]);

  const navLinks = [
    ...navItems
      .filter((item) => item.enabled)
      .map((item) => ({ href: item.href, label: item.label })),
    ...cmsPages
      .filter((page) => page.showInNav)
      .map((page) => ({
        href: `/pagina/${page.slug}`,
        label: page.navLabel || page.title,
      })),
  ];

  return (
    <html lang="es">
      <body
        className={`${manrope.variable} ${playfair.variable} font-sans bg-off-white text-charcoal antialiased`}
      >
        <a
          href="#contenido-principal"
          className="fixed left-4 top-4 z-[100] -translate-y-24 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-md transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteChrome navLinks={navLinks} contact={contact}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
