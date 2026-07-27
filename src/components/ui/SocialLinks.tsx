import type { ReactNode } from "react";
import { isConfigured } from "@/config/contact";
import { cn } from "@/lib/utils";

type SocialMap = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
};

type Props = {
  social: SocialMap;
  className?: string;
  /** Estilo visual del botón */
  variant?: "light" | "dark";
  size?: "sm" | "md";
};

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 8.5h2.5V5.2H14c-2.3 0-3.8 1.4-3.8 3.9V11H8v3.3h2.2V22h3.5v-7.7H16L16.7 11h-3V9.3c0-.5.2-.8.8-.8Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Z" />
      <path d="M17.5 6.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
      <path d="M12 3.5c-2.3 0-2.6 0-3.5.05-.9.04-1.5.2-2.05.4a4.1 4.1 0 0 0-1.5 1c-.42.42-.74.92-.98 1.5-.22.55-.37 1.15-.41 2.05C3.51 9.4 3.5 9.7 3.5 12s0 2.6.05 3.5c.04.9.2 1.5.4 2.05.24.58.56 1.08.98 1.5.42.42.92.74 1.5.98.55.22 1.15.37 2.05.41.9.05 1.2.05 3.5.05s2.6 0 3.5-.05c.9-.04 1.5-.2 2.05-.4a4.1 4.1 0 0 0 1.5-1c.42-.42.74-.92.98-1.5.22-.55.37-1.15.41-2.05.05-.9.05-1.2.05-3.5s0-2.6-.05-3.5c-.04-.9-.2-1.5-.4-2.05a4.1 4.1 0 0 0-1-1.5 4.1 4.1 0 0 0-1.5-.98c-.55-.22-1.15-.37-2.05-.41C14.6 3.51 14.3 3.5 12 3.5Zm0 1.7c2.25 0 2.52 0 3.4.05.82.04 1.27.17 1.57.29.4.15.68.34.98.64.3.3.49.58.64.98.12.3.25.75.29 1.57.04.89.05 1.16.05 3.4s0 2.52-.05 3.4c-.04.82-.17 1.27-.29 1.57-.15.4-.34.68-.64.98-.3.3-.58.49-.98.64-.3.12-.75.25-1.57.29-.89.04-1.16.05-3.4.05s-2.52 0-3.4-.05c-.82-.04-1.27-.17-1.57-.29a2.6 2.6 0 0 1-.98-.64 2.6 2.6 0 0 1-.64-.98c-.12-.3-.25-.75-.29-1.57C5.21 14.52 5.2 14.25 5.2 12s0-2.52.05-3.4c.04-.82.17-1.27.29-1.57.15-.4.34-.68.64-.98.3-.3.58-.49.98-.64.3-.12.75-.25 1.57-.29.89-.04 1.16-.05 3.4-.05Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.3 9.3H3.6V20h2.7V9.3ZM4.95 4A1.55 1.55 0 1 0 5 7.1 1.55 1.55 0 0 0 4.95 4ZM20.4 13.1c0-2.5-1.35-4.1-3.45-4.1a3 3 0 0 0-2.7 1.5V9.3h-2.7c.04.7 0 10.7 0 10.7h2.7v-6c0-.3 0-.7.1-1 .3-.7.95-1.45 2.05-1.45 1.45 0 2 1.1 2 2.7V20h2.7v-6.9Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.2 8.3a5.9 5.9 0 0 1-3.5-1.1v6.2a5.4 5.4 0 1 1-4.7-5.35v2.45a3 3 0 1 0 2.1 2.9V3.5h2.4a3.5 3.5 0 0 0 3.5 3.5v1.3Z" />
    </svg>
  );
}

const NETWORKS: Array<{
  key: keyof SocialMap;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
}> = [
  { key: "facebook", label: "Facebook", icon: FacebookIcon },
  { key: "instagram", label: "Instagram", icon: InstagramIcon },
  { key: "linkedin", label: "LinkedIn", icon: LinkedInIcon },
  { key: "tiktok", label: "TikTok", icon: TikTokIcon },
];

export function SocialLinks({
  social,
  className,
  variant = "light",
  size = "md",
}: Props) {
  const items = NETWORKS.filter(({ key }) => isConfigured(social[key] ?? ""));

  if (!items.length) return null;

  const iconSize = size === "sm" ? "h-4 w-4" : "h-[1.15rem] w-[1.15rem]";
  const pad = size === "sm" ? "h-9 w-9" : "h-10 w-10";

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {items.map(({ key, label, icon: Icon }) => (
        <li key={key}>
          <a
            href={social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={cn(
              "inline-flex items-center justify-center border transition",
              pad,
              variant === "light"
                ? "border-white/25 text-white/85 hover:border-gold hover:bg-white/10 hover:text-gold"
                : "border-navy/15 text-navy hover:border-ocean hover:bg-ocean/5 hover:text-ocean",
            )}
          >
            <Icon className={iconSize} />
          </a>
        </li>
      ))}
    </ul>
  );
}
