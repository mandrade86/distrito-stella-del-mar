import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue } from "@/lib/content/page-registry";

export function parsePercent(
  value: string | undefined,
  fallback: number,
): number {
  const n = Number(String(value ?? "").replace("%", "").trim());
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, n));
}

type HeroFallbacks = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageOpacity?: number;
  overlayOpacity?: number;
};

export function resolvePageHero(
  hero: SectionCopy | undefined,
  fallbacks: HeroFallbacks,
) {
  return {
    eyebrow: copyValue(hero, "eyebrow", fallbacks.eyebrow),
    title: copyValue(hero, "title", fallbacks.title),
    description: copyValue(hero, "description", fallbacks.description),
    image: copyValue(hero, "image", fallbacks.image),
    imageAlt: copyValue(hero, "imageAlt", fallbacks.imageAlt),
    imageOpacity: parsePercent(
      hero?.imageOpacity,
      fallbacks.imageOpacity ?? 100,
    ),
    overlayOpacity: parsePercent(
      hero?.overlayOpacity,
      fallbacks.overlayOpacity ?? 75,
    ),
  };
}
