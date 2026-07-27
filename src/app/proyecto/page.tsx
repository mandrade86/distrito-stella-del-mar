import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { SharedSections } from "@/components/sections/SharedSections";
import { getPageCopy, getSharedCopy } from "@/lib/content";
import { resolvePageHero } from "@/lib/content/page-hero";

export const metadata: Metadata = {
  title: "El proyecto | Distrito Stella del Mar",
  description:
    "Conozca la visión y propuesta de valor de Distrito Stella del Mar como nuevo destino urbano de Puerto Cortés.",
  alternates: { canonical: "/proyecto" },
};

export default async function ProjectPage() {
  const [copy, shared] = await Promise.all([
    getPageCopy("proyecto"),
    getSharedCopy(),
  ]);
  const hero = resolvePageHero(copy.pageHero, {
    eyebrow: "El proyecto",
    title: "Una nueva visión de ciudad para Puerto Cortés",
    description:
      "Comercio, servicios, gastronomía, turismo e inversión integrados en un destino urbano con identidad propia.",
    image: "/images/renders/sdm-05.png",
    imageAlt: "Plaza interior de Distrito Stella del Mar",
  });

  return (
    <>
      <PageHero {...hero} />
      <PageHtmlBody copy={copy.htmlBody} />
      <SharedSections pageSlug="proyecto" shared={shared} />
    </>
  );
}
