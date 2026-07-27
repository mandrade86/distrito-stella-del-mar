"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FadeIn } from "@/components/ui/FadeIn";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { cn } from "@/lib/utils";
import type { MasterPlanPhase } from "@/data/masterplan";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("shared").homeMasterPlan ?? {};

type Props = {
  phases: MasterPlanPhase[];
  copy?: SectionCopy;
};

function phaseGallery(phase: MasterPlanPhase): string[] {
  const items = phase.gallery?.length
    ? phase.gallery
    : [phase.image].filter(Boolean);
  return [...new Set(items)];
}

export function HomeMasterPlan({ phases, copy }: Props) {
  const text = { ...defaults, ...copy };
  const reduce = useReducedMotion();
  const tabs = phases.length ? phases : [];
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "general");
  const active = tabs.find((p) => p.id === activeId) ?? tabs[0];
  const gallery = active ? phaseGallery(active) : [];
  const [activeImage, setActiveImage] = useState(gallery[0] ?? "");
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const phase = phases.find((p) => p.id === activeId) ?? phases[0];
    const next = phase ? phaseGallery(phase) : [];
    setActiveImage(next[0] ?? "");
  }, [activeId, phases]);

  function goGallery(dir: -1 | 1) {
    if (gallery.length < 2) return;
    const current = Math.max(0, gallery.indexOf(activeImage));
    const next = (current + dir + gallery.length) % gallery.length;
    setActiveImage(gallery[next]);
  }

  if (!active) return null;

  const lightboxItems = gallery.map((src) => ({
    src,
    alt: active.imageAlt,
  }));
  const lightboxIndex = Math.max(0, gallery.indexOf(activeImage));
  const currentIndex = Math.max(0, gallery.indexOf(activeImage));

  return (
    <section
      id="master-plan-home"
      className="relative bg-off-white pt-6 pb-12 text-navy md:pt-8 md:pb-16 lg:pt-2 lg:pb-20"
    >
      <div className="relative section-pad container-site">
        <FadeIn className="text-center">
          <div className="mb-4 flex justify-center">
            <span className="relative inline-flex h-10 w-10 items-center justify-center">
              <Image
                src="/images/logos/icon-star-color.png"
                alt=""
                width={40}
                height={40}
                className="object-contain"
              />
            </span>
          </div>
          <h2 className="font-serif text-3xl text-navy md:text-4xl">
            {copyValue(text, "title", defaults.title)}
          </h2>
          {/* Línea de ola bajo el título (marca + mar) */}
          <svg
            className="mx-auto mt-4 h-3 w-28 text-gold"
            viewBox="0 0 112 12"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 7c10-5 18-5 28 0s18 5 28 0 18-5 28 0 16 5 24 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="sea-shimmer-line"
            />
            <path
              d="M2 10c10-4 18-4 28 0s18 4 28 0 18-4 28 0 16 4 24 0"
              stroke="rgba(22,138,181,0.55)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </FadeIn>
      </div>

      <div className="relative mt-6 md:mt-8">
        <div className="relative mx-auto max-w-[1600px] px-3 sm:px-4 lg:px-6">
          <div className="relative overflow-hidden shadow-[0_28px_80px_rgba(8,47,83,0.18)] ring-1 ring-navy/10">
            {/* Marco con acento ola/estrella */}
            <span
              className="pointer-events-none absolute left-0 top-0 z-30 h-16 w-16 border-l-2 border-t-2 border-gold/70"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-0 right-0 z-30 h-16 w-16 border-b-2 border-r-2 border-turquoise/60"
              aria-hidden
            />

            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="relative block w-full bg-deep-blue text-left"
              aria-label="Ampliar imagen"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active.id}-${activeImage}`}
                  initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[4/3] w-full sm:aspect-[16/10] md:aspect-[21/9] md:min-h-[420px] lg:min-h-[520px]"
                >
                  <Image
                    src={activeImage || active.image}
                    alt={active.imageAlt}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-navy/15"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/70 to-transparent"
                    aria-hidden
                  />
                </motion.div>
              </AnimatePresence>
            </button>

            <div
              role="tablist"
              aria-label="Fases del master plan"
              className="absolute bottom-3 left-3 z-20 flex max-w-[calc(100%-5rem)] gap-2 sm:bottom-5 sm:left-5 sm:max-w-none sm:flex-col md:top-5 md:bottom-auto"
            >
              {tabs.map((phase) => {
                const selected = phase.id === active.id;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(phase.id)}
                    className={cn(
                      "relative h-16 w-24 overflow-hidden transition sm:h-20 sm:w-28 md:h-[5.5rem] md:w-32",
                      selected
                        ? "ring-2 ring-gold opacity-100"
                        : "opacity-65 ring-1 ring-white/30 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={phase.image}
                      alt={phase.imageAlt}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                    <span
                      className={cn(
                        "absolute inset-0",
                        selected ? "bg-navy/10" : "bg-navy/50",
                      )}
                      aria-hidden
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-navy/70 px-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white sm:text-[10px]">
                      {phase.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold md:flex">
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-turquoise" />
              {active.label}
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-turquoise" />
            </p>

            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => goGallery(-1)}
                  className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/95 text-navy shadow-lg transition hover:bg-gold sm:left-4 md:h-12 md:w-12"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goGallery(1)}
                  className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/95 text-navy shadow-lg transition hover:bg-gold sm:right-4 md:h-12 md:w-12"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <p className="pointer-events-none absolute bottom-4 right-4 z-20 bg-navy/85 px-3 py-1.5 text-xs font-medium text-white">
                  {currentIndex + 1} / {gallery.length}
                </p>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative section-pad container-site mt-8 md:mt-10">
        <FadeIn
          delay={0.08}
          className="relative flex flex-col items-center justify-between gap-5 overflow-hidden border border-navy/10 bg-navy px-5 py-6 text-white md:flex-row md:px-8 md:py-7"
        >
          <span
            className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 opacity-20"
            aria-hidden
          >
            <Image
              src="/images/logos/icon-star-white.png"
              alt=""
              width={64}
              height={64}
              className="object-contain"
            />
          </span>
          <p className="relative max-w-xl text-center font-serif text-xl text-white md:text-left md:text-2xl">
            {copyValue(text, "ctaTitle", defaults.ctaTitle)}
          </p>
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <PrimaryButton
              href="/contacto?interes=Inversi%C3%B3n"
              variant="gold"
              size="lg"
            >
              {copyValue(text, "ctaPrimary", defaults.ctaPrimary)}
            </PrimaryButton>
            <PrimaryButton href="/master-plan" variant="secondary" size="lg">
              {copyValue(text, "ctaSecondary", defaults.ctaSecondary)}
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>

      <ImageLightbox
        open={lightbox}
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightbox(false)}
        onChange={(i) => setActiveImage(gallery[i] ?? activeImage)}
      />
    </section>
  );
}
