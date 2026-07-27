import {
  Banknote,
  Building2,
  Coffee,
  Landmark,
  PanelsTopLeft,
  Store,
} from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("master-plan").opportunityTypes ?? {};

const opportunities = [
  {
    icon: Landmark,
    title: "Tiendas ancla",
    text: "Formatos de gran escala que generan flujo y fortalecen el posicionamiento del distrito.",
  },
  {
    icon: Store,
    title: "Plaza abierta",
    text: "Locales con relación directa a recorridos peatonales y espacios exteriores.",
  },
  {
    icon: Building2,
    title: "Centro climatizado",
    text: "Oferta comercial en dos niveles dentro de un entorno moderno y confortable.",
  },
  {
    icon: Coffee,
    title: "Food Court",
    text: "Espacios para conceptos gastronómicos, cafeterías y franquicias.",
  },
  {
    icon: Banknote,
    title: "Área financiera",
    text: "Espacios destinados a bancos e instituciones de servicios financieros.",
  },
  {
    icon: PanelsTopLeft,
    title: "Quioscos",
    text: "Formatos compactos en puntos estratégicos del recorrido comercial.",
  },
] as const;

type Props = { copy?: SectionCopy };

export function OpportunityTypes({ copy }: Props) {
  const text = { ...defaults, ...copy };
  return (
    <section className="section-y bg-sand">
      <div className="section-pad container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <SectionTitle
            align="center"
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
            titleClassName="text-xl md:text-2xl lg:text-[1.75rem]"
          />
        </FadeIn>

        <Stagger className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <article className="flex h-full flex-col items-center border border-navy/8 bg-white/70 px-4 py-6 text-center">
                <Icon className="h-6 w-6 text-gold" aria-hidden />
                <h3 className="mt-4 font-serif text-xl text-navy md:text-2xl">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-snug text-muted md:text-sm">
                  {text}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
