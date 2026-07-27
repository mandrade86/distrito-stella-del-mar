import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { Location } from "@/components/sections/Location";
import { SharedSections } from "@/components/sections/SharedSections";
import { getPageCopy, getSharedCopy } from "@/lib/content";
import { resolvePageHero } from "@/lib/content/page-hero";

export const metadata: Metadata = {
  title: "Ubicación | Distrito Stella del Mar",
  description:
    "Ubicación estratégica sobre la CA-13 en Barrio El Porvenir, Puerto Cortés, Honduras.",
  alternates: { canonical: "/ubicacion" },
};

export default async function LocationPage() {
  const [copy, shared] = await Promise.all([
    getPageCopy("ubicacion"),
    getSharedCopy(),
  ]);
  const hero = resolvePageHero(copy.pageHero, {
    eyebrow: "Ubicación",
    title: "Conectado con el crecimiento de Puerto Cortés",
    description:
      "Sobre la CA-13, cerca del puerto, la playa, residenciales, instituciones y las principales conexiones regionales.",
    image: "/images/renders/sdm-18.jpg",
    imageAlt: "Vista aérea del entorno de Distrito Stella del Mar",
  });

  return (
    <>
      <PageHero {...hero} />
      <PageHtmlBody copy={copy.htmlBody} />
      <Location copy={copy.location} />
      <SharedSections pageSlug="ubicacion" shared={shared} />
    </>
  );
}
