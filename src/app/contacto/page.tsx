import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { Contact } from "@/components/sections/Contact";
import { SharedSections } from "@/components/sections/SharedSections";
import { getPageCopy, getSharedCopy } from "@/lib/content";
import { resolvePageHero } from "@/lib/content/page-hero";

export const metadata: Metadata = {
  title: "Contacto | Distrito Stella del Mar",
  description:
    "Contacto para ventas, arrendamientos, inversionistas, franquicias y renta de espacio para eventos.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactPage() {
  const [copy, shared] = await Promise.all([
    getPageCopy("contacto"),
    getSharedCopy(),
  ]);
  const hero = resolvePageHero(copy.pageHero, {
    eyebrow: "Contacto",
    title: "Conversemos sobre su próxima oportunidad",
    description:
      "Ventas, arrendamientos, inversión, franquicias y eventos en el nuevo destino de Puerto Cortés.",
    image: "/images/renders/sdm-03.png",
    imageAlt: "Espacios comerciales de Distrito Stella del Mar",
  });

  return (
    <>
      <PageHero {...hero} />
      <PageHtmlBody copy={copy.htmlBody} />
      <Contact copy={copy.contact} />
      <SharedSections pageSlug="contacto" shared={shared} />
    </>
  );
}
