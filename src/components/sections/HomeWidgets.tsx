import { Fragment } from "react";
import { ProjectIntro } from "@/components/sections/ProjectIntro";
import { WhyPuertoCortes } from "@/components/sections/WhyPuertoCortes";
import { HomeMasterPlan } from "@/components/sections/HomeMasterPlan";
import { HomeImpactStats } from "@/components/sections/HomeImpactStats";
import { AnchorBrands } from "@/components/sections/AnchorBrands";
import { CTABand } from "@/components/sections/CTABand";
import { HomeHtmlBlock } from "@/components/sections/HomeHtmlBlock";
import { HomeInvite } from "@/components/sections/HomeInvite";
import { SectionDivider } from "@/components/ui/SectionDivider";
import type { HomeWidgetData, PageCopy } from "@/lib/content";
import type { SectionCopy } from "@/lib/content/page-registry";
import type { MasterPlanPhase } from "@/data/masterplan";
import { isHtmlHomeWidget } from "@/lib/content/defaults-cms";
import { showsOnPage } from "@/lib/content/shared-pages";

type Props = {
  widgets: HomeWidgetData[];
  shared: PageCopy;
  heroCopy?: SectionCopy;
  phases?: MasterPlanPhase[];
};

function renderWidget(
  widget: HomeWidgetData,
  shared: PageCopy,
  phases: MasterPlanPhase[],
  heroCopy?: SectionCopy,
) {
  if (isHtmlHomeWidget(widget)) {
    return <HomeHtmlBlock label={widget.label} html={widget.html} />;
  }

  switch (widget.widgetKey) {
    case "homeInvite":
      return <HomeInvite copy={{ ...shared.homeInvite, ...heroCopy }} />;
    case "projectCredits":
      // Ahora vive en el Hero (inferior derecha); se ignora como widget.
      return null;
    case "projectIntro":
      return <ProjectIntro copy={shared.projectIntro} />;
    case "whyPuerto":
      return <WhyPuertoCortes copy={shared.whyPuerto} />;
    case "homeMasterPlan":
      return (
        <HomeMasterPlan phases={phases} copy={shared.homeMasterPlan} />
      );
    case "impactStats":
      return <HomeImpactStats copy={shared.impactStats} />;
    case "anchorBrands":
      return <AnchorBrands copy={shared.anchorBrands} />;
    case "ctaBand":
      return <CTABand copy={shared.ctaBand} />;
    default:
      return null;
  }
}

function needsDivider(current: string, next?: string) {
  if (!next) return false;
  const pair = new Set([current, next]);
  return pair.has("projectIntro") && pair.has("anchorBrands");
}

export function HomeWidgets({
  widgets,
  shared,
  heroCopy,
  phases = [],
}: Props) {
  const ordered = [...widgets]
    .filter((w) => w.enabled)
    .filter((w) => {
      if (isHtmlHomeWidget(w)) return true;
      return showsOnPage(shared[w.widgetKey], "home", w.widgetKey);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {ordered.map((widget, index) => {
        const next = ordered[index + 1];
        return (
          <Fragment key={widget.widgetKey}>
            {renderWidget(widget, shared, phases, heroCopy)}
            {needsDivider(widget.widgetKey, next?.widgetKey) ? (
              <SectionDivider />
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
}
