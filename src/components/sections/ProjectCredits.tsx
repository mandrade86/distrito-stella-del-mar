import Image from "next/image";
import type { SectionCopy } from "@/lib/content/page-registry";
import { copyValue, defaultsForPage } from "@/lib/content/page-registry";

const defaults = defaultsForPage("shared").projectCredits ?? {};

type Props = { copy?: SectionCopy };

function CreditLogo({
  href,
  src,
  alt,
  label,
}: {
  href: string;
  src: string;
  alt: string;
  label: string;
}) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={160}
      height={48}
      className="h-8 w-auto max-w-[7.5rem] object-contain opacity-95 transition group-hover:opacity-100 sm:h-9 sm:max-w-[9rem]"
    />
  );

  const body = (
    <span className="flex flex-col items-center gap-1.5 text-center">
      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
        {label}
      </span>
      {image}
    </span>
  );

  if (!href.trim()) {
    return <div className="group">{body}</div>;
  }

  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      className="group rounded-sm outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {body}
    </a>
  );
}

/** Créditos RCJ — logos centrados en el Hero. */
export function ProjectCredits({ copy }: Props) {
  const text = { ...defaults, ...copy };
  const leftLabel = copyValue(text, "creditProject", defaults.creditProject);
  const rightLabel = copyValue(text, "creditCompany", defaults.creditCompany);
  const leftLogo = copyValue(
    text,
    "logoProject",
    defaults.logoProject || "/images/logos/rcj-inmobiliaria.webp",
  );
  const rightLogo = copyValue(
    text,
    "logoCompany",
    defaults.logoCompany || "/images/logos/rcj-corporacion.webp",
  );
  const leftAlt = copyValue(
    text,
    "logoProjectAlt",
    defaults.logoProjectAlt || "RCJ Inmobiliaria Honduras",
  );
  const rightAlt = copyValue(
    text,
    "logoCompanyAlt",
    defaults.logoCompanyAlt || "RCJ Corporación",
  );
  const leftUrl = copyValue(text, "logoProjectUrl", defaults.logoProjectUrl || "");
  const rightUrl = copyValue(
    text,
    "logoCompanyUrl",
    defaults.logoCompanyUrl || "",
  );

  return (
    <div className="flex items-center justify-end gap-5 sm:gap-6">
      <CreditLogo
        href={leftUrl}
        src={leftLogo}
        alt={leftAlt}
        label={leftLabel}
      />
      <span
        className="h-10 w-px shrink-0 bg-white/70 sm:h-12"
        aria-hidden
      />
      <CreditLogo
        href={rightUrl}
        src={rightLogo}
        alt={rightAlt}
        label={rightLabel}
      />
    </div>
  );
}
