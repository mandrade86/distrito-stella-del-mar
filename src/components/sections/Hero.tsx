"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Building2, Layers3, MapPinned, Ruler } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ProjectCredits } from "@/components/sections/ProjectCredits";
import type { HeroSlideData } from "@/lib/content";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";
import { parsePercent } from "@/lib/content/page-hero";

const fallbackSlides: HeroSlideData[] = [
  {
    src: "/images/renders-1.jpg",
    alt: "Vista aérea del desarrollo de Distrito Stella del Mar",
  },
  {
    src: "/images/renders/sdm-01.png",
    alt: "Fachada principal de Distrito Stella del Mar",
  },
  {
    src: "/images/renders/sdm-03.png",
    alt: "Acceso peatonal y plaza comercial de Distrito Stella del Mar",
  },
  {
    src: "/images/renders/sdm-05.png",
    alt: "Experiencia de gastronomía y comercio en Distrito Stella del Mar",
  },
];

const metricIcons = [Building2, Ruler, Layers3, MapPinned] as const;

const heroDefaults = defaultsForPage("home").hero ?? {};

type Props = {
  slides?: HeroSlideData[];
  copy?: SectionCopy;
  credits?: SectionCopy;
};

export function Hero({ slides = fallbackSlides, copy, credits }: Props) {
  const text = { ...heroDefaults, ...copy };
  const metrics = [
    copyValue(text, "metric1", heroDefaults.metric1),
    copyValue(text, "metric2", heroDefaults.metric2),
    copyValue(text, "metric3", heroDefaults.metric3),
    copyValue(text, "metric4", heroDefaults.metric4),
  ];
  const imageOpacity =
    parsePercent(text.imageOpacity, parsePercent(heroDefaults.imageOpacity, 100)) /
    100;
  const overlayOpacity =
    parsePercent(
      text.overlayOpacity,
      parsePercent(heroDefaults.overlayOpacity, 70),
    ) / 100;
  const reduce = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const slideList = slides.length ? slides : fallbackSlides;
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  useEffect(() => {
    setActiveSlide(0);
  }, [slideList.length]);

  useEffect(() => {
    if (reduce) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideList.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [reduce, slideList.length]);

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative flex min-h-screen flex-col overflow-hidden bg-navy"
    >
      <motion.div
        className="absolute -inset-y-[10%] inset-x-0"
        style={{ y: reduce ? 0 : backgroundY }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={slideList[activeSlide].src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 1.1, ease: "easeOut" }}
          >
            <Image
              src={slideList[activeSlide].src}
              alt={slideList[activeSlide].alt}
              fill
              priority={activeSlide === 0}
              className="object-cover"
              style={{ opacity: imageOpacity }}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(8,47,83,${overlayOpacity}), rgba(8,47,83,${overlayOpacity * 0.55}), rgba(8,47,83,${overlayOpacity * 0.12}))`,
        }}
        aria-hidden
      />

      <div className="relative z-10 section-pad container-site flex w-full flex-1 items-center justify-center pb-6 pt-28 md:pb-8 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <BrandLogo
              className="h-36 w-[18rem] drop-shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:h-44 sm:w-[22rem] md:h-52 md:w-[26rem] lg:h-60 lg:w-[30rem]"
              priority
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-40 left-5 z-20 flex gap-2 md:bottom-36 md:left-10">
        {slideList.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Mostrar imagen ${index + 1}`}
            aria-current={activeSlide === index}
            onClick={() => setActiveSlide(index)}
            className={`h-1.5 transition-all ${
              activeSlide === index
                ? "w-8 bg-gold"
                : "w-4 bg-white/45 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 mt-auto">
        <div className="section-pad container-site flex justify-end pb-4 pt-2 md:pb-5">
          <ProjectCredits copy={credits} />
        </div>
        <div className="border-t border-white/15 bg-navy/72 backdrop-blur-sm">
          <ul className="section-pad container-site grid grid-cols-2 gap-x-4 gap-y-5 py-4 lg:grid-cols-4">
            {metrics.map((label, index) => {
              const Icon = metricIcons[index];
              return (
                <li
                  key={`${index}-${label}`}
                  className="flex items-center gap-3 text-xs font-medium leading-snug text-white/90 sm:text-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/50 text-gold">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
