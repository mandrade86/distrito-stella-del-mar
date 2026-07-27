"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  tone?: "light" | "dark";
};

export function BrandLogo({
  className,
  priority = false,
  tone = "light",
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      <Image
        src={
          tone === "dark"
            ? "/images/logos/logo-blue-crop.png"
            : "/images/logos/logo-white-crop.png"
        }
        alt="Distrito Stella del Mar"
        width={1126}
        height={725}
        className="h-full w-full object-contain object-center"
        priority={priority}
      />
    </span>
  );
}
