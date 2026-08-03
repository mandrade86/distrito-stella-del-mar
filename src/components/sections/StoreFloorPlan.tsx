"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  stores as staticStores,
  type FloorPlanLevel,
  type LeasingStatus,
  type Store,
  DEFAULT_FLOOR_PLANS,
  LEASING_STATUSES,
} from "@/data/stores";
import { cn } from "@/lib/utils";
import {
  boxToPolygon,
  isValidPolygon,
  polygonToSvgPoints,
} from "@/lib/hotspot-polygon";
import { isConfigured, whatsappHref } from "@/config/contact";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("tiendas").floorPlan ?? {};
const DEFAULT_PLAN = "/images/masterplan/levels/nivel-2.png";
const STAR_LOGO = "/images/logos/icon-star-color.png";

type Props = {
  stores?: Store[];
  levels?: FloorPlanLevel[];
  copy?: SectionCopy;
  /** WhatsApp del vendedor (CMS o NEXT_PUBLIC_WHATSAPP_NUMBER). */
  whatsapp?: string;
};

function leasingSvgClass(status: LeasingStatus | undefined, isActive: boolean) {
  const base = status || "Disponible";
  if (isActive) {
    if (base === "Reservado") return "fill-gold/45 stroke-gold";
    if (base === "Ocupado") return "fill-navy/50 stroke-navy";
    return "fill-ocean/45 stroke-ocean";
  }
  if (base === "Reservado") {
    return "fill-gold/20 stroke-gold/55 hover:fill-gold/35";
  }
  if (base === "Ocupado") {
    return "fill-navy/20 stroke-navy/45 hover:fill-navy/35";
  }
  return "fill-ocean/15 stroke-ocean/45 hover:fill-ocean/30";
}

function storePolygonPoints(store: Store) {
  if (isValidPolygon(store.polygon)) return store.polygon!;
  return boxToPolygon(store.hotspot);
}

function leasingLabel(status: LeasingStatus | undefined) {
  const base = status || "Disponible";
  if (base === "Ocupado") return "Alquilado";
  return base;
}

function leasingBadgeClass(status: LeasingStatus | undefined) {
  const base = status || "Disponible";
  if (base === "Reservado") return "bg-gold/20 text-navy ring-1 ring-gold/50";
  if (base === "Ocupado") return "bg-navy text-white ring-1 ring-navy";
  return "bg-ocean/15 text-ocean ring-1 ring-ocean/40";
}

function displayName(store: Store) {
  const name = store.name?.trim();
  if (!name || name === "Sin asignar") {
    return store.unitLabel || store.id;
  }
  return name;
}

function sellerWhatsAppHref(store: Store, whatsapp?: string) {
  const unit = store.unitLabel || store.id;
  const name = displayName(store);
  const message = `Hola, me interesa el local ${unit} (${name}) en Distrito Stella del Mar. ¿Sigue disponible?`;
  if (whatsapp && isConfigured(whatsapp)) {
    return whatsappHref(message, whatsapp);
  }
  return whatsappHref(message);
}

