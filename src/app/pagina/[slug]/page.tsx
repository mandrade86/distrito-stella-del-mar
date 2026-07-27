import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SafeHtml } from "@/components/ui/SafeHtml";
import { getCmsPageBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);
  if (!page) return { title: "Página" };
  return {
    title: page.seoTitle || `${page.title} | Distrito Stella del Mar`,
    description: page.seoDescription || page.excerpt || undefined,
    alternates: { canonical: `/pagina/${page.slug}` },
  };
}

export default async function CmsPageView({ params }: Props) {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow="Información"
        title={page.title}
        description={page.excerpt || "Contenido del distrito."}
        image="/images/renders/sdm-03.png"
        imageAlt={page.title}
      />
      <section className="section-y bg-off-white">
        <div className="section-pad container-site">
          <SafeHtml html={page.content} className="mx-auto max-w-3xl" />
        </div>
      </section>
    </>
  );
}
