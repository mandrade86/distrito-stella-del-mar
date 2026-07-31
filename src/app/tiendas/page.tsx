import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { StoreFloorPlan } from "@/components/sections/StoreFloorPlan";
import { SharedSections } from "@/components/sections/SharedSections";
import {
  getFloorPlanLevels,
  getPageCopy,
  getPublicContact,
  getSharedCopy,
  getStores,
} from "@/lib/content";
import { resolvePageHero } from "@/lib/content/page-hero";

export const metadata: Metadata = {
  title: "Tiendas | Distrito Stella del Mar",
  description:
    "Explore el plano del centro y consulte disponibilidad, teléfono y horarios de las tiendas de Distrito Stella del Mar.",
  alternates: { canonical: "/tiendas" },
};

export default async function StoresPage() {
  const [stores, levels, copy, shared, contact] = await Promise.all([
    getStores(),
    getFloorPlanLevels(),
    getPageCopy("tiendas"),
    getSharedCopy(),
    getPublicContact(),
  ]);
  const hero = resolvePageHero(copy.pageHero, {
    eyebrow: "Tiendas",
    title: "Directorio del distrito",
    description:
      "Consulte el plano interactivo por nivel: disponibles, reservados y ocupados.",
    image: "/images/renders/sdm-05.png",
    imageAlt: "Plaza interior de Distrito Stella del Mar",
  });

  return (
    <>
      <PageHero {...hero} />
      <PageHtmlBody copy={copy.htmlBody} />
      <StoreFloorPlan
        stores={stores}
        levels={levels}
        copy={copy.floorPlan}
        whatsapp={contact.whatsapp}
      />
      <SharedSections pageSlug="tiendas" shared={shared} />
    </>
  );
}
