"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FadeIn } from "@/components/ui/FadeIn";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { galleryItems } from "@/data/gallery";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";
import { cn } from "@/lib/utils";

const defaults = defaultsForPage("novedades").gallery ?? {};

/** Patrones irregulares para una cuadrícula “desordenada” (bento). */
const collageClass = [
  "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[280px] lg:min-h-[340px]",
  "aspect-[3/4] sm:min-h-[200px]",
  "aspect-square sm:min-h-[180px]",
  "sm:col-span-2 aspect-[16/9] sm:min-h-[200px]",
  "aspect-[4/5] sm:row-span-2 sm:min-h-[260px]",
  "aspect-[5/4] sm:min-h-[180px]",
  "sm:col-span-2 lg:col-span-1 aspect-[3/2] sm:min-h-[200px]",
  "aspect-square sm:min-h-[180px]",
  "sm:col-span-2 aspect-[21/9] sm:min-h-[160px]",
  "aspect-[3/4] sm:row-span-2 sm:min-h-[280px]",
  "aspect-[4/3] sm:min-h-[180px]",
  "sm:col-span-2 aspect-[16/10] sm:min-h-[220px]",
] as const;

type Props = { copy?: SectionCopy };

export function Gallery({ copy }: Props) {
  const text = { ...defaults, ...copy };
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? galleryItems : galleryItems.slice(0, 8);

  return (
    <section id="galeria" className="bg-off-white section-y">
      <div className="section-pad container-site">
        <FadeIn>
          <SectionTitle
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:auto-rows-[minmax(140px,auto)] lg:grid-cols-4">
          {visible.map((item, i) => (
            <FadeIn
              key={item.id}
              delay={(i % 5) * 0.05}
              className={cn(
                collageClass[i % collageClass.length],
                i % 7 === 3 && "lg:translate-y-4",
                i % 7 === 5 && "lg:-translate-y-3",
              )}
            >
              <button
                type="button"
                className="group relative block h-full min-h-[160px] w-full overflow-hidden"
                onClick={() => {
                  setIndex(galleryItems.findIndex((g) => g.id === item.id));
                  setOpen(true);
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span
                  className="pointer-events-none absolute inset-0 bg-navy/0 transition group-hover:bg-navy/20"
                  aria-hidden
                />
              </button>
            </FadeIn>
          ))}
        </div>

        {!expanded ? (
          <div className="mt-10 text-center">
            <PrimaryButton variant="ghost" onClick={() => setExpanded(true)}>
              Explorar la galería
            </PrimaryButton>
          </div>
        ) : null}
      </div>

      <ImageLightbox
        open={open}
        items={galleryItems.map((g) => ({ src: g.src, alt: g.alt }))}
        index={index}
        onClose={() => setOpen(false)}
        onChange={setIndex}
      />
    </section>
  );
}
