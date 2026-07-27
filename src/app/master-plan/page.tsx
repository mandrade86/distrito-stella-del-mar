import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { MasterPlan } from "@/components/sections/MasterPlan";
import { OpportunityTypes } from "@/components/sections/OpportunityTypes";
import { AnchorBrands } from "@/components/sections/AnchorBrands";
import { CommercialSpaces } from "@/components/sections/CommercialSpaces";
import { ConventionCenter } from "@/components/sections/ConventionCenter";
import { VirtualTour } from "@/components/sections/VirtualTour";
import { SharedSections } from "@/components/sections/SharedSections";
import {
  getFeaturedSpaces,
  getPageCopy,
  getSharedCopy,
  getSpaces,
} from "@/lib/content";
import { resolvePageHero } from "@/lib/content/page-hero";
import { showsOnPage } from "@/lib/content/shared-pages";

export const metadata: Metadata = {
  title: "Master Plan y oportunidades | Distrito Stella del Mar",
  description:
    "Explore las fases del master plan, formatos comerciales, anclas y espacios disponibles en Distrito Stella del Mar.",
  alternates: { canonical: "/master-plan" },
};

export default async function MasterPlanPage() {
  const [spaces, featuredSpaces, copy, shared] = await Promise.all([
    getSpaces(),
    getFeaturedSpaces(),
    getPageCopy("master-plan"),
    getSharedCopy(),
  ]);
  const hero = resolvePageHero(copy.pageHero, {
    eyebrow: "Master Plan",
    title: "Un desarrollo diseñado para evolucionar",
    description:
      "Dos fases complementarias articulan anclas, plaza abierta, centro climatizado, gastronomía, servicios y renta de espacio para eventos.",
    image: "/images/masterplan/overview.jpg",
    imageAlt: "Vista aérea del master plan de Distrito Stella del Mar",
  });

  return (
    <>
      <PageHero {...hero} />
      <PageHtmlBody copy={copy.htmlBody} />
      <MasterPlan copy={copy.masterPlan} />
      <OpportunityTypes copy={copy.opportunityTypes} />
      {showsOnPage(shared.anchorBrands, "master-plan", "anchorBrands") ? (
        <AnchorBrands copy={shared.anchorBrands} />
      ) : null}
      <CommercialSpaces
        spaces={spaces}
        featuredSpaces={featuredSpaces}
        copy={copy.commercialSpaces}
      />
      <ConventionCenter copy={copy.convention} />
      <VirtualTour copy={copy.virtualTour} />
      <SharedSections
        pageSlug="master-plan"
        shared={shared}
        except={["anchorBrands"]}
      />
    </>
  );
}
