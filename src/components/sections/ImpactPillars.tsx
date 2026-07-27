import {
  BriefcaseBusiness,
  Building,
  Heart,
  Plane,
  TrendingUp,
} from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("impacto").pillars ?? {};

const pillars = [
  {
    icon: TrendingUp,
    title: "Desarrollo económico",
    text: "Atracción de inversión, actividad empresarial y nuevas relaciones comerciales.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Generación de empleo",
    text: "Oportunidades directas e indirectas asociadas a operación, comercio y servicios.",
  },
  {
    icon: Plane,
    title: "Turismo",
    text: "Una propuesta capaz de complementar la experiencia de quienes visitan Puerto Cortés.",
  },
  {
    icon: Building,
    title: "Desarrollo urbano",
    text: "Arquitectura contemporánea, conectividad y espacios que enriquecen el entorno.",
  },
  {
    icon: Heart,
    title: "Calidad de vida",
    text: "Más alternativas de compras, gastronomía, servicios, eventos y convivencia.",
  },
] as const;

type Props = { copy?: SectionCopy };

export function ImpactPillars({ copy }: Props) {
  const text = { ...defaults, ...copy };
  return (
    <section className="section-y bg-off-white">
      <div className="section-pad container-site">
        <FadeIn>
          <SectionTitle
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
        </FadeIn>

        <Stagger className="mt-12 grid gap-px overflow-hidden border border-navy/10 bg-navy/10 md:grid-cols-2 lg:grid-cols-5">
          {pillars.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <article className="h-full bg-white p-6">
                <Icon className="h-6 w-6 text-gold" aria-hidden />
                <h3 className="mt-5 font-serif text-xl text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
