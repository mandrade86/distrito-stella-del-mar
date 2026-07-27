import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/ui/FadeIn";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("shared").projectIntro ?? {};

type Props = { copy?: SectionCopy };

/** Mismo formato estructural que ¿Por qué Puerto Cortés?: texto izq + imagen diagonal full-bleed der. */
export function ProjectIntro({ copy }: Props) {
  const text = { ...defaults, ...copy };
  const body = copyValue(text, "body", defaults.body ?? "");

  return (
    <section id="vision" className="overflow-hidden bg-sand">
      <div className="grid lg:min-h-[560px] lg:grid-cols-2 xl:min-h-[640px]">
        <FadeIn className="flex flex-col justify-center px-5 py-14 sm:px-8 md:px-10 lg:py-20 lg:pl-[max(2rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-10">
          <SectionTitle
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
          {body ? (
            <p className="mt-6 max-w-xl leading-relaxed text-muted">{body}</p>
          ) : null}
        </FadeIn>

        <FadeIn
          delay={0.08}
          className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-full"
        >
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[55%] bg-gradient-to-br from-ocean/25 to-turquoise/10 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"
            aria-hidden
          />
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
    </section>
  );
}
