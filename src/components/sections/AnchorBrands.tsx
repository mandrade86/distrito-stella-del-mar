"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/FadeIn";
import { anchorBrands } from "@/data/brands";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("shared").anchorBrands ?? {};

type Props = { copy?: SectionCopy };

export function AnchorBrands({ copy }: Props) {
  const text = { ...defaults, ...copy };
  return (
    <section className="bg-sand section-y">
      <div className="section-pad container-site">
        <FadeIn>
          <SectionTitle
            align="center"
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
            className="mx-auto"
          />
        </FadeIn>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {anchorBrands.map((brand) => (
            <StaggerItem key={brand.id}>
              <div className="flex h-32 items-center justify-center border border-navy/10 bg-white px-6 py-7 text-center shadow-[0_12px_35px_rgba(8,47,83,0.07)] transition duration-300 hover:-translate-y-1 hover:border-ocean/40 hover:shadow-[0_18px_45px_rgba(8,47,83,0.12)]">
                {brand.logo ? (
                  <div className="relative h-16 w-full max-w-36">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      style={{ transform: `scale(${brand.logoScale ?? 1})` }}
                      sizes="144px"
                    />
                  </div>
                ) : (
                  <span className="font-serif text-2xl text-navy md:text-3xl">
                    {brand.name}
                  </span>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
