import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { StoreFloorPlan } from "@/components/sections/StoreFloorPlan";
import { SharedSections } from "@/components/sections/SharedSections";
import { getPageCopy, getSharedCopy, getStores } from "@/lib/content";
import { resolvePageHero } from "@/lib/content/page-hero";

export const metadata: Metadata = {
  title: "Tiendas | Distrito Stella del Mar",
  description:
    "Explore el plano del centro y consulte teléfono y horarios de las tiendas de Distrito Stella del Mar.",
  alternates: { canonical: "/tiendas" },
};

export default async function StoresPage() {
  const [stores, copy, shared] = await Promise.all([
    getStores(),
    getPageCopy("tiendas"),
    getSharedCopy(),
  ]);
  const hero = resolvePageHero(copy.pageHero, {
    eyebrow: "Tiendas",
    title: "Directorio del distrito",
    description:
      "Consulte el plano interactivo para ubicar locales y conocer teléfonos y horarios de atención.",
    image: "/images/renders/sdm-05.png",
    imageAlt: "Plaza interior de Distrito Stella del Mar",
  });

  return (
    <>
      <PageHero {...hero} />
      <PageHtmlBody copy={copy.htmlBody} />
      <StoreFloorPlan stores={stores} copy={copy.floorPlan} />
      <SharedSections pageSlug="tiendas" shared={shared} />
    </>
  );
}
