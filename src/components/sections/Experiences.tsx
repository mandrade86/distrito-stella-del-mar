import Image from "next/image";
import {
  CarFront,
  Landmark,
  Presentation,
  ShoppingBag,
  Trees,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/ui/FadeIn";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("shared").experiences ?? {};

const experiences = [
  {
    title: "Compras",
    text: "Locales y anclas pensados para un recorrido comercial completo.",
    image: "/images/renders/sdm-01.png",
    icon: ShoppingBag,
  },
  {
    title: "Gastronomía",
    text: "Restaurantes, cafeterías y food court para prolongar la visita.",
    image: "/images/renders/sdm-05.png",
    icon: UtensilsCrossed,
  },
  {
    title: "Servicios financieros",
    text: "Áreas destinadas a instituciones que acompañan el día a día del visitante.",
    image: "/images/renders/sdm-02.png",
    icon: Landmark,
  },
  {
    title: "Conveniencia",
    text: "Autoservicios y espacios de uso frecuente para el entorno urbano.",
    image: "/images/renders/sdm-03.png",
    icon: CarFront,
  },
  {
    title: "Eventos y renta de espacio",
    text: "Un centro de aproximadamente 1,000 m² para reuniones empresariales y sociales.",
    image: "/images/renders/sdm-19.png",
    icon: Presentation,
  },
];

const gridClasses = [
  "md:col-span-2 lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-6",
  "lg:col-span-6",
] as const;

type Props = { copy?: SectionCopy };

export function Experiences({ copy }: Props) {
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

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:auto-rows-[220px] lg:grid-cols-12">
          {experiences.map((item, index) => {
            const Icon = item.icon;
            return (
            <FadeIn
              key={item.title}
              delay={index * 0.05}
              className={gridClasses[index]}
            >
              <article className="group relative h-full min-h-64 overflow-hidden border border-white/20 bg-navy">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent transition-colors group-hover:from-deep-blue" />
                <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center border border-white/35 bg-navy/55 text-gold backdrop-blur-sm">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <span className="absolute right-5 top-5 text-xs font-semibold tracking-[0.18em] text-white/65">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h3 className="font-serif text-2xl text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-white/80">
                    {item.text}
                  </p>
                </div>
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 bg-gold transition-all duration-500 group-hover:w-full"
                  aria-hidden
                />
              </article>
            </FadeIn>
            );
          })}
        </div>

        <FadeIn className="mt-4 grid overflow-hidden bg-deep-blue text-white md:grid-cols-2">
          <div className="flex gap-4 border-b border-white/15 p-6 md:border-b-0 md:border-r">
            <Trees className="mt-1 h-6 w-6 shrink-0 text-turquoise" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Espacios abiertos
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Plazas y recorridos peatonales para permanecer y descubrir el
                distrito.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-6">
            <Users className="mt-1 h-6 w-6 shrink-0 text-turquoise" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Experiencias familiares
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Un entorno para visitas compartidas, compras y gastronomía en un
                mismo lugar.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
