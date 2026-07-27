import { SectionTitle } from "@/components/ui/SectionTitle";
import { Metric } from "@/components/ui/Metric";
import { FadeIn } from "@/components/ui/FadeIn";
import { valueMetrics } from "@/data/metrics";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("impacto").valueProp ?? {};

const blocks = [
  {
    title: "Mercado potencial",
    text: "Una población dinámica con proyección de crecimiento sostenido en la región.",
    metrics: ["population", "growth"],
  },
  {
    title: "Generación de empleos",
    text: "El desarrollo contempla una contribución relevante al empleo local directo e indirecto.",
    metrics: ["jobs-direct", "jobs-indirect"],
  },
  {
    title: "Crecimiento económico",
    text: "Un nodo comercial pensado para atraer inversión, marcas y flujo de visitantes.",
    metrics: [],
  },
  {
    title: "Atracción de turistas",
    text: "Puerto Cortés recibe anualmente un volumen significativo de visitantes turísticos.",
    metrics: ["tourists-min", "tourists-max"],
  },
] as const;

type Props = { copy?: SectionCopy };

export function ValueProposition({ copy }: Props) {
  const text = { ...defaults, ...copy };
  return (
    <section className="bg-sand section-y">
      <div className="section-pad container-site">
        <FadeIn>
          <SectionTitle
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {blocks.map((block, i) => (
            <FadeIn key={block.title} delay={i * 0.05}>
              <article className="h-full border border-navy/8 bg-white/70 p-6 md:p-8">
                <h3 className="font-serif text-2xl text-navy">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                  {block.text}
                </p>
                {block.metrics.length > 0 ? (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {block.metrics.map((id) => {
                      const m = valueMetrics.find((x) => x.id === id);
                      if (!m) return null;
                      return (
                        <Metric
                          key={m.id}
                          value={m.value}
                          label={m.label}
                          suffix={m.suffix}
                          decimals={m.decimals}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
