import Image from "next/image";
import Link from "next/link";

/** Pantalla cuando el sitio aún no está en vivo (solo admins logueados ven el sitio). */
export function ComingSoon() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(22,138,181,0.45), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(197,161,90,0.25), transparent 50%)",
        }}
      />
      <div className="relative z-10 flex max-w-lg flex-col items-center gap-6">
        <Image
          src="/images/logos/logo-white.png"
          alt="Distrito Stella del Mar"
          width={280}
          height={80}
          className="h-auto w-[min(18rem,80vw)]"
          priority
        />
        <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Pronto abriremos
        </h1>
        <p className="text-sm leading-relaxed text-white/75 md:text-base">
          El sitio público de Distrito Stella del Mar aún no está en vivo. Si
          forma parte del equipo, inicie sesión para previsualizarlo.
        </p>
        <Link
          href="/admin/login"
          className="mt-2 border border-gold/60 bg-gold/15 px-5 py-2.5 text-sm font-medium text-gold transition hover:bg-gold/25"
        >
          Acceso al equipo
        </Link>
      </div>
    </div>
  );
}
