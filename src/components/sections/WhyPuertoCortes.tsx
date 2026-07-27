import Image from "next/image";
import {
  Anchor,
  Map,
  Palmtree,
  Route,
  type LucideIcon,
} from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("shared").whyPuerto ?? {};

const ICON_MAP: Record<string, LucideIcon> = {
  anchor: Anchor,
  route: Route,
  palmtree: Palmtree,
  map: Map,
};

type Props = { copy?: SectionCopy };

export function WhyPuertoCortes({ copy }: Props) {
  const text = { ...defaults, ...copy };
  const reasons = ([1, 2, 3, 4] as const)
    .map((n) => {
      const title = copyValue(
        text,
        `reason${n}Title`,
        defaults[`reason${n}Title`] ?? "",
      );
      const body = copyValue(
        text,
        `reason${n}Text`,
        defaults[`reason${n}Text`] ?? "",
      );
      const iconKey = copyValue(
        text,
        `reason${n}Icon`,
        defaults[`reason${n}Icon`] ?? "anchor",
      )
        .trim()
        .toLowerCase();
      return {
        title,
        body,
        icon: ICON_MAP[iconKey] ?? Anchor,
      };
    })
    .filter((r) => r.title || r.body);

  return (
    <section className="overflow-hidden bg-deep-blue">
      <div className="grid lg:min-h-[560px] lg:grid-cols-2 xl:min-h-[640px]">
        <FadeIn className="flex flex-col justify-center px-5 py-14 sm:px-8 md:px-10 lg:py-20 lg:pl-[max(2rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-10">
          <SectionTitle
            light
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
          <p className="mt-6 max-w-xl leading-relaxed text-white/70">
            {copyValue(text, "body", defaults.body)}
          </p>
        </FadeIn>

        <FadeIn
          delay={0.08}
          className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-full"
        >
          <div className="absolute inset-0 overflow-hidden [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]">
            <Image
              src={copyValue(text, "image", defaults.image)}
              alt={copyValue(text, "imageAlt", defaults.imageAlt)}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
          </div>
        </FadeIn>
      </div>

      {reasons.length ? (
        <div className="section-pad container-site pb-16 pt-10 md:pb-20 md:pt-12">
          <Stagger className="grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, body }) => (
              <StaggerItem key={title}>
                <article className="h-full bg-white p-6 md:p-7">
                  <Icon className="h-6 w-6 text-ocean" aria-hidden />
                  <h3 className="mt-5 font-serif text-xl text-navy">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      ) : null}
    </section>
  );
}
