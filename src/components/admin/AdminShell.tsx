"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  GalleryHorizontal,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Newspaper,
  Settings,
  Store,
  Images,
  Inbox,
  Layers3,
  FilePlus2,
  LayoutPanelTop,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/home-widgets", label: "Widgets Home", icon: LayoutPanelTop },
  { href: "/admin/pages", label: "Páginas del sitio", icon: FileText },
  { href: "/admin/cms-pages", label: "Páginas extra (HTML)", icon: FilePlus2 },
  { href: "/admin/blog", label: "Novedades", icon: Newspaper },
  { href: "/admin/menu", label: "Menú", icon: Menu },
  { href: "/admin/slides", label: "Hero slides", icon: Images },
  { href: "/admin/stores", label: "Tiendas", icon: Store },
  { href: "/admin/spaces", label: "Locales", icon: Building2 },
  { href: "/admin/gallery", label: "Galería", icon: GalleryHorizontal },
  { href: "/admin/brands", label: "Marcas", icon: Layers3 },
  { href: "/admin/master-plan", label: "Master Plan", icon: Map },
  { href: "/admin/leads", label: "Contactos", icon: Inbox },
  { href: "/admin/settings", label: "Ajustes", icon: Settings },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen w-full bg-sand text-charcoal">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy text-white md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            CMS
          </p>
          <p className="mt-1 font-serif text-xl">Stella del Mar</p>
          {email ? (
            <p className="mt-2 truncate text-xs text-white/60">{email}</p>
          ) : null}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-gold" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-navy/10 bg-navy px-3 py-3 text-white md:hidden">
          {links.map(({ href, label }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "shrink-0 rounded-sm px-3 py-1.5 text-xs font-medium",
                  active ? "bg-white/15 text-white" : "text-white/70",
                )}
              >
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="ml-auto shrink-0 px-3 py-1.5 text-xs text-white/70"
          >
            Salir
          </button>
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
