"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const heroDefaults = defaultsForPage("home").hero ?? {};
const inviteDefaults = defaultsForPage("shared").homeInvite ?? {};

type Props = { copy?: SectionCopy };

function WaveRibbon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 40c120-28 240-28 360 0s240 28 360 0 240-28 360 0 240 28 360 0v40H0z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Banner Home: atmósfera playa (antes en Master Plan). */
export function HomeInvite({ copy }: Props) {
  const text = { ...heroDefaults, ...inviteDefaults, ...copy };
  const reduce = useReducedMotion();

  const title = copyValue(
    text,
    "title",
    inviteDefaults.title || heroDefaults.title,
  );
  const subtitle = copyValue(
    text,
    "subtitle",
    inviteDefaults.subtitle || heroDefaults.subtitle,
  );
  const ctaPrimary = copyValue(
    text,
    "ctaPrimary",
    inviteDefaults.ctaPrimary || heroDefaults.ctaPrimary,
  );
  const ctaSecondary = copyValue(
    text,
    "ctaSecondary",
    inviteDefaults.ctaSecondary || heroDefaults.ctaSecondary,
  );

  return (
    <section
      id="destino"
      className="relative overflow-hidden bg-sand text-navy"
    >
      {/* Atmósfera arena + marca (heredada del Master Plan) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,_rgba(36,185,199,0.12),_transparent_42%),radial-gradient(ellipse_at_88%_20%,_rgba(197,161,90,0.16),_transparent_38%),linear-gradient(180deg,_#f7f3eb_0%,_#f4f0e8_55%,_#ebe4d6_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-10 h-px sea-shimmer-line bg-gradient-to-r from-transparent via-ocean/40 to-transparent md:top-14"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -right-8 top-6 h-40 w-40 opacity-[0.12] sea-star-float md:right-10 md:top-8 md:h-56 md:w-56"
        aria-hidden
      >
        <Image
          src="/images/logos/icon-star-color.png"
          alt=""
          fill
          className="object-contain"
          sizes="224px"
        />
      </div>
      <div
        className="pointer-events-none absolute -left-6 bottom-10 h-24 w-24 opacity-[0.1] sea-star-float-delayed md:left-8 md:h-36 md:w-36"
        aria-hidden
      >
        <Image
          src="/images/logos/icon-star-color.png"
          alt=""
          fill
          className="object-contain"
          sizes="144px"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 overflow-hidden text-ocean/15 md:h-28"
        aria-hidden
      >
        <div className="sea-wave-track flex w-[200%]">
          <WaveRibbon className="h-20 w-1/2 md:h-28" />
          <WaveRibbon className="h-20 w-1/2 md:h-28" />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-14 overflow-hidden text-gold/25 md:h-20"
        aria-hidden
      >
        <div
          className="sea-wave-track flex w-[200%]"
          style={{ animationDuration: "26s", animationDirection: "reverse" }}
        >
          <WaveRibbon className="h-14 w-1/2 md:h-20" />
          <WaveRibbon className="h-14 w-1/2 md:h-20" />
        </div>
      </div>

      <div className="relative z-[2] section-pad container-site py-16 md:py-14 lg:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ocean"
            >
              Distrito Stella del Mar
            </motion.p>

            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: reduce ? 0 : 0.06, duration: 0.65 }}
              className="mt-3 font-serif text-2xl leading-tight text-navy sm:text-3xl md:text-[2.35rem]"
            >
              {title}
            </motion.h2>

            <motion.svg
              initial={reduce ? false : { opacity: 0, scaleX: 0.7 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 0.14, duration: 0.55 }}
              className="mx-auto mt-4 h-2.5 w-28 origin-center text-gold lg:mx-0"
              viewBox="0 0 112 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 7c10-5 18-5 28 0s18 5 28 0 18-5 28 0 16 5 24 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="sea-shimmer-line"
              />
              <path
                d="M2 10c10-4 18-4 28 0s18 4 28 0 18-4 28 0 16 4 24 0"
                stroke="rgba(22,138,181,0.55)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </motion.svg>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: reduce ? 0 : 0.12, duration: 0.65 }}
              className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base lg:mx-0"
            >
              {subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: reduce ? 0 : 0.2, duration: 0.65 }}
            className="flex w-full max-w-md flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0"
          >
            <PrimaryButton
              href="/contacto?interes=Alquiler%20de%20local"
              variant="gold"
              size="lg"
            >
              {ctaPrimary}
            </PrimaryButton>
            <PrimaryButton href="/master-plan" variant="ghost" size="lg">
              {ctaSecondary}
            </PrimaryButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
