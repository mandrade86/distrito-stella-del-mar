import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FadeIn } from "@/components/ui/FadeIn";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("master-plan").convention ?? {};

type Props = { copy?: SectionCopy };

export function ConventionCenter({ copy }: Props) {
  const text = { ...defaults, ...copy };
  return (
    <section id="convenciones" className="relative overflow-hidden section-y">
      <Image
        src="/images/renders/sdm-19.png"
        alt="Ambiente del desarrollo ideal para eventos"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-navy/85" aria-hidden />
      <div className="relative z-10 section-pad mx-auto max-w-4xl text-center">
        <FadeIn>
          <SectionTitle
            light
            align="center"
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
            className="mx-auto"
          />
          <PrimaryButton
            href="/contacto?interes=Renta%20de%20espacio"
            variant="gold"
            size="lg"
            className="mt-8"
          >
            {copyValue(text, "cta", defaults.cta)}
          </PrimaryButton>
        </FadeIn>
      </div>
    </section>
  );
}
