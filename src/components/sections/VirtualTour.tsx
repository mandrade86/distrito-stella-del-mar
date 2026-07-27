import Image from "next/image";
import { Download, Play } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("master-plan").virtualTour ?? {};

type Props = { copy?: SectionCopy };

export function VirtualTour({ copy }: Props) {
  const text = { ...defaults, ...copy };
  return (
    <section className="section-y bg-navy">
      <div className="section-pad container-site grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-7">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src="/images/renders/sdm-19.png"
              alt="Fachada principal del centro comercial climatizado"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-navy/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-navy/60 text-white backdrop-blur">
                <Play className="ml-1 h-6 w-6" aria-hidden />
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-5">
          <SectionTitle
            light
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <PrimaryButton
              href="/contacto?interes=Informaci%C3%B3n%20general"
              variant="gold"
            >
              {copyValue(text, "ctaPrimary", defaults.ctaPrimary)}
              <Play className="h-4 w-4" aria-hidden />
            </PrimaryButton>
            <PrimaryButton
              href="/contacto?interes=Informaci%C3%B3n%20general"
              variant="secondary"
            >
              {copyValue(text, "ctaSecondary", defaults.ctaSecondary)}
              <Download className="h-4 w-4" aria-hidden />
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