export function StoreFloorPlan({
  stores = staticStores,
  levels = DEFAULT_FLOOR_PLANS,
  copy,
  whatsapp,
}: Props) {
  const text = { ...defaults, ...copy };
  const fallbackPlan = copyValue(
    text,
    "planImage",
    defaults.planImage || DEFAULT_PLAN,
  );

  const activeLevels = useMemo(
    () =>
      (levels.length ? levels : DEFAULT_FLOOR_PLANS).filter(
        (l) => l.active !== false,
      ),
    [levels],
  );

  const [levelKey, setLevelKey] = useState(activeLevels[0]?.key || "n2");
  const [leasingFilter, setLeasingFilter] = useState<"all" | LeasingStatus>(
    "all",
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
    place: "above" | "below";
    hotspotH: number;
  } | null>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    if (!activeLevels.some((l) => l.key === levelKey) && activeLevels[0]) {
      setLevelKey(activeLevels[0].key);
    }
  }, [activeLevels, levelKey]);

  const currentLevel =
    activeLevels.find((l) => l.key === levelKey) || activeLevels[0];
  const planSrc = currentLevel?.planImage || fallbackPlan;

  const levelStores = useMemo(() => {
    const byLevel = stores.filter(
      (s) => (s.floorPlanKey || "n2") === (currentLevel?.key || levelKey),
    );
    if (leasingFilter === "all") return byLevel;
    return byLevel.filter(
      (s) => (s.leasingStatus || "Disponible") === leasingFilter,
    );
  }, [stores, currentLevel?.key, levelKey, leasingFilter]);

  const active = levelStores.find((s) => s.id === activeId) ?? null;

  useEffect(() => {
    setActiveId(null);
    setTooltipPos(null);
  }, [levelKey, leasingFilter]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
        setTooltipPos(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showStore = (store: Store, el: Element) => {
    setActiveId(store.id);
    const plan = planRef.current;
    if (!plan) return;
    const planBox = plan.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const x = box.left - planBox.left + box.width / 2;
    const y = box.top - planBox.top;
    // Si el hotspot está arriba, la tarjeta se abre hacia abajo para no cortarse
    const place: "above" | "below" =
      y < planBox.height * 0.32 ? "below" : "above";
    setTooltipPos({ x, y, place, hotspotH: box.height });
  };

  const clearActive = () => {
    setActiveId(null);
    setTooltipPos(null);
  };

  return (
    <section className="section-y overflow-visible bg-sand">
      <div className="section-pad container-site overflow-visible">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <SectionTitle
            align="center"
            eyebrow={copyValue(text, "eyebrow", defaults.eyebrow)}
            title={copyValue(text, "title", defaults.title)}
            description={copyValue(text, "description", defaults.description)}
            titleClassName="text-xl md:text-2xl lg:text-[1.75rem]"
          />
        </FadeIn>

        <FadeIn delay={0.06} className="mt-8">
          <div className="flex flex-col items-center gap-4">
            {activeLevels.length > 1 ? (
              <div
                role="tablist"
                aria-label="Niveles del plano"
                className="flex flex-wrap justify-center gap-2"
              >
                {activeLevels.map((level) => {
                  const selected = level.key === currentLevel?.key;
                  return (
                    <button
                      key={level.key}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setLevelKey(level.key)}
                      className={cn(
                        "border px-4 py-2 text-sm font-medium transition",
                        selected
                          ? "border-navy bg-navy text-white"
                          : "border-navy/15 bg-white text-navy hover:border-navy/40",
                      )}
                    >
                      {level.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setLeasingFilter("all")}
                className={cn(
                  "border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
                  leasingFilter === "all"
                    ? "border-navy bg-navy text-white"
                    : "border-navy/15 bg-white text-navy",
                )}
              >
                Todos
              </button>
              {LEASING_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setLeasingFilter(status)}
                  className={cn(
                    "border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
                    leasingFilter === status
                      ? "border-navy bg-navy text-white"
                      : "border-navy/15 bg-white text-navy",
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <p className="flex flex-wrap justify-center gap-4 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 bg-ocean/70" /> Disponible
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 bg-gold" /> Reservado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 bg-navy" /> Ocupado
              </span>
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-8 overflow-visible">
          <div
            ref={planRef}
            className="relative z-10 mx-auto max-w-5xl overflow-visible border border-navy/10 bg-white shadow-[0_20px_50px_rgba(8,47,83,0.12)]"
          >
            {/* img nativo: conserva proporción real del plano (evita desfase 16:9 de next/image) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={planSrc}
              alt={`Plano interactivo — ${currentLevel?.label || "tiendas"}`}
              className="block h-auto w-full select-none"
              draggable={false}
            />

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {levelStores.map((store) => {
                const isActive = activeId === store.id;
                const leasing = store.leasingStatus || "Disponible";
                const points = storePolygonPoints(store);
                return (
                  <g key={store.id}>
                    <polygon
                      data-store-id={store.id}
                      points={polygonToSvgPoints(points)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${store.unitLabel ? `${store.unitLabel}. ` : ""}${displayName(store)}. ${leasing}`}
                      aria-describedby={isActive ? tooltipId : undefined}
                      aria-expanded={isActive}
                      className={cn(
                        "cursor-pointer transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                        leasingSvgClass(leasing, isActive),
                      )}
                      strokeWidth={isActive ? 0.55 : 0.35}
                      vectorEffect="non-scaling-stroke"
                      onMouseEnter={(e) => showStore(store, e.currentTarget)}
                      onMouseLeave={clearActive}
                      onFocus={(e) => showStore(store, e.currentTarget)}
                      onBlur={clearActive}
                      onClick={(e) => {
                        if (activeId === store.id) clearActive();
                        else showStore(store, e.currentTarget);
                      }}
                    />
                    {store.unitLabel ? (
                      <text
                        x={store.hotspot.x + 0.4}
                        y={store.hotspot.y + 1.6}
                        className="pointer-events-none hidden fill-navy/90 sm:block"
                        style={{ fontSize: 1.55, fontWeight: 700 }}
                      >
                        {store.unitLabel}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {active && tooltipPos ? (
              <div
                id={tooltipId}
                role="tooltip"
                className={cn(
                  "absolute z-30 w-[min(20.5rem,calc(100%-1.25rem))] -translate-x-1/2 overflow-hidden rounded-sm border border-navy/10 bg-gradient-to-b from-white via-white to-sand/80 text-left shadow-[0_18px_50px_rgba(8,47,83,0.28),0_2px_0_rgba(197,161,90,0.35)_inset]",
                  tooltipPos.place === "above"
                    ? "-translate-y-[calc(100%+0.5rem)]"
                    : "translate-y-2",
                )}
                style={{
                  left: Math.min(
                    Math.max(tooltipPos.x, 150),
                    (planRef.current?.clientWidth ?? 400) - 150,
                  ),
                  top:
                    tooltipPos.place === "above"
                      ? tooltipPos.y
                      : tooltipPos.y + tooltipPos.hotspotH,
                }}
                onMouseEnter={() => setActiveId(active.id)}
                onMouseLeave={clearActive}
              >
                <div className="relative border-b border-gold/25 bg-gradient-to-r from-navy via-navy to-[#0a3d6b] px-3.5 py-3">
                  <Image
                    src={STAR_LOGO}
                    alt=""
                    width={56}
                    height={56}
                    className="pointer-events-none absolute -right-1 -top-1 h-14 w-14 opacity-[0.18]"
                  />
                  <div className="relative flex items-start gap-3">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-white/15 bg-white/95 p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                      <Image
                        src={active.logo || STAR_LOGO}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span className="min-w-0 pt-0.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                        {[active.unitLabel, active.category]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <p className="mt-1 font-serif text-lg leading-tight text-white">
                        {displayName(active)}
                      </p>
                    </span>
                  </div>
                </div>

                <div className="space-y-3 px-3.5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                        leasingBadgeClass(active.leasingStatus),
                      )}
                    >
                      {leasingLabel(active.leasingStatus)}
                    </span>
                    {active.level ? (
                      <span className="text-[11px] text-muted">{active.level}</span>
                    ) : null}
                    {active.area ? (
                      <span className="text-[11px] font-medium text-navy">
                        {active.area} m²
                      </span>
                    ) : null}
                  </div>

                  {active.description ? (
                    <p className="text-xs leading-relaxed text-muted">
                      {active.description}
                    </p>
                  ) : null}

                  {(active.leasingStatus || "Disponible") === "Disponible" ? (
                    (() => {
                      const wa = sellerWhatsAppHref(active, whatsapp);
                      if (!wa) {
                        return (
                          <p className="rounded-sm border border-ocean/20 bg-ocean/5 px-2.5 py-2 text-[11px] text-muted">
                            Local disponible. Configure el WhatsApp del vendedor en
                            Ajustes o{" "}
                            <code className="text-[10px]">NEXT_PUBLIC_WHATSAPP_NUMBER</code>
                            .
                          </p>
                        );
                      }
                      return (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(37,211,102,0.35)] transition hover:brightness-105"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden />
                          Consultar por WhatsApp
                        </a>
                      );
                    })()
                  ) : (active.leasingStatus || "") === "Ocupado" ? (
                    <p className="rounded-sm border border-navy/10 bg-navy/[0.04] px-2.5 py-2 text-[11px] leading-relaxed text-muted">
                      Este local ya está alquilado. Explore otros espacios
                      disponibles en el plano.
                    </p>
                  ) : (
                    <p className="rounded-sm border border-gold/25 bg-gold/10 px-2.5 py-2 text-[11px] leading-relaxed text-navy/80">
                      Local reservado. Puede consultar disponibilidad con el
                      equipo comercial.
                    </p>
                  )}

                  {active.phone ? (
                    <a
                      href={`tel:${active.phone.replace(/\s+/g, "")}`}
                      className="flex items-start gap-2 text-xs text-charcoal underline-offset-2 hover:text-navy hover:underline"
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
                      className="flex items-start gap-2 text-xs text-charcoal underline-offset-2 hover:text-navy hover:underline"
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
                      className="flex items-start gap-2 text-xs text-charcoal underline-offset-2 hover:text-navy hover:underline"
                    >
                      <Globe
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                        aria-hidden
                      />
                      <span>Sitio web</span>
                    </a>
                  ) : null}
                  {active.hours ? (
                    <p className="flex items-start gap-2 text-xs text-muted">
                      <Clock
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                        aria-hidden
                      />
                      <span>{active.hours}</span>
                    </p>
                  ) : null}
                  {active.level ? (
                    <p className="flex items-start gap-2 text-xs text-muted">
                      <MapPin
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                        aria-hidden
                      />
                      <span>{active.level}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className="mx-auto mt-8 max-w-5xl">
          {!levelStores.length ? (
            <p className="text-center text-sm text-muted">
              No hay locales para este filtro en {currentLevel?.label || "este nivel"}.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {levelStores.map((store) => (
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
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-navy/8 bg-sand p-1 shadow-sm">
                      <Image
                        src={store.logo || STAR_LOGO}
                        alt=""
                        width={44}
                        height={44}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-ocean">
                        {[store.unitLabel, leasingLabel(store.leasingStatus)]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                      <span className="mt-0.5 block font-medium text-navy">
                        {displayName(store)}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {store.phone || store.category || "—"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
