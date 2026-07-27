import { ProjectIntro } from "@/components/sections/ProjectIntro";
import { Experiences } from "@/components/sections/Experiences";
import { WhyPuertoCortes } from "@/components/sections/WhyPuertoCortes";
import { AnchorBrands } from "@/components/sections/AnchorBrands";
import { HomeImpactStats } from "@/components/sections/HomeImpactStats";
import { CTABand } from "@/components/sections/CTABand";
import type { PageCopy } from "@/lib/content";
import { showsOnPage } from "@/lib/content/shared-pages";

type Props = {
  pageSlug: string;
  shared: PageCopy;
  /** Solo renderiza estas claves (si se omite, usa el orden completo). */
  only?: string[];
  /** Omite estas claves (útil si ya se renderizaron en otro lugar). */
  except?: string[];
};

const ORDER = [
  "projectIntro",
  "experiences",
  "whyPuerto",
  "anchorBrands",
  "impactStats",
  "ctaBand",
] as const;

/**
 * Secciones compartidas habilitadas para una página (según CMS → Mostrar en páginas).
 * Nota: homeMasterPlan solo se usa en Home vía Widgets.
 */
export function SharedSections({ pageSlug, shared, only, except }: Props) {
  const skip = new Set(except ?? []);
  const keys = (only ?? [...ORDER]).filter((key) => !skip.has(key));

  return (
    <>
      {keys.map((key) => {
        if (!showsOnPage(shared[key], pageSlug, key)) return null;
        switch (key) {
          case "projectIntro":
            return <ProjectIntro key={key} copy={shared.projectIntro} />;
          case "experiences":
            return <Experiences key={key} copy={shared.experiences} />;
          case "whyPuerto":
            return <WhyPuertoCortes key={key} copy={shared.whyPuerto} />;
          case "anchorBrands":
            return <AnchorBrands key={key} copy={shared.anchorBrands} />;
          case "impactStats":
            return <HomeImpactStats key={key} copy={shared.impactStats} />;
          case "ctaBand":
            return <CTABand key={key} copy={shared.ctaBand} />;
          default:
            return null;
        }
      })}
    </>
  );
}
