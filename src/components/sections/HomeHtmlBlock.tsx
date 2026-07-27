import { SafeHtml } from "@/components/ui/SafeHtml";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = {
  label?: string;
  html: string;
};

/** Bloque HTML libre administrado desde Widgets del Home. */
export function HomeHtmlBlock({ label, html }: Props) {
  if (!html?.trim()) return null;

  return (
    <section className="section-y bg-off-white" aria-label={label || "Contenido"}>
      <div className="section-pad container-site">
        <FadeIn>
          <SafeHtml html={html} className="mx-auto max-w-4xl" />
        </FadeIn>
      </div>
    </section>
  );
}
