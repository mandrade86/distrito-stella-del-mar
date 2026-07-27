import Image from "next/image";
import { ArrowRight, HardHat } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("novedades").construction ?? {};

type Props = { copy?: SectionCopy };

export function ConstructionProgress({ copy }: Props) {
  const text = { ...defaults, ...copy };
  return (
    <section className="section-y bg-sand">
      <div className="section-pad container-site">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/renders/render-2.jpg"
                alt="Vista general del desarrollo Distrito Stella del Mar"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-navy/90 px-4 py-3 text-sm text-white backdrop-blur">
                <HardHat className="h-4 w-4 text-gold" aria-hidden />
                {copyValue(text, "badge", defaults.badge)}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-5">
            <SectionTitle
              eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
              title={copyValue(text, "title", defaults.title)}
              description={copyValue(text, "description", defaults.description)}
            />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {copyValue(text, "note", defaults.note)}
            </p>
            <PrimaryButton
              href="/novedades"
              variant="ghost"
              className="mt-7"
            >
              {copyValue(text, "cta", defaults.cta)}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </PrimaryButton>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
