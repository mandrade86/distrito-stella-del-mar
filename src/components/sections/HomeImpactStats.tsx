"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { Metric } from "@/components/ui/Metric";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("shared").impactStats ?? {};

const STAT_KEYS = [1, 2, 3, 4, 5, 6] as const;

type Props = { copy?: SectionCopy };

/** Extrae número animable y sufijo (+, %, etc.) desde el texto del CMS. */
function parseStat(raw: string): {
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
} {
  const text = raw.trim();
  const match = text.match(/^([^\d-]*)(-?[\d][\d.,]*)(.*)$/);
  if (!match) {
    return { value: 0, prefix: "", suffix: "+", decimals: 0 };
  }

  const prefix = match[1] ?? "";
  const numeric = (match[2] ?? "").replace(/,/g, "");
  const rest = (match[3] ?? "").trim();
  const value = Number(numeric);
  const decimals = numeric.includes(".")
    ? (numeric.split(".")[1]?.length ?? 0)
    : 0;

  // Siempre mostrar + como prefijo, salvo porcentajes (conservan %)
  let suffix = "";
  let outPrefix = prefix;
  if (rest.includes("%")) {
    suffix = "%";
  } else {
    outPrefix = prefix.includes("+") ? prefix : `+${prefix}`;
  }

  return {
    value: Number.isFinite(value) ? value : 0,
    prefix: outPrefix,
    suffix,
    decimals,
  };
}

export function HomeImpactStats({ copy }: Props) {
  const text = { ...defaults, ...copy };

  const stats = STAT_KEYS.map((n) => ({
    raw: copyValue(text, `stat${n}Value`, defaults[`stat${n}Value`] ?? ""),
    label: copyValue(text, `stat${n}Label`, defaults[`stat${n}Label`] ?? ""),
  }))
    .filter((s) => s.raw || s.label)
    .map((s) => ({ ...s, ...parseStat(s.raw) }));

  return (
    <section className="bg-off-white section-y">
      <div className="section-pad container-site">
        <FadeIn className="text-center">
          <h2 className="font-serif text-3xl text-navy md:text-4xl">
            {copyValue(text, "title", defaults.title)}
          </h2>
        </FadeIn>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, index) => (
            <FadeIn key={`${stat.raw}-${stat.label}`} delay={index * 0.05}>
              <Metric
                value={stat.value}
                label={stat.label}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.decimals}
                className="text-center [&_p]:mx-auto"
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
