"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import {
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  Store as StoreIcon,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { stores as staticStores, type Store } from "@/data/stores";
import { cn } from "@/lib/utils";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("tiendas").floorPlan ?? {};
const DEFAULT_PLAN = "/images/masterplan/plano-tiendas-render.png";

type Props = { stores?: Store[]; copy?: SectionCopy };

export function StoreFloorPlan({ stores = staticStores, copy }: Props) {
  const text = { ...defaults, ...copy };
  const planSrc = copyValue(text, "planImage", defaults.planImage || DEFAULT_PLAN);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const planRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const active = stores.find((s) => s.id === activeId) ?? null;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showStore = (store: Store, el: HTMLElement) => {
    setActiveId(store.id);
    const plan = planRef.current;
    if (!plan) return;
    const planBox = plan.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const x = box.left - planBox.left + box.width / 2;
    const y = box.top - planBox.top;
    setTooltipPos({ x, y });
  };

  const clearActive = () => {
    setActiveId(null);
    setTooltipPos(null);
  };

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

        <FadeIn delay={0.08} className="mt-10">
          <div
            ref={planRef}
            className="relative mx-auto max-w-5xl overflow-hidden border border-navy/10 bg-white shadow-[0_20px_50px_rgba(8,47,83,0.12)]"
          >
            <Image
              src={planSrc}
              alt="Plano interactivo de tiendas de Distrito Stella del Mar"
              width={1600}
              height={900}
              className="block h-auto w-full select-none"
              priority
            />

            {stores.map((store) => {
              const isActive = activeId === store.id;
              return (
                <button
                  key={store.id}
                  type="button"
                  data-store-id={store.id}
                  aria-label={`${store.unitLabel ? `${store.unitLabel}. ` : ""}${store.name}. ${store.phone}. ${store.hours}`}
                  aria-describedby={isActive ? tooltipId : undefined}
                  aria-expanded={isActive}
                  className={cn(
                    "absolute rounded-[2px] border transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                    isActive
                      ? "z-10 border-gold bg-gold/35 shadow-[0_0_0_1px_rgba(197,161,90,0.55)]"
                      : "border-ocean/35 bg-ocean/15 hover:border-gold hover:bg-gold/25",
                  )}
                  style={{
                    left: `${store.hotspot.x}%`,
                    top: `${store.hotspot.y}%`,
                    width: `${store.hotspot.w}%`,
                    height: `${store.hotspot.h}%`,
                  }}
                  onMouseEnter={(e) => showStore(store, e.currentTarget)}
                  onMouseLeave={clearActive}
                  onFocus={(e) => showStore(store, e.currentTarget)}
                  onBlur={clearActive}
                  onClick={(e) => {
                    if (activeId === store.id) clearActive();
                    else showStore(store, e.currentTarget);
                  }}
                >
                  {store.unitLabel ? (
                    <span className="pointer-events-none absolute left-0.5 top-0.5 hidden bg-navy/80 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white sm:inline">
                      {store.unitLabel}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {active && tooltipPos ? (
              <div
                id={tooltipId}
                role="tooltip"
                className="absolute z-20 w-[min(19rem,calc(100%-1.5rem))] -translate-x-1/2 -translate-y-[calc(100%+0.5rem)] border border-navy/10 bg-white px-3 py-3 text-left shadow-[0_14px_36px_rgba(8,47,83,0.2)]"
                style={{
                  left: Math.min(
                    Math.max(tooltipPos.x, 140),
                    (planRef.current?.clientWidth ?? 400) - 140,
                  ),
                  top: Math.max(tooltipPos.y, 8),
                }}
                onMouseEnter={() => setActiveId(active.id)}
                onMouseLeave={clearActive}
              >
                <div className="flex items-start gap-3">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-navy/8 bg-sand p-1.5">
                    {active.logo ? (
                      <Image
                        src={active.logo}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <StoreIcon className="h-5 w-5 text-ocean" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                      {[active.unitLabel, active.category]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="mt-1 font-serif text-lg leading-tight text-navy">
                      {active.name}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-ocean">
                      {active.status || "Abierto"}
                      {active.level ? ` · ${active.level}` : ""}
                    </p>
                  </span>
                </div>
                {active.description ? (
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    {active.description}
                  </p>
                ) : null}
                {active.phone ? (
                  <a
                    href={`tel:${active.phone.replace(/\s+/g, "")}`}
                    className="mt-3 flex items-start gap-2 text-xs text-charcoal underline-offset-2 hover:text-navy hover:underline"
                  >
                    <Phone
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                      aria-hidden
                    />
                    <span>{active.phone}</span>
                  </a>
                ) : null}
                {active.email ? (
                  <a
                    href={`mailto:${active.email}`}
                    className="mt-2 flex items-start gap-2 text-xs text-charcoal underline-offset-2 hover:text-navy hover:underline"
                  >
                    <Mail
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                      aria-hidden
                    />
                    <span>{active.email}</span>
                  </a>
                ) : null}
                {active.website ? (
                  <a
                    href={active.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-start gap-2 text-xs text-charcoal underline-offset-2 hover:text-navy hover:underline"
                  >
                    <Globe
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                      aria-hidden
                    />
                    <span>Sitio web</span>
                  </a>
                ) : null}
                {active.hours ? (
                  <p className="mt-2 flex items-start gap-2 text-xs text-muted">
                    <Clock
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                      aria-hidden
                    />
                    <span>{active.hours}</span>
                  </p>
                ) : null}
                {active.level ? (
                  <p className="mt-2 flex items-start gap-2 text-xs text-muted">
                    <MapPin
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                      aria-hidden
                    />
                    <span>{active.level}</span>
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className="mx-auto mt-8 max-w-5xl">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <li key={store.id}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 border bg-white px-3 py-3 text-left transition",
                    activeId === store.id
                      ? "border-gold"
                      : "border-navy/8 hover:border-navy/20",
                  )}
                  onMouseEnter={() => {
                    const el = planRef.current?.querySelector<HTMLElement>(
                      `button[data-store-id="${store.id}"]`,
                    );
                    if (el) showStore(store, el);
                  }}
                  onMouseLeave={clearActive}
                  onFocus={() => {
                    const el = planRef.current?.querySelector<HTMLElement>(
                      `button[data-store-id="${store.id}"]`,
                    );
                    if (el) showStore(store, el);
                  }}
                  onBlur={clearActive}
                >
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-navy/8 bg-sand p-1">
                    {store.logo ? (
                      <Image
                        src={store.logo}
                        alt=""
                        width={44}
                        height={44}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <StoreIcon className="h-4 w-4 text-ocean" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-ocean">
                      {[store.unitLabel, store.category]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    <span className="mt-0.5 block font-medium text-navy">
                      {store.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {store.phone || store.status || "—"}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
