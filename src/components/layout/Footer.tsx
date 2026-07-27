import { BrandLogo } from "@/components/ui/BrandLogo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { isConfigured, siteConfig } from "@/config/contact";
import type { PublicContact } from "@/lib/content";

export function Footer({
  links = [],
  contact,
}: {
  links?: { href: string; label: string }[];
  contact?: PublicContact;
}) {
  const year = new Date().getFullYear();
  const email = contact?.email ?? siteConfig.email;
  const phone = contact?.phone ?? siteConfig.phone;
  const social = contact?.social ?? siteConfig.social;
  const footerText = contact?.footerText ?? siteConfig.shortDescription;
  const addressLine = contact?.addressLine ?? siteConfig.addressLine;
  const privacyUrl = contact?.privacyUrl || "/contacto";
  const termsUrl = contact?.termsUrl || "/contacto";

  return (
    <footer className="bg-navy text-white">
      <div className="section-pad container-site grid gap-8 py-10 sm:gap-10 sm:py-14 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4 sm:space-y-5">
          <div className="flex justify-center">
            <BrandLogo className="h-14 w-[9rem] sm:h-16 sm:w-[10rem]" />
          </div>
          {footerText ? (
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              {footerText}
            </p>
          ) : null}
          <SocialLinks social={social} size="sm" />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Menú
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/80 sm:block sm:space-y-2.5">
            {links.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Contacto
          </p>
          <ul className="space-y-2 text-sm leading-relaxed text-white/80 sm:space-y-2.5">
            {addressLine ? (
              <li className="hidden sm:block">{addressLine}</li>
            ) : null}
            <li>
              {isConfigured(email) ? (
                <a href={`mailto:${email}`}>{email}</a>
              ) : (
                <span>Correo: por configurar</span>
              )}
            </li>
            <li>
              {isConfigured(phone) ? (
                <a href={`tel:${phone}`}>{phone}</a>
              ) : (
                <span>Teléfono: por configurar</span>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-pad container-site flex flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-6 sm:text-sm">
          <p>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={privacyUrl} className="hover:text-white/90">
              Política de privacidad
            </a>
            <a href={termsUrl} className="hover:text-white/90">
              Términos y condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
