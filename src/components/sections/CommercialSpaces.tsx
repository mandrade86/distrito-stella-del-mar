"use client";

import { useMemo, useState } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  categoryLabels,
  featuredSpaces as staticFeatured,
  spaces as staticSpaces,
  type CommercialSpace,
  type SpaceCategory,
} from "@/data/spaces";
import { cn } from "@/lib/utils";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("master-plan").commercialSpaces ?? {};

type Filter = "all" | SpaceCategory;

const filters: Filter[] = [
  "all",
  "plaza",
  "local",
  "food-court",
  "quiosco",
  "financiero",
  "autoservicio",
  "convenciones",
];

type Props = {
  spaces?: CommercialSpace[];
  featuredSpaces?: CommercialSpace[];
  copy?: SectionCopy;
};

export function CommercialSpaces({
  spaces = staticSpaces,
  featuredSpaces = staticFeatured,
  copy,
}: Props) {
  const text = { ...defaults, ...copy };
  const [filter, setFilter] = useState<Filter>("all");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const source = showAll ? spaces : featuredSpaces;
    if (filter === "all") return source;
    return source.filter((s) => s.category === filter);
  }, [filter, showAll, spaces, featuredSpaces]);

  return (
    <section id="locales" className="bg-off-white section-y">
      <div className="section-pad container-site">
        <FadeIn>
          <SectionTitle
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
          />
        </FadeIn>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar por categoría"
        >
          {filters.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              className={cn(
                "rounded-sm px-3 py-2 text-xs font-semibold uppercase tracking-wide md:text-sm",
                filter === key
                  ? "bg-navy text-white"
                  : "bg-sand text-navy hover:bg-sand/80",
              )}
              onClick={() => setFilter(key)}
            >
              {categoryLabels[key]}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((space, i) => (
            <FadeIn key={space.id} delay={i * 0.04}>
              <SpaceCard space={space} />
            </FadeIn>
          ))}
        </div>

        {!showAll ? (
          <div className="mt-10 text-center">
            <PrimaryButton variant="ghost" onClick={() => setShowAll(true)}>
              Ver disponibilidad completa
            </PrimaryButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
