import Image from "next/image";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FadeIn } from "@/components/ui/FadeIn";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("shared").ctaBand ?? {};

type Props = { copy?: SectionCopy };

export function CTABand({ copy }: Props) {
  const text = { ...defaults, ...copy };
  return (
    <section className="relative overflow-hidden py-24 [clip-path:polygon(0_8%,100%_0,100%_92%,0_100%)] md:py-28">
      <Image
        src="/images/renders/sdm-01.png"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-deep-blue/90" aria-hidden />
      <div className="relative z-10 section-pad container-site flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <FadeIn className="max-w-2xl">
          <h2 className="font-serif text-3xl text-white md:text-4xl">
            {copyValue(text, "title", defaults.title)}
          </h2>
          <p className="mt-3 text-white/80">
            {copyValue(text, "description", defaults.description)}
          </p>
        </FadeIn>
        <FadeIn delay={0.08} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <PrimaryButton href="/contacto" variant="gold" size="lg">
            {copyValue(text, "cta", defaults.cta)}
          </PrimaryButton>
        </FadeIn>
      </div>
    </section>
  );
}
