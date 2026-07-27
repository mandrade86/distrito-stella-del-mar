import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Opacidad de la imagen de fondo (0–100). */
  imageOpacity?: number;
  /** Opacidad del overlay navy (0–100). */
  overlayOpacity?: number;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imageOpacity = 100,
  overlayOpacity = 75,
}: Props) {
  const img = Math.min(100, Math.max(0, imageOpacity)) / 100;
  const ov = Math.min(100, Math.max(0, overlayOpacity)) / 100;

  return (
    <section className="relative flex min-h-[36vh] items-end overflow-hidden bg-navy pt-24 md:min-h-[40vh]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        style={{ opacity: img }}
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(8,47,83,${ov}), rgba(8,47,83,${ov * 0.78}), rgba(8,47,83,${ov * 0.28}))`,
        }}
        aria-hidden
      />
      <div className="section-pad container-site relative z-10 pb-8 pt-16 md:pb-10 md:pt-20">
        <FadeIn className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            {description}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
