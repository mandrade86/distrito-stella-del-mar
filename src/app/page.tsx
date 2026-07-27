import { Hero } from "@/components/sections/Hero";
import { PageHtmlBody } from "@/components/sections/PageHtmlBody";
import { HomeWidgets } from "@/components/sections/HomeWidgets";
import {
  getHeroSlides,
  getHomeWidgets,
  getMasterPlanPhases,
  getPageCopy,
  getSharedCopy,
} from "@/lib/content";

export default async function HomePage() {
  const [slides, copy, shared, widgets, phases] = await Promise.all([
    getHeroSlides(),
    getPageCopy("home"),
    getSharedCopy(),
    getHomeWidgets(),
    getMasterPlanPhases(),
  ]);

  return (
    <>
      <Hero
        slides={slides}
        copy={copy.hero}
        credits={shared.projectCredits}
      />
      <HomeWidgets
        widgets={widgets}
        shared={shared}
        heroCopy={copy.hero}
        phases={phases}
      />
      <PageHtmlBody copy={copy.htmlBody} />
    </>
  );
}
