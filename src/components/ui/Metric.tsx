"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  light?: boolean;
};

export function Metric({
  value,
  label,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  light = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <div ref={ref} className={cn("space-y-2", className)}>
      <p
        className={cn(
          "font-serif text-3xl md:text-4xl",
          light ? "text-white" : "text-navy",
        )}
      >
        {prefix}
        {display.toLocaleString("es-HN", {
          maximumFractionDigits: decimals,
          minimumFractionDigits: decimals,
        })}
        {suffix}
      </p>
      <p
        className={cn(
          "text-sm leading-snug md:text-base",
          light ? "text-white/70" : "text-muted",
        )}
      >
        {label}
      </p>
    </div>
  );
}
