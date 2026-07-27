import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-navy px-5 pt-24 text-white">
      <div className="container-site py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
          Error 404
        </p>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl">
          Esta página no está disponible
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/75">
          El contenido pudo cambiar de ubicación. Regresa al inicio para
          continuar explorando Distrito Stella del Mar.
        </p>
        <PrimaryButton href="/" variant="gold" size="lg" className="mt-8">
          Volver al inicio
        </PrimaryButton>
      </div>
    </section>
  );
}
