import Image from "next/image";
import { MapPin } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FadeIn } from "@/components/ui/FadeIn";
import { isConfigured, siteConfig } from "@/config/contact";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("ubicacion").location ?? {};

const points = [
  "Frente al Colegio Franklin Delano Roosevelt",
  "CA-13, Barrio El Porvenir, Puerto Cortés",
  "Zona de alto tránsito vehicular",
  "Cercanía a zonas residenciales",
  "Cercanía a instituciones y oficinas",
  "Conectividad con el puerto",
  "Cercanía a la playa",
  "Conexión hacia la frontera",
];

type Props = { copy?: SectionCopy };

export function Location({ copy }: Props) {
  const text = { ...defaults, ...copy };
  const hasCoords =
    isConfigured(siteConfig.mapLat) && isConfigured(siteConfig.mapLng);
  const mapsHref = isConfigured(siteConfig.mapsUrl)
    ? siteConfig.mapsUrl
    : hasCoords
      ? `https://www.google.com/maps?q=${siteConfig.mapLat},${siteConfig.mapLng}`
      : null;

  return (
    <section id="ubicacion" className="bg-off-white section-y">
      <div className="section-pad container-site">
        <FadeIn>
          <SectionTitle
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
        </FadeIn>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <FadeIn className="relative lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src="/images/renders-1.jpg"
                alt="Vista aérea del proyecto en su contexto urbano"
                fill
                className="object-cover opacity-75"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div
                className="absolute inset-0 bg-navy/20"
                aria-hidden
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 max-w-md border border-white/20 bg-navy/90 p-4 text-white shadow-lg backdrop-blur md:bottom-6 md:left-6">
              <p className="flex items-start gap-2 text-sm leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {siteConfig.addressLine}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-5">
            <ul className="space-y-3">
              {points.map((point) => (
                <li
                  key={point}
                  className="border-l-2 border-gold/70 pl-4 text-sm text-charcoal/85 md:text-base"
                >
                  {point}
                </li>
              ))}
            </ul>

            <div className="relative mt-8 overflow-hidden border border-navy/10 bg-sand">
              {hasCoords ? (
                <>
                  <iframe
                    title="Mapa de ubicación de Distrito Stella del Mar"
                    className="h-56 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?ll=${siteConfig.mapLat},${siteConfig.mapLng}&z=15&output=embed`}
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)]">
                    <div className="relative flex flex-col items-center">
                      <span className="absolute top-1.5 h-14 w-14 animate-ping rounded-full bg-gold/40" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-navy shadow-lg">
                        <Image
                          src="/images/logos/icon-star-white.png"
                          alt=""
                          width={60}
                          height={60}
                          className="h-9 w-9"
                          aria-hidden
                        />
                      </div>
                      <span className="-mt-px h-0 w-0 border-x-[9px] border-t-[13px] border-x-transparent border-t-navy" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-56 flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted">
                  <p>Mapa pendiente de coordenadas.</p>
                  <p className="text-xs">
                    Configura NEXT_PUBLIC_MAP_LAT y NEXT_PUBLIC_MAP_LNG en
                    .env.local
                  </p>
                </div>
              )}
            </div>

            {mapsHref ? (
              <PrimaryButton
                href={mapsHref}
                className="mt-5 w-full sm:w-auto"
                variant="primary"
              >
                {copyValue(text, "cta", defaults.cta)}
              </PrimaryButton>
            ) : (
              <p className="mt-5 text-xs text-muted">
                URL de Google Maps pendiente (NEXT_PUBLIC_MAPS_URL).
              </p>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
