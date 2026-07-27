"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Item = { src: string; alt: string };

type Props = {
  open: boolean;
  items: Item[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function ImageLightbox({
  open,
  items,
  index,
  onClose,
  onChange,
}: Props) {
  const current = items[index];

  const prev = useCallback(() => {
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);

  const next = useCallback(() => {
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, prev, next]);

  if (!open || !current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imagen"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/92 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute right-4 top-4 rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Imagen anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm bg-white/10 p-2 text-white hover:bg-white/20 md:left-6"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        aria-label="Imagen siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm bg-white/10 p-2 text-white hover:bg-white/20 md:right-6"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <div
        className="relative h-[70vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
      </div>
      <p className="absolute bottom-4 left-1/2 max-w-xl -translate-x-1/2 text-center text-sm text-white/80">
        {current.alt}
      </p>
    </div>
  );
}
