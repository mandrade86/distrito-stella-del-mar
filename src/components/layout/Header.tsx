"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/BrandLogo";

export type NavLink = { href: string; label: string };

export function Header({ links = [] }: { links?: NavLink[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "bg-white/95 shadow-[0_1px_0_rgba(8,47,83,0.08)] backdrop-blur"
          : "bg-transparent",
      )}
    >
      <div className="section-pad container-site flex items-center justify-between gap-5 py-3 md:py-4">
        <Link href="/" className="relative z-10 shrink-0">
          <BrandLogo
            className="h-16 w-40 md:h-[4.5rem] md:w-44"
            tone={scrolled ? "dark" : "light"}
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-5 xl:flex 2xl:gap-7"
          aria-label="Principal"
        >
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              data-active={
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`))
              }
              className={cn(
                "water-nav-link py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors 2xl:text-sm",
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`))
                  ? scrolled
                    ? "text-navy"
                    : "text-white"
                  : scrolled
                    ? "text-charcoal/75 hover:text-navy"
                    : "text-white/80 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={cn(
            "rounded-sm p-2 xl:hidden",
            scrolled ? "text-navy" : "text-white",
          )}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-white/10 bg-navy xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="section-pad flex flex-col gap-1 py-4" aria-label="Móvil">
          {links.map((link) => (
            <Link
              key={`m-${link.href}-${link.label}`}
              href={link.href}
              className="py-3 text-base font-semibold uppercase tracking-[0.08em] text-white/90"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
