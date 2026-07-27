import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "gold";
type ButtonSize = "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-navy text-white hover:bg-deep-blue border border-transparent",
  secondary:
    "bg-transparent text-white border border-white/70 hover:bg-white/10",
  ghost:
    "bg-transparent text-navy border border-navy/20 hover:border-navy/50",
  gold: "bg-gold text-navy hover:brightness-105 border border-transparent",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-sm md:text-base",
};

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = Common &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type Props = ButtonAsButton | ButtonAsLink;

export function PrimaryButton(props: Props) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
