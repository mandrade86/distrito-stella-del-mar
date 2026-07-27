"use client";

import Image from "next/image";
import { useState, type ComponentType } from "react";
import {
  Building2,
  Car,
  Expand,
  Layers,
  MapPin,
  Ruler,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Landmark,
  CalendarDays,
  type LucideProps,
} from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/ui/FadeIn";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { cn } from "@/lib/utils";
import {
  masterPlanPhases,
  type MasterPlanTab,
} from "@/data/masterplan";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("master-plan").masterPlan ?? {};

type IconType = ComponentType<LucideProps>;

function highlightIcon(text: string): IconType {
  const t = text.toLowerCase();
  if (
    t.includes("diunsa") ||
    t.includes("xtra") ||
    t.includes("carrion") ||
    t.includes("barato")
  ) {
    return ShoppingBag;
  }
  if (t.includes("m² de proyecto") || /^[\d.,]+\s*m²/.test(t)) return Ruler;
  if (t.includes("espacios comerciales") || t.includes("locales")) return Store;
  if (t.includes("fases")) return Layers;
  if (t.includes("ubicación") || t.includes("ca-13")) return MapPin;
  if (t.includes("autoservicio")) return Car;
  if (t.includes("food") || t.includes("gastronom")) return UtensilsCrossed;
  if (t.includes("renta") || t.includes("evento")) return CalendarDays;
  if (t.includes("financ")) return Landmark;
  if (t.includes("climatizado") || t.includes("centro comercial")) return Building2;
  return Building2;
}

function splitHighlight(text: string) {
  const match = text.match(/^(.+?):\s*(.+)$/);
  if (match) return { label: match[1], value: match[2] };
  const areaMatch = text.match(/^([\d.,]+\s*m²)\s+(.+)$/i);
  if (areaMatch) return { label: areaMatch[2], value: areaMatch[1] };
  const countMatch = text.match(/^(\d+)\s+(.+)$/);
  if (countMatch) return { label: countMatch[2], value: countMatch[1] };
  return { label: text, value: null };
}

type Props = { copy?: SectionCopy };

export function MasterPlan({ copy }: Props) {
  const text = { ...defaults, ...copy };
  const [tab, setTab] = useState<MasterPlanTab>("general");
  const [lightbox, setLightbox] = useState(false);
  const active = masterPlanPhases.find((p) => p.id === tab) ?? masterPlanPhases[0];

  return (
    <section id="master-plan" className="bg-sand section-y">
      <div className="section-pad container-site">
        <FadeIn>
          <SectionTitle
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            titleClassName="text-xl md:text-2xl lg:text-[1.75rem]"
          />
        </FadeIn>

        <div
          role="tablist"
          aria-label="Fases del master plan"
          className="mt-10 flex flex-wrap gap-2"
        >
          {masterPlanPhases.map((phase) => (
            <button
              key={phase.id}
              type="button"
              role="tab"
              id={`master-plan-tab-${phase.id}`}
              aria-controls={`master-plan-panel-${phase.id}`}
              aria-selected={tab === phase.id}
              tabIndex={tab === phase.id ? 0 : -1}
              className={cn(
                "rounded-sm px-4 py-2 text-sm font-medium transition-colors",
                tab === phase.id
                  ? "bg-navy text-white"
                  : "bg-white text-navy hover:bg-white/80",
              )}
              onClick={() => setTab(phase.id)}
              onKeyDown={(event) => {
                const currentIndex = masterPlanPhases.findIndex(
                  (item) => item.id === phase.id,
                );
                let nextIndex = currentIndex;

                if (event.key === "ArrowRight") {
                  nextIndex = (currentIndex + 1) % masterPlanPhases.length;
                } else if (event.key === "ArrowLeft") {
                  nextIndex =
                    (currentIndex - 1 + masterPlanPhases.length) %
                    masterPlanPhases.length;
                } else if (event.key === "Home") {
                  nextIndex = 0;
                } else if (event.key === "End") {
                  nextIndex = masterPlanPhases.length - 1;
                } else {
                  return;
                }

                event.preventDefault();
                const nextPhase = masterPlanPhases[nextIndex];
                setTab(nextPhase.id);
                document
                  .getElementById(`master-plan-tab-${nextPhase.id}`)
                  ?.focus();
              }}
            >
              {phase.label}
            </button>
          ))}
        </div>

        <div
          id={`master-plan-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`master-plan-tab-${active.id}`}
          tabIndex={0}
          className="mt-8 space-y-8"
        >
          <FadeIn className="relative">
            <div
              className="pointer-events-none absolute -inset-3 -z-10 hidden bg-gradient-to-br from-gold/25 via-ocean/10 to-transparent md:block"
              aria-hidden
            />
            <button
              type="button"
              className="group relative block aspect-[4/3] w-full overflow-hidden shadow-[0_28px_70px_rgba(8,47,83,0.28)] ring-1 ring-navy/10 md:aspect-[16/9]"
              onClick={() => setLightbox(true)}
              aria-label="Ampliar imagen del master plan"
            >
              <Image
                src={active.image}
                alt={active.imageAlt}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 1100px"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent"
                aria-hidden
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-sm bg-navy/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition group-hover:bg-navy">
                <Expand className="h-3.5 w-3.5" /> Ampliar
              </span>
            </button>
            <div
              className="pointer-events-none absolute -bottom-3 left-8 h-1.5 w-24 -skew-x-[35deg] bg-gold"
              aria-hidden
            />
          </FadeIn>

          <FadeIn delay={0.08} className="mx-auto max-w-5xl text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mx-auto mb-3 h-1 w-14 -skew-x-[35deg] bg-gold" aria-hidden />
              <h3 className="font-serif text-2xl text-navy md:text-3xl">
                {active.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                {active.description}
              </p>
            </div>
            <ul
              className={cn(
                "mt-8 grid gap-4 text-left sm:grid-cols-2",
                active.highlights.length >= 5 ? "lg:grid-cols-3" : "lg:grid-cols-4",
              )}
            >
              {active.highlights.map((item) => {
                const Icon = highlightIcon(item);
                const { label, value } = splitHighlight(item);
                return (
                  <li
                    key={item}
                    className="flex flex-col items-center gap-3 border border-navy/8 bg-white/70 px-4 py-5 text-center"
                  >
                    <Icon className="h-6 w-6 text-gold" aria-hidden />
                    <span className="min-w-0">
                      {value ? (
                        <>
                          <span className="block font-serif text-xl text-navy md:text-2xl">
                            {value}
                          </span>
                          <span className="mt-1 block text-xs leading-snug text-muted md:text-sm">
                            {label}
                          </span>
                        </>
                      ) : (
                        <span className="block text-sm font-medium leading-snug text-charcoal md:text-base">
                          {label}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        </div>
      </div>

      <ImageLightbox
        open={lightbox}
        items={masterPlanPhases.map((p) => ({
          src: p.image,
          alt: p.imageAlt,
        }))}
        index={masterPlanPhases.findIndex((p) => p.id === tab)}
        onClose={() => setLightbox(false)}
        onChange={(i) => setTab(masterPlanPhases[i].id)}
      />
    </section>
  );
}
