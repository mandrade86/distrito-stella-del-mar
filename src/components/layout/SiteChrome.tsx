"use client";

import { usePathname } from "next/navigation";
import { Header, type NavLink } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import type { PublicContact } from "@/lib/content";

export function SiteChrome({
  children,
  navLinks = [],
  contact,
}: {
  children: React.ReactNode;
  navLinks?: NavLink[];
  contact?: PublicContact;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header links={navLinks} />
      <main id="contenido-principal">{children}</main>
      <Footer links={navLinks} contact={contact} />
      <WhatsAppButton whatsapp={contact?.whatsapp} />
    </>
  );
}
