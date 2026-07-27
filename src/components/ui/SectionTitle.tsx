import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  titleClassName?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
  titleClassName,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-[11px] font-semibold uppercase tracking-[0.24em]",
            light ? "text-gold" : "text-ocean",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-serif leading-[1.15]",
          titleClassName ?? "text-[2rem] md:text-4xl lg:text-[2.75rem]",
          light ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-[0.95rem] leading-relaxed md:text-lg",
            align === "center" && "mx-auto",
            light ? "text-white/80" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
