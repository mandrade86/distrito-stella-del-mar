"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { formatArea } from "@/lib/utils";
import type { CommercialSpace, SpaceCategory } from "@/data/spaces";
import { categoryLabels } from "@/data/spaces";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const categoryImages: Record<SpaceCategory, string> = {
  plaza: "/images/renders/sdm-05.png",
  local: "/images/renders/sdm-02.png",
  "food-court": "/images/renders/sdm-03.png",
  quiosco: "/images/renders/sdm-08.png",
  financiero: "/images/renders/sdm-07.png",
  autoservicio: "/images/renders/sdm-01.png",
  convenciones: "/images/renders/sdm-06.png",
};

type Props = {
  space: CommercialSpace;
};

export function SpaceCard({ space }: Props) {
  const imageSrc = categoryImages[space.category];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group flex h-full flex-col overflow-hidden border border-navy/10 bg-white shadow-[0_1px_0_rgba(8,47,83,0.04)] transition-colors hover:border-ocean/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-95"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/15 to-transparent"
          aria-hidden
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
            {categoryLabels[space.category]}
          </p>
          <span className="rounded-sm bg-sand px-2 py-1 text-xs font-medium text-navy">
            {space.status}
          </span>
        </div>
        <h3 className="font-serif text-2xl text-navy">{space.id}</h3>
        <p className="mt-1 text-sm text-muted">{space.name}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted">Área</dt>
            <dd className="font-medium text-charcoal">
              {formatArea(space.area)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Fase</dt>
            <dd className="font-medium text-charcoal">Fase {space.phase}</dd>
          </div>
          {space.level ? (
            <div className="col-span-2">
              <dt className="text-muted">Nivel</dt>
              <dd className="font-medium text-charcoal">{space.level}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-auto pt-6">
          <PrimaryButton
            href={`/contacto?espacio=${encodeURIComponent(space.id)}`}
            className="w-full"
            variant="ghost"
          >
            Solicitar información
          </PrimaryButton>
        </div>
      </div>
    </motion.article>
  );
}
