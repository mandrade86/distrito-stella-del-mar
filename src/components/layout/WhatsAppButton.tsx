"use client";

import { MessageCircle } from "lucide-react";
import { isConfigured, whatsappHref } from "@/config/contact";

export function WhatsAppButton({ whatsapp }: { whatsapp?: string }) {
  const href =
    whatsapp && isConfigured(whatsapp)
      ? whatsappHref(
          undefined,
          whatsapp,
        )
      : whatsappHref();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
