import { SafeHtml } from "@/components/ui/SafeHtml";
import type { SectionCopy } from "@/lib/content/page-registry";

export function PageHtmlBody({ copy }: { copy?: SectionCopy }) {
  const html = copy?.content?.trim();
  if (!html) return null;
  return (
    <section className="section-y bg-off-white">
      <div className="section-pad container-site">
        <SafeHtml html={html} className="mx-auto max-w-3xl" />
      </div>
    </section>
  );
}
