import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { ImpactPillars } from "@/components/sections/ImpactPillars";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { SharedSections } from "@/components/sections/SharedSections";
import { getPageCopy, getSharedCopy } from "@/lib/content";
import { resolvePageHero } from "@/lib/content/page-hero";

export const metadata: Metadata = {
  title: "Impacto | Distrito Stella del Mar",
  description:
    "Conozca el potencial económico, laboral, turístico y urbano de Distrito Stella del Mar en Puerto Cortés.",
  alternates: { canonical: "/impacto" },
};

export default async function ImpactPage() {
  const [copy, shared] = await Promise.all([
    getPageCopy("impacto"),
    getSharedCopy(),
  ]);
  const hero = resolvePageHero(copy.pageHero, {
    eyebrow: "Impacto",
    title: "Un proyecto que impulsa ciudad y oportunidades",
    description:
      "Desarrollo económico, empleo, turismo, transformación urbana y calidad de vida para Puerto Cortés.",
    image: "/images/renders-1.jpg",
    imageAlt: "Vista aérea del desarrollo comercial y su contexto",
    imageOpacity: 75,
  });

  return (
    <>
      <PageHero {...hero} />
      <PageHtmlBody copy={copy.htmlBody} />
      <ImpactPillars copy={copy.pillars} />
      <ValueProposition copy={copy.valueProp} />
      <SharedSections pageSlug="impacto" shared={shared} />
    </>
  );
}
